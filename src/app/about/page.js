'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { ArrowLeft, BookOpen, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import aboutData from '../../../public/content/about.json';

export default function AboutPage() {
  const t = aboutData.english;

  return (
    <div className="min-h-screen md:h-screen flex flex-col justify-between md:overflow-hidden bg-background text-foreground select-none">
      
      {/* Header */}
      <Header cameraActive={false} />

      {/* Main Content Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side: About Details Page Content */}
        <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto bg-background">
          <div className="max-w-3xl mx-auto w-full">
            
            {/* Back Button */}
            <div className="mb-6">
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO HOME</span>
              </Link>
            </div>

            {/* Title Block */}
            <div className="border-b border-border-dark pb-6 mb-8">
              <div className="inline-flex items-center space-x-2 bg-flow-green/10 text-flow-green px-3 py-1 rounded-full border border-flow-green/20 text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3" />
                <span>Documentation</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {t.title}
              </h1>
              <p className="text-sm font-medium text-flow-green uppercase tracking-wider mt-1.5">
                {t.subtitle}
              </p>
            </div>

            {/* Content Cards */}
            <div className="space-y-6">
              
              {/* Card 1: Why Useful */}
              <div className="p-6 bg-panel border border-border-dark rounded-xl flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{t.why_useful_title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{t.why_useful_desc}</p>
                </div>
              </div>

              {/* Card 2: How It Works */}
              <div className="p-6 bg-panel border border-border-dark rounded-xl flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-flow-green/10 flex items-center justify-center text-flow-green border border-flow-green/20 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{t.how_it_works_title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{t.how_it_works_desc}</p>
                </div>
              </div>

              {/* Card 3: Key Features */}
              <div className="p-6 bg-panel border border-border-dark rounded-xl flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <h3 className="text-base font-bold text-white mb-2">{t.what_it_does_title}</h3>
                  <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                    {t.what_it_does_list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>



          </div>
        </div>

        {/* Right Side: Spacer Panel — hidden on mobile */}
        <div className="hidden md:flex w-96 bg-[#161b22] border-l border-border-dark items-center justify-center relative p-6">
          <div className="text-center opacity-5">
            <BookOpen className="w-48 h-48 mx-auto" />
          </div>
        </div>

      </main>

      {/* Chatbot (Triggered server-side conditional rendering) */}
      <Chatbot />

    </div>
  );
}
