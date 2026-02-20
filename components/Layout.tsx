
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Wrench, 
  PieChart, 
  CheckCircle2, 
  UserCircle,
  Calendar,
  Heart
} from 'lucide-react';
import { ViewType } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentView, setCurrentView } = useApp();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tools', icon: Wrench, label: 'Tools' },
    { id: 'finance', icon: PieChart, label: 'Finance' },
    { id: 'productivity', icon: CheckCircle2, label: 'Productivity' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'health', icon: Heart, label: 'Health' },
    { id: 'profile', icon: UserCircle, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6 custom-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex justify-around items-center h-16 px-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-500 text-white scale-110' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-indigo-500'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'block' : 'hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
