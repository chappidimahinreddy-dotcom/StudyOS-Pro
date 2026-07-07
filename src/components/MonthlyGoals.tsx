import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Plus, 
  ChevronRight, 
  Trophy, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  Timer
} from 'lucide-react';
import { Goal } from '../types';

interface MonthlyGoalsProps {
  goals: Goal[];
  onIncrementGoal: (id: string) => void;
  onAddGoal: (title: string, target: number, xpReward: number) => void;
  xp: number;
  level: number;
}

export default function MonthlyGoals({ goals, onIncrementGoal, onAddGoal, xp, level }: MonthlyGoalsProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(10);
  const [newXp, setNewXp] = useState(300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddGoal(newTitle, newTarget, newXp);
    setNewTitle('');
    setShowAddGoal(false);
  };

  // Calculate stats
  const totalCompleted = goals.filter(g => g.current >= g.target).length;
  const averageCompletion = goals.reduce((acc, goal) => {
    const ratio = Math.min(goal.current / goal.target, 1);
    return acc + ratio;
  }, 0) / (goals.length || 1) * 100;

  return (
    <div className="glass-panel rounded-[24px] p-6 flex flex-col h-full border border-white/5" id="monthly-goals-section">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-display font-semibold tracking-tight text-white flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-accent-cyan" />
            <span>Monthly Scholar Goals</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Earn high tier XP nodes to rank up your profile.</p>
        </div>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="p-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          id="add-goal-btn"
          title="Add new goal node"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Goal Summary Header Info */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall Target</span>
          <span className="text-xl font-mono font-bold text-accent-cyan">{averageCompletion.toFixed(0)}%</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Completed</span>
          <span className="text-xl font-mono font-bold text-white">{totalCompleted} / {goals.length}</span>
        </div>
      </div>

      {/* Add Goal Dialog Form */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-white/10"
          >
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Goal Objective</label>
              <input
                type="text"
                placeholder="Study Physics for 15 hours..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm text-white glass-input font-sans"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Count</label>
                <input
                  type="number"
                  min="1"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm text-white glass-input font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">XP Reward</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={newXp}
                  onChange={(e) => setNewXp(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm text-white glass-input font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-accent-cyan text-xs font-bold text-slate-950 hover:brightness-110 transition-all"
              >
                Create Goal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goal Nodes List */}
      <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-1">
        {goals.map((goal) => {
          const progressPercent = Math.min((goal.current / goal.target) * 100, 100);
          const isFinished = goal.current >= goal.target;

          return (
            <div 
              key={goal.id} 
              className={`p-3.5 rounded-2xl bg-white/[0.01] border transition-all ${
                isFinished 
                  ? 'border-success-study/20 bg-success-study/[0.02]' 
                  : 'border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
              id={`goal-node-${goal.id}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="pr-2">
                  <h4 className={`text-sm font-medium tracking-wide ${isFinished ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                    {goal.title}
                  </h4>
                  <span className="text-[10px] font-mono font-medium text-accent-cyan bg-accent-cyan/5 px-2 py-0.5 rounded border border-accent-cyan/10 mt-1 inline-block">
                    +{goal.xpReward} XP Node
                  </span>
                </div>
                
                {/* Target increment button or finished check */}
                {isFinished ? (
                  <span className="p-1 bg-success-study/10 text-success-study rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                ) : (
                  <button
                    onClick={() => onIncrementGoal(goal.id)}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-800 text-[11px] font-mono font-bold text-slate-300 flex items-center space-x-1"
                    id={`increment-goal-${goal.id}`}
                  >
                    <span>{goal.current}</span>
                    <span className="text-slate-600">/</span>
                    <span>{goal.target}</span>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-800/40 rounded-full overflow-hidden mt-2.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    isFinished 
                      ? 'bg-gradient-to-r from-success-study to-emerald-400' 
                      : 'bg-gradient-to-r from-accent-cyan to-blue-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
