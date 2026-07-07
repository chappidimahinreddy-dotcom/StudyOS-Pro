import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  CheckCircle2, 
  Hourglass, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

interface StatsProps {
  completedTasks: number;
  totalTasks: number;
  focusMinutes: number;
  streak: number;
  monthlyGoalProgress: number; // percentage
}

// Custom Counter Hook/Component for beautiful rolling numbers
function AnimatedCount({ value, duration = 1, suffix = "", decimals = 0 }: { value: number; duration?: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMiliseconds / 30), 10);
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalMiliseconds, 1);
      
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const currentCount = start + easedProgress * (end - start);
      
      setCount(currentCount);

      if (progress >= 1) {
        clearInterval(timer);
        setCount(end);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-mono font-bold tracking-tight text-white">
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function StatsSection({ completedTasks, totalTasks, focusMinutes, streak, monthlyGoalProgress }: StatsProps) {
  const focusHours = focusMinutes / 60;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {/* Study Streak Card */}
      <motion.div 
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-panel rounded-[24px] p-5 relative overflow-hidden group border border-amber-500/10 cursor-pointer"
        id="stat-streak-card"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
        
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 shadow-inner group-hover:bg-amber-500/20 transition-all duration-300">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active Streak</span>
          </span>
        </div>

        <div>
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Study Streak</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl md:text-4xl">
              <AnimatedCount value={streak} suffix=" Days" />
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans mt-2">
            Top 5% of global scholars today! Keep it hot! 🔥
          </p>
        </div>
      </motion.div>

      {/* Today's Tasks Card */}
      <motion.div 
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-panel rounded-[24px] p-5 relative overflow-hidden group border border-emerald-500/10 cursor-pointer"
        id="stat-tasks-card"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />

        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-inner group-hover:bg-emerald-500/20 transition-all duration-300">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono font-semibold px-2 py-1 rounded-full">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% Complete
          </span>
        </div>

        <div>
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Today's Tasks</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl md:text-4xl text-white font-mono font-bold tracking-tight">
              {completedTasks}
              <span className="text-slate-600 font-sans font-normal text-xl mx-1">/</span>
              {totalTasks}
            </span>
          </div>
          {/* Active progress bar */}
          <div className="w-full bg-slate-800/40 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Focus Hours Card */}
      <motion.div 
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-panel rounded-[24px] p-5 relative overflow-hidden group border border-accent-purple/10 cursor-pointer"
        id="stat-focus-card"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 blur-3xl rounded-full" />

        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-accent-purple/10 rounded-2xl text-accent-purple shadow-inner group-hover:bg-accent-purple/20 transition-all duration-300">
            <Hourglass className="w-6 h-6 text-accent-purple" />
          </div>
          <span className="text-[10px] bg-accent-purple/10 border border-accent-purple/20 text-accent-purple font-mono font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+1.5h vs yesterday</span>
          </span>
        </div>

        <div>
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Focus Time</h3>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl md:text-4xl">
              <AnimatedCount value={focusHours} decimals={1} suffix=" hrs" />
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans mt-2">
            Great mental stamina! Over 4 sessions completed. 🧠
          </p>
        </div>
      </motion.div>

      {/* Monthly Goal Progress Card */}
      <motion.div 
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-panel rounded-[24px] p-5 relative overflow-hidden group border border-accent-cyan/10 cursor-pointer"
        id="stat-goals-card"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 blur-3xl rounded-full" />

        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-accent-cyan/10 rounded-2xl text-accent-cyan shadow-inner group-hover:bg-accent-cyan/20 transition-all duration-300">
            <TrendingUp className="w-6 h-6 text-accent-cyan" />
          </div>
          <span className="text-[10px] bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-mono font-semibold px-2 py-1 rounded-full">
            Month Progress
          </span>
        </div>

        <div>
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Milestones Completed</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl md:text-4xl">
              <AnimatedCount value={monthlyGoalProgress} suffix="%" />
            </span>
          </div>
          {/* Mini progress ticks for premium Linear feel */}
          <div className="flex space-x-1 mt-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((tick) => {
              const active = monthlyGoalProgress >= (tick / 8) * 100;
              return (
                <div 
                  key={tick} 
                  className={`h-1.5 flex-1 rounded-sm transition-all duration-500 ${
                    active ? 'bg-gradient-to-r from-accent-cyan to-blue-500' : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
