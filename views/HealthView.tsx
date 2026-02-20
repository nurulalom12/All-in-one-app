
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, Activity, Scale, Moon, Droplets, Plus, 
  TrendingUp, Pill, ChevronRight, Info
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const HealthView: React.FC = () => {
  const { health, setHealth, waterLogs, setWaterLogs, moods, medicines, t } = useApp();
  const [showWaterModal, setShowWaterModal] = useState(false);

  const bmi = (health.weight / ((health.height / 100) ** 2)).toFixed(1);
  const getBmiStatus = (val: number) => {
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Normal';
    if (val < 30) return 'Overweight';
    return 'Obese';
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayWater = waterLogs.find(l => l.date === todayStr)?.currentAmount || 0;
  const waterGoal = 3000; // 3L goal

  const addWater = (amount: number) => {
    const existing = waterLogs.find(l => l.date === todayStr);
    if (existing) {
      setWaterLogs(waterLogs.map(l => l.date === todayStr ? { ...l, currentAmount: l.currentAmount + amount } : l));
    } else {
      setWaterLogs([...waterLogs, { date: todayStr, currentAmount: amount, goal: waterGoal }]);
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('health_monitor')}</h2>
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
          <Heart size={20} fill="currentColor" />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl">
              <Heart size={20} />
            </div>
            <span className="text-[10px] font-black text-emerald-500">+2%</span>
          </div>
          <h3 className="text-2xl font-black dark:text-white">{health.heartRate}</h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">BPM Avg</p>
        </div>

        <div className="p-6 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-2xl">
              <Activity size={20} />
            </div>
            <span className="text-[10px] font-black text-indigo-500">Goal: 10k</span>
          </div>
          <h3 className="text-2xl font-black dark:text-white">{health.steps}</h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('steps')}</p>
        </div>
      </div>

      {/* BMI Card */}
      <div className="p-8 rounded-[48px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Body Mass Index</p>
          <div className="flex items-baseline gap-3 mb-6">
            <h3 className="text-5xl font-black">{bmi}</h3>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase">
              {getBmiStatus(Number(bmi))}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">{t('weight')}</p>
              <p className="font-bold">{health.weight} kg</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">{t('height')}</p>
              <p className="font-bold">{health.height} cm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="p-8 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-lg font-black dark:text-white">{t('hydration')}</h4>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Daily intake goal: 3L</p>
          </div>
          <button 
            onClick={() => addWater(250)}
            className="p-4 bg-blue-500 text-white rounded-3xl shadow-lg shadow-blue-500/20 active:scale-90 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
          <div 
            className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min((todayWater / waterGoal) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>{todayWater}ml</span>
          <span>{waterGoal}ml</span>
        </div>
      </div>

      {/* Sleep & Recovery */}
      <div className="p-8 rounded-[48px] bg-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="flex justify-between items-start mb-8">
          <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
            <Moon size={24} />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Sleep Quality</p>
            <p className="text-xl font-black">Excellent</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-4xl font-black">{health.sleepHours}h</h3>
          <span className="text-xs font-bold opacity-60">/ 8h goal</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Last night's rest</p>
      </div>

      {/* Medicines Reminder (Quick View) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicines Today</h4>
          <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">View All</button>
        </div>
        <div className="space-y-3">
          {medicines.length > 0 ? medicines.map(med => (
            <div key={med.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl">
                <Pill size={20} />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-sm dark:text-white">{med.name}</h5>
                <p className="text-[10px] text-slate-400 font-medium">{med.dosage} • {med.time}</p>
              </div>
              <button className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${med.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'}`}>
                {med.completed && <Plus size={16} className="rotate-45" />}
              </button>
            </div>
          )) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
              <Info size={24} className="mx-auto mb-2 text-slate-300" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No medicines added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthView;
