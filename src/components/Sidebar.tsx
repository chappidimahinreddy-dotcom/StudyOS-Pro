import { useState } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  Calendar, 
  Bot, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Flame,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  xp: number;
  level: number;
}

export default function Sidebar({ activeSection, setActiveSection, xp, level }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'focus', label: 'Pomodoro Focus', icon: Timer },
    { id: 'tasks', label: "Today's Tasks", icon: CheckSquare },
    { id: 'calendar', label: 'Study Calendar', icon: Calendar },
    { id: 'ai-coach', label: 'AI Coach', icon: Bot },
  ];

  const secondaryItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Calculate percentage of XP to next level (each level requires 1000 XP)
  const xpInCurrentLevel = xp % 1000;
  const xpPercentage = (xpInCurrentLevel / 1000) * 100;

  return (
    <>
      {/* Mobile Top Header (with Sidebar Trigger) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-study/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-purple/20">
            <span className="text-white font-display font-bold text-base">S</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">StudyOS</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          id="mobile-menu-trigger"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer (Collapsible Sidebar) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            {/* Sidebar Content */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 glass-panel z-50 flex flex-col p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center shadow-lg">
                    <span className="text-white font-display font-bold text-lg">S</span>
                  </div>
                  <span className="font-display font-semibold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">StudyOS</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                  id="mobile-menu-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* XP System for Mobile Drawer */}
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-purple/10 to-transparent blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-accent-purple uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Rank: Novice</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-400">Lv.{level}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-500 rounded-full" 
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-[10px] text-slate-500 font-mono">{xpInCurrentLevel}/1000 XP</span>
                  <span className="text-[10px] text-slate-400 font-medium">Next level: {1000 - xpInCurrentLevel} XP</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1 overflow-y-auto">
                <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase pl-3 mb-2">Core Tools</p>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-accent-purple/20 to-accent-cyan/10 text-white border-l-2 border-accent-purple font-medium shadow-inner' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                      id={`mob-sidebar-link-${item.id}`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-accent-purple glow-text-purple' : ''}`} />
                      <span className="text-sm font-sans">{item.label}</span>
                    </button>
                  );
                })}

                <div className="pt-6">
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase pl-3 mb-2">System</p>
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-2xl transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-accent-purple/20 to-accent-cyan/10 text-white border-l-2 border-accent-purple font-medium shadow-inner' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                        id={`mob-sidebar-sec-${item.id}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-sans">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-auto">
                <button 
                  onClick={() => alert("StudyOS Premium User Mode Active")} 
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-2xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-sm"
                  id="mob-sidebar-logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Left Panel) */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-white/5 bg-[#070b1e]/90 backdrop-blur-2xl p-6 sticky top-0 shrink-0 z-30">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-purple/25 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple to-accent-cyan rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity" />
            <span className="text-white font-display font-bold text-xl relative z-10">S</span>
          </div>
          <div>
            <span className="font-display font-semibold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent block">StudyOS</span>
            <span className="text-[10px] text-accent-cyan font-mono font-medium tracking-widest uppercase">OS v1.4.2</span>
          </div>
        </div>

        {/* Level Up Progress Block */}
        <div className="mb-6 p-4 rounded-[20px] bg-slate-900/50 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-accent-purple uppercase tracking-wider">
              <Award className="w-4 h-4 text-accent-purple" />
              <span>Rank: Scholar</span>
            </div>
            <span className="text-xs font-mono font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">Lv.{level}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-500 rounded-full" 
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono">{xpInCurrentLevel}/1000 XP</span>
            <span className="text-[10px] text-slate-400 font-medium">+{1000 - xpInCurrentLevel} XP left</span>
          </div>
        </div>

        {/* Core Navigation Items */}
        <div className="space-y-1 flex-1">
          <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase pl-3 mb-2">Core Tools</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[16px] transition-all relative group ${
                  isActive 
                    ? 'bg-white/5 text-white border-l-2 border-accent-purple font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                id={`sidebar-link-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-accent-purple' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span className="text-sm font-sans">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-accent-purple shadow-lg shadow-accent-purple/50"
                  />
                )}
              </button>
            );
          })}

          <div className="pt-6">
            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase pl-3 mb-2">System</p>
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[16px] transition-all group ${
                    isActive 
                      ? 'bg-white/5 text-white border-l-2 border-accent-purple font-medium' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  id={`sidebar-sec-${item.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                    <span className="text-sm font-sans">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="w-1.5 h-1.5 rounded-full bg-accent-purple shadow-lg shadow-accent-purple/50"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User profile bottom anchor */}
        <div className="border-t border-white/5 pt-4 mt-auto">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full object-cover border border-accent-purple/30"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-study border-2 border-study rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Mahin R.</p>
                <p className="text-[10px] font-mono text-slate-500">Scholar Scholar</p>
              </div>
            </div>
            <button 
              onClick={() => alert("StudyOS Premium User Mode Active")} 
              className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg"
              id="sidebar-signout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Persistent) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#070b1e]/90 backdrop-blur-xl border-t border-white/5 z-40 flex items-center justify-around px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-xl relative transition-all"
              id={`mob-nav-${item.id}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-accent-purple glow-text-purple' : 'text-slate-400'}`} />
              <span className={`text-[9px] mt-1 font-sans ${isActive ? 'text-white font-medium' : 'text-slate-500'}`}>{item.label.split(' ').pop()}</span>
              {isActive && (
                <span className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full bg-accent-purple shadow-sm shadow-accent-purple/80" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
