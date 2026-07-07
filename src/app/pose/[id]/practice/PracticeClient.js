'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { validateRule } from '@/utils/geometry';
import { Play, Pause, RotateCcw, ChevronRight, ArrowLeft, Volume2, ShieldAlert, CheckCircle, Activity, Award, Film } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PracticeClient({ asana }) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  
  // States
  const [poseState, setPoseState] = useState('incorrect'); // 'correct' | 'partially-correct' | 'incorrect'
  const [holdTime, setHoldTime] = useState(10);
  const [activeError, setActiveError] = useState('');
  const [cameraState, setCameraState] = useState('loading'); // 'loading' | 'active' | 'denied'
  const [cameraConnected, setCameraConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const steps = asana.steps;
  const currentStep = steps[currentStepIndex];

  // Refs for video, canvas, MediaPipe, Speech, and Demo Video
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const demoVideoRef = useRef(null);
  const poseInstanceRef = useRef(null);
  const cameraInstanceRef = useRef(null);
  const holdTimerRef = useRef(null);
  const speechThrottleRef = useRef(0);

  // Load streak from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStreak = localStorage.getItem('yoga_practice_streak') || 0;
      setStreak(parseInt(savedStreak, 10));
    }
  }, []);

  // Text to speech function
  const speakText = (text, force = false) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Throttle voice feedback to once every 4.5 seconds to avoid overlapping voices, unless forced
    const now = Date.now();
    if (!force && now - speechThrottleRef.current < 4500) return;
    
    speechThrottleRef.current = now;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // relaxing, clear speech rate
    window.speechSynthesis.speak(utterance);
  };

  // Trigger step instructions speech on step change
  useEffect(() => {
    if (isCalibrated) {
      setHoldTime(currentStep.duration);
      speakText(currentStep.voice_prompt, true);
    }
  }, [currentStepIndex, isCalibrated]);

  // Load MediaPipe scripts dynamically from jsDelivr CDN
  useEffect(() => {
    let active = true;

    const loadMediaPipe = async () => {
      try {
        if (!window.Pose) {
          await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
          await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
        }
        
        if (!active) return;
        initializePoseDetector();
      } catch (err) {
        console.error('Failed to load MediaPipe Pose scripts:', err);
        setCameraState('denied');
      }
    };

    loadMediaPipe();

    return () => {
      active = false;
      if (cameraInstanceRef.current) {
        cameraInstanceRef.current.stop();
      }
      if (poseInstanceRef.current) {
        poseInstanceRef.current.close();
      }
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Initialize MediaPipe Pose
  const initializePoseDetector = () => {
    if (!window.Pose || !videoRef.current) return;

    const pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onPoseResults);
    poseInstanceRef.current = pose;

    // Start Webcam
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraState('active');
          setCameraConnected(true);

          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (poseInstanceRef.current && videoRef.current) {
                await poseInstanceRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480
          });
          camera.start();
          cameraInstanceRef.current = camera;
          
          // Initial calibration speech
          speakText("Stand back. Position your entire body in front of the camera.", true);
        }
      })
      .catch((err) => {
        console.error('Camera access denied:', err);
        setCameraState('denied');
        setCameraConnected(false);
      });
  };

  // Handle MediaPipe results
  const onPoseResults = (results) => {
    if (!results.poseLandmarks || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calibration check (need shoulders, hips, knees, ankles)
    const landmarks = results.poseLandmarks;
    const keyJoints = [11, 12, 23, 24, 25, 26, 27, 28]; // shoulder, hip, knee, ankle
    const visibleCount = keyJoints.reduce((acc, idx) => {
      return landmarks[idx] && landmarks[idx].visibility > 0.5 ? acc + 1 : acc;
    }, 0);

    const calibrationRatio = visibleCount / keyJoints.length;
    setCalibrationProgress(Math.floor(calibrationRatio * 100));

    if (!isCalibrated) {
      drawSkeleton(ctx, landmarks, '#ef4444'); // Red skeleton before calibration
      if (calibrationRatio >= 0.9) {
        setIsCalibrated(true);
        speakText("Body detected. Calibration complete. Let's begin.", true);
      } else {
        setActiveError("Please adjust your position so your full body is in the camera view.");
        speakText("Please step back so your knees and feet are visible.", false);
      }
      return;
    }

    // Run active pose validation
    const validationResults = currentStep.validation.map(rule => {
      return {
        ruleId: rule.id,
        ...validateRule(rule, landmarks)
      };
    });

    // Check if correct, partially-correct, or incorrect
    const allValid = validationResults.every(r => r.isValid);
    const anyPartiallyValid = validationResults.some(r => r.isPartiallyValid);
    
    let activeState = 'incorrect';
    let errorMessage = '';

    if (allValid) {
      activeState = 'correct';
    } else if (anyPartiallyValid) {
      activeState = 'partially-correct';
      // Find first failing partially valid message
      const failPart = validationResults.find(r => !r.isValid && r.isPartiallyValid);
      errorMessage = failPart ? failPart.message : '';
    } else {
      activeState = 'incorrect';
      // Find first fully failing message
      const failFull = validationResults.find(r => !r.isValid && !r.isPartiallyValid);
      errorMessage = failFull ? failFull.message : '';
    }

    setPoseState(activeState);
    setActiveError(errorMessage);

    // Dynamic skeletal drawing color based on alignment state
    let skeletonColor = '#ef4444'; // Red for incorrect
    if (activeState === 'correct') {
      skeletonColor = '#2ea44f'; // Neon green for correct
    } else if (activeState === 'partially-correct') {
      skeletonColor = '#fbbf24'; // Amber for partially correct
    }

    // Draw skeletal overlay inside the user webcam PiP
    drawSkeleton(ctx, landmarks, skeletonColor);

    // Speak posture adjustments if incorrect
    if (activeState === 'incorrect' && errorMessage) {
      speakText(errorMessage, false);
    }
  };

  // Math-based canvas drawing function (mirrored for User's PiP)
  const drawSkeleton = (ctx, landmarks, color) => {
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Helper to mirror and map coordinates to canvas size
    const mapPt = (pt) => {
      // Mirror the x-coordinate to align with mirrored webcam CSS
      return {
        x: (1 - pt.x) * width,
        y: pt.y * height
      };
    };

    // Connections map (Shoulders, spine, hips, arms, legs)
    const connections = [
      [11, 12], // shoulders
      [11, 13], [13, 15], // left arm
      [12, 14], [14, 16], // right arm
      [11, 23], [12, 24], [23, 24], // torso/hips
      [23, 25], [25, 27], // left leg
      [24, 26], [26, 28]  // right leg
    ];

    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';

    connections.forEach(([iA, iB]) => {
      const pA = landmarks[iA];
      const pB = landmarks[iB];
      if (pA && pB && pA.visibility > 0.5 && pB.visibility > 0.5) {
        const cA = mapPt(pA);
        const cB = mapPt(pB);
        ctx.beginPath();
        ctx.moveTo(cA.x, cA.y);
        ctx.lineTo(cB.x, cB.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    ctx.fillStyle = '#ffffff';
    [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach(idx => {
      const pt = landmarks[idx];
      if (pt && pt.visibility > 0.5) {
        const c = mapPt(pt);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  // Smart Hold-Timer Hook
  useEffect(() => {
    if (!isCalibrated) return;

    if (poseState === 'correct' || poseState === 'partially-correct') {
      if (!holdTimerRef.current) {
        holdTimerRef.current = setInterval(() => {
          setHoldTime((prev) => {
            if (prev <= 1) {
              clearInterval(holdTimerRef.current);
              holdTimerRef.current = null;
              handleStepComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    }

    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    };
  }, [poseState, isCalibrated]);

  // Demo Video segment looping logic
  useEffect(() => {
    const video = demoVideoRef.current;
    if (!video || videoError) return;

    setVideoError(false);

    // Set video start position
    const start = currentStep.video_start || 0;
    video.currentTime = start;
    video.play().catch(() => {});

    const handleTimeUpdate = () => {
      const end = currentStep.video_end || 5;
      const startSec = currentStep.video_start || 0;

      // Loop back to start if step end time is reached
      if (video.currentTime >= end || video.currentTime < startSec) {
        video.currentTime = startSec;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentStepIndex, videoError]);

  // Handle Step completion
  const handleStepComplete = () => {
    if (currentStepIndex < steps.length - 1) {
      speakText("Step completed! Move to the next step.", true);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1500);
    } else {
      handlePoseSequenceComplete();
    }
  };

  // Trigger streak increment, database record, and confetti
  const handlePoseSequenceComplete = () => {
    speakText("Congratulations! You have completed the practice. Your streak is updated.", true);
    setShowCelebration(true);
    
    const todayStr = new Date().toDateString();
    const lastPractice = localStorage.getItem('last_practice_date');
    let newStreak = streak;

    if (lastPractice !== todayStr) {
      if (lastPractice === new Date(Date.now() - 86400000).toDateString()) {
        newStreak = streak + 1;
      } else {
        newStreak = 1;
      }
      localStorage.setItem('yoga_practice_streak', newStreak);
      localStorage.setItem('last_practice_date', todayStr);
      setStreak(newStreak);
    }

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    if (newStreak === 5 || newStreak === 10) {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          colors: ['#2ea44f', '#fbbf24', '#ffffff']
        });
      }, 700);
    }
  };

  const handleRestart = () => {
    setHoldTime(currentStep.duration);
    if (demoVideoRef.current) {
      demoVideoRef.current.currentTime = currentStep.video_start || 0;
    }
    speakText(currentStep.voice_prompt, true);
  };

  const handlePause = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setPoseState('incorrect');
    speakText("Practice paused.", true);
  };

  // Derive CC Text
  const captionText = !isCalibrated
    ? "Calibration in progress. Position your entire body in front of the camera."
    : activeError
      ? activeError
      : currentStep.voice_prompt;

  return (
    <div className="h-screen flex flex-col justify-between overflow-hidden bg-background text-foreground select-none relative">
      
      {/* Top Header */}
      <Header cameraActive={true} cameraConnected={cameraConnected} />

      {/* Confetti Celebration Modal */}
      {showCelebration && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-flow-green/20 border-2 border-flow-green flex items-center justify-center text-flow-green animate-bounce">
            <Award className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Practice Complete!</h2>
          <p className="text-gray-400 text-sm max-w-sm text-center">
            You successfully completed all steps of <b className="text-white">{asana.name}</b>.
          </p>
          <div className="bg-panel border border-border-dark p-6 rounded-xl text-center w-64 shadow-2xl">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Practice Streak</span>
            <div className="text-5xl font-extrabold text-flow-green">{streak} Days</div>
            <p className="text-xs text-gray-400 mt-2">See you tomorrow on the mat!</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-lg text-sm font-semibold bg-flow-green hover:bg-flow-green-hover text-white transition-all shadow-lg shadow-flow-green/10"
          >
            RETURN TO LIBRARY
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Interactive Video Player Arena */}
        <div className="flex-1 p-6 flex flex-col justify-between relative bg-background">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-panel border border-[#30363d] flex items-center justify-center shadow-2xl">
            
            {/* HTML5 Synchronous Demo Video (Center background) */}
            {!videoError ? (
              <div className="absolute inset-0 z-0">
                <video
                  ref={demoVideoRef}
                  src={`/asanas/${asana.id}/demo.mp4`}
                  loop
                  muted
                  playsInline
                  autoPlay
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              // Fallback guide view when demo.mp4 is missing
              <div className="text-center z-0 opacity-40 p-8">
                <Film className="w-16 h-16 text-gray-500 mx-auto mb-4 animate-pulse" />
                <p className="text-sm tracking-wide text-gray-300 mb-2 uppercase">Video Demonstration Mode</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  To view a moving instructor, upload <code className="bg-gray-800 px-1 py-0.5 rounded">demo.mp4</code> into the folder <code className="bg-gray-800 px-1 py-0.5 rounded">/public/asanas/{asana.id}/</code>.
                </p>
              </div>
            )}
            
            {/* Gradient shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10 pointer-events-none"></div>

            {/* Mode Indicator Badge */}
            <div className="absolute top-4 left-4 z-20 bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded border border-red-500/30 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              <span>Practice Mode</span>
            </div>

            {/* Exit Link */}
            <Link 
              href={`/pose/${asana.id}`}
              className="absolute top-4 right-4 z-20 bg-card-bg/85 hover:bg-card-bg border border-border-dark text-xs text-gray-300 font-semibold px-3 py-1.5 rounded transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Practice</span>
            </Link>

            {/* Closed Caption / Subtitles Box overlay */}
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 w-3/4 max-w-xl bg-black/65 backdrop-blur-md px-6 py-3 rounded-xl border border-border-dark flex items-center justify-center space-x-3 text-center">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${poseState === 'correct' ? 'bg-flow-green' : 'bg-yellow-500'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${poseState === 'correct' ? 'bg-flow-green' : 'bg-yellow-500'}`}></span>
              </span>
              <p className="leading-relaxed font-sans text-xs text-white">
                "{captionText}"
              </p>
            </div>

            {/* Floating Bottom HUD: Step Information and Hold Timer */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-2/3 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
              
              {/* Progress / Hold Bar */}
              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden mb-3 border border-gray-700">
                <div 
                  className={`h-full rounded-full shadow-[0_0_12px_#2ea44f] transition-all duration-300 ${
                    poseState === 'correct' ? 'bg-gradient-to-r from-flow-green to-emerald-400' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${(holdTime / currentStep.duration) * 100}%` }}
                ></div>
              </div>
              
              {/* Interactive Active Hold Status Countdown */}
              <div className="flex items-center justify-center space-x-2 text-sm">
                {!isCalibrated ? (
                  <span className="text-red-400 animate-pulse font-medium">
                    CALIBRATION: {calibrationProgress}%
                  </span>
                ) : (
                  <>
                    <Activity className={`w-4 h-4 ${poseState === 'correct' ? 'text-flow-green animate-spin' : 'text-yellow-500 animate-pulse'}`} />
                    <span className="font-mono text-white font-medium">
                      HOLD: <b className={poseState === 'correct' ? 'text-flow-green' : 'text-yellow-500'}>
                        00:{holdTime < 10 ? `0${holdTime}` : holdTime}
                      </b> / 00:{currentStep.duration < 10 ? `0${currentStep.duration}` : currentStep.duration} seconds
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Right Corner: User's PIP Webcam Interface Mirror */}
            <div className={`absolute bottom-4 right-4 z-20 w-48 aspect-video rounded-lg overflow-hidden border-2 shadow-xl transition-all duration-300 ${
              !isCalibrated || poseState === 'incorrect' 
                ? 'border-red-500 scale-105 shadow-red-950/20' 
                : poseState === 'partially-correct' 
                  ? 'border-yellow-500' 
                  : 'border-flow-green opacity-40 hover:opacity-100'
            }`}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas 
                ref={canvasRef} 
                width={192} 
                height={108} 
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider text-white">
                YOUR VIDEO
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Instructions Sidebar */}
        <div className="w-96 bg-panel border-l border-border-dark p-6 flex flex-col justify-between shadow-xl flex-shrink-0">
          <div>
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">{asana.name}</h2>
                <p className="text-xs font-medium text-flow-green uppercase tracking-wider mt-1">{asana.english}</p>
              </div>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg border transition ${
                  !isMuted 
                    ? 'bg-flow-green/10 text-flow-green border-flow-green/20' 
                    : 'bg-card-bg text-gray-400 border-border-dark'
                }`}
                title={isMuted ? "Unmute Voice Coach" : "Mute Voice Coach"}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 bg-card-bg rounded-lg border border-border-dark mb-6">
              <span className="text-[10px] bg-border-dark text-gray-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Instructions
              </span>
              <p className="text-sm text-gray-300 mt-2.5 leading-relaxed">
                {currentStep.instruction}
              </p>
            </div>

            {/* Error Message Box */}
            {activeError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 mb-6 flex items-start space-x-2 animate-pulse">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{activeError}</span>
              </div>
            )}

            {/* Interactive Segment Step Matrix Pipeline Indicator */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Segment Tracker</h4>
              <div className="flex items-center space-x-2">
                {steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === currentStepIndex 
                          ? 'bg-flow-green ring-4 ring-flow-green/20 shadow-[0_0_8px_#2ea44f]' 
                          : idx < currentStepIndex 
                            ? 'bg-flow-green/60' 
                            : 'bg-gray-700'
                      }`}></div>
                      <span className={`text-[10px] font-medium mt-2 transition-colors ${
                        idx === currentStepIndex ? 'text-white' : 'text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 -mt-4 transition-colors ${
                        idx < currentStepIndex ? 'bg-flow-green/45' : 'bg-gray-700'
                      }`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Streak Card */}
          <div className="p-4 bg-card-bg/50 border border-border-dark rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-flow-green/10 flex items-center justify-center text-flow-green border border-flow-green/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Daily Streak</h5>
                <p className="text-[10px] text-gray-500">Keep up the daily practice</p>
              </div>
            </div>
            <span className="text-lg font-extrabold text-flow-green">{streak} Days</span>
          </div>

        </div>
      </main>

      {/* Bottom Footer Control Bar */}
      <footer className="bg-panel border-t border-border-dark px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-sm">
            <span className="text-gray-400">Current:</span> 
            <span className="font-semibold text-white ml-1">{asana.name}</span>
          </div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="text-sm flex items-center space-x-1.5">
            <span className="text-gray-400">Step:</span>
            <span className="font-semibold text-white">{currentStepIndex + 1} of {steps.length}</span>
            <div className="flex space-x-1 ml-1">
              {steps.map((_, i) => (
                <span 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentStepIndex ? 'bg-flow-green' : 'bg-gray-700'
                  }`}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Control Buttons Grid Layout */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePause}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] transition"
          >
            PAUSE PRACTICE
          </button>
          <button 
            onClick={handleRestart}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] transition"
          >
            RESTART STEP
          </button>
          <button 
            onClick={handleStepComplete}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-flow-green hover:bg-flow-green-hover text-white shadow-md shadow-emerald-950 transition flex items-center space-x-2"
          >
            <span>NEXT STEP</span>
            <span className="text-[11px] opacity-75 font-normal">(Auto)</span>
          </button>
        </div>
      </footer>

      {/* Chatbot (V2 Drawer) */}
      <Chatbot 
        asanaContext={{
          name: asana.name,
          sanskrit: asana.sanskrit,
          currentStep: currentStepIndex + 1,
          totalSteps: steps.length,
          instruction: currentStep.instruction
        }}
      />

    </div>
  );
}
