'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { ArrowLeft, BookOpen, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  const listItems = t('whatItDoesList');

  return (
    <div className="h-screen overflow-y-auto flex flex-col bg-background text-foreground select-none">
      
      {/* Header */}
      <Header cameraActive={false} />

      {/* Main Content */}
      <main className="flex-1 py-10 px-4 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto w-full">
          
            {/* Back Button */}
            <div className="mb-6">
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('backToHome')}</span>
              </Link>
            </div>

            {/* Title Block */}
            <div className="border-b border-border-dark pb-6 mb-8">
              <div className="inline-flex items-center space-x-2 bg-flow-green/10 text-flow-green px-3 py-1 rounded-full border border-flow-green/20 text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3" />
                <span>{t('documentationBadge')}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {t('aboutTitle')}
              </h1>
              <p className="text-sm font-medium text-flow-green uppercase tracking-wider mt-1.5">
                {t('aboutSubtitle')}
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
                  <h3 className="text-base font-bold text-white mb-2">{t('whyUsefulTitle')}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{t('whyUsefulDesc')}</p>
                </div>
              </div>

              {/* Card 2: How It Works */}
              <div className="p-6 bg-panel border border-border-dark rounded-xl flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-flow-green/10 flex items-center justify-center text-flow-green border border-flow-green/20 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{t('howItWorksTitle')}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{t('howItWorksDesc')}</p>
                </div>
              </div>

              {/* Card 3: Key Features */}
              <div className="p-6 bg-panel border border-border-dark rounded-xl flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <h3 className="text-base font-bold text-white mb-2">{t('whatItDoesTitle')}</h3>
                  <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                    {Array.isArray(listItems) && listItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t border-[#30363d] px-8 py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} {t('footerText')}</p>
      </footer>

      <Chatbot />
    </div>
  );
}
