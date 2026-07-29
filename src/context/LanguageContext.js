'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UI_TRANSLATIONS } from '@/locales/translations';
import { POSE_TRANSLATIONS } from '@/locales/poseTranslations';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, params = {}) => key,
  getLocalizedAsana: (asana) => asana,
  isMounted: false,
});

export function LanguageProvider({ children }) {
  /**
   * IMPORTANT: Always initialize with 'en' — never read localStorage here.
   *
   * Next.js client components are pre-rendered on the server where window/
   * localStorage don't exist. If we read localStorage in the useState initializer
   * it runs on the client during hydration with a DIFFERENT value than the server
   * rendered ('en'), causing a React hydration mismatch error.
   *
   * The correct pattern: start with the same default on both server and client,
   * then update from localStorage in useEffect (client-only, after hydration).
   */
  const [language, setLanguageState] = useState('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This runs only on the client, after hydration is complete — safe to read localStorage.
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'hi' || saved === 'en') {
        setLanguageState(saved);
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
  }, []);

  const setLanguage = (newLang) => {
    if (newLang !== 'en' && newLang !== 'hi') return;
    setLanguageState(newLang);
    try {
      localStorage.setItem('lang', newLang);
    } catch (e) {
      console.warn('localStorage write error:', e);
    }
  };

  /**
   * Helper function to look up translated UI string by key.
   * Supports placeholder interpolation, e.g., t('stepCount', { step: 1, total: 6 })
   */
  const t = (key, params = {}) => {
    const dict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
    let val = dict[key] ?? UI_TRANSLATIONS.en[key] ?? key;
    if (typeof val === 'string') {
      Object.keys(params).forEach((pKey) => {
        val = val.replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
      });
    }
    return val;
  };

  /**
   * Translates a pose configuration object into the current active language.
   * If language is 'en', returns original asana object unmodified.
   */
  const getLocalizedAsana = (asana) => {
    if (!asana) return asana;
    if (language === 'en') return asana;

    const poseTrans = POSE_TRANSLATIONS[asana.id];
    if (!poseTrans) return asana;

    const steps = (asana.steps || []).map((step, idx) => {
      const stepTrans = poseTrans.steps?.[idx];
      if (!stepTrans) return step;
      return {
        ...step,
        instruction: stepTrans.instruction || step.instruction,
        voice_prompt: stepTrans.voice_prompt || step.voice_prompt,
      };
    });

    return {
      ...asana,
      name: poseTrans.name || asana.name,
      sanskrit: poseTrans.sanskrit || asana.sanskrit,
      english: poseTrans.english || asana.english,
      difficulty: poseTrans.difficulty || asana.difficulty,
      description: poseTrans.description || asana.description,
      benefits: poseTrans.benefits || asana.benefits,
      steps,
    };
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedAsana, isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
