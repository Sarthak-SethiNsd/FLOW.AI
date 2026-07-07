import React from 'react';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import PoseSelectorDropdown from '@/components/PoseSelectorDropdown';
import { getAllAsanas } from '@/utils/asanas';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import homepageData from '../../public/content/homepage.json';

export default function HomePage() {
  const asanas = getAllAsanas();

  return (
    <div className="h-screen bg-background text-foreground flex flex-col justify-between overflow-hidden select-none">
      <div>
        <Header cameraActive={false} />

        {/* Main Split Layout */}
        <main className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left: About FLOW.AI Card Menu */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-xl flex flex-col justify-between h-80 hover:border-gray-500 transition-all duration-300">
            <div>
              <div className="inline-flex items-center space-x-2 bg-flow-green/10 text-flow-green px-3 py-1 rounded-full border border-flow-green/20 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-flow-green animate-pulse" />
                <span>{homepageData.badge_text}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-3">
                {homepageData.about_card_title}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {homepageData.about_card_desc}
              </p>
            </div>
            <Link 
              href="/about"
              className="w-full text-center py-3.5 rounded-xl text-sm font-semibold bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-[#30363d] transition-colors"
            >
              {homepageData.about_card_button}
            </Link>
          </div>

          {/* Right: Quick Select Dropdown */}
          <div className="flex flex-col space-y-6">
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
                {homepageData.hero_title} <span className="text-flow-green shadow-[0_0_15px_rgba(46,164,79,0.3)]">FLOW.AI</span>
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                {homepageData.hero_desc}
              </p>
            </div>
            
            <PoseSelectorDropdown asanas={asanas} />
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t border-[#30363d] px-8 py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} {homepageData.footer_text}</p>
      </footer>
      <Chatbot />
    </div>
  );
}
