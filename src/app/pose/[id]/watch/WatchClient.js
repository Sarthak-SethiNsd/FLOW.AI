'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import YogaSVG, { ASANA_GUIDE_DATA, JOINT_KEYS } from '@/components/YogaSVG';

const ANIM_DURATION = 900; // ms for step transition

export default function WatchClient({ asana }) {
  const data = ASANA_GUIDE_DATA[asana.id];
  const steps = asana.steps;

  const [stepIndex,    setStepIndex]    = useState(0);
  const [animCoords,   setAnimCoords]   = useState(
    data ? data.steps[0] : null
  );
  const [audioState,   setAudioState]   = useState('playing');
  const [visualState,  setVisualState]  = useState('playing');
  const [showAltView,  setShowAltView]  = useState(false);

  // Refs for JS animation
  const rafRef          = useRef(null);
  const fromCoordsRef   = useRef(data ? data.steps[0] : null);
  const toCoordsRef     = useRef(data ? data.steps[0] : null);
  const animStartRef    = useRef(null);

  // Refs for visual alt-view timer
  const altTimerRef             = useRef(null);
  const visualRemainingRef      = useRef(2500);
  const visualTimerStartRef     = useRef(null);
  const [visualCountdown, setVisualCountdown] = useState(2.5);

  // ── JS-DRIVEN SKELETON INTERPOLATION ──────────────────────────────────────
  const startInterpolation = useCallback((fromStep, toStep) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    fromCoordsRef.current = fromStep;
    toCoordsRef.current   = toStep;
    animStartRef.current  = performance.now();

    function tick(now) {
      const elapsed = now - animStartRef.current;
      const rawT    = Math.min(elapsed / ANIM_DURATION, 1);
      const t       = easeInOut(rawT);

      const interpolated = { isHoldStep: toStep.isHoldStep, altShift: toStep.altShift };
      JOINT_KEYS.forEach(k => {
        const from = fromCoordsRef.current[k];
        const to   = toCoordsRef.current[k];
        if (!from || !to) return;
        interpolated[k] = {
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t,
        };
      });
      setAnimCoords(interpolated);

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromCoordsRef.current = toStep;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── AUDIO ─────────────────────────────────────────────────────────────────
  const playFromBeginning = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setAudioState('playing');
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate  = 0.78;
    utt.onend   = () => setAudioState('completed');
    utt.onerror = () => setAudioState('completed');
    window.speechSynthesis.speak(utt);
  }, []);

  const handleStopAudio = () => {
    window.speechSynthesis?.pause();
    setAudioState('paused');
  };
  const handleContinueAudio = () => {
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setAudioState('playing');
    } else {
      playFromBeginning(steps[stepIndex].voice_prompt);
    }
  };
  const handleReplayAudio = () => playFromBeginning(steps[stepIndex].voice_prompt);

  // ── VISUAL TIMER ──────────────────────────────────────────────────────────
  const startAltTimer = useCallback((ms) => {
    if (altTimerRef.current) clearTimeout(altTimerRef.current);
    visualTimerStartRef.current = Date.now();
    visualRemainingRef.current  = ms;

    // Countdown display
    const interval = setInterval(() => {
      const elapsed = Date.now() - visualTimerStartRef.current;
      const rem = Math.max(0, ms - elapsed);
      setVisualCountdown(rem / 1000);
      if (rem <= 0) clearInterval(interval);
    }, 250);

    altTimerRef.current = setTimeout(() => {
      clearInterval(interval);
      setShowAltView(true);
      setVisualState('completed');
      setVisualCountdown(0);
    }, ms);
  }, []);

  const handleStopVisual = () => {
    if (altTimerRef.current) clearTimeout(altTimerRef.current);
    const elapsed   = Date.now() - (visualTimerStartRef.current || Date.now());
    const remaining = Math.max(0, visualRemainingRef.current - elapsed);
    visualRemainingRef.current = remaining;
    setVisualState('paused');
    setVisualCountdown(remaining / 1000);
  };
  const handleContinueVisual = () => {
    setVisualState('playing');
    if (visualRemainingRef.current <= 0) {
      setShowAltView(false);
      visualRemainingRef.current = 2500;
      startAltTimer(2500);
    } else {
      startAltTimer(visualRemainingRef.current);
    }
  };
  const handleReplayVisual = () => {
    setShowAltView(false);
    visualRemainingRef.current = 2500;
    setVisualState('playing');
    startAltTimer(2500);
  };

  // ── ON STEP CHANGE ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!data) return;
    const toStep = data.steps[stepIndex];

    // Animate skeleton
    startInterpolation(fromCoordsRef.current || toStep, toStep);

    // Reset audio
    setAudioState('playing');
    playFromBeginning(steps[stepIndex].voice_prompt);

    // Reset visual
    setShowAltView(false);
    setVisualState('playing');
    visualRemainingRef.current = 2500;
    startAltTimer(2500);

    return () => {
      window.speechSynthesis?.cancel();
      if (altTimerRef.current) clearTimeout(altTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  const goNext = () => { if (stepIndex < steps.length - 1) setStepIndex(p => p + 1); };
  const goPrev = () => { if (stepIndex > 0)                setStepIndex(p => p - 1); };

  const currentStep = steps[stepIndex];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden bg-background text-foreground select-none">
      <Header cameraActive={false}/>

      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

        {/* ── LEFT: Canvas ── */}
        <div className="h-[50vh] md:flex-1 md:h-auto p-5 flex flex-col relative bg-background">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-panel border border-border-dark
                          flex items-center justify-center shadow-2xl">

            {/* SVG */}
            <div className="absolute inset-0 z-0 flex items-center justify-center p-6">
              <YogaSVG asanaId={asana.id} coords={animCoords} showAltView={showAltView}/>
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none"/>

            {/* Badge */}
            <div className="absolute top-4 left-4 z-20 bg-flow-green/20 text-flow-green text-xs
                            font-bold uppercase tracking-widest px-3 py-1 rounded border border-flow-green/30">
              ● Watch &amp; Learn Mode
            </div>

            {/* Exit */}
            <Link href={`/pose/${asana.id}`}
              className="absolute top-4 right-4 z-20 bg-card-bg/80 hover:bg-card-bg border border-border-dark
                         text-xs text-gray-300 font-semibold px-3 py-1.5 rounded transition flex items-center space-x-1.5">
              <ArrowLeft className="w-3.5 h-3.5"/><span>Exit Preview</span>
            </Link>

            {/* Progress HUD */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-2/3 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">
                Step {currentStep.step_number} of {steps.length}
              </p>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden border border-gray-700">
                <div className="bg-gradient-to-r from-flow-green to-emerald-400 h-full rounded-full
                                shadow-[0_0_10px_#2ea44f] transition-all duration-500"
                  style={{ width:`${((stepIndex+1)/steps.length)*100}%` }}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="w-full md:w-[26rem] bg-panel border-t md:border-t-0 md:border-l border-border-dark flex flex-col shadow-xl md:flex-shrink-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* Pose title */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">{asana.name}</h2>
              <p className="text-xs font-semibold text-flow-green uppercase tracking-wider mt-0.5">{asana.english}</p>
            </div>

            {/* Step instruction */}
            <div className="p-4 bg-card-bg rounded-lg border border-border-dark">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">
                Step {currentStep.step_number} — What to Do
              </p>
              <p className="text-sm text-gray-100 leading-relaxed font-medium">
                {currentStep.instruction}
              </p>
            </div>

            {/* Voice guide */}
            <div className="p-4 bg-[#0d1117] rounded-lg border border-border-dark">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 className={`w-3.5 h-3.5 flex-shrink-0 ${audioState==='playing' ? 'text-flow-green animate-pulse' : 'text-gray-500'}`}/>
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  {audioState==='playing' ? 'Voice Guide Speaking…' : 'Voice Guide Text'}
                </p>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{currentStep.voice_prompt}</p>
            </div>

            {/* Audio controls */}
            <div className="p-3 bg-card-bg/50 rounded-lg border border-border-dark">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Audio Controls</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={handleStopAudio} disabled={audioState!=='playing'}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/50
                               text-red-300 border border-red-800/40 disabled:opacity-20 disabled:pointer-events-none
                               transition flex items-center justify-center gap-1.5">
                    <Square className="w-3.5 h-3.5"/><span>Stop Audio</span>
                  </button>
                  <button onClick={handleContinueAudio} disabled={audioState==='playing'}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-flow-green/20 hover:bg-flow-green/30
                               text-flow-green border border-flow-green/30 disabled:opacity-20 disabled:pointer-events-none
                               transition flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5"/><span>Continue Audio</span>
                  </button>
                </div>
                <button onClick={handleReplayAudio}
                  className="w-full px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-violet-950/40 hover:bg-violet-900/60
                             text-violet-300 border border-violet-800/30 transition flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3 h-3"/><span>Replay From Beginning</span>
                </button>
              </div>
            </div>

            {/* Visual controls */}
            <div className="p-3 bg-card-bg/50 rounded-lg border border-border-dark">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Visual (Alt View)</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={handleStopVisual} disabled={visualState!=='playing'}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/50
                               text-red-300 border border-red-800/40 disabled:opacity-20 disabled:pointer-events-none
                               transition flex items-center justify-center gap-1.5">
                    <Square className="w-3.5 h-3.5"/><span>Stop Visual</span>
                  </button>
                  <button onClick={handleContinueVisual} disabled={visualState==='playing'}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-flow-green/20 hover:bg-flow-green/30
                               text-flow-green border border-flow-green/30 disabled:opacity-20 disabled:pointer-events-none
                               transition flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5"/><span>Continue Visual</span>
                  </button>
                </div>
                <button onClick={handleReplayVisual}
                  className="w-full px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-950/40 hover:bg-indigo-900/60
                             text-indigo-300 border border-indigo-800/30 transition flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3 h-3"/><span>Replay Visual</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5 text-center">
                {visualState==='playing'
                  ? `Camera shifts in ${visualCountdown.toFixed(1)}s…`
                  : visualState==='completed' ? 'Alt view angle active.' : 'Visual paused.'}
              </p>
            </div>

            {/* Joint legend */}
            <div className="p-3 bg-card-bg/40 rounded-lg border border-border-dark/60">
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Joint Numbering</h4>
              <div className="space-y-1.5 text-[10px] text-gray-400">
                {[{n:'1',a:'Wrist',l:'Hip'},{n:'2',a:'Elbow',l:'Knee'},{n:'3',a:'Shoulder',l:'Ankle'}].map(({n,a,l}) => (
                  <div key={n} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[8px] font-bold
                                     flex items-center justify-center flex-shrink-0">{n}</span>
                    <span>Arm → {a} &nbsp;|&nbsp; Leg → {l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segment tracker */}
            <div>
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-3 tracking-wider">Segment Tracker</h4>
              <div className="flex items-center space-x-1">
                {steps.map((_, idx) => (
                  <React.Fragment key={idx}>
                    <button onClick={() => setStepIndex(idx)}
                      className="flex flex-col items-center flex-1 focus:outline-none group">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === stepIndex
                          ? 'bg-flow-green ring-4 ring-flow-green/20 shadow-[0_0_8px_#2ea44f]'
                          : idx < stepIndex ? 'bg-flow-green/55' : 'bg-gray-700 group-hover:bg-gray-500'
                      }`}/>
                      <span className={`text-[9px] font-medium mt-1 ${idx===stepIndex?'text-white':'text-gray-600'}`}>
                        {idx+1}
                      </span>
                    </button>
                    {idx < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 -mt-3.5 transition-colors ${idx<stepIndex?'bg-flow-green/45':'bg-gray-700'}`}/>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>{/* end scrollable */}

          {/* Footer nav */}
          <div className="border-t border-border-dark px-5 py-4 flex-shrink-0
                          flex items-center justify-between bg-panel">
            <div className="text-xs text-gray-500">
              Step <span className="text-white font-semibold">{stepIndex+1}</span> / {steps.length}
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={goPrev} disabled={stepIndex===0}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#21262d] hover:bg-[#30363d]
                           text-gray-300 border border-[#30363d] disabled:opacity-30 disabled:pointer-events-none
                           transition flex items-center space-x-1">
                <ChevronLeft className="w-4 h-4"/><span>BACK</span>
              </button>
              <button onClick={goNext} disabled={stepIndex===steps.length-1}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-flow-green hover:bg-flow-green-hover
                           text-white disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1.5">
                <span>NEXT</span><ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Chatbot asanaContext={{
        name: asana.name, sanskrit: asana.sanskrit,
        currentStep: stepIndex+1, totalSteps: steps.length,
        instruction: currentStep.instruction,
      }}/>
    </div>
  );
}
