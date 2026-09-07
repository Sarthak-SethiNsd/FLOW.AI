'use client';

import React from 'react';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import PoseSelectorDropdown from '@/components/PoseSelectorDropdown';
import { getAllAsanas } from '@/utils/asanas';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const asanas = getAllAsanas();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen md:h-screen bg-background text-foreground flex flex-col justify-between md:overflow-hidden select-none">
      <Header cameraActive={false} />

      {/* Main Container: 2-column layout on desktop (Left content, Right Chatbot workspace) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8 flex flex-col md:flex-row gap-6 lg:gap-8 overflow-y-auto md:overflow-hidden min-h-0">
        
        {/* Left Section: Shifted slightly to the left, contains Dropdown + Cards */}
        <div className="flex-1 flex flex-col justify-center space-y-6 min-w-0">
          
          {/* Dropdown in upper-left */}
          <div className="w-full max-w-xs">
            <PoseSelectorDropdown asanas={asanas} />
          </div>

          {/* Cards Grid: Side-by-side on wide screens, stacked on narrower screens */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            
            {/* Card 1: About FLOW.AI */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between hover:border-gray-500 transition-all duration-300">
              <div>
                <div className="inline-flex items-center space-x-2 bg-flow-green/10 text-flow-green px-3 py-1 rounded-full border border-flow-green/20 text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-flow-green animate-pulse" />
                  <span>{t('badgeText')}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-3">
                  {t('aboutCardTitle')}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {t('aboutCardDesc')}
                </p>
              </div>
              <Link 
                href="/about"
                className="w-full text-center py-3.5 rounded-xl text-sm font-semibold bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-[#30363d] transition-colors"
              >
                {t('aboutCardButton')}
              </Link>
            </div>

            {/* Card 2: Perfect Your Practice with FLOW.AI */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between hover:border-gray-500 transition-all duration-300">
              <div>
                <h2 className="text-2xl font-extrabold text-white mb-3">
                  {t('heroTitle')} <span className="text-flow-green">{t('brandName')}</span>
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {t('heroDesc')}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Section: Dedicated Vertical FLOW.AI Assistant Workspace */}
        <div className="w-full md:w-[24rem] lg:w-[26rem] xl:w-[28rem] h-[520px] md:h-full flex-shrink-0 rounded-2xl border border-[#30363d] shadow-2xl overflow-hidden bg-panel">
          <Chatbot variant="workspace" initialOpen={true} />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t border-[#30363d] px-8 py-4 text-center text-xs text-gray-500 flex-shrink-0">
        <p>&copy; {new Date().getFullYear()} {t('footerText')}</p>
      </footer>
    </div>
  );
}
