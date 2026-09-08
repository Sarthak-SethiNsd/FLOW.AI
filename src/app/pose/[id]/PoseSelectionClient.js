'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { Eye, ArrowLeft, Dumbbell } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PoseSelectionClient({ rawAsana }) {
  const { t, language, getLocalizedAsana } = useLanguage();
  const asana = getLocalizedAsana(rawAsana);

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden bg-background text-foreground select-none">

      {/* Top Header */}
      <Header cameraActive={false} />

      {/* Main: two-column on md+, stacked on mobile */}
      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden min-h-0">

        {/* LEFT — Pose content */}
        <div className="flex-1 overflow-y-auto py-8 px-4 md:px-8 bg-background min-w-0">

          {/* Back navigation */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToPoses')}</span>
            </Link>
          </div>

          {/* Pose Header */}
          <section className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1.5">
              {asana.name}
            </h2>
            <p className="text-sm font-mono text-flow-green tracking-widest uppercase">
              {language === 'hi'
                ? <>{asana.name} &bull; {asana.sanskrit}</>
                : <>{asana.name} &bull; {asana.english}</>}
            </p>
          </section>

          {/* Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">

            {/* Card A: Watch & Learn */}
            <div className="group bg-[#161b22] border border-[#30363d] rounded-2xl p-7 hover:border-gray-500 transition-all duration-300 flex flex-col justify-between min-h-[22rem] shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 mb-5 border border-[#30363d] group-hover:bg-gray-700 transition">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('watchLearnTitle')}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {t('watchLearnDesc')}
                </p>
              </div>
              <Link
                href={`/pose/${asana.id}/watch`}
                className="mt-6 w-full text-center py-3.5 rounded-xl text-sm font-semibold bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-[#30363d] transition-colors"
              >
                {t('launchPreview')}
              </Link>
            </div>

            {/* Card B: Practice Mode */}
            <div className="group bg-[#161b22] border border-[#30363d] rounded-2xl p-7 hover:border-flow-green/60 transition-all duration-300 flex flex-col justify-between min-h-[22rem] shadow-2xl hover:shadow-[0_0_20px_rgba(46,164,79,0.08)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-flow-green/10 flex items-center justify-center text-flow-green mb-5 border border-flow-green/20 group-hover:bg-flow-green/20 transition">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('practiceModeTitle')}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {t('practiceModeDesc')}
                </p>
              </div>
              <Link
                href={`/pose/${asana.id}/practice`}
                className="mt-6 w-full text-center py-3.5 rounded-xl text-sm font-bold bg-flow-green hover:bg-flow-green-hover text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:shadow-[0_0_15px_#2ea44f]"
              >
                {t('startPractice')}
              </Link>
            </div>

          </section>
        </div>

        {/* RIGHT — Dedicated FLOW.AI Assistant workspace */}
        <div className="w-full md:w-[24rem] lg:w-[26rem] xl:w-[28rem] flex-shrink-0 border-t md:border-t-0 md:border-l border-border-dark overflow-hidden flex flex-col min-h-[420px] md:min-h-0 shadow-xl bg-panel">
          <Chatbot
            variant="workspace"
            asanaContext={{ name: asana.name }}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t border-[#30363d] px-8 py-4 text-center text-xs text-gray-500 flex-shrink-0">
        <p>&copy; {new Date().getFullYear()} {t('footerText')}</p>
      </footer>

    </div>
  );
}
