import { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence
} from 'motion/react';
import {
  Bell,
  Search,
  Plus,
  Sparkles,
  Zap,
  TrendingUp,
  Flame,
  Calendar as CalendarIcon,
  CheckSquare,
  Bot,
  Timer,
  Award,
  BookOpen,
  Info,
  CalendarDays,
  Target
} from 'lucide-react';

import { Task, Goal, CalendarEvent, Notification, Priority } from './types';
import Sidebar from './components/Sidebar';
import StatsSection from './components/StatsSection';
import TaskList from './components/TaskList';
import FocusTimer from './components/FocusTimer';
import MonthlyGoals from './components/MonthlyGoals';
import CalendarCard from './components/CalendarCard';
import AICoach from './components/AICoach';
import NotificationDropdown from './components/NotificationDropdown';
import TaskModal from './components/TaskModal';

export default function App() {
  // Navigation Section State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // XP & Profile Level RPG state
  const [xp, setXp] = useState(1450); // initial XP (starts at Level 2)
  const [level, setLevel] = useState(2);
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      text: '🤖 AI Coach formulated a new Mathematics learning sprint for you!',
      time: '10 mins ago',
      unread: true,
      type: 'ai'
    },
    {
      id: '2',
      text: '🔥 Streak milestone! You have studied 5 consecutive days!',
      time: '2 hrs ago',
      unread: true,
      type: 'milestone'
    },
    {
      id: '3',
      text: '⚙️ Systems fully loaded. Your premium StudyOS workspace is live.',
      time: 'Yesterday',
      unread: false,
      type: 'system'
    }
  ]);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Analyze and outline chapter 4 of History textbook',
      completed: false,
      priority: 'low',
      subject: 'History',
      duration: 20,
      dueDate: '2026-07-06'
    },
    {
      id: 'task-2',
      title: 'Solve Calculus integration & limit problem sets',
      completed: true,
      priority: 'high',
      subject: 'Mathematics',
      duration: 45,
      dueDate: '2026-07-06'
    },
    {
      id: 'task-3',
      title: 'Refactor algorithms and React states inside code editor',
      completed: false,
      priority: 'medium',
      subject: 'Computer Science',
      duration: 60,
      dueDate: '2026-07-07'
    },
    {
      id: 'task-4',
      title: 'Draft Chemistry lab report on organic structures',
      completed: true,
      priority: 'medium',
      subject: 'Chemistry',
      duration: 30,
      dueDate: '2026-07-06'
    },
    {
      id: 'task-5',
      title: 'Revise electromagnetism formulas and theory',
      completed: false,
      priority: 'high',
      subject: 'Physics',
      duration: 40,
      dueDate: '2026-07-08'
    }
  ]);

  // Monthly Scholar Goals State
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 'goal-1',
      title: 'Log 20 high-concentration Focus hours',
      current: 14,
      target: 20,
      xpReward: 500
    },
    {
      id: 'goal-2',
      title: 'Solve 15 Computer Science task nodes',
      current: 12,
      target: 15,
      xpReward: 400
    },
    {
      id: 'goal-3',
      title: 'Complete 3 physics lab assignments',
      current: 2,
      target: 3,
      xpReward: 350
    },
    {
      id: 'goal-4',
      title: 'Maintain a 7-day studying streak',
      current: 5,
      target: 7,
      xpReward: 300
    }
  ]);

  // Study Calendar Preview State
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'evt-1',
      date: '2026-07-06',
      title: 'StudyOS Launch Prep & Setup',
      type: 'session',
      subject: 'Computer Science'
    },
    {
      id: 'evt-2',
      date: '2026-07-06',
      title: 'Review Calculus Equations',
      type: 'review',
      subject: 'Mathematics'
    },
    {
      id: 'evt-3',
      date: '2026-07-07',
      title: 'CS Exam: Algorithms',
      type: 'exam',
      subject: 'Computer Science'
    },
    {
      id: 'evt-4',
      date: '2026-07-08',
      title: 'Physics Lab Submission',
      type: 'deadline',
      subject: 'Physics'
    },
    {
      id: 'evt-5',
      date: '2026-07-12',
      title: 'History Midterm Presentation',
      type: 'exam',
      subject: 'History'
    }
  ]);

  // Focus sessions tracking (Minutes)
  const [focusMinutes, setFocusMinutes] = useState(250); // initial focus time is 4.1 hours (250 mins)
  const [streak, setStreak] = useState(5); // initial streak is 5 days

  // Global Dialog / Mobile FAB State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Synchronize leveling up when XP threshold is crossed (every 1000 XP increases level)
  useEffect(() => {
    const calculatedLevel = Math.floor(xp / 1000) + 1;
    if (calculatedLevel > level) {
      setLevel(calculatedLevel);
      setLevelUpMessage(`🎉 LEVEL UP! You reached Level ${calculatedLevel}! You are recognized as an elite scholar!`);

      // Inject milestone alert notification
      const newNotification: Notification = {
        id: `level-up-${calculatedLevel}`,
        text: `👑 Level Up! Welcome to Scholar Level ${calculatedLevel}. Keep up the high flow.`,
        time: 'Just now',
        unread: true,
        type: 'milestone'
      };
      setNotifications(prev => [newNotification, ...prev]);

      // Close level alert after 5s
      setTimeout(() => {
        setLevelUpMessage(null);
      }, 5000);
    }
  }, [xp, level]);

  // Tasks Interaction Handlers
  const handleToggleTask = (id: string) => {
    setTasks(prevTasks => {
      const updated = prevTasks.map(task => {
        if (task.id === id) {
          const newState = !task.completed;

          // If task completed, grant +100 XP as a premium reward!
          if (newState) {
            setXp(prev => prev + 100);

            // Increment any Computer Science task counts in goals if relevant
            if (task.subject === 'Computer Science') {
              incrementGoalProgress('goal-2');
            }
          } else {
            // Deduct XP if unchecked (graceful correction)
            setXp(prev => Math.max(0, prev - 100));
          }
          return { ...task, completed: newState };
        }
        return task;
      });
      return updated;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = (newTask: { title: string; priority: Priority; subject: string; duration: number }) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      completed: false,
      priority: newTask.priority,
      subject: newTask.subject,
      duration: newTask.duration,
      dueDate: '2026-07-06'
    };

    setTasks(prev => [task, ...prev]);

    // Push notification for task injection
    const newNotice: Notification = {
      id: `task-add-${Date.now()}`,
      text: `📥 Scheduled study node: "${task.title}" under ${task.subject}.`,
      time: 'Just now',
      unread: true,
      type: 'system'
    };
    setNotifications(prev => [newNotice, ...prev]);
  };

  // Goals Interaction Handlers
  const incrementGoalProgress = (id: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          const nextCount = goal.current + 1;
          if (nextCount === goal.target) {
            // Target achieved! Reward major bonus XP!
            setXp(prev => prev + goal.xpReward);
            alert(`🏆 Monthly Milestone Unlocked: "${goal.title}"! Awarded +${goal.xpReward} XP!`);

            const goalNotice: Notification = {
              id: `goal-unlock-${goal.id}`,
              text: `🏆 Achievement unlocked: "${goal.title}" (+${goal.xpReward} XP).`,
              time: 'Just now',
              unread: true,
              type: 'milestone'
            };
            setNotifications(prev => [goalNotice, ...prev]);
          }
          return { ...goal, current: Math.min(nextCount, goal.target) };
        }
        return goal;
      })
    );
  };

  const handleAddGoal = (title: string, target: number, xpReward: number) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      current: 0,
      target,
      xpReward
    };
    setGoals(prev => [...prev, newGoal]);
  };

  // Focus Timer Session Completion Handler
  const handleSessionComplete = (minutes: number) => {
    setFocusMinutes(prev => prev + minutes);
    setXp(prev => prev + 150); // Study session awards +150 XP!

    // Track Focus hours in goals
    setGoals(prev =>
      prev.map(g => {
        if (g.id === 'goal-1') {
          // Add hours studied to current target
          const currentHours = g.current + (minutes / 60);
          return { ...g, current: parseFloat(currentHours.toFixed(1)) };
        }
        return g;
      })
    );

    // Track streak
    setStreak(prev => prev + 1);

    const studyNotice: Notification = {
      id: `focus-complete-${Date.now()}`,
      text: `⏱️ Focus session logged successfully! You concentrated for ${minutes} minutes and earned +150 XP!`,
      time: 'Just now',
      unread: true,
      type: 'milestone'
    };
    setNotifications(prev => [studyNotice, ...prev]);
  };

  // Calendar Event Handler
  const handleAddCalendarEvent = (title: string, date: string, type: any, subject: string) => {
    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title,
      date,
      type,
      subject
    };
    setEvents(prev => [...prev, newEvent]);
  };

  // Notifications Actions
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // AI Planner Helper (Formulates a strategic plan inside AI Coach block)
  const triggerAIPlanner = () => {
    const incompleteTasks = tasks.filter(t => !t.completed);
    if (incompleteTasks.length === 0) {
      alert("🤖 StudyOS Planner: No active study nodes found. Add a task before launching the AI Planner!");
      return;
    }

    const plan = incompleteTasks.map((t, idx) => `Block ${idx + 1}: Dedicate a ${t.duration || 25}m Pomodoro block to "${t.title}" (${t.subject})`).join('\n\n');
    alert(`⚡ AI STUDY OS STRATEGY PROTOCOL FORMULATED:\n\n${plan}\n\nRemoving distractions and preparing focus timers.`);

    // Switch view to Focus tab so they can immediately begin
    setActiveSection('focus');
  };

  // Calculated variables
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const monthlyGoalProgress = Math.round(
    (goals.filter(g => g.current >= g.target).length / goals.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#050816] bg-mesh-purple bg-mesh-cyan grid-overlay flex flex-col md:flex-row relative text-slate-100">

      {/* Level-Up Toast Alert banner */}
      <AnimatePresence>
        {levelUpMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-gradient-to-r from-accent-purple via-indigo-600 to-accent-cyan border border-white/20 shadow-2xl flex items-center space-x-3 text-white max-w-md w-full"
          >
            <Award className="w-8 h-8 text-amber-300 animate-spin" />
            <div>
              <p className="font-display font-bold text-sm tracking-wide">STUDY LEVEL UP</p>
              <p className="text-xs text-slate-100">{levelUpMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Navigation Layout Side Panel */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        xp={xp}
        level={level}
      />

      {/* Main StudyOS Dashboard Frame */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">

        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8" id="studyos-header">
          {/* Brand/Welcome and Greeting */}
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2 py-0.5 rounded-full">
                Workspace Active
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-500">
                July 6, 2026 • 11:48 PM UTC
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white mt-1.5">
              Hello, <span className="bg-gradient-to-r from-white via-indigo-200 to-accent-cyan bg-clip-text text-transparent">Scholar Mahin</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Your neural concentration levels are currently optimized at 94% flow.</p>
          </div>

          {/* Search bar & notification trigger controls */}
          <div className="flex items-center space-x-3 self-stretch lg:self-auto">
            {/* Search filter input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Query study node or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm text-white glass-input font-sans"
              />
            </div>

            {/* Notification drop indicator */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl border transition-all relative cursor-pointer ${showNotifications
                  ? 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple shadow-sm'
                  : 'bg-[#0f172a]/60 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                id="header-notification-bell"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-purple ring-4 ring-[#050816] animate-ping" />
                )}
              </button>

              {/* Notification Overlay Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <NotificationDropdown
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onClearAll={handleClearAllNotifications}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Micro Profile Status Block */}
            <div className="flex items-center space-x-2 bg-[#0f172a]/50 border border-white/5 px-3 py-1.5 rounded-xl shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-success-study animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Sync State</span>
            </div>
          </div>
        </header>

        {/* Unified Dashboard (Core Bento View or Immersive Expanded Views) */}
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              key="dashboard"
            >
              {/* Animated Stats Cards Section */}
              <StatsSection
                completedTasks={completedCount}
                totalTasks={totalCount}
                focusMinutes={focusMinutes}
                streak={streak}
                monthlyGoalProgress={monthlyGoalProgress}
              />

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Task List Node */}
                <div className="lg:col-span-1 h-full min-h-[460px]">
                  <TaskList
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onAddTask={handleAddTask}
                    searchQuery={searchQuery}
                  />
                </div>

                {/* Column 2: Focus Clock & Quick Actions */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  {/* Focus Timer Widget */}
                  <div className="flex-1">
                    <FocusTimer onSessionComplete={handleSessionComplete} />
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="glass-panel rounded-[24px] p-5 border border-white/5 relative overflow-hidden shrink-0" id="quick-actions-panel">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-purple/5 to-transparent blur-xl pointer-events-none" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">StudyOS Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 text-left text-xs font-semibold text-slate-200 transition-all flex flex-col space-y-1 group cursor-pointer"
                        id="quick-act-new-task"
                      >
                        <Plus className="w-4 h-4 text-accent-purple transition-transform group-hover:scale-110" />
                        <span>New Task</span>
                      </button>

                      <button
                        onClick={() => {
                          alert("Starting Pomodoro Sprint! Toggle the central control button below.");
                          setActiveSection('focus');
                        }}
                        className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 text-left text-xs font-semibold text-slate-200 transition-all flex flex-col space-y-1 group cursor-pointer"
                        id="quick-act-start-focus"
                      >
                        <Timer className="w-4 h-4 text-accent-cyan transition-transform group-hover:scale-110" />
                        <span>Start Focus</span>
                      </button>

                      <button
                        onClick={() => setActiveSection('calendar')}
                        className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 text-left text-xs font-semibold text-slate-200 transition-all flex flex-col space-y-1 group cursor-pointer"
                        id="quick-act-open-cal"
                      >
                        <CalendarIcon className="w-4 h-4 text-amber-500 transition-transform group-hover:scale-110" />
                        <span>Open Calendar</span>
                      </button>

                      <button
                        onClick={triggerAIPlanner}
                        className="p-3 rounded-xl bg-gradient-to-r from-accent-purple/10 to-accent-cyan/5 hover:from-accent-purple/20 hover:to-accent-cyan/10 border border-accent-purple/20 text-left text-xs font-semibold text-white transition-all flex flex-col space-y-1 group cursor-pointer"
                        id="quick-act-ai-planner"
                      >
                        <Bot className="w-4 h-4 text-pink-400 transition-transform group-hover:scale-110" />
                        <span>AI Planner</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Column 3: Calendar, Goals & AI Advice */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  {/* Monthly Goals progress widgets */}
                  <div className="flex-1">
                    <MonthlyGoals
                      goals={goals}
                      onIncrementGoal={incrementGoalProgress}
                      onAddGoal={handleAddGoal}
                      xp={xp}
                      level={level}
                    />
                  </div>

                  {/* Dynamic Calendar Agenda */}
                  <div className="flex-1">
                    <CalendarCard
                      events={events}
                      onAddEvent={handleAddCalendarEvent}
                    />
                  </div>
                </div>

              </div>

              {/* Socratic AI Coach standalone panel inside bento flow */}
              <div className="mt-6">
                <AICoach onSuggestTask={(title, subject, duration) => handleAddTask({ title, subject, priority: 'medium', duration })} />
              </div>
            </motion.div>
          ) : activeSection === 'focus' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key="focus-view"
              className="max-w-xl mx-auto py-8"
            >
              <div className="mb-4">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <FocusTimer onSessionComplete={handleSessionComplete} />
            </motion.div>
          ) : activeSection === 'tasks' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key="tasks-view"
              className="max-w-2xl mx-auto py-8"
            >
              <div className="mb-4">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <TaskList
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onAddTask={handleAddTask}
                searchQuery={searchQuery}
              />
            </motion.div>
          ) : activeSection === 'calendar' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key="calendar-view"
              className="max-w-2xl mx-auto py-8"
            >
              <div className="mb-4">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <CalendarCard
                events={events}
                onAddEvent={handleAddCalendarEvent}
              />
            </motion.div>
          ) : activeSection === 'ai-coach' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key="ai-coach-view"
              className="max-w-2xl mx-auto py-8"
            >
              <div className="mb-4">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <AICoach onSuggestTask={(title, subject, duration) => handleAddTask({ title, subject, priority: 'medium', duration })} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-[24px] p-8 text-center border border-white/5 my-12"
              key="stale-tab"
            >
              <Info className="w-12 h-12 text-accent-purple mx-auto mb-4 animate-pulse" />
              <h2 className="text-lg font-display font-semibold text-white">System Panel Standby</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                The "{activeSection}" module is optimized for premium background services. Standard study parameters are active.
              </p>
              <button
                onClick={() => setActiveSection('dashboard')}
                className="mt-6 px-4 py-2 rounded-xl bg-accent-purple text-xs font-semibold text-white shadow-lg hover:brightness-110"
              >
                Return to Master Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button (FAB) - Mobile Only */}
      <div className="md:hidden fixed bottom-20 right-4 z-30">
        <div className="relative">
          <AnimatePresence>
            {isFabOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 15 }}
                className="absolute bottom-16 right-0 w-52 glass-panel rounded-2xl border border-white/10 p-2.5 shadow-2xl flex flex-col space-y-1.5"
              >
                <button
                  onClick={() => {
                    setIsFabOpen(false);
                    setIsTaskModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-white/5 text-left text-xs font-semibold text-slate-200 flex items-center space-x-2 cursor-pointer"
                  id="fab-action-add-task"
                >
                  <Plus className="w-4 h-4 text-accent-purple" />
                  <span>Insert Task Node</span>
                </button>
                <button
                  onClick={() => {
                    setIsFabOpen(false);
                    alert("Focus sprint loaded! Starting clock.");
                    setActiveSection('focus');
                  }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-white/5 text-left text-xs font-semibold text-slate-200 flex items-center space-x-2 cursor-pointer"
                  id="fab-action-focus"
                >
                  <Timer className="w-4 h-4 text-accent-cyan" />
                  <span>Start Focus Session</span>
                </button>
                <button
                  onClick={() => {
                    setIsFabOpen(false);
                    setActiveSection('ai-coach');
                  }}
                  className="w-full py-2 px-3 rounded-xl hover:bg-white/5 text-left text-xs font-semibold text-slate-200 flex items-center space-x-2 cursor-pointer"
                  id="fab-action-coach"
                >
                  <Bot className="w-4 h-4 text-pink-400" />
                  <span>Ask AI Coach</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Floating Gradient Circle */}
          <button
            onClick={() => setIsFabOpen(!isFabOpen)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white shadow-lg shadow-accent-purple/35 relative active:scale-95 transition-all cursor-pointer"
            id="mobile-floating-action-button"
          >
            <motion.div
              animate={{ rotate: isFabOpen ? 45 : 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <Plus className="w-6 h-6 text-white stroke-[2.5]" />
            </motion.div>
          </button>
        </div>
      </div>

    </div>
  );
}
