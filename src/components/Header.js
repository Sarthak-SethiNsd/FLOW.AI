'use client';

import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Header({ cameraConnected = false, cameraActive = false }) {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3.5 bg-[#161b22] border-b border-[#30363d] select-none">
      <div className="flex items-center space-x-6 md:space-x-10">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition">
          <Activity className="w-5 h-5 text-flow-green animate-pulse" />
          <span className="font-bold text-white tracking-wide text-lg">FLOW.AI</span>
        </Link>
        <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium text-gray-400">
          <Link
            href="/"
            className="text-white border-b-2 border-flow-green pb-0.5 hover:text-flow-green transition-colors"
          >
            My Practice
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-3">
        {cameraActive ? (
          <div className="flex items-center space-x-2 bg-[#21262d] px-3 py-1.5 rounded-full border border-[#30363d]">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cameraConnected ? 'bg-flow-green' : 'bg-red-500'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${cameraConnected ? 'bg-flow-green' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-xs font-medium text-gray-300 hidden sm:inline">
              Camera: {cameraConnected ? 'Connected' : 'Error / Access Denied'}
            </span>
          </div>
        ) : (
          <span className="text-xs bg-[#21262d] px-3 py-1.5 rounded-full border border-[#30363d] text-gray-400 hidden sm:inline">
            Camera: Off
          </span>
        )}
      </div>
    </header>
  );
}
