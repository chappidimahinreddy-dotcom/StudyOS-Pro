import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Frown, 
  Smile, 
  Compass, 
  Zap, 
  RefreshCcw,
  BookOpen
} from 'lucide-react';
import { AIAdvice } from '../types';

interface AICoachProps {
  onSuggestTask: (title: string, subject: string, duration: number) => void;
}

const mockQuotes = [
  { quote: "Success is the sum of small study nodes, repeated day in and day out.", author: "Robert Collier" },
  { quote: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { quote: "Focus is a muscle. The Pomodoro timer is your training weight.", author: "StudyOS Coach" },
  { quote: "Don't wish it were easier. Wish you were more focused.", author: "Jim Rohn" },
  { quote: "Your neural networks are rewiring as you solve these hard problems. Embrace the friction.", author: "AI Study Coach" }
];

const moodResponses: Record<string, AIAdvice> = {
  'overwhelmed': {
    quote: "“The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks.”",
    author: "Mark Twain",
    suggestedSubject: "Mathematics (Simple practice nodes)",
    advice: "You are experiencing high cognitive overload. Let's practice task micro-slicing: pick your highest priority study node, set your Pomodoro to 15 minutes instead of 25, and shut off all extra tabs. Just do ONE small proof of concept."
  },
  'sleepy': {
    quote: "“A vigorous walk, deep breathing, or a chilly splash of water yields more alertness than three cups of stale espresso.”",
    author: "Circadian Science",
    suggestedSubject: "Computer Science (Active coding session)",
    advice: "Physical alertness precedes mental focus! Stand up right now, do 10 jumping jacks or a quick stretch, splash cold water on your face, and open a light work folder. Let's do an active typing/coding task rather than passive reading to stimulate the motor cortex!"
  },
  'distracted': {
    quote: "“Attention is the rarest and purest form of generosity.”",
    author: "Simone Weil",
    suggestedSubject: "History (Passive reading node)",
    advice: "Dopamine feedback loops are hijacking your prefrontal cortex. Switch to full screen mode right now. Take 3 deep diaphragmatic breaths (inhale 4s, hold 4s, exhale 6s). Let's start a single 25m Focus sprint with our physical phone in another room."
  },
  'unmotivated': {
    quote: "“You don't need motivation to study. You need action, which then breeds motivation as a byproduct.”",
    author: "Flow Theory",
    suggestedSubject: "Physics (Problem solving)",
    advice: "Action breeds motivation, not the other way around! Commit to writing exactly 3 lines of your assignment or reading 1 page. Tell yourself you can stop after 5 minutes if you hate it. 90% of the time, the momentum of starting will carry you through!"
  }
};

const customQueryAnswers: { keywords: string[]; answer: string; subject: string }[] = [
  {
    keywords: ["schedule", "plan", "planner", "time", "organize"],
    answer: "To schedule your semester effectively, use block scheduling! Dedicate a 2-hour window every Tuesday/Thursday for deep work on Physics, and a 1-hour evening slot for active coding. Never stack heavy study sessions consecutively.",
    subject: "Computer Science"
  },
  {
    keywords: ["exam", "test", "finals", "quiz"],
    answer: "Active recall is your best weapon! Close your book, write down everything you remember from memory, and then check against your notes. Practice this 3 days prior to your test rather than cramming passively.",
    subject: "Mathematics"
  },
  {
    keywords: ["math", "calculus", "algebra", "numbers"],
    answer: "With mathematics, passive reading does not work. You must struggle with problem sets. Do 3 practice problems, review the answers, identify the systemic pattern, and repeat. Try drawing visual schemas of equations!",
    subject: "Mathematics"
  },
  {
    keywords: ["coding", "programming", "code", "react", "js", "html"],
    answer: "Coding is muscle memory. Break the system, inspect console logs, and understand error flows. Write simple tests for your modules, make code modular, and avoid long functions.",
    subject: "Computer Science"
  },
  {
    keywords: ["read", "book", "history", "english", "notes"],
    answer: "Use the SQ3R method for textbook reading: Survey, Question, Read, Recite, Review. Write active questions in the page margins rather than highlighting text passively.",
    subject: "History"
  }
];

export default function AICoach({ onSuggestTask }: AICoachProps) {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [currentAdvice, setCurrentAdvice] = useState<AIAdvice>({
    quote: "“Your brain is for having ideas, not holding them. Offload your stress into today's task queue and enter deep study flow.”",
    author: "David Allen",
    suggestedSubject: "Computer Science (Deep work block)",
    advice: "Welcome to StudyOS! Click a cognitive mood node below or type a custom question to generate strategic, targeted study recommendations."
  });
  const [userQuery, setUserQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'coach'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleMoodClick = (mood: string) => {
    setActiveMood(mood);
    const response = moodResponses[mood];
    if (response) {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentAdvice(response);
        setIsTyping(false);
      }, 400);
    }
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery.toLowerCase();
    const newUserMessage = { role: 'user' as const, text: userQuery };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let matchedAnswer = "I understand you are working on your curriculum. To conquer this, I recommend setting a 25-minute study timer immediately, focusing on active recall (testing yourself), and removing all physical distractions. Action is the ultimate solution!";
      let matchedSubject = "Mathematics";

      for (const item of customQueryAnswers) {
        if (item.keywords.some(k => query.includes(k))) {
          matchedAnswer = item.answer;
          matchedSubject = item.subject;
          break;
        }
      }

      const coachResponse = {
        role: 'coach' as const,
        text: matchedAnswer
      };

      setChatHistory(prev => [...prev, coachResponse]);
      setIsTyping(false);

      // Update active advice container
      const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
      setCurrentAdvice({
        quote: `“${randomQuote.quote}”`,
        author: randomQuote.author,
        suggestedSubject: matchedSubject,
        advice: matchedAnswer
      });
    }, 800);
  };

  const triggerSuggestedTask = () => {
    // Generate a task suggestion depending on current advice state
    const cleanSubject = currentAdvice.suggestedSubject.split(' ')[0];
    onSuggestTask(`AI Challenge: Deep study node`, cleanSubject, 25);
    alert(`⚡ Task node added to queue: "AI Challenge: Deep study node" in ${cleanSubject}!`);
  };

  const randomizeAdvice = () => {
    setIsTyping(true);
    setTimeout(() => {
      const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
      const randomSubjects = ["Mathematics (Active exercises)", "Computer Science (Refactoring)", "Physics (Concept mapping)", "History (Flashcard deck)"];
      const randomAdvices = [
        "Take a pen and paper. Explain the current concept out loud as if teaching a 10-year old (The Feynman Technique). This highlights structural knowledge gaps instantly.",
        "Commit to a micro study sprint of just 10 minutes. If you are still unmotivated, you have permission to stop. 90% of the time, the friction dissolves.",
        "Draw a mental spider map connecting today's topics to prior modules. Associative memory linking cements concepts into long term neural networks.",
        "Try the Leitner flashcard system today to optimize your spaced repetition calendar schedule."
      ];

      setCurrentAdvice({
        quote: `“${randomQuote.quote}”`,
        author: randomQuote.author,
        suggestedSubject: randomSubjects[Math.floor(Math.random() * randomSubjects.length)],
        advice: randomAdvices[Math.floor(Math.random() * randomAdvices.length)]
      });
      setActiveMood(null);
      setIsTyping(false);
    }, 300);
  };

  return (
    <div className="glass-panel rounded-[24px] p-6 flex flex-col h-full border border-white/5 relative overflow-hidden" id="ai-coach-section">
      {/* Decorative blurred back light */}
      <div className="absolute -top-10 -left-10 w-44 h-44 bg-accent-purple/10 blur-[50px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-accent-cyan/5 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-5 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-purple to-pink-500 flex items-center justify-center text-white shadow-md shadow-accent-purple/20">
            <Bot className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-white tracking-tight flex items-center space-x-1">
              <span>Socratic AI Coach</span>
              <span className="text-[9px] bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-mono px-1.5 py-0.2 rounded-full uppercase tracking-wider">Model Live</span>
            </h2>
            <p className="text-[10px] text-slate-400">Personal study optimization algorithms</p>
          </div>
        </div>
        
        <button
          onClick={randomizeAdvice}
          className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          title="Regenerate dynamic advice"
          id="regenerate-coach-btn"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mood Node Selectors */}
      <div className="mb-5 relative z-10">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 pl-0.5">How's your concentration state?</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.keys(moodResponses).map((mood) => {
            const isActive = activeMood === mood;
            return (
              <button
                key={mood}
                onClick={() => handleMoodClick(mood)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold capitalize transition-all flex items-center justify-center space-x-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-accent-purple/25 to-pink-500/15 border-accent-purple/50 text-white font-bold shadow-md shadow-accent-purple/10'
                    : 'bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
                id={`mood-btn-${mood}`}
              >
                <span>{mood}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dynamic Advice Block */}
      <div className="flex-1 rounded-2xl bg-slate-950/40 border border-white/5 p-4 mb-4 overflow-y-auto max-h-[220px] relative z-10">
        <AnimatePresence mode="wait">
          {isTyping ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-1.5 py-4 pl-1"
              key="typing"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-500 italic pl-1 font-mono">Formulating strategy...</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              key="advice"
            >
              {/* Quote block */}
              <div className="border-l-2 border-accent-purple/30 pl-3 italic">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentAdvice.quote}</p>
                <span className="text-[10px] text-slate-500 font-medium block mt-1">— {currentAdvice.author}</span>
              </div>

              {/* Actionable Advice */}
              <div>
                <span className="text-[10px] uppercase font-bold text-accent-purple tracking-wider block mb-1">Coach Strategy</span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{currentAdvice.advice}</p>
              </div>

              {/* Subject suggestion badge */}
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-accent-cyan" />
                  <span className="text-[11px] font-medium text-slate-300">Suggested: <span className="text-accent-cyan font-semibold">{currentAdvice.suggestedSubject}</span></span>
                </div>
                <button
                  onClick={triggerSuggestedTask}
                  className="px-2.5 py-1 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 hover:bg-accent-cyan/20 text-[10px] font-bold text-accent-cyan transition-all"
                >
                  Adopt Study Node
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Input Chat Query Form */}
      <form onSubmit={handleQuerySubmit} className="flex items-center space-x-2 relative z-10" id="ai-coach-form">
        <input
          type="text"
          placeholder="Ask coach: 'how to prep for math test'..."
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-xs text-white glass-input font-sans"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-pink-500 text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-accent-purple/20 cursor-pointer"
          id="send-ai-query-btn"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
