import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { getAsanaById } from '@/utils/asanas';
import { Eye, ArrowLeft, Dumbbell, Sparkles } from 'lucide-react';

export default async function PoseSelectionPage({ params }) {
  const { id } = await params;
  const asana = getAsanaById(id);

  if (!asana) {
    notFound();
  }

  return (
    <div className="min-h-screen md:h-screen flex flex-col justify-between md:overflow-hidden bg-background text-foreground select-none">
      
      {/* Top Header */}
      <Header cameraActive={false} />

      {/* Main Content Workspace */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left/Center: Mode Selector Canvas */}
        <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto bg-background">
          <div className="max-w-4xl mx-auto w-full">
            
            {/* Back navigation */}
            <div className="mb-6">
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO POSES</span>
              </Link>
            </div>

            {/* Pose Header */}
            <section className="text-center mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1.5">
                {asana.name}
              </h2>
              <p className="text-sm font-mono text-flow-green tracking-widest uppercase">
                {asana.sanskrit} &bull; {asana.english}
              </p>
            </section>

            {/* Enlarged Cards Layout */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              
              {/* Card A: Watch & Learn */}
              <div className="group bg-[#161b22] border border-[#30363d] rounded-2xl p-8 hover:border-gray-500 transition-all duration-300 flex flex-col justify-between h-96 shadow-2xl">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 mb-6 border border-[#30363d] group-hover:bg-gray-700 transition">
                    <Eye className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Watch & Learn</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Preview the step-by-step movements, watch the visual guide, and listen to the detailed verbal instruction at your own pace without turning on your camera.
                  </p>
                </div>
                <Link 
                  href={`/pose/${asana.id}/watch`}
                  className="w-full text-center py-4 rounded-xl text-sm font-semibold bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-[#30363d] transition-colors"
                >
                  LAUNCH PREVIEW
                </Link>
              </div>

              {/* Card B: Practice Mode */}
              <div className="group bg-[#161b22] border border-[#30363d] rounded-2xl p-8 hover:border-flow-green/60 transition-all duration-300 flex flex-col justify-between h-96 shadow-2xl hover:shadow-[0_0_20px_rgba(46,164,79,0.08)]">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-flow-green/10 flex items-center justify-center text-flow-green mb-6 border border-flow-green/20 group-hover:bg-flow-green/20 transition">
                    <Dumbbell className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Practice Mode</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Turn on your webcam to practice the pose in real-time. Receive live posture adjustments, voice coaching, and build your daily exercise streak.
                  </p>
                </div>
                <Link 
                  href={`/pose/${asana.id}/practice`}
                  className="w-full text-center py-4 rounded-xl text-sm font-bold bg-flow-green hover:bg-flow-green-hover text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:shadow-[0_0_15px_#2ea44f]"
                >
                  START PRACTICE
                </Link>
              </div>

            </section>
          </div>
        </div>

        {/* Right Side: Spacer Panel — hidden on mobile */}
        <div className="hidden md:flex w-96 bg-[#161b22] border-l border-[#30363d] items-center justify-center relative p-6 flex-shrink-0">
          <div className="text-center opacity-5">
            <Sparkles className="w-48 h-48 mx-auto text-flow-green" />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t border-[#30363d] px-8 py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} FLOW.AI. Designed for premium movement validation.</p>
      </footer>

      {/* Chatbot (V2 Hook) */}
      <Chatbot />
    </div>
  );
}
