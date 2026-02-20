
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Calendar as CalendarIcon,
  Trash2
} from 'lucide-react';
import { CalendarEvent } from '../types';

const CalendarView: React.FC = () => {
  const { events, setEvents, t } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    color: 'bg-indigo-500'
  });

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-20 border border-slate-100 dark:border-slate-800 opacity-20"></div>);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <div key={d} className={`h-20 border border-slate-100 dark:border-slate-800 p-1 overflow-hidden relative ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
        <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>{d}</span>
        <div className="mt-1 space-y-0.5">
          {dayEvents.slice(0, 2).map(e => (
            <div key={e.id} className={`text-[8px] truncate px-1 rounded-sm text-white ${e.color || 'bg-indigo-500'}`}>
              {e.title}
            </div>
          ))}
          {dayEvents.length > 2 && <div className="text-[8px] text-slate-400">+{dayEvents.length - 2} more</div>}
        </div>
      </div>
    );
  }

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime || '09:00',
      endTime: newEvent.endTime || '10:00',
      color: newEvent.color || 'bg-indigo-500'
    };
    setEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      color: 'bg-indigo-500'
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('calendar')}</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Calendar Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black dark:text-white">{monthName} {year}</h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <ChevronLeft size={20} className="text-slate-500" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <ChevronRight size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="bg-slate-50 dark:bg-slate-900 py-2 text-center text-[10px] font-black text-slate-400 uppercase">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Upcoming Events</h4>
        <div className="space-y-3">
          {events
            .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(event => (
              <div key={event.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center gap-4 shadow-sm group">
                <div className={`w-12 h-12 rounded-2xl ${event.color} flex items-center justify-center text-white shrink-0`}>
                  <CalendarIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-sm dark:text-white truncate">{event.title}</h5>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <Clock size={10} />
                    <span>{event.date} • {event.startTime} - {event.endTime}</span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteEvent(event.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          {events.length === 0 && (
            <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
              <CalendarIcon size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs text-slate-400 font-medium">No events scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <h3 className="text-xl font-black dark:text-white mb-6 uppercase tracking-tight">{t('add_event')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t('event_title')}</label>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm font-bold"
                  placeholder="Meeting with..."
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t('event_date')}</label>
                <input 
                  type="date" 
                  value={newEvent.date}
                  onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t('event_start')}</label>
                  <input 
                    type="time" 
                    value={newEvent.startTime}
                    onChange={e => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t('event_end')}</label>
                  <input 
                    type="time" 
                    value={newEvent.endTime}
                    onChange={e => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Color</label>
                <div className="flex gap-2">
                  {['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-violet-500'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setNewEvent({...newEvent, color: c})}
                      className={`w-8 h-8 rounded-full ${c} ${newEvent.color === c ? 'ring-4 ring-slate-200 dark:ring-slate-700' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddEvent}
                  className="flex-1 p-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
