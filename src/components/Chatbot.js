'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Chatbot({ asanaContext = null }) {
  // -------------------------------------------------------------------------
  // Feature flag — existing gate, unchanged.
  // The chatbot UI only mounts at all when this env var is 'true'.
  // -------------------------------------------------------------------------
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT === 'true';

  // -------------------------------------------------------------------------
  // Auth gate — check authentication state before rendering chatbot UI.
  // isAuthenticated: false  → show sign-in prompt when user clicks the button
  // loading: true           → suppress the button entirely (no flicker)
  // -------------------------------------------------------------------------
  const { user, isAuthenticated, loading: authLoading, signIn } = useAuth();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chatbotWelcome') }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // -------------------------------------------------------------------------
  // Don't render at all if:
  //  • The AI assistant feature flag is off, OR
  //  • Firebase is still determining auth state (prevents flicker)
  // -------------------------------------------------------------------------
  if (!isEnabled || authLoading) return null;

  // -------------------------------------------------------------------------
  // Sign-in handler — used by the auth gate prompt
  // -------------------------------------------------------------------------
  const handleSignIn = async () => {
    setSigningIn(true);
    await signIn();
    setSigningIn(false);
  };

  // -------------------------------------------------------------------------
  // Chat send handler — only reachable when isAuthenticated is true
  // -------------------------------------------------------------------------
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isAuthenticated || !user) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let token = '';
      try {
        if (user && typeof user.getIdToken === 'function') {
          token = await user.getIdToken();
        }
      } catch (tokenErr) {
        console.error('Failed to retrieve Firebase auth token:', tokenErr);
      }

      if (!token) {
        setMessages(prev => [...prev, { role: 'assistant', content: t('authRequiredDesc') || 'Please sign in with Google to continue.' }]);
        setIsLoading(false);
        return;
      }

      const history = messages.map(msg => ({ role: msg.role, content: msg.content }));
      
      const response = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          history,
          asanaContext
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to generate response.'}` }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Render — auth gate determines what the open panel shows
  // -------------------------------------------------------------------------
  return (
    <div className="fixed bottom-24 right-6 z-40 select-text">

      {/* Floating Action Button — always visible when feature is enabled */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-flow-green text-white flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_#2ea44f] hover:scale-105 transition duration-300"
          title={t('chatbotTooltip')}
          aria-label={t('chatbotTooltip')}
        >
          <MessageSquare className="w-5 h-5 fill-white" />
        </button>
      )}

      {/* Open panel — branches on authentication state */}
      {isOpen && (
        <div className="w-80 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-between shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">

          {/* Panel header — shared between auth prompt and chat */}
          <div className="bg-[#21262d] border-b border-[#30363d] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-flow-green animate-pulse"></span>
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                {t('chatbotHeaderTitle')}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ---------------------------------------------------------------
            AUTHENTICATION GATE
            Unauthenticated users see a sign-in prompt instead of the chat.
          --------------------------------------------------------------- */}
          {!isAuthenticated ? (
            <div className="p-6 flex flex-col items-center space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-flow-green/10 border border-flow-green/30 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-flow-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  {t('authRequiredTitle')}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {t('authRequiredDesc')}
                </p>
              </div>
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-flow-green text-white hover:bg-flow-green-hover transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
              >
                {signingIn ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('signingIn')}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t('signIn')}</span>
                  </>
                )}
              </button>
            </div>

          ) : (
            /* ---------------------------------------------------------------
              AUTHENTICATED — full chat interface (existing behavior, unchanged)
            --------------------------------------------------------------- */
            <>
              {/* Message List */}
              <div className="h-72 p-4 overflow-y-auto space-y-3 text-xs flex flex-col scrollbar-thin">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[80%] px-3 py-2.5 rounded-lg leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-flow-green/20 text-white border border-flow-green/25 self-end rounded-br-none'
                        : 'bg-[#21262d] text-gray-300 border border-[#30363d] self-start rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-[#21262d] text-gray-400 border border-[#30363d] max-w-[80%] px-3 py-2.5 rounded-lg rounded-bl-none self-start flex items-center space-x-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-flow-green" />
                    <span>{t('chatbotAnalyzing')}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-[#21262d] border-t border-[#30363d] flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('chatbotPlaceholder')}
                  className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-flow-green transition"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 rounded-lg bg-flow-green text-white hover:bg-flow-green-hover transition disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Send className="w-3.5 h-3.5 fill-white" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
