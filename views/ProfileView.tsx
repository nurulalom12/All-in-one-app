
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Lock, Shield, Languages, Cloud, LogOut, ChevronRight, User, Bell, Info } from 'lucide-react';

const ProfileView: React.FC = () => {
  const { darkMode, setDarkMode, language, setLanguage, pinLock, setPinLock, setIsLocked, t } = useApp();
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("Cloud Sync Successful!");
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 pb-24">
      <div className="text-center px-4">
        <div className="relative inline-block">
          <div className="w-28 h-28 rounded-[44px] bg-gradient-to-tr from-indigo-500 to-violet-600 mx-auto flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-500/20 mb-6 border-4 border-white dark:border-slate-900">
            U
          </div>
          <div className="absolute bottom-6 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900" />
        </div>
        <h2 className="text-2xl font-black dark:text-white">User Profile</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Premium Assistant Member</p>
      </div>

      <div className="space-y-5">
        <section>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-5 mb-3">{t('settings')}</h4>
          <div className="bg-white dark:bg-slate-900 rounded-[36px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-2xl ${darkMode ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <span className="font-bold text-sm dark:text-white">{t('theme')}</span>
              </div>
              <div className={`w-12 h-7 rounded-full p-1 transition-colors ${darkMode ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-5 shadow-sm' : 'shadow-sm'}`} />
              </div>
            </button>

            <button 
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="w-full p-5 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-600">
                  <Languages size={20} />
                </div>
                <span className="font-bold text-sm dark:text-white">{t('language')}</span>
              </div>
              <span className="text-xs font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl">{language === 'en' ? 'EN' : 'BN'}</span>
            </button>
            
            <button className="w-full p-5 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-600">
                  <Bell size={20} />
                </div>
                <span className="font-bold text-sm dark:text-white">Notifications</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          </div>
        </section>

        <section>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-5 mb-3">Cloud & Security</h4>
          <div className="bg-white dark:bg-slate-900 rounded-[36px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20">
                  <Cloud size={20} className={syncing ? 'animate-bounce' : ''} />
                </div>
                <span className="font-bold text-sm dark:text-white">{syncing ? 'Syncing...' : 'Firebase Backup'}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>

            <button 
              onClick={() => setIsLocked(true)}
              className="w-full p-5 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-900/20">
                  <Shield size={20} />
                </div>
                <span className="font-bold text-sm dark:text-white">Security Lock</span>
              </div>
              <Lock size={18} className="text-slate-300" />
            </button>
          </div>
        </section>

        <section className="px-1">
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-[32px] flex items-start gap-4">
             <Info className="text-slate-400 mt-1 flex-shrink-0" size={18} />
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Phase 2 update includes secure local vault, advanced finance trackers, and automated focus sessions. Stay tuned for AI integration in Phase 3.</p>
          </div>
        </section>

        <button className="w-full p-6 flex items-center gap-3 text-rose-500 font-black uppercase text-[10px] tracking-widest bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] justify-center shadow-sm active:scale-95 transition-all">
          <LogOut size={18} /> {t('logout')}
        </button>
      </div>

      <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">V2.5.0-STABLE • PHASE 2 READY</p>
    </div>
  );
};

export default ProfileView;
