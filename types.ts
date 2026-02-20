
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: 'work' | 'personal' | 'idea';
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  completed: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted: string; 
  frequency: 'daily' | 'weekly';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note: string;
  period?: 'daily' | 'monthly';
}

export interface DueItem {
  id: string;
  name: string;
  amount: number;
  type: 'payable' | 'receivable'; // বকেয়া দেনা vs পাওনা
  date: string;
  status: 'pending' | 'cleared';
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export interface EMILoan {
  id: string;
  name: string;
  monthlyAmount: number;
  totalTenure: number;
  paidTenure: number;
  startDate: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
}

export interface MoodLog {
  date: string; 
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'cool';
}

export interface WaterLog {
  date: string;
  currentAmount: number; 
  goal: number;
}

export interface HealthStats {
  steps: number;
  weight: number; 
  height: number; 
  sleepHours: number;
  heartRate: number;
}

export interface VaultDoc {
  id: string;
  name: string;
  type: 'file' | 'password';
  data: string; 
  username?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  color?: string;
}

export type ViewType = 'home' | 'tools' | 'finance' | 'productivity' | 'profile' | 'calendar' | 'health';
