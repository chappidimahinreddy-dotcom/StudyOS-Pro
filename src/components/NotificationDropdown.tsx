import { motion } from 'motion/react';
import { Bell, Check, Trash2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function NotificationDropdown({ notifications, onMarkAsRead, onClearAll, onClose }: NotificationDropdownProps) {
  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-accent-purple" />;
      default:
        return <AlertCircle className="w-4 h-4 text-accent-cyan" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border border-white/10 p-4 shadow-2xl z-50 text-slate-200"
      id="notifications-overlay-dropdown"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-accent-purple" />
          <span className="text-sm font-semibold text-white font-display">Study Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-accent-purple/20 text-accent-purple border border-accent-purple/30 rounded-full font-mono">
              {unreadCount} NEW
            </span>
          )}
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[10px] text-slate-500 hover:text-red-400 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Nodes</span>
          </button>
        )}
      </div>

      {/* Notifications Queue */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-0.5">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-xl border transition-all flex items-start space-x-3 relative ${
                notification.unread
                  ? 'bg-accent-purple/5 border-accent-purple/15 hover:bg-accent-purple/10'
                  : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'
              }`}
            >
              {/* Left Type Icon */}
              <div className="mt-0.5 shrink-0">
                {getIcon(notification.type)}
              </div>

              {/* Text Context */}
              <div className="flex-1 min-w-0 pr-6">
                <p className={`text-xs ${notification.unread ? 'text-white font-medium' : 'text-slate-400'}`}>
                  {notification.text}
                </p>
                <span className="text-[9px] font-mono text-slate-500 block mt-1">{notification.time}</span>
              </div>

              {/* Action Circle for read state */}
              {notification.unread && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="absolute right-2 top-3 p-1 rounded-md bg-white/5 border border-white/5 hover:border-success-study/40 hover:text-success-study transition-all cursor-pointer"
                  title="Mark notification as read"
                  id={`mark-read-btn-${notification.id}`}
                >
                  <Check className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No study alerts or system notices currently in log.
          </div>
        )}
      </div>

      {/* Footer trigger */}
      <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
        <button
          onClick={onClose}
          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-semibold rounded-lg text-slate-300 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}
