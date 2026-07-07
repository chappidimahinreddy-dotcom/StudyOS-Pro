export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  subject: string;
  duration?: number; // estimated study time in minutes
  dueDate?: string; // YYYY-MM-DD
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  xpReward: number;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'deadline' | 'exam' | 'session' | 'review';
  subject: string;
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  type: 'system' | 'ai' | 'milestone';
}

export interface AIAdvice {
  quote: string;
  author: string;
  suggestedSubject: string;
  advice: string;
}
