
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Task, Note, Habit, Transaction, ViewType, SavingsGoal, EMILoan, 
  Subscription, MoodLog, WaterLog, VaultDoc, HealthStats, ShoppingItem,
  Medicine, JournalEntry, DueItem, CalendarEvent
} from '../types';

interface AppContextType {
  tasks: Task[];
  notes: Note[];
  shoppingList: ShoppingItem[];
  habits: Habit[];
  transactions: Transaction[];
  dues: DueItem[];
  savingsGoals: SavingsGoal[];
  emis: EMILoan[];
  subscriptions: Subscription[];
  moods: MoodLog[];
  waterLogs: WaterLog[];
  vault: VaultDoc[];
  health: HealthStats;
  medicines: Medicine[];
  journals: JournalEntry[];
  events: CalendarEvent[];
  currentView: ViewType;
  darkMode: boolean;
  language: 'en' | 'bn';
  pinLock: string | null;
  isLocked: boolean;
  
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setDues: React.Dispatch<React.SetStateAction<DueItem[]>>;
  setSavingsGoals: React.Dispatch<React.SetStateAction<SavingsGoal[]>>;
  setEmis: React.Dispatch<React.SetStateAction<EMILoan[]>>;
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  setMoods: React.Dispatch<React.SetStateAction<MoodLog[]>>;
  setWaterLogs: React.Dispatch<React.SetStateAction<WaterLog[]>>;
  setVault: React.Dispatch<React.SetStateAction<VaultDoc[]>>;
  setHealth: React.Dispatch<React.SetStateAction<HealthStats>>;
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  setJournals: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setCurrentView: (view: ViewType) => void;
  setDarkMode: (dark: boolean) => void;
  setLanguage: (lang: 'en' | 'bn') => void;
  setPinLock: (pin: string | null) => void;
  setIsLocked: (locked: boolean) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    welcome: "Hi, Ready for the day?",
    tasks: "Tasks",
    spending: "Spending",
    hydration: "Hydration",
    trend: "Spending Trend",
    quick_tools: "Quick Tools",
    finance_hub: "Finance Hub",
    summary: "Summary",
    goals: "Goals",
    emi_loans: "EMI/Loans",
    subs: "Subs",
    dues: "Dues",
    productivity: "Wellness",
    habits: "Habits",
    wellness: "Health",
    focus: "Focus",
    settings: "Settings",
    language: "Language",
    theme: "Theme Mode",
    logout: "Logout",
    locked: "Locked",
    enter_pin: "Enter PIN",
    bmi: "BMI",
    steps: "Steps",
    sleep: "Sleep",
    weight: "Weight",
    height: "Height",
    shopping: "Shopping",
    notes: "Notes",
    ai_chat: "AI Assistant",
    meds: "Medicines",
    prayer: "Prayer",
    journal: "Journal",
    gpa: "GPA Calc",
    quran: "Quran",
    hadis: "Hadith",
    dua: "Dua",
    qibla: "Qibla",
    islamic_cal: "Islamic Calendar",
    hijri: "Hijri Date",
    lifestyle: "Lifestyle",
    quotes: "Quotes",
    captions: "Captions",
    stories: "Stories",
    rhymes: "Rhymes",
    calendar: "Calendar",
    add_event: "Add Event",
    event_title: "Event Title",
    event_date: "Date",
    event_start: "Start Time",
    event_end: "End Time",
    health_monitor: "Health Monitor",
    calculator: "Calculator",
    timer: "Timer",
    bmr: "BMR",
    water: "Water",
    heart_rate: "Heart Rate",
    health_tools: "Health Tools"
  },
  bn: {
    welcome: "আজকের জন্য প্রস্তুত?",
    tasks: "কাজ",
    spending: "ব্যয়",
    hydration: "পানি পান",
    trend: "ব্যয়ের ধরন",
    quick_tools: "প্রয়োজনীয় টুলস",
    finance_hub: "আর্থিক কেন্দ্র",
    summary: "সংক্ষিপ্তসার",
    goals: "লক্ষ্য",
    emi_loans: "ইএমআই/ঋণ",
    subs: "সাবস্ক্রিপশন",
    dues: "বাকি-বকেয়া",
    productivity: "সুস্থতা",
    habits: "অভ্যাস",
    wellness: "স্বাস্থ্য",
    focus: "মনোযোগ",
    settings: "সেটিংস",
    language: "ভাষা",
    theme: "থিম মোড",
    logout: "লগআউট",
    locked: "লক করা",
    enter_pin: "পিন দিন",
    bmi: "বিএমআই",
    steps: "পদক্ষেপ",
    sleep: "ঘুম",
    weight: "ওজন",
    height: "উচ্চতা",
    shopping: "কেনাকাটা",
    notes: "নোটস",
    ai_chat: "AI সহকারী",
    meds: "ঔষধ",
    prayer: "নামাজ",
    journal: "ডায়েরি",
    gpa: "জিপিএ ক্যালক",
    quran: "কুরআন",
    hadis: "হাদিস",
    dua: "দোয়া",
    qibla: "কিবলা",
    islamic_cal: "ইসলামিক ক্যালেন্ডার",
    hijri: "হিজরি তারিখ",
    lifestyle: "লাইফস্টাইল",
    quotes: "উক্তি",
    captions: "ক্যাপশন",
    stories: "গল্প",
    rhymes: "ছন্দ",
    calendar: "ক্যালেন্ডার",
    add_event: "ইভেন্ট যোগ করুন",
    event_title: "ইভেন্টের নাম",
    event_date: "তারিখ",
    event_start: "শুরুর সময়",
    event_end: "শেষের সময়",
    health_monitor: "স্বাস্থ্য মনিটর",
    calculator: "ক্যালকুলেটর",
    timer: "টাইমার",
    bmr: "বিএমআর",
    water: "পানি",
    heart_rate: "হৃদস্পন্দন",
    health_tools: "স্বাস্থ্য টুলস"
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('tasks') || '[]'));
  const [notes, setNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('notes') || '[]'));
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => JSON.parse(localStorage.getItem('shoppingList') || '[]'));
  const [habits, setHabits] = useState<Habit[]>(() => JSON.parse(localStorage.getItem('habits') || '[]'));
  const [transactions, setTransactions] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('transactions') || '[]'));
  const [dues, setDues] = useState<DueItem[]>(() => JSON.parse(localStorage.getItem('dues') || '[]'));
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => JSON.parse(localStorage.getItem('savingsGoals') || '[]'));
  const [emis, setEmis] = useState<EMILoan[]>(() => JSON.parse(localStorage.getItem('emis') || '[]'));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => JSON.parse(localStorage.getItem('subscriptions') || '[]'));
  const [moods, setMoods] = useState<MoodLog[]>(() => JSON.parse(localStorage.getItem('moods') || '[]'));
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => JSON.parse(localStorage.getItem('waterLogs') || '[]'));
  const [vault, setVault] = useState<VaultDoc[]>(() => JSON.parse(localStorage.getItem('vault') || '[]'));
  const [health, setHealth] = useState<HealthStats>(() => JSON.parse(localStorage.getItem('health') || '{"steps":0,"weight":70,"height":170,"sleepHours":8,"heartRate":72}'));
  const [medicines, setMedicines] = useState<Medicine[]>(() => JSON.parse(localStorage.getItem('medicines') || '[]'));
  const [journals, setJournals] = useState<JournalEntry[]>(() => JSON.parse(localStorage.getItem('journals') || '[]'));
  const [events, setEvents] = useState<CalendarEvent[]>(() => JSON.parse(localStorage.getItem('events') || '[]'));

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
  const [language, setLanguage] = useState<'en' | 'bn'>(() => (localStorage.getItem('lang') as any) || 'en');
  const [pinLock, setPinLock] = useState<string | null>(() => localStorage.getItem('pinLock'));
  const [isLocked, setIsLocked] = useState<boolean>(!!localStorage.getItem('pinLock'));

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('dues', JSON.stringify(dues));
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
    localStorage.setItem('emis', JSON.stringify(emis));
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    localStorage.setItem('moods', JSON.stringify(moods));
    localStorage.setItem('waterLogs', JSON.stringify(waterLogs));
    localStorage.setItem('vault', JSON.stringify(vault));
    localStorage.setItem('health', JSON.stringify(health));
    localStorage.setItem('medicines', JSON.stringify(medicines));
    localStorage.setItem('journals', JSON.stringify(journals));
    localStorage.setItem('events', JSON.stringify(events));
  }, [tasks, notes, shoppingList, habits, transactions, dues, savingsGoals, emis, subscriptions, moods, waterLogs, vault, health, medicines, journals, events]);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <AppContext.Provider value={{
      tasks, notes, shoppingList, habits, transactions, dues, savingsGoals, emis, subscriptions, moods, waterLogs, vault, health, medicines, journals, events,
      currentView, darkMode, language, pinLock, isLocked,
      setTasks, setNotes, setShoppingList, setHabits, setTransactions, setDues, setSavingsGoals, setEmis, setSubscriptions,
      setMoods, setWaterLogs, setVault, setHealth, setMedicines, setJournals, setEvents, setCurrentView, setDarkMode, setLanguage, setPinLock, setIsLocked, t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
