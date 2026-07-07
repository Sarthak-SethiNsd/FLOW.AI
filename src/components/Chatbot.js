'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

export default function Chatbot({ asanaContext = null }) {
  // Check if AI Assistant is enabled in environment
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT === 'true';
  
  if (!isEnabled) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Namaste! I am your FLOW.AI Assistant. How can I help you with your yoga practice or flexibility today?" }
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({ role: msg.role, content: msg.content }));
      
      const response = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="fixed bottom-24 right-6 z-40 select-text">
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-flow-green text-white flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_#2ea44f] hover:scale-105 transition duration-300"
          title="Ask AI Assistant"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
        </button>
      )}

      {/* Chatbox Window Panel */}
      {isOpen && (
        <div className="w-80 h-96 bg-[#161b22] border border-border-dark rounded-xl flex flex-col justify-between shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#21262d] border-b border-border-dark px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-flow-green animate-pulse"></span>
              <span className="text-xs font-bold text-white tracking-wide uppercase">AI Assistant (LLaMA)</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs flex flex-col scrollbar-thin">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`max-w-[80%] px-3 py-2.5 rounded-lg leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-flow-green/20 text-white border border-flow-green/25 self-end rounded-br-none'
                    : 'bg-card-bg text-gray-300 border border-border-dark self-start rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-card-bg text-gray-400 border border-border-dark max-w-[80%] px-3 py-2.5 rounded-lg rounded-bl-none self-start flex items-center space-x-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-flow-green" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-[#21262d] border-t border-border-dark flex items-center space-x-2">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about postures or flexibility..."
              className="flex-1 bg-background border border-border-dark rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-flow-green transition"
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

        </div>
      )}
    </div>
  );
}
