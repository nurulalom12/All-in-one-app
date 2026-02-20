
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator, Calendar, Repeat, ScanLine, X, ShieldCheck, 
  FileText, Lock, Plus, Camera, ChevronRight, Scale, Book, Moon, GraduationCap,
  Activity, ShoppingBag, BookOpen, Pill, Trash2, Check, Clock, Compass, Search, 
  Languages, Star, Heart, Sparkles, MessageSquare, Quote, Music, BookText, Copy, Share2,
  // Added missing CreditCard import
  CreditCard
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- SUB-COMPONENTS FOR TOOLS ---

const ShoppingTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { shoppingList, setShoppingList, t } = useApp();
  return (
    <div className="space-y-6 animate-in fade-in h-full">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('shopping')}</h3>
        <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={20} /></button>
      </div>
      <div className="space-y-3">
        {shoppingList.map(item => (
          <div key={item.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] flex items-center gap-4 group">
            <button 
              onClick={() => setShoppingList(shoppingList.map(i => i.id === item.id ? {...i, completed: !i.completed} : i))}
              className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-200'}`}
            >
              {item.completed && <Check size={14} />}
            </button>
            <span className={`text-sm font-black flex-1 dark:text-white ${item.completed ? 'line-through opacity-40' : ''}`}>{item.name}</span>
            <button onClick={() => setShoppingList(shoppingList.filter(i => i.id !== item.id))} className="text-rose-500"><Trash2 size={16}/></button>
          </div>
        ))}
        <button onClick={() => {
          const n = prompt("Item Name?");
          if (n) setShoppingList([{ id: Date.now().toString(), name: n, quantity: '1', completed: false }, ...shoppingList]);
        }} className="w-full p-6 bg-indigo-600 text-white rounded-[32px] font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20">
          + Add New Item
        </button>
      </div>
    </div>
  );
};

const CalculatorTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const { t } = useApp();

  const handleNumber = (n: string) => {
    setDisplay(display === '0' ? n : display + n);
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('calculator')}</h3>
        <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={20} /></button>
      </div>
      <div className="flex-1 flex flex-col justify-end p-6 bg-slate-50 dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-inner">
        <div className="text-right mb-2 text-slate-400 font-bold text-sm h-6">{equation}</div>
        <div className="text-right text-5xl font-black dark:text-white overflow-hidden truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {['C', '(', ')', '/'].map(btn => (
          <button key={btn} onClick={btn === 'C' ? clear : () => handleOp(btn)} className="p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl font-black text-indigo-500">{btn}</button>
        ))}
        {['7', '8', '9', '*'].map(btn => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOp(btn) : handleNumber(btn)} className="p-6 bg-white dark:bg-slate-800 rounded-3xl font-black dark:text-white shadow-sm">{btn}</button>
        ))}
        {['4', '5', '6', '-'].map(btn => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOp(btn) : handleNumber(btn)} className="p-6 bg-white dark:bg-slate-800 rounded-3xl font-black dark:text-white shadow-sm">{btn}</button>
        ))}
        {['1', '2', '3', '+'].map(btn => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOp(btn) : handleNumber(btn)} className="p-6 bg-white dark:bg-slate-800 rounded-3xl font-black dark:text-white shadow-sm">{btn}</button>
        ))}
        <button onClick={() => handleNumber('0')} className="col-span-2 p-6 bg-white dark:bg-slate-800 rounded-3xl font-black dark:text-white shadow-sm">0</button>
        <button onClick={() => handleNumber('.')} className="p-6 bg-white dark:bg-slate-800 rounded-3xl font-black dark:text-white shadow-sm">.</button>
        <button onClick={calculate} className="p-6 bg-indigo-600 text-white rounded-3xl font-black shadow-lg shadow-indigo-500/20">=</button>
      </div>
    </div>
  );
};

const TimerTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { t } = useApp();

  useEffect(() => {
    let interval: any = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime(time - 1), 1000);
    } else if (time === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in h-full flex flex-col items-center">
      <div className="flex justify-between items-center w-full px-2">
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('timer')}</h3>
        <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={20} /></button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
            <circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="754" strokeDashoffset={754 - (754 * time) / 3600} className="text-indigo-500 transition-all duration-1000" />
          </svg>
          <div className="text-6xl font-black dark:text-white">{formatTime(time)}</div>
        </div>
        <div className="flex gap-4">
          {[60, 300, 600, 1800].map(s => (
            <button key={s} onClick={() => { setTime(s); setIsActive(false); }} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500">{s/60}m</button>
          ))}
        </div>
        <div className="flex gap-6">
          <button onClick={() => setIsActive(!isActive)} className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${isActive ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}>
            {isActive ? <X size={32} /> : <Check size={32} />}
          </button>
          <button onClick={() => { setTime(0); setIsActive(false); }} className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
            <Repeat size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

