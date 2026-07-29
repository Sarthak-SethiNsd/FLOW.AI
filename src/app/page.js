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
      <div>
        <Header cameraActive={false} />

        {/* Main Split Layout */}
        <main className="max-w-6xl mx-auto px-4 md:px-10 py-10 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          
          {/* Left: About FLOW.AI Card Menu */}
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

          {/* Right: Quick Select Dropdown */}
          <div className="flex flex-col space-y-6">
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
                {t('heroTitle')} <span className="text-flow-green shadow-[0_0_15px_rgba(46,164,79,0.3)]">{t('brandName')}</span>
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('heroDesc')}
              </p>
            </div>
            
            <PoseSelectorDropdown asanas={asanas} />
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t border-[#30363d] px-8 py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} {t('footerText')}</p>
      </footer>
      <Chatbot />
    </div>
  );
}
