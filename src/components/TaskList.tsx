import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Trash2, 
  Plus, 
  Search, 
  AlertCircle, 
  Sparkles, 
  Calendar,
  Clock,
  Filter
} from 'lucide-react';
import { Task, Priority } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (task: { title: string; priority: Priority; subject: string; duration: number }) => void;
  searchQuery: string;
}

export default function TaskList({ tasks, onToggleTask, onDeleteTask, onAddTask, searchQuery }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Computer Science');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDuration, setNewDuration] = useState(30);

  const subjects = [
    'Computer Science', 
    'Mathematics', 
    'Physics', 
    'Chemistry', 
    'English Lit', 
    'History'
  ];

  // Filter tasks based on searchQuery, state filter, and priority filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = 
      filter === 'all' ? true :
      filter === 'completed' ? task.completed : !task.completed;
    
    const matchesPriority = 
      priorityFilter === 'all' ? true : task.priority === priorityFilter;

    return matchesSearch && matchesState && matchesPriority;
  });

  const handleSubmitQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    onAddTask({
      title: newTitle,
      subject: newSubject,
      priority: newPriority,
      duration: Number(newDuration)
    });

    setNewTitle('');
    setShowQuickAdd(false);
  };

  const getPriorityColors = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-500/10 border-red-500/20 text-red-400',
          dot: 'bg-red-500 glow-text-red',
          border: 'border-red-500/30'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          dot: 'bg-amber-500',
          border: 'border-amber-500/30'
        };
      case 'low':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          dot: 'bg-cyan-500',
          border: 'border-cyan-500/30'
        };
    }
  };

  return (
    <div className="glass-panel rounded-[24px] p-6 flex flex-col h-full border border-white/5" id="task-list-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold tracking-tight text-white flex items-center space-x-2">
            <span>Today's Tasks</span>
            <span className="text-xs bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-mono font-medium px-2 py-0.5 rounded-full">
              {tasks.filter(t => !t.completed).length} remaining
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Achieve daily flow by crossing out task nodes.</p>
        </div>
        <button
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan hover:brightness-110 active:scale-95 transition-all text-xs font-semibold text-white shadow-lg shadow-accent-purple/20"
          id="toggle-quick-add-task"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Quick Add Form Panel */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.form 
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onSubmit={handleSubmitQuickAdd}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden shrink-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-cyan/5 to-transparent blur-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="Review CS lecture notes..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-white glass-input font-sans"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-white glass-input font-sans"
                >
                  {subjects.map(s => (
                    <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</label>
                <div className="flex space-x-2">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                        newPriority === p
                          ? p === 'high' ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-md shadow-red-500/10'
                            : p === 'medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                            : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration (Min)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm text-white glass-input font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-accent-purple/20 transition-all flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Task Node</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task Filters (Linear Styled) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5 mb-4">
        {/* State Tabs */}
        <div className="flex bg-slate-900/50 border border-white/5 p-1 rounded-xl shrink-0">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all ${
                filter === tab
                  ? 'bg-white/10 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Priority Filter Dropdown */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Priority:</span>
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-slate-900/60 border border-white/5 rounded-xl px-2.5 py-1 text-slate-300 focus:outline-none focus:border-accent-purple/50 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🔵 Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 space-y-2.5">
        <AnimatePresence initial={false}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const colors = getPriorityColors(task.priority);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group ${
                    task.completed ? 'opacity-65' : ''
                  }`}
                  id={`task-node-${task.id}`}
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    {/* Custom animated checkbox */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer shrink-0 transition-all duration-300 ${
                        task.completed
                          ? 'bg-success-study border-success-study shadow-lg shadow-success-study/20 text-white'
                          : `border-white/15 bg-white/5 hover:border-accent-purple/50`
                      }`}
                      id={`task-checkbox-${task.id}`}
                    >
                      {task.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </motion.div>
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <span className={`text-sm text-slate-100 block truncate font-sans tracking-wide transition-all ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}>
                        {task.title}
                      </span>
                      {/* Meta information row */}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {/* Subject Badge */}
                        <span className="text-[10px] font-semibold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/15 px-2 py-0.5 rounded-md">
                          {task.subject}
                        </span>

                        {/* Priority mini label */}
                        <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border flex items-center space-x-1 ${colors.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          <span>{task.priority}</span>
                        </span>

                        {/* Estimated Duration */}
                        {task.duration && (
                          <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-600" />
                            <span>{task.duration}m</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Delete button) */}
                  <div className="flex items-center ml-2">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      id={`delete-task-${task.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]"
              id="tasks-empty-placeholder"
            >
              <div className="p-4 bg-slate-900/60 rounded-full border border-white/5 mb-3 text-slate-500">
                <AlertCircle className="w-8 h-8 stroke-[1.5]" />
              </div>
              <p className="text-sm font-medium text-slate-400">No active tasks found</p>
              <p className="text-xs text-slate-500 text-center mt-1 max-w-xs">
                {searchQuery 
                  ? "No results matching your study search. Try another subject node."
                  : "All completed or filtered! Create a new task node above."}
              </p>
              {!showQuickAdd && !searchQuery && (
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(true)}
                  className="mt-4 px-3 py-1.5 rounded-xl border border-accent-purple/30 text-accent-purple bg-accent-purple/5 hover:bg-accent-purple/10 text-xs font-semibold transition-all"
                >
                  Quick Add Study Node
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
