import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Brain, X, Timer, Settings } from 'lucide-react';

export default function FocusTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      // Switch mode automatically
      switchMode(mode === 'focus' ? 'break' : 'focus');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft((mode === 'focus' ? focusDuration : breakDuration) * 60);
  };
  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft((newMode === 'focus' ? focusDuration : breakDuration) * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 left-24 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-700 w-72"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                {isSettingsOpen ? 'Settings' : 'Focus Mode'}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="text-slate-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isSettingsOpen ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Focus (min)</label>
                  <input 
                    type="number" 
                    value={focusDuration} 
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    className="w-full bg-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Break (min)</label>
                  <input 
                    type="number" 
                    value={breakDuration} 
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="w-full bg-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <button 
                  onClick={() => { setIsSettingsOpen(false); resetTimer(); }}
                  className="w-full bg-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-6 bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => switchMode('focus')}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${mode === 'focus' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    Focus
                  </button>
                  <button
                    onClick={() => switchMode('break')}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${mode === 'break' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    Break
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="text-6xl font-black tracking-tighter font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-sm">
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button onClick={toggleTimer} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isActive ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30'}`}>
                    {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </button>
                  <button onClick={resetTimer} className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white p-4 rounded-full shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3 group border border-slate-700"
        >
          <Timer className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
          {isActive && <span className="font-mono font-bold">{formatTime(timeLeft)}</span>}
        </button>
      )}
    </div>
  );
}
