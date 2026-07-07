import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Plus, 
  AlertTriangle 
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarCardProps {
  events: CalendarEvent[];
  onAddEvent: (title: string, date: string, type: 'deadline' | 'exam' | 'session' | 'review', subject: string) => void;
}

export default function CalendarCard({ events, onAddEvent }: CalendarCardProps) {
  // Use a hardcoded, consistent study month to prevent server-client desyncs
  const [selectedDate, setSelectedDate] = useState('2026-07-06'); // matches simulated current time
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed for representation, 6 is July)
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'deadline' | 'exam' | 'session' | 'review'>('deadline');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newDate, setNewDate] = useState('2026-07-08');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate simple 35-day grid representing July 2026
  // July 1, 2026 is a Wednesday (3rd column)
  const daysInMonth = 31;
  const startDayOffset = 3; // Wednesday offset

  const calendarDays = [];
  // Empty blocks for offset
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push({ day: null, dateString: '' });
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const paddedDay = d.toString().padStart(2, '0');
    const dateStr = `2026-07-${paddedDay}`;
    calendarDays.push({ day: d, dateString: dateStr });
  }

  // Filter events for the currently selected date
  const selectedDayEvents = events.filter(e => e.date === selectedDate);
  // Sort upcoming events
  const upcomingEvents = events
    .filter(e => e.date >= '2026-07-06')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddEvent(newTitle, newDate, newType, newSubject);
    setNewTitle('');
    setShowAddEvent(false);
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-500/15 border-red-500/20 text-red-400';
      case 'deadline':
        return 'bg-amber-500/15 border-amber-500/20 text-amber-400';
      case 'session':
        return 'bg-accent-purple/15 border-accent-purple/20 text-accent-purple';
      case 'review':
        return 'bg-cyan-500/15 border-cyan-500/20 text-accent-cyan';
      default:
        return 'bg-slate-500/15 border-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="glass-panel rounded-[24px] p-6 flex flex-col h-full border border-white/5" id="calendar-card-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-accent-purple" />
          <h2 className="text-lg font-display font-semibold tracking-tight text-white">Study Planner</h2>
        </div>
        <button
          onClick={() => setShowAddEvent(!showAddEvent)}
          className="p-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          id="calendar-add-event-btn"
          title="Schedule study milestone"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Mini Month Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-display font-semibold text-slate-200">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <div className="flex space-x-1">
          <button 
            onClick={() => alert("StudyOS Calendar locked on July 2026 Semester Core Module")} 
            className="p-1 text-slate-500 hover:text-slate-300 rounded-lg bg-white/5 border border-white/5"
            id="cal-prev"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => alert("StudyOS Calendar locked on July 2026 Semester Core Module")} 
            className="p-1 text-slate-500 hover:text-slate-300 rounded-lg bg-white/5 border border-white/5"
            id="cal-next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {calendarDays.map((dayItem, index) => {
          if (!dayItem.day) {
            return <div key={`empty-${index}`} className="h-7 w-7" />;
          }

          const isSelected = dayItem.dateString === selectedDate;
          const isToday = dayItem.dateString === '2026-07-06';
          const hasEvents = events.some(e => e.date === dayItem.dateString);

          return (
            <button
              key={dayItem.dateString}
              onClick={() => setSelectedDate(dayItem.dateString)}
              className={`h-7 w-7 mx-auto rounded-lg flex items-center justify-center text-xs font-semibold relative transition-all cursor-pointer ${
                isSelected
                  ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/30 font-bold scale-105'
                  : isToday
                    ? 'border border-accent-cyan text-accent-cyan font-bold bg-accent-cyan/5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              id={`cal-day-${dayItem.day}`}
            >
              <span>{dayItem.day}</span>
              {/* Event Dot */}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent-cyan" />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Form for Scheduling Events */}
      <AnimatePresence>
        {showAddEvent && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="p-3.5 mb-4 bg-slate-900/60 border border-white/10 rounded-2xl"
          >
            <div className="mb-2">
              <input
                type="text"
                placeholder="Math Final, Review session..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-white glass-input font-sans"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <select
                value={newType}
                onChange={(e: any) => setNewType(e.target.value)}
                className="px-2 py-1.5 text-xs text-white glass-input"
              >
                <option value="deadline">⚠️ Deadline</option>
                <option value="exam">🔥 Exam</option>
                <option value="session">🧠 Session</option>
                <option value="review">✅ Review</option>
              </select>
              <input
                type="text"
                placeholder="Subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="px-2 py-1.5 text-xs text-white glass-input"
              />
            </div>
            <div className="flex items-center justify-between">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-2 py-1 text-xs text-slate-300 glass-input font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-accent-purple text-xs font-bold text-white rounded-lg hover:brightness-110"
              >
                Add Event
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Selected Day's Agenda */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[190px] pr-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between items-center px-1">
          <span>Agenda Node</span>
          <span className="font-mono text-[10px] text-slate-400 capitalize bg-white/5 px-2 py-0.5 rounded-md">
            {selectedDate.split('-').slice(1).join('/')}
          </span>
        </h3>

        {selectedDayEvents.length > 0 ? (
          selectedDayEvents.map((event) => (
            <div key={event.id} className="p-3 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-xl border ${getEventBadgeColor(event.type)}`}>
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-100 block truncate leading-tight">
                  {event.title}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5 block capitalize">
                  {event.subject} • {event.type}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-slate-500 text-xs border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            No study agenda scheduled for this day node.
          </div>
        )}

        {/* Upcoming spotlight deadllines */}
        <div className="pt-2 border-t border-white/5 mt-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2">Upcoming Deadlines</h3>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex justify-between items-center text-xs p-1 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">{event.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                  {event.date === '2026-07-06' ? 'Today' : event.date === '2026-07-07' ? 'Tomorrow' : event.date.split('-').pop() + ' Jul'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
