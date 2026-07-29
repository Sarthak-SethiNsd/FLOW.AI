'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function PoseSelectorDropdown({ asanas = [] }) {
  const router = useRouter();
  const { t, getLocalizedAsana } = useLanguage();

  const handleChange = (e) => {
    const val = e.target.value;
    if (val) {
      router.push(`/pose/${val}`);
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col space-y-2">
      <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
        {t('quickSelectLabel')}
      </label>
      <select 
        onChange={handleChange}
        className="bg-[#21262d] border border-[#30363d] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-flow-green transition"
        defaultValue=""
      >
        <option value="" disabled>{t('quickSelectPlaceholder')}</option>
        {asanas.map((rawAsana) => {
          const asana = getLocalizedAsana(rawAsana);
          return (
            <option key={asana.id} value={asana.id}>
              {asana.name} ({asana.english})
            </option>
          );
        })}
      </select>
    </div>
  );
}
