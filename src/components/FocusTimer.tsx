import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Zap,
  Coffee,
  Brain
} from 'lucide-react';

interface FocusTimerProps {
  onSessionComplete: (minutes: number) => void;
}

type TimerMode = 'study' | 'short-break' | 'long-break';

export default function FocusTimer({ onSessionComplete }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>('study');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showCompletionGlow, setShowCompletionGlow] = useState(false);
  const [estimatedFinish, setEstimatedFinish] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initialTimes: Record<TimerMode, number> = {
    'study': 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60
  };

  const modeLabels: Record<TimerMode, string> = {
    'study': 'Focus Study',
    'short-break': 'Short Break',
    'long-break': 'Long Break'
  };

  // Helper to format time (e.g., 25:00)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset timer state when mode changes
  const changeMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(initialTimes[newMode]);
    setShowCompletionGlow(false);
  };

  // Keep calculating estimated finish time live
  useEffect(() => {
    const updateEstimatedFinish = () => {
      const now = new Date();
      now.setSeconds(now.getSeconds() + secondsLeft);
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setEstimatedFinish(`${hours}:${minutes} ${ampm}`);
    };

    updateEstimatedFinish();
    if (isActive) {
      const interval = setInterval(updateEstimatedFinish, 1000);
      return () => clearInterval(interval);
    }
  }, [secondsLeft, isActive]);

  // Main countdown logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setShowCompletionGlow(true);
    
    // Play synthesis/audio tone if enabled
    if (soundEnabled) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime); // high tone
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        console.log("Audio feedback error:", e);
      }
    }

    // Call state updater
    const minutesStudied = Math.round(initialTimes[mode] / 60);
    if (mode === 'study') {
      onSessionComplete(minutesStudied);
    }

    // Auto toggle to break/study
    if (mode === 'study') {
      alert(`🎉 Incredible! Focus session complete! You earned 150 XP! Take a well-deserved short break!`);
      changeMode('short-break');
    } else {
      alert(`💪 Break's over! Time to dive back into the learning zone! Ready to study?`);
      changeMode('study');
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(initialTimes[mode]);
    setShowCompletionGlow(false);
  };

  // Math for Circular SVG progress
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const totalDuration = initialTimes[mode];
  const progressRatio = secondsLeft / totalDuration;
  const strokeDashoffset = circumference - (progressRatio * circumference);

  return (
    <div className="glass-panel rounded-[24px] p-6 flex flex-col items-center justify-between h-full border border-white/5 relative overflow-hidden" id="focus-timer-section">
      {/* Glow Rings when Active */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 bg-radial pointer-events-none transition-all duration-1000 ${
              mode === 'study' 
                ? 'from-accent-purple/10 via-transparent to-transparent' 
                : 'from-accent-cyan/10 via-transparent to-transparent'
            }`}
          />
        )}
      </AnimatePresence>

      {/* Mode Selectors */}
      <div className="flex bg-slate-900/60 p-1 border border-white/5 rounded-2xl w-full max-w-sm mb-6 relative z-10">
        {(['study', 'short-break', 'long-break'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition-all flex items-center justify-center space-x-1.5 ${
              mode === m
                ? m === 'study'
                  ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20'
                  : 'bg-accent-cyan text-white shadow-lg shadow-accent-cyan/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id={`timer-mode-btn-${m}`}
          >
            {m === 'study' ? <Brain className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
            <span>{m === 'study' ? 'Study' : m === 'short-break' ? 'Short' : 'Long'}</span>
          </button>
        ))}
      </div>

      {/* Main Clock Circle Layout */}
      <div className="relative flex items-center justify-center my-4">
        {/* Decorative background grid ring */}
        <div className="absolute inset-4 rounded-full border border-white/5 bg-slate-950/40 shadow-inner flex flex-col items-center justify-center relative">
          <div className="absolute top-10 text-[10px] uppercase font-bold tracking-widest text-slate-500 font-sans">
            {modeLabels[mode]}
          </div>
          
          <div className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-white glow-text-purple z-10">
            {formatTime(secondsLeft)}
          </div>

          <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-2.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 z-10">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Ends: {estimatedFinish}</span>
          </div>
        </div>

        {/* SVG Circle Progress */}
        <svg className="w-56 h-56 -rotate-90 relative z-0">
          {/* Static gray track */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-slate-800/40 fill-transparent"
            strokeWidth="10"
          />
          {/* Active colored track */}
          <motion.circle
            cx="112"
            cy="112"
            r={radius}
            className="fill-transparent stroke-linecap-round"
            stroke={mode === 'study' ? '#7C3AED' : '#06B6D4'}
            strokeWidth="10"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: isActive ? 1 : 0.4, ease: isActive ? "linear" : "easeOut" }}
          />
        </svg>
      </div>

      {/* Timer Controls Row */}
      <div className="flex items-center space-x-4 mt-6 w-full max-w-xs relative z-10">
        {/* Reset button */}
        <button
          onClick={handleReset}
          className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 active:scale-95 transition-all flex-1 flex justify-center items-center cursor-pointer"
          id="timer-reset-btn"
          title="Reset timer node"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsActive(!isActive)}
          className={`p-4 rounded-2xl flex-[2] text-sm font-bold text-white flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-95 transition-all ${
            isActive
              ? 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/40 border border-white/10'
              : mode === 'study'
                ? 'bg-gradient-to-r from-accent-purple to-indigo-600 hover:brightness-110 shadow-accent-purple/20'
                : 'bg-gradient-to-r from-accent-cyan to-blue-500 hover:brightness-110 shadow-accent-cyan/20'
          }`}
          id="timer-toggle-btn"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-white stroke-none" />
              <span>PAUSE SESSION</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white stroke-none" />
              <span>START FOCUS</span>
            </>
          )}
        </button>

        {/* Sound FX Toggle button */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3.5 rounded-2xl border transition-all flex-1 flex justify-center items-center cursor-pointer ${
            soundEnabled 
              ? 'bg-accent-purple/20 border-accent-purple/40 text-accent-purple shadow-sm shadow-accent-purple/10' 
              : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
          }`}
          id="timer-sound-toggle-btn"
          title={soundEnabled ? "Mute completion chime" : "Enable completion chime"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Quote Banner */}
      <div className="mt-5 text-center text-[11px] text-slate-500 italic max-w-sm">
        {mode === 'study' 
          ? "“Deep concentration is the premium currency of productivity.”" 
          : "“Rest gives the neural pathways time to consolidate your memories.”"}
      </div>
    </div>
  );
}
