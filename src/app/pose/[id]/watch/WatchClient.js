'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, ArrowLeft, Volume2, Film } from 'lucide-react';

export default function WatchClient({ asana }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const steps = asana.steps;
  const currentStep = steps[currentStepIndex];

  const videoRef = useRef(null);

  // Text-To-Speech function
  const speakText = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (!isPlayingAudio) return;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // relaxing pace
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak when step changes or audio toggles
  useEffect(() => {
    speakText(currentStep.voice_prompt);
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, isPlayingAudio]);

  // Video looping logic based on step timestamps
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    setVideoError(false);

    // Set video start position
    const start = currentStep.video_start || 0;
    video.currentTime = start;
    video.play().catch(() => {
      // Browsers restrict autoplay sometimes, ignore it
    });

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

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentStep.video_start || 0;
    }
    speakText(currentStep.voice_prompt);
  };

  return (
    <div className="h-screen flex flex-col justify-between overflow-hidden bg-background text-foreground select-none">
      
      {/* Top Header */}
      <Header cameraActive={false} />

      {/* Main Content Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Interactive Video Player Arena */}
        <div className="flex-1 p-6 flex flex-col justify-between relative bg-background">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-panel border border-border-dark flex items-center justify-center shadow-2xl">
            
            {/* HTML5 Synchronous Video Player */}
            {!videoError ? (
              <div className="absolute inset-0 z-0">
                <video
                  ref={videoRef}
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
            
            {/* Visual Gradient Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10 pointer-events-none"></div>

            {/* Mode Indicator Badge */}
            <div className="absolute top-4 left-4 z-20 bg-flow-green/20 text-flow-green text-xs font-bold uppercase tracking-widest px-3 py-1 rounded border border-flow-green/30">
              ● Watch & Learn Mode
            </div>

            {/* Exit Link */}
            <Link 
              href={`/pose/${asana.id}`}
              className="absolute top-4 right-4 z-20 bg-card-bg/80 hover:bg-card-bg border border-border-dark text-xs text-gray-300 font-semibold px-3 py-1.5 rounded transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Preview</span>
            </Link>

            {/* Subtitle Caption Overlay (Spoken audio printed on screen) */}
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 w-3/4 max-w-xl bg-black/65 backdrop-blur-md px-6 py-3 rounded-xl border border-border-dark flex items-center justify-center space-x-3 text-center">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flow-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-flow-green"></span>
              </span>
              <p className="leading-relaxed font-sans text-xs text-white">
                "{currentStep.voice_prompt}"
              </p>
            </div>

            {/* Floating Bottom HUD: Step Information and Progress */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-2/3 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">
                Step {currentStep.step_number} of {steps.length}
              </p>
              
              {/* Progress Bar (Percentage of steps completed) */}
              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden mb-3 border border-gray-700">
                <div 
                  className="bg-gradient-to-r from-flow-green to-emerald-400 h-full rounded-full shadow-[0_0_12px_#2ea44f] transition-all duration-500"
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Volume2 className="w-4 h-4 text-flow-green animate-pulse" />
                <span className="font-sans text-white font-medium">Listening to Voice Guide</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Sidebar instructions and Segment tracker */}
        <div className="w-96 bg-panel border-l border-border-dark p-6 flex flex-col justify-between shadow-xl flex-shrink-0">
          
          <div>
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">{asana.name}</h2>
                <p className="text-xs font-medium text-flow-green uppercase tracking-wider mt-1">{asana.english}</p>
              </div>
              <button 
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`p-2 rounded-lg border transition ${
                  isPlayingAudio 
                    ? 'bg-flow-green/10 text-flow-green border-flow-green/20' 
                    : 'bg-card-bg text-gray-400 border-border-dark'
                }`}
                title={isPlayingAudio ? "Mute Voice Guide" : "Unmute Voice Guide"}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 bg-card-bg rounded-lg border border-border-dark mb-6">
              <span className="text-[10px] bg-border-dark text-gray-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Step Instructions
              </span>
              <p className="text-sm text-gray-300 mt-2.5 leading-relaxed">
                {currentStep.instruction}
              </p>
            </div>

            {/* Interactive Segment Step Matrix Pipeline Indicator */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Segment Tracker</h4>
              <div className="flex items-center space-x-2">
                {steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <button 
                      onClick={() => setCurrentStepIndex(idx)}
                      className="flex flex-col items-center flex-1 focus:outline-none"
                    >
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
                    </button>
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

          {/* Benefits Info Box */}
          <div className="p-4 bg-card-bg/40 rounded-lg border border-border-dark/60">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Pose Benefits</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              {asana.benefits.slice(0, 3).map((benefit, i) => (
                <li key={i} className="truncate">{benefit}</li>
              ))}
            </ul>
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
            onClick={handleRestart}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PLAY AUDIO</span>
          </button>
          <button 
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
          <button 
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-flow-green hover:bg-flow-green-hover text-white disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1.5"
          >
            <span>NEXT STEP</span>
            <ChevronRight className="w-4 h-4" />
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
