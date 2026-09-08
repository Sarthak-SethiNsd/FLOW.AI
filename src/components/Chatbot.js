'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

// ---------------------------------------------------------------------------
// Recommendation Note Component
// Compact, clearly styled informational note (guidance only, no form/buttons)
// Declared outside parent component so it is not re-created during render.
// ---------------------------------------------------------------------------
function RecommendationNote({ t, compact = false }) {
  return (
    <div className={`rounded-lg bg-[#0d1117]/90 border border-[#30363d] text-gray-300 ${compact ? 'p-3 text-[11px] space-y-1.5' : 'p-4 text-xs space-y-2'}`}>
      <div className="flex items-center space-x-2 text-flow-green">
        <Sparkles className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} flex-shrink-0`} />
        <span className="text-xs font-bold tracking-wide text-white">
          {t('recNoteTitle') || 'Want a personalized yoga asana recommendation?'}
        </span>
      </div>
      <p className="text-gray-400">
        {t('recNotePrompt') || 'For a better response, tell me:'}
      </p>
      <ul className="text-gray-400 space-y-1 pl-1">
        <li className="flex items-start space-x-1.5">
          <span className="text-flow-green font-bold select-none">•</span>
          <span>{t('recNoteLevel') || 'Your experience level'}</span>
        </li>
        <li className="flex items-start space-x-1.5">
          <span className="text-flow-green font-bold select-none">•</span>
          <span>{t('recNoteLimitation') || 'Any injury or physical limitation'}</span>
        </li>
        <li className="flex items-start space-x-1.5">
          <span className="text-flow-green font-bold select-none">•</span>
          <span>{t('recNoteGoal') || 'Your goal (flexibility, strength, relaxation, posture, etc.)'}</span>
        </li>
      </ul>
    </div>
  );
}

export default function Chatbot({ asanaContext = null, variant = 'floating', positionClass = '', initialOpen = false }) {
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

  const [isOpen, setIsOpen] = useState(initialOpen);
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
  // Variant: 'pill' — labeled trigger + wider comfortable panel
  // Used on: Home (/), About (/about), Asana Selection (/pose/[id])
  // -------------------------------------------------------------------------
  if (variant === 'pill') {
    return (
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 select-text flex flex-col items-end">

        {/* Pill Trigger — visible when panel is closed */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#161b22] border border-flow-green/40 text-flow-green text-sm font-semibold shadow-lg hover:bg-[#21262d] hover:border-flow-green hover:shadow-[0_0_12px_rgba(46,164,79,0.25)] transition duration-200"
            title={t('chatbotPillTooltip')}
            aria-label={t('chatbotPillLabel')}
          >
            <span className="w-2 h-2 rounded-full bg-flow-green animate-pulse flex-shrink-0" />
            <span>{t('chatbotPillLabel')}</span>
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
          </button>
        )}

        {/* Open panel — wider and taller than floating variant */}
        {isOpen && (
          <div className="w-96 max-w-[calc(100vw-2rem)] bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">

            {/* Panel header */}
            <div className="bg-[#21262d] border-b border-[#30363d] px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-flow-green animate-pulse" />
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

            {/* Auth gate — unauthenticated users see sign-in prompt */}
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
              /* Authenticated — full chat interface */
              <>
                {/* Message list — taller than floating variant */}
                <div className="h-80 p-4 overflow-y-auto space-y-3 text-xs flex flex-col scrollbar-thin">
                  {/* Recommendation Guidance Note */}
                  <RecommendationNote t={t} compact />

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

                {/* Input form */}
                <form onSubmit={handleSend} className="p-3 bg-[#21262d] border-t border-[#30363d] flex items-center space-x-2 flex-shrink-0">
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

  // -------------------------------------------------------------------------
  // Variant: 'workspace' — true embedded right-side workspace
  // Used on: Watch & Learn (/pose/[id]/watch), Practice (/pose/[id]/practice)
  // Behaves like: width: 100%; height: 100%; position: relative;
  // -------------------------------------------------------------------------
  if (variant === 'workspace') {
    return (
      <div className="w-full h-full flex flex-col relative bg-panel overflow-hidden">
        {/* Workspace Header */}
        <div className="bg-[#0d1117] border-b border-[#30363d] px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-flow-green animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">{t('chatbotHeaderTitle')}</span>
            {asanaContext?.name && (
              <span className="text-[10px] text-gray-400 font-medium bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d] truncate max-w-[130px]">
                {asanaContext.name}
              </span>
            )}
          </div>
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-[#21262d]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Context strip — current step info */}
        {asanaContext?.instruction && (
          <div className="px-4 py-2 bg-flow-green/5 border-b border-[#30363d] flex-shrink-0">
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
              {asanaContext.currentStep && asanaContext.totalSteps
                ? `Step ${asanaContext.currentStep} of ${asanaContext.totalSteps}`
                : 'Current Step'}
            </p>
            <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{asanaContext.instruction}</p>
          </div>
        )}

        {/* Workspace Body */}
        {!isOpen ? (
          /* CLOSED STATE — Dedicated Assistant Workspace View */
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto min-h-0">
            <div className="space-y-4">
              <RecommendationNote t={t} />
            </div>

            {/* Pill trigger at bottom of workspace */}
            <div className="pt-4 border-t border-border-dark flex justify-center flex-shrink-0">
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#0d1117] border border-flow-green/40 text-flow-green text-xs font-semibold shadow hover:bg-[#21262d] hover:border-flow-green hover:shadow-[0_0_12px_rgba(46,164,79,0.25)] transition duration-200"
                title={t('chatbotPillTooltip')}
                aria-label={t('chatbotPillLabel')}
              >
                <span className="w-2 h-2 rounded-full bg-flow-green animate-pulse flex-shrink-0" />
                <span>{t('chatbotPillLabel')}</span>
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
              </button>
            </div>
          </div>
        ) : (
          /* OPEN STATE — Full Chat Panel Filling Right Workspace */
          <div className="flex-1 flex flex-col min-h-0">
            {!isAuthenticated ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-flow-green/10 border border-flow-green/30 flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-flow-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{t('authRequiredTitle')}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{t('authRequiredDesc')}</p>
                </div>
                <button
                  onClick={handleSignIn}
                  disabled={signingIn}
                  className="w-full max-w-xs py-2.5 rounded-lg text-xs font-semibold bg-flow-green text-white hover:bg-flow-green-hover transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
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
              <>
                {/* Message list */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs flex flex-col scrollbar-thin min-h-0">
                  {/* Recommendation Guidance Note */}
                  <RecommendationNote t={t} compact />

                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-lg leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-flow-green/20 text-white border border-flow-green/25 self-end rounded-br-none'
                          : 'bg-[#21262d] text-gray-300 border border-[#30363d] self-start rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-[#21262d] text-gray-400 border border-[#30363d] max-w-[80%] px-3.5 py-2.5 rounded-lg rounded-bl-none self-start flex items-center space-x-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-flow-green" />
                      <span>{t('chatbotAnalyzing')}</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSend} className="p-3 bg-[#21262d] border-t border-[#30363d] flex items-center space-x-2 flex-shrink-0">
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

  // -------------------------------------------------------------------------
  // Variant: 'floating' (default) — original behavior, legacy fallback
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
                {/* Recommendation Guidance Note */}
                <RecommendationNote t={t} compact />

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
