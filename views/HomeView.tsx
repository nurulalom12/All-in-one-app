
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, TrendingUp, Zap, Activity, Droplets, Heart, Footprints, Sparkles, Moon, Clock, Calendar } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';

const HomeView: React.FC = () => {
  const { tasks, transactions, setCurrentView, waterLogs, health, medicines, t, language } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const pendingMeds = medicines.filter(m => !m.completed).length;
  
  const todayWater = waterLogs.find(l => l.date === todayStr)?.currentAmount || 0;
  const waterPercent = Math.min((todayWater / 2000) * 100, 100);

  const weeklyExpenses = transactions
    .filter(tr => tr.type === 'expense')
    .slice(0, 7)
    .map(tr => ({ day: new Date(tr.date).toLocaleDateString(undefined, { weekday: 'short' }), amount: tr.amount }))
    .reverse();

  // Simulated Prayer Times (usually fetched via API)
  const prayers = [
    { name: language === 'bn' ? 'ফজর' : 'Fajr', time: '05:10 AM' },
    { name: language === 'bn' ? 'যোহর' : 'Dhuhr', time: '12:15 PM' },
    { name: language === 'bn' ? 'আসর' : 'Asr', time: '04:10 PM' },
    { name: language === 'bn' ? 'মাগরিব' : 'Maghrib', time: '06:20 PM' },
    { name: language === 'bn' ? 'এশা' : 'Isha', time: '07:45 PM' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-4">
      <header className="flex justify-between items-start px-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight dark:text-white">Daily Smart</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {currentTime.toLocaleDateString([], { weekday: 'long' })}</p>
        </div>
        <button 
          onClick={() => setCurrentView('profile')} 
          className="w-11 h-11 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-500/30 transition-transform active:scale-90"
        >
          JD
        </button>
      </header>

      {/* Prayer Times Widget */}
      <div className="p-5 rounded-[36px] bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 flex items-center justify-between overflow-hidden relative">
        <div className="absolute -right-4 -bottom-4 opacity-10">
           <Moon size={120} />
        </div>
        <div className="flex-1">
           <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('prayer')} Schedule</span>
           </div>
           <h3 className="text-lg font-black">{prayers[1].name} • {prayers[1].time}</h3>
           <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-tight">Next: {prayers[2].name} at {prayers[2].time}</p>
        </div>
        <button onClick={() => setCurrentView('tools')} className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest">Qibla</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Med Reminder Card */}
        <div className="p-4 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl"><Clock size={16} /></div>
             <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{t('meds')}</span>
          </div>
          <p className="text-xl font-black dark:text-white">{pendingMeds} Pending</p>
          <button onClick={() => setCurrentView('productivity')} className="text-[9px] font-black text-indigo-500 uppercase mt-2">View Doses</button>
        </div>

        {/* Task Summary */}
        <div className="p-4 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-violet-200">
          <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-violet-50 dark:bg-violet-900/20 text-violet-500 rounded-xl"><Zap size={16} /></div>
             <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{t('tasks')}</span>
          </div>
          <p className="text-xl font-black dark:text-white">{pendingTasks} Left</p>
          <button onClick={() => setCurrentView('productivity')} className="text-[9px] font-black text-violet-500 uppercase mt-2">Go To List</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
             <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl"><Heart size={18} fill="currentColor" /></div>
             <span className="text-[10px] font-black uppercase text-slate-400">BPM</span>
          </div>
          <p className="text-2xl font-black dark:text-white">{health.heartRate}</p>
        </div>
        <div className="p-4 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
             <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-xl"><Footprints size={18} /></div>
             <span className="text-[10px] font-black uppercase text-slate-400">{t('steps')}</span>
          </div>
          <p className="text-2xl font-black dark:text-white">{health.steps}</p>
        </div>
      </div>

      <div className="p-6 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-slate-100 dark:text-slate-800" />
              <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" strokeDasharray={150.8} strokeDashoffset={150.8 - (150.8 * waterPercent) / 100} className="text-blue-500" strokeLinecap="round" />
            </svg>
            <Droplets className="absolute text-blue-500" size={20} />
          </div>
          <div>
            <p className="text-sm font-black dark:text-white">{t('hydration')}</p>
            <p className="text-xs text-slate-500">{todayWater} ml today</p>
          </div>
        </div>
        <button onClick={() => setCurrentView('productivity')} className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-2xl">
           <Plus size={20} />
        </button>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h4 className="text-[10px] font-black dark:text-white flex items-center gap-2 uppercase tracking-widest">{t('trend')}</h4>
          <button onClick={() => setCurrentView('finance')} className="text-xs text-indigo-500 font-bold">Details</button>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[40px] border border-slate-100 dark:border-slate-800 h-48 shadow-sm">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={weeklyExpenses}>
               <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                 {weeklyExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === weeklyExpenses.length - 1 ? '#6366f1' : '#e2e8f0'} />
                 ))}
               </Bar>
               <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