const HealthTools: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { health, setHealth, t } = useApp();
  const [weight, setWeight] = useState(health.weight);
  const [height, setHeight] = useState(health.height);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'m' | 'f'>('m');

  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  const bmr = gender === 'm' 
    ? (10 * weight + 6.25 * height - 5 * age + 5)
    : (10 * weight + 6.25 * height - 5 * age - 161);

  return (
    <div className="space-y-8 animate-in fade-in h-full flex flex-col">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('health_tools')}</h3>
        <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={20} /></button>
      </div>
      <div className="space-y-6 flex-1 overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-8 rounded-[40px] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">BMI Score</p>
            <h4 className="text-4xl font-black">{bmi}</h4>
          </div>
          <div className="p-8 rounded-[40px] bg-emerald-600 text-white shadow-xl shadow-emerald-500/20">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">BMR (kcal)</p>
            <h4 className="text-4xl font-black">{Math.round(bmr)}</h4>
          </div>
        </div>

        <div className="p-8 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex gap-2">
            <button onClick={() => setGender('m')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${gender === 'm' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>Male</button>
            <button onClick={() => setGender('f')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${gender === 'f' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>Female</button>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight (kg)</label>
              <span className="text-sm font-black dark:text-white">{weight}</span>
            </div>
            <input type="range" min="30" max="200" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height (cm)</label>
              <span className="text-sm font-black dark:text-white">{height}</span>
            </div>
            <input type="range" min="100" max="250" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
              <span className="text-sm font-black dark:text-white">{age}</span>
            </div>
            <input type="range" min="1" max="100" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <button onClick={() => setHealth({...health, weight, height})} className="w-full py-5 bg-indigo-600 text-white rounded-[28px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Update Profile</button>
        </div>
      </div>
    </div>
  );
};

const NotesTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notes, setNotes, t } = useApp();
  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('notes')}</h3>
        <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={20} /></button>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto px-1">
        {notes.map(note => (
          <div key={note.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-black dark:text-white">{note.title}</h4>
              <button onClick={() => setNotes(notes.filter(n => n.id !== note.id))} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{note.content}</p>
            <p className="text-[8px] font-black text-slate-300 uppercase mt-4">{note.createdAt}</p>
          </div>
        ))}
        <button onClick={() => {
          const t = prompt("Note Title?");
          const c = prompt("Content?");
          if (t && c) setNotes([{ id: Date.now().toString(), title: t, content: c, createdAt: new Date().toLocaleString(), category: 'personal' }, ...notes]);
        }} className="w-full p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] text-slate-400 font-black uppercase text-[10px] tracking-widest">+ Create New Note</button>
      </div>
    </div>
  );
};

const MedsTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { medicines, setMedicines, t } = useApp();
  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('meds')}</h3>
        <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={20} /></button>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto px-1">
        {medicines.map(med => (
          <div key={med.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] flex items-center gap-4 shadow-sm group">
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl">
              <Pill size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-black dark:text-white">{med.name}</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase">{med.dosage} • {med.time}</p>
            </div>
            <button onClick={() => setMedicines(medicines.filter(m => m.id !== med.id))} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
          </div>
        ))}
        <button onClick={() => {
          const n = prompt("Medicine Name?");
          const d = prompt("Dosage?");
          const tm = prompt("Time (e.g. 09:00 AM)?");
          if (n && d && tm) setMedicines([{ id: Date.now().toString(), name: n, dosage: d, time: tm, completed: false }, ...medicines]);
        }} className="w-full p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] text-slate-400 font-black uppercase text-[10px] tracking-widest">+ Add Medicine</button>
      </div>
    </div>
  );
};

const LifestyleTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t, language } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'quotes' | 'captions' | 'stories' | 'rhymes'>('quotes');
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateContent = async (topic?: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const promptMap = {
        quotes: `Give me a deep and meaningful motivational quote in ${language === 'bn' ? 'Bengali' : 'English'}. Include the author name.`,
        captions: `Give me 5 cool Instagram/Facebook captions for a "${topic || 'beautiful day'}" in ${language === 'bn' ? 'Bengali' : 'English'}. Include emojis.`,
        stories: `Write a very short 2-minute moral story for adults in ${language === 'bn' ? 'Bengali' : 'English'}.`,
        rhymes: `Write a beautiful 4-line poem or rhyme about "Nature" in ${language === 'bn' ? 'Bengali' : 'English'}.`
      };
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: promptMap[activeSubTab],
      });
      setContent(response.text || 'Error generating content.');
    } catch (e) {
      setContent('Failed to load content. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generateContent(); }, [activeSubTab]);

  const copyToClipboard = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      alert("Copied!");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
       <div className="flex justify-between items-center px-2">
          <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('lifestyle')}</h3>
          <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={20} /></button>
       </div>

       <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
          {[
            { id: 'quotes', label: t('quotes'), icon: Quote },
            { id: 'captions', label: t('captions'), icon: MessageSquare },
            { id: 'stories', label: t('stories'), icon: BookText },
            { id: 'rhymes', label: t('rhymes'), icon: Music }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-500'
              }`}
            >
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
       </div>

       <div className="flex-1 overflow-y-auto space-y-6 px-1">
          <div className="p-10 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl relative min-h-[300px] flex flex-col items-center justify-center text-center">
             {loading ? (
                <div className="animate-pulse space-y-4 w-full">
                   <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 mx-auto" />
                   <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2 mx-auto" />
                   <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-2/3 mx-auto" />
                </div>
             ) : (
                <>
                   <Sparkles size={40} className="text-indigo-500 mb-8 opacity-20" />
                   <p className="text-lg font-black dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{content}</p>
                   <div className="flex gap-3 mt-10">
                      <button onClick={copyToClipboard} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-indigo-500 transition-colors"><Copy size={20} /></button>
                      <button onClick={() => generateContent()} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Next One</button>
                   </div>
                </>
             )}
          </div>
       </div>
    </div>
  );
};

const IslamicTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t, language } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'prayer' | 'quran' | 'hadis' | 'dua' | 'qibla'>('prayer');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAiQuery = async (type: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Provide the requested ${type} information about "${searchQuery}" in ${language === 'bn' ? 'Bengali' : 'English'}. Include references if possible.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiResult(response.text || 'No information found.');
    } catch (e) {
      setAiResult('Error fetching information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const prayers = [
    { n: language === 'bn' ? 'ফজর' : 'Fajr', t: '05:10 AM' },
    { n: language === 'bn' ? 'যোহর' : 'Dhuhr', t: '12:15 PM' },
    { n: language === 'bn' ? 'আসর' : 'Asr', t: '04:10 PM' },
    { n: language === 'bn' ? 'মাগরিব' : 'Maghrib', t: '06:20 PM' },
    { n: language === 'bn' ? 'এশা' : 'Isha', t: '07:45 PM' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
       <div className="flex justify-between items-center px-2">
          <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('prayer')}</h3>
          <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={20} /></button>
       </div>

       <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
          {[
            { id: 'prayer', label: t('prayer'), icon: Clock },
            { id: 'qibla', label: t('qibla'), icon: Compass },
            { id: 'dua', label: t('dua'), icon: Heart },
            { id: 'quran', label: t('quran'), icon: BookOpen },
            { id: 'hadis', label: t('hadis'), icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveSubTab(tab.id as any); setAiResult(null); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-500 shadow-sm'
              }`}
            >
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
       </div>

       <div className="flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar">
          {activeSubTab === 'prayer' && (
             <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <div className="p-10 rounded-[48px] bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Moon size={150} /></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">{t('hijri')}</p>
                  <h3 className="text-2xl font-black mb-10">15 Ramadan, 1446 AH</h3>
                  <div className="space-y-3">
                     {prayers.map(p => (
                       <div key={p.n} className="flex justify-between items-center px-6 py-5 bg-white/10 rounded-[28px] border border-white/10 backdrop-blur-xl">
                          <span className="font-black text-xs uppercase tracking-widest">{p.n}</span>
                          <span className="font-mono font-bold text-lg">{p.t}</span>
                       </div>
                     ))}
                  </div>
                </div>
             </div>
          )}

          {activeSubTab === 'qibla' && (
             <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in">
                <div className="relative w-72 h-72 bg-white dark:bg-slate-900 rounded-full border-[12px] border-slate-50 dark:border-slate-800 shadow-2xl flex items-center justify-center">
                   <div className="absolute inset-0 rounded-full flex items-center justify-center p-6">
                      <div className="w-full h-full rounded-full border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center relative">
                         <span className="absolute top-4 font-black text-rose-500">N</span>
                         <span className="absolute right-4 font-black">E</span>
                         <span className="absolute bottom-4 font-black">S</span>
                         <span className="absolute left-4 font-black">W</span>
                      </div>
                   </div>
                   <div className="w-1.5 h-56 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full rotate-[293deg] transform shadow-xl"></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-700 rounded-full shadow-lg border-4 border-slate-200" />
                </div>
                <div className="text-center mt-12">
                   <h4 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Qibla Compass</h4>
                   <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-2">293° North West (Dhaka)</p>
                </div>
             </div>
          )}

          {(activeSubTab === 'quran' || activeSubTab === 'hadis') && (
             <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="relative group">
                   <input 
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder={activeSubTab === 'quran' ? 'Enter Surah or Ayah...' : 'Search for Hadith keywords...'}
                     className="w-full p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold dark:text-white transition-all"
                   />
                   <button 
                     onClick={() => handleAiQuery(activeSubTab)}
                     disabled={loading}
                     className="absolute right-4 top-4 p-3 bg-emerald-600 text-white rounded-[20px] active:scale-90 transition-all shadow-lg shadow-emerald-500/20"
                   >
                     {loading ? <Clock className="animate-spin" size={20} /> : <Search size={20} />}
                   </button>
                </div>
                {aiResult && (
                   <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-2xl animate-in fade-in">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl"><Sparkles size={18} /></div>
                         <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Assistant Research</span>
                      </div>
                      <div className="text-sm dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">{aiResult}</div>
                   </div>
                )}
             </div>
          )}
       </div>
    </div>
  );
};

