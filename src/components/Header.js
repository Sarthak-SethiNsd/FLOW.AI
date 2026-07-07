'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Video, HelpCircle } from 'lucide-react';

export default function Header({ cameraConnected = false, cameraActive = false }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#161b22] border-b border-[#30363d] select-none">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2 text-[#2ea44f] hover:opacity-90 transition">
          <Activity className="w-5 h-5 text-flow-green animate-pulse" />
          <span className="font-bold text-white tracking-wide text-lg">FLOW.AI</span>
        </Link>
        <nav className="flex space-x-6 text-sm font-medium text-gray-400">
          <Link href="/" className="text-white border-b-2 border-flow-green pb-1">
            My Practice
          </Link>
          <a href="#" className="hover:text-white transition">Library</a>
          <a href="#" className="hover:text-white transition">Stats</a>
          <a href="#" className="hover:text-white transition">Settings</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        {cameraActive ? (
          <div className="flex items-center space-x-2 bg-[#21262d] px-3 py-1.5 rounded-full border border-[#30363d]">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cameraConnected ? 'bg-flow-green' : 'bg-red-500'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${cameraConnected ? 'bg-flow-green' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-xs font-medium text-gray-300">
              Camera: {cameraConnected ? 'Connected' : 'Error / Access Denied'}
            </span>
          </div>
        ) : (
          <span className="text-xs bg-[#21262d] px-3 py-1.5 rounded-full border border-[#30363d] text-gray-400">
            Camera: Off
          </span>
        )}
      </div>
    </header>
  );
}
