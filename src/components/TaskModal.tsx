import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { title: string; priority: Priority; subject: string; duration: number }) => void;
}

export default function TaskModal({ isOpen, onClose, onAddTask }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [priority, setPriority] = useState<Priority>('medium');
  const [duration, setDuration] = useState(25);

  const subjects = [
    'Computer Science', 
    'Mathematics', 
    'Physics', 
    'Chemistry', 
    'English Lit', 
    'History'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTask({
      title,
      subject,
      priority,
      duration: Number(duration)
    });

    setTitle('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-full max-w-lg glass-panel rounded-[24px] border border-white/10 p-6 relative z-10 overflow-hidden"
            id="global-task-creation-modal"
          >
            {/* Top right decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-purple/20 to-transparent blur-2xl" />

            {/* Title / Close */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-accent-purple/10 border border-accent-purple/20 rounded-xl text-accent-purple">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Create Study Node</h2>
                  <p className="text-xs text-slate-400">Map a new cognitive module to your active queue.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Task Objective</label>
                <input
                  type="text"
                  placeholder="Analyze lecture slides or complete math assignment..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-white glass-input font-sans"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Study Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm text-white glass-input font-sans"
                  >
                    {subjects.map(s => (
                      <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Focus Duration (Min)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-2.5 text-sm text-white glass-input font-mono"
                    />
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        priority === p
                          ? p === 'high' ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-md shadow-red-500/15'
                            : p === 'medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/15'
                            : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/15'
                          : 'bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-cyan-500'}`} />
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-white/[0.01] border border-white/5 p-3 rounded-xl mt-2">
                <AlertTriangle className="w-4 h-4 text-accent-cyan shrink-0" />
                <span>Completing this node awards +100 XP to your level progression scholar.</span>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-xs font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-accent-purple/20 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Inject Study Node</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
