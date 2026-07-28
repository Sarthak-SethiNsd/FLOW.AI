'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import YogaSVG, { ASANA_GUIDE_DATA } from '@/components/YogaSVG';
import { validateRule } from '@/utils/geometry';
import { Play, Pause, RotateCcw, ChevronRight, ArrowLeft, Volume2, ShieldAlert, CheckCircle, Activity, Square } from 'lucide-react';

export default function PracticeClient({ asana }) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  // Posture & Practice States
  const [poseState, setPoseState] = useState('incorrect');
  const [holdTime, setHoldTime] = useState(10);
  const [activeError, setActiveError] = useState('');
  const [cameraState, setCameraState] = useState('loading');
  const [cameraConnected, setCameraConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Audio & Visual Controls
  const [audioState, setAudioState] = useState('idle');   // 'idle' | 'playing' | 'paused' | 'completed'
  const [visualState, setVisualState] = useState('playing');
  const [showAltView, setShowAltView] = useState(false);

  const steps = asana.steps;
  const currentStep = steps[currentStepIndex];

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseInstanceRef = useRef(null);
  const cameraInstanceRef = useRef(null);
  const holdTimerRef = useRef(null);
  const lastSpokenErrorRef = useRef('');

  // Refs that track latest state values — accessible inside closures without staleness
  const isMutedRef = useRef(isMuted);
  const isPausedRef = useRef(isPaused);
  const isCalibratedRef = useRef(isCalibrated);
  const isSpeakingRef = useRef(false);
  const currentStepRef = useRef(currentStep);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { isCalibratedRef.current = isCalibrated; }, [isCalibrated]);
  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);

  /**
   * Core speech function.
   * force=true  → cancel current speech and start immediately (for step instructions, user replay).
   * force=false → only speak if nothing is currently playing (for posture corrections).
   */
  const speakText = (text, force = false) => {
    if (isMutedRef.current || typeof window === 'undefined' || !window.speechSynthesis) return;

    // If already speaking and not forced, skip — let current speech finish
    if (!force && isSpeakingRef.current) return;

    // If forced or idle, cancel whatever is playing and start new utterance
    if (force) {
      window.speechSynthesis.cancel();
    }

    isSpeakingRef.current = true;
    setAudioState('playing');

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.85;
    utt.onend = () => {
      isSpeakingRef.current = false;
      setAudioState('completed');
    };
    utt.onerror = () => {
      isSpeakingRef.current = false;
      setAudioState('completed');
    };
    window.speechSynthesis.speak(utt);
  };

  // Audio Control Handlers (user-initiated, always force)
  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      isSpeakingRef.current = false;
      setAudioState('paused');
    }
  };

  const handleContinueAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        isSpeakingRef.current = true;
        setAudioState('playing');
      } else {
        speakText(currentStepRef.current.voice_prompt, true);
      }
    }
  };

  const handleReplayAudio = () => {
    speakText(currentStepRef.current.voice_prompt, true);
  };

  // Visual Control Handlers
  const handleStopVisual = () => setVisualState('paused');
  const handleContinueVisual = () => { setVisualState('playing'); setShowAltView(false); };
  const handleReplayVisual = () => { setShowAltView(false); setVisualState('playing'); };

  // Step Change Effect
  useEffect(() => {
    const step = steps[currentStepIndex];
    setHoldTime(step.duration || 10);
    setActiveError('');
    setPoseState('incorrect');
    setIsPaused(false);
    lastSpokenErrorRef.current = '';

    // Force-speak the new step instruction
    speakText(step.voice_prompt, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  // Load MediaPipe scripts and start camera on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isSubscribed = true;

    const loadScripts = async () => {
      try {
        if (!window.Pose) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        if (!window.Camera) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        if (isSubscribed) {
          initMediaPipe();
        }
      } catch (err) {
        console.error('Failed to load MediaPipe CDN scripts:', err);
        if (isSubscribed) {
          setCameraState('denied');
        }
      }
    };

    loadScripts();

    return () => {
      isSubscribed = false;
      if (cameraInstanceRef.current) cameraInstanceRef.current.stop();
      if (poseInstanceRef.current) poseInstanceRef.current.close();
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initMediaPipe = () => {
    const pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onPoseResults);
    poseInstanceRef.current = pose;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraState('active');
            setCameraConnected(true);

            const camera = new window.Camera(videoRef.current, {
              onFrame: async () => {
                if (videoRef.current && poseInstanceRef.current) {
                  await poseInstanceRef.current.send({ image: videoRef.current });
                }
              },
              width: 640,
              height: 480
            });
            camera.start();
            cameraInstanceRef.current = camera;

            speakText("Stand back. Position your entire body in front of the camera.", true);
          }
        })
        .catch((err) => {
          console.error('Camera access denied:', err);
          setCameraState('denied');
          setCameraConnected(false);
        });
    }
  };

  // MediaPipe pose results handler
  // NOTE: This runs ~30fps. Never call speakText(force=true) here — only speakText(force=false)
  // so in-flight speech is never interrupted by posture checks.
  const onPoseResults = (results) => {
    if (!results.poseLandmarks || !canvasRef.current) return;

    const canvas = canvasRef.current;
    if (canvas.clientWidth && canvas.clientHeight &&
        (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight)) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const landmarks = results.poseLandmarks;

    // If paused, just draw a dim skeleton and exit
    if (isPausedRef.current) {
      drawSkeleton(ctx, landmarks, '#6b7280');
      return;
    }

    // --- Calibration Phase ---
    const keyJoints = [11, 12, 23, 24, 25, 26, 27, 28];
    const visibleCount = keyJoints.reduce((acc, idx) =>
      landmarks[idx] && landmarks[idx].visibility > 0.5 ? acc + 1 : acc, 0);
    const calibrationRatio = visibleCount / keyJoints.length;
    setCalibrationProgress(Math.floor(calibrationRatio * 100));

    if (!isCalibratedRef.current) {
      drawSkeleton(ctx, landmarks, '#ef4444');
      if (calibrationRatio >= 0.9) {
        isCalibratedRef.current = true;
        setIsCalibrated(true);
        // force=true because this is a one-time transition announcement
        speakText("Body detected. Calibration complete. Let's begin.", true);
      } else {
        const calibErr = "Please step back so your full body including feet are visible.";
        setActiveError(calibErr);
        if (lastSpokenErrorRef.current !== calibErr) {
          lastSpokenErrorRef.current = calibErr;
          // force=false — only speak if nothing is already playing
          speakText(calibErr, false);
        }
      }
      return;
    }

    // --- Active Pose Validation ---
    const step = currentStepRef.current;
    const validationResults = step.validation.map(rule => ({
      ruleId: rule.id,
      ...validateRule(rule, landmarks)
    }));

    const allValid = validationResults.every(r => r.isValid);
    const anyPartiallyValid = validationResults.some(r => r.isPartiallyValid);

    let activeState = 'incorrect';
    let errorMessage = '';

    if (allValid) {
      activeState = 'correct';
    } else if (anyPartiallyValid) {
      activeState = 'partially-correct';
      const failPart = validationResults.find(r => !r.isValid && r.isPartiallyValid);
      errorMessage = failPart ? failPart.message : '';
    } else {
      activeState = 'incorrect';
      const failFull = validationResults.find(r => !r.isValid && !r.isPartiallyValid);
      errorMessage = failFull ? failFull.message : '';
    }

    setPoseState(activeState);
    setActiveError(errorMessage);

    // Speak correction ONCE when a NEW error appears; speak success ONCE when corrected
    if ((activeState === 'incorrect' || activeState === 'partially-correct') && errorMessage) {
      if (lastSpokenErrorRef.current !== errorMessage) {
        lastSpokenErrorRef.current = errorMessage;
        // force=false — only start speaking if nothing currently playing
        speakText(errorMessage, false);
      }
    } else if (activeState === 'correct') {
      if (lastSpokenErrorRef.current !== '') {
        lastSpokenErrorRef.current = '';
        speakText("Posture corrected. Hold this position.", false);
      }
    }

    // Skeleton color by state
    let skeletonColor = '#ef4444';
    if (activeState === 'correct') skeletonColor = '#2ea44f';
    else if (activeState === 'partially-correct') skeletonColor = '#fbbf24';

    drawSkeleton(ctx, landmarks, skeletonColor);
  };

  // Draw skeleton on canvas
  const drawSkeleton = (ctx, landmarks, color) => {
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    const mapPt = (pt) => ({ x: (1 - pt.x) * width, y: pt.y * height });

    const connections = [
      [11, 12],
      [11, 13], [13, 15],
      [12, 14], [14, 16],
      [11, 23], [12, 24], [23, 24],
      [23, 25], [25, 27],
      [24, 26], [26, 28]
    ];

    ctx.lineWidth = 4;
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

    ctx.fillStyle = '#ffffff';
    [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach(idx => {
      const pt = landmarks[idx];
      if (pt && pt.visibility > 0.5) {
        const c = mapPt(pt);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  // Smart Hold-Timer Effect
  useEffect(() => {
    if (!isCalibrated || isPaused) {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      return;
    }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poseState, isCalibrated, isPaused]);

  const handleStepComplete = () => {
    if (currentStepIndex < steps.length - 1) {
      speakText("Step completed! Moving to the next step.", true);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1200);
    } else {
      speakText("Congratulations! You have completed all steps of this practice.", true);
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    isPausedRef.current = false;
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldTime(currentStep.duration || 10);
    setPoseState('incorrect');
    setActiveError('');
    lastSpokenErrorRef.current = '';
    speakText(currentStep.voice_prompt, true);
  };

  const handlePause = () => {
    if (isPaused) {
      setIsPaused(false);
      isPausedRef.current = false;
      speakText("Resuming practice.", true);
    } else {
      setIsPaused(true);
      isPausedRef.current = true;
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        isSpeakingRef.current = false;
      }
      setAudioState('idle');
    }
  };

  // Caption text for overlay
  const captionText = !isCalibrated
    ? "Calibration in progress. Position your entire body in front of the camera."
    : isPaused
      ? "Practice paused. Click RESUME PRACTICE to continue."
      : activeError
        ? activeError
        : currentStep.voice_prompt;

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden bg-background text-foreground select-none relative">

      <Header cameraActive={true} cameraConnected={cameraConnected} />

      {/* Completion Modal */}
      {isCompleted && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-flow-green/20 border-2 border-flow-green flex items-center justify-center text-flow-green animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Practice Complete!</h2>
          <p className="text-gray-400 text-sm max-w-sm text-center">
            You successfully completed all steps of <b className="text-white">{asana.name}</b>.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-lg text-sm font-bold bg-flow-green hover:bg-flow-green-hover text-white transition-all shadow-lg shadow-flow-green/20"
          >
            RETURN TO POSES
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

        {/* Arena: 50/50 Dual View */}
        <div className="h-[55vh] md:flex-1 md:h-auto p-3 md:p-4 flex flex-col bg-background">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-panel border border-[#30363d] flex flex-col md:flex-row shadow-2xl">

            {/* Left 50%: Live User Camera + MediaPipe Skeleton */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-black border-b md:border-b-0 md:border-r border-border-dark overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              />
              <div className="absolute top-3 left-3 z-20 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-red-500/30 backdrop-blur-md flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span>Your Live Camera</span>
              </div>
            </div>

            {/* Right 50%: 2D Animated Target Pose Guide */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-[#0d0821] overflow-hidden flex items-center justify-center p-4">
              {ASANA_GUIDE_DATA[asana.id] ? (
                <YogaSVG
                  asanaId={asana.id}
                  coords={ASANA_GUIDE_DATA[asana.id].steps[Math.min(currentStepIndex, ASANA_GUIDE_DATA[asana.id].steps.length - 1)]}
                  showAltView={showAltView}
                />
              ) : (
                <div className="text-gray-500 text-xs uppercase tracking-wider">Target Pose Guide</div>
              )}
              <div className="absolute top-3 left-3 z-20 bg-flow-green/20 text-flow-green text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-flow-green/30 backdrop-blur-md">
                ● Target Pose Guide
              </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10 pointer-events-none"></div>

            {/* Top right: Mode badge + Exit */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              <div className="bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-red-500/30 backdrop-blur-md">
                Practice Mode
              </div>
              <Link
                href={`/pose/${asana.id}`}
                className="bg-card-bg/85 hover:bg-card-bg border border-border-dark text-xs text-gray-300 font-semibold px-2.5 py-1 rounded transition flex items-center space-x-1 backdrop-blur-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit</span>
              </Link>
            </div>

            {/* Caption overlay */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 w-3/4 max-w-xl bg-black/75 backdrop-blur-md px-5 py-2.5 rounded-xl border border-border-dark flex items-center justify-center space-x-3 text-center shadow-xl">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${poseState === 'correct' ? 'bg-flow-green' : 'bg-yellow-500'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${poseState === 'correct' ? 'bg-flow-green' : 'bg-yellow-500'}`}></span>
              </span>
              <p className="leading-relaxed font-sans text-xs text-white">"{captionText}"</p>
            </div>

            {/* Bottom HUD: Progress bar + Hold timer */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-2/3 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-semibold">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
              <div className="w-full bg-gray-800/80 h-2 rounded-full overflow-hidden mb-2 border border-gray-700 backdrop-blur-sm">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${poseState === 'correct' ? 'bg-gradient-to-r from-flow-green to-emerald-400 shadow-[0_0_12px_#2ea44f]' : 'bg-yellow-500'}`}
                  style={{ width: `${(holdTime / (currentStep.duration || 10)) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-black/60 px-3.5 py-1 rounded-full backdrop-blur-md inline-flex border border-white/10">
                {!isCalibrated ? (
                  <span className="text-red-400 animate-pulse font-medium text-xs">
                    CALIBRATION: {calibrationProgress}%
                  </span>
                ) : isPaused ? (
                  <span className="text-blue-400 font-medium text-xs">PRACTICE PAUSED</span>
                ) : (
                  <>
                    <Activity className={`w-3.5 h-3.5 ${poseState === 'correct' ? 'text-flow-green animate-spin' : 'text-yellow-500 animate-pulse'}`} />
                    <span className="font-mono text-white text-xs font-medium">
                      HOLD: <b className={poseState === 'correct' ? 'text-flow-green' : 'text-yellow-500'}>
                        00:{holdTime < 10 ? `0${holdTime}` : holdTime}
                      </b> / 00:{(currentStep.duration || 10) < 10 ? `0${currentStep.duration || 10}` : currentStep.duration || 10} seconds
                    </span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[22rem] bg-panel border-t md:border-t-0 md:border-l border-border-dark flex flex-col shadow-xl md:flex-shrink-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">

            {/* Title + Mute */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">{asana.name}</h2>
                <p className="text-xs font-semibold text-flow-green uppercase tracking-wider mt-0.5">{asana.english}</p>
              </div>
              <button
                onClick={() => { setIsMuted(v => !v); isMutedRef.current = !isMutedRef.current; }}
                className={`p-2 rounded-lg border transition ${!isMuted ? 'bg-flow-green/10 text-flow-green border-flow-green/20' : 'bg-card-bg text-gray-400 border-border-dark'}`}
                title={isMuted ? "Unmute Voice Coach" : "Mute Voice Coach"}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Step Instruction */}
            <div className="p-4 bg-card-bg rounded-lg border border-border-dark">
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                Step {currentStepIndex + 1} — Instructions
              </span>
              <p className="text-sm text-gray-100 leading-relaxed font-medium">
                {currentStep.instruction}
              </p>
            </div>

            {/* Live Posture Feedback Box */}
            <div>
              {!isCalibrated ? (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-start space-x-2.5 animate-pulse">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Positioning Required</span>
                    <span>Please step back so your full body including feet are visible.</span>
                  </div>
                </div>
              ) : isPaused ? (
                <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300 flex items-start space-x-2.5">
                  <Pause className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                  <div>
                    <span className="font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Practice Paused</span>
                    <span>Press RESUME PRACTICE to continue.</span>
                  </div>
                </div>
              ) : activeError ? (
                <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-start space-x-2.5 animate-pulse">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                  <div>
                    <span className="font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Posture Correction Needed</span>
                    <span>{activeError}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-flow-green/15 border border-flow-green/30 rounded-lg text-xs text-emerald-300 flex items-start space-x-2.5">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-flow-green" />
                  <div>
                    <span className="font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Form Aligned</span>
                    <span>Posture correct! Hold position to complete this step.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Controls */}
            <div className="p-3 bg-card-bg/50 rounded-lg border border-border-dark">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Audio Controls</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={handleStopAudio} disabled={audioState !== 'playing'}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 disabled:opacity-25 disabled:pointer-events-none transition flex items-center justify-center gap-1.5">
                    <Square className="w-3.5 h-3.5" /><span>Stop Audio</span>
                  </button>
                  <button onClick={handleContinueAudio} disabled={audioState === 'playing'}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-flow-green/20 hover:bg-flow-green/30 text-flow-green border border-flow-green/30 disabled:opacity-25 disabled:pointer-events-none transition flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5" /><span>Continue Audio</span>
                  </button>
                </div>
                <button onClick={handleReplayAudio}
                  className="w-full px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-violet-950/40 hover:bg-violet-900/60 text-violet-300 border border-violet-800/30 transition flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3 h-3" /><span>Replay Audio Instruction</span>
                </button>
              </div>
            </div>

            {/* Visual Guide Controls */}
            <div className="p-3 bg-card-bg/50 rounded-lg border border-border-dark">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Visual Guide Controls</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={handleStopVisual} disabled={visualState !== 'playing'}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 disabled:opacity-25 disabled:pointer-events-none transition flex items-center justify-center gap-1.5">
                    <Square className="w-3.5 h-3.5" /><span>Pause Visual</span>
                  </button>
                  <button onClick={handleContinueVisual} disabled={visualState === 'playing'}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-flow-green/20 hover:bg-flow-green/30 text-flow-green border border-flow-green/30 disabled:opacity-25 disabled:pointer-events-none transition flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5" /><span>Resume Visual</span>
                  </button>
                </div>
                <button onClick={handleReplayVisual}
                  className="w-full px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/30 transition flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3 h-3" /><span>Replay Visual Guide</span>
                </button>
              </div>
            </div>

            {/* Joint Numbering Legend */}
            <div className="p-3 bg-card-bg/40 rounded-lg border border-border-dark/60">
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Joint Numbering Key</h4>
              <div className="space-y-1.5 text-[10px] text-gray-400">
                {[{n:'1',a:'Wrist',l:'Hip'},{n:'2',a:'Elbow',l:'Knee'},{n:'3',a:'Shoulder',l:'Ankle'}].map(({n,a,l}) => (
                  <div key={n} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[8px] font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                    <span>Arm → {a} &nbsp;|&nbsp; Leg → {l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segment Tracker */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Segment Tracker</h4>
              <div className="flex items-center space-x-1.5">
                {steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <button
                      onClick={() => setCurrentStepIndex(idx)}
                      className="flex flex-col items-center flex-1 focus:outline-none group"
                    >
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === currentStepIndex
                          ? 'bg-flow-green ring-4 ring-flow-green/20 shadow-[0_0_8px_#2ea44f]'
                          : idx < currentStepIndex
                            ? 'bg-flow-green/60'
                            : 'bg-gray-700 group-hover:bg-gray-500'
                      }`}></div>
                      <span className={`text-[9px] font-medium mt-1 transition-colors ${idx === currentStepIndex ? 'text-white' : 'text-gray-500'}`}>
                        {idx + 1}
                      </span>
                    </button>
                    {idx < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 -mt-3.5 transition-colors ${idx < currentStepIndex ? 'bg-flow-green/45' : 'bg-gray-700'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer Controls */}
      <footer className="bg-panel border-t border-border-dark px-4 md:px-8 py-3 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="hidden md:flex items-center space-x-6">
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
                <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentStepIndex ? 'bg-flow-green' : 'bg-gray-700'}`}></span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 justify-center md:justify-start">
          <button
            onClick={handlePause}
            className={`px-5 py-2 rounded-lg text-sm font-semibold border transition flex items-center space-x-2 ${
              isPaused
                ? 'bg-flow-green text-white border-flow-green hover:bg-flow-green-hover'
                : 'bg-[#21262d] hover:bg-[#30363d] text-gray-200 border-[#30363d]'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? 'RESUME PRACTICE' : 'PAUSE PRACTICE'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-[#30363d] transition flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART STEP</span>
          </button>

          <button
            onClick={handleStepComplete}
            className="px-5 py-2 rounded-lg text-sm font-bold bg-flow-green hover:bg-flow-green-hover text-white shadow-md shadow-emerald-950 transition flex items-center space-x-2"
          >
            <span>NEXT STEP</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

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