const ToolsView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { t } = useApp();

  const tools = [
    { id: 'finance', name: t('finance_hub'), icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: 'Income, Dues & More' },
    { id: 'lifestyle', name: t('lifestyle'), icon: MessageSquare, color: 'text-violet-500', bg: 'bg-violet-50', desc: 'Quotes & Captions' },
    { id: 'islamic', name: t('prayer'), icon: Moon, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'Islamic Hub' },
    { id: 'shopping', name: t('shopping'), icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: 'List & Items' },
    { id: 'notes', name: t('notes'), icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Capture Ideas' },
    { id: 'meds', name: t('meds'), icon: Pill, color: 'text-rose-500', bg: 'bg-rose-50', desc: 'Reminders' },
    { id: 'calculator', name: t('calculator'), icon: Calculator, color: 'text-slate-500', bg: 'bg-slate-50', desc: 'Math & Tools' },
    { id: 'timer', name: t('timer'), icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Countdown' },
    { id: 'health_tools', name: t('health_tools'), icon: Scale, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'BMI & BMR' },
  ];

  const handleClose = () => setActiveTool(null);

  if (activeTool === 'shopping') return <ShoppingTool onClose={handleClose} />;
  if (activeTool === 'lifestyle') return <LifestyleTool onClose={handleClose} />;
  if (activeTool === 'islamic') return <IslamicTool onClose={handleClose} />;
  if (activeTool === 'calculator') return <CalculatorTool onClose={handleClose} />;
  if (activeTool === 'timer') return <TimerTool onClose={handleClose} />;
  if (activeTool === 'health_tools') return <HealthTools onClose={handleClose} />;
  if (activeTool === 'notes') return <NotesTool onClose={handleClose} />;
  if (activeTool === 'meds') return <MedsTool onClose={handleClose} />;
  if (activeTool === 'finance') { window.location.hash = 'finance'; return null; }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 pb-24">
      <h2 className="text-2xl font-black dark:text-white px-1 uppercase tracking-tighter">Utility Hub</h2>
      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="p-6 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-4 transition-all active:scale-[0.95] group hover:border-indigo-200"
          >
            <div className={`p-5 rounded-[32px] ${tool.bg} dark:bg-slate-800 ${tool.color} transition-transform group-hover:scale-110 shadow-sm`}>
              <tool.icon size={28} />
            </div>
            <div>
              <span className="font-black text-[11px] uppercase tracking-widest dark:text-white block">{tool.name}</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-1 block opacity-70">{tool.desc}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="p-10 rounded-[56px] bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
         <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -mr-16 blur-3xl" />
         <h4 className="text-xl font-black mb-1">Advanced Tools</h4>
         <p className="text-xs opacity-70 mb-8 font-bold leading-relaxed">PDF Export and Cloud backup available for Premium users.</p>
         <button className="w-full py-5 bg-white/20 backdrop-blur-md rounded-[28px] text-[10px] font-black uppercase tracking-[0.2em]">Upgrade Now</button>
      </div>
    </div>
  );
};

export default ToolsView;
