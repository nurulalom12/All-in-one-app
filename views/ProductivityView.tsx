
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Check, Trash2, Heart, Activity, Scale, Moon
} from 'lucide-react';
import { Priority } from '../types';

const ProductivityView: React.FC = () => {
  const { tasks, setTasks, health, setHealth, t } = useApp();
  const [activeTab, setActiveTab] = useState<'wellness' | 'tasks'>('wellness');

  const todayStr = new Date().toISOString().split('T')[0];
  const bmi = (health.weight / ((health.height / 100) ** 2)).toFixed(1);

  const renderWellness = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('bmi')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black dark:text-white">{bmi}</h3>
          </div>
        </div>
        <button onClick={() => {
           const w = prompt("Weight (kg)?", health.weight.toString());
           if (w) setHealth({...health, weight: Number(w)});
        }} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl"><Scale size={20} className="text-slate-500" /></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
           <Activity size={24} className="mx-auto mb-4 text-emerald-500" />
           <p className="text-2xl font-black dark:text-white">{health.steps}</p>
           <p className="text-[10px] text-slate-400 font-black uppercase">{t('steps')}</p>
        </div>
        <div className="p-6 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
           <Moon size={24} className="mx-auto mb-4 text-indigo-500" />
           <p className="text-2xl font-black dark:text-white">{health.sleepHours}h</p>
           <p className="text-[10px] text-slate-400 font-black uppercase">{t('sleep')}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-black dark:text-white px-1 uppercase tracking-tighter">{t('productivity')}</h2>
      
      <div className="flex gap-2 p-1">
        {[
          { id: 'wellness', label: t('wellness'), icon: Heart },
          { id: 'tasks', label: t('tasks'), icon: Check },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
              ? 'bg-indigo-600 text-white shadow-xl' 
              : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'wellness' ? renderWellness() : (
        <div className="space-y-4 animate-in fade-in">
           {tasks.map(t => (
             <div key={t.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] flex items-center gap-4 group shadow-sm">
                <button 
                  onClick={() => setTasks(tasks.map(tk => tk.id === t.id ? {...tk, completed: !tk.completed} : tk))}
                  className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'}`}
                >
                  {t.completed && <Check size={16} />}
                </button>
                <span className={`text-sm font-bold flex-1 dark:text-white ${t.completed ? 'line-through opacity-40' : ''}`}>{t.title}</span>
                <button onClick={() => setTasks(tasks.filter(tk => tk.id !== t.id))} className="opacity-0 group-hover:opacity-100 text-rose-500"><Trash2 size={18}/></button>
             </div>
           ))}
           <button onClick={() => {
              const s = prompt("New Task?");
              if (s) setTasks([{ id: Date.now().toString(), title: s, priority: Priority.MEDIUM, completed: false, dueDate: todayStr }, ...tasks]);
           }} className="w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] text-slate-400 font-black uppercase text-[10px] tracking-widest">+ Create New Task</button>
        </div>
      )}
    </div>
  );
};

export default ProductivityView;
