
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

const GeminiChat: React.FC = () => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are a helpful, minimalist personal daily assistant. Keep answers brief, smart, and useful. Use the users language if possible.',
        }
      });

      const aiText = response.text || 'Sorry, I am having trouble understanding.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to AI. Please check your network.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40 z-50 animate-bounce"
      >
        <Sparkles size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-80 sm:h-[450px] bg-white dark:bg-slate-900 shadow-2xl z-[60] flex flex-col rounded-t-3xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-10">
      <div className="p-4 bg-indigo-600 text-white flex justify-between items-center rounded-t-3xl sm:rounded-t-3xl">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-black text-sm uppercase tracking-widest">AI Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)}><X size={20} /></button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
              m.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-br-none' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl animate-pulse text-xs text-slate-400">Thinking...</div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500 dark:text-white"
        />
        <button 
          onClick={handleSend}
          className="bg-indigo-600 text-white p-2 rounded-xl active:scale-90 transition-transform"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;
