import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, CheckCircle2, RotateCcw, ArrowLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { vocabularyData, VocabularyWord } from '../data/vocabulary';

export default function TypingPractice() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const initGame = () => {
    const shuffled = [...vocabularyData].sort(() => 0.5 - Math.random());
    setWords(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setInput('');
    setIsError(false);
    setCompleted(false);
    setStartTime(null);
    setWpm(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());
    
    setInput(value);
    
    const target = words[currentIndex].word;
    if (value === target) {
      // Word completed
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setInput('');
        setIsError(false);
      } else {
        // Game completed
        const endTime = Date.now();
        const minutes = (endTime - (startTime || endTime)) / 60000;
        const totalChars = words.reduce((acc, w) => acc + w.word.length, 0);
        const wordsCount = totalChars / 5;
        setWpm(Math.round(wordsCount / (minutes || 1)));
        setCompleted(true);
      }
    } else {
      // Check for errors
      if (target.startsWith(value)) {
        setIsError(false);
      } else {
        setIsError(true);
      }
    }
  };

  if (words.length === 0) return null;

  const currentWord = words[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full flex justify-between items-center mb-12">
        <Link to="/vocabulary" className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">Typing Practice</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Improve accuracy and speed</p>
        </div>
        <div className="bg-indigo-600/20 px-6 py-2 rounded-2xl border border-indigo-600/30 text-indigo-400 font-black">
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      <div className="max-w-3xl w-full space-y-12">
        <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 shadow-2xl text-center relative overflow-hidden group">
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col items-center gap-4">
              <span className="px-4 py-1 bg-indigo-900/30 text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-900/50">
                Type the word below
              </span>
              <div className="flex flex-wrap justify-center gap-2 text-6xl md:text-7xl font-black tracking-tighter">
                {currentWord.word.split('').map((char, i) => {
                  let color = 'text-slate-700';
                  if (i < input.length) {
                    color = input[i] === char ? 'text-indigo-400' : 'text-rose-500';
                  }
                  return (
                    <span key={i} className={color}>
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-slate-400 text-xl font-medium">{currentWord.meaning}</p>
              <p className="text-indigo-500 font-bold text-sm italic">{currentWord.uzbek}</p>
            </div>

            <div className="relative max-w-md mx-auto">
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={input}
                onChange={handleInputChange}
                className={`
                  w-full bg-slate-950 border-2 rounded-2xl py-5 px-6 text-2xl font-bold text-center transition-all outline-none
                  ${isError ? 'border-rose-500 text-rose-400 shadow-lg shadow-rose-900/20' : 'border-slate-800 focus:border-indigo-500 text-white shadow-xl shadow-indigo-900/10'}
                `}
                placeholder="Start typing..."
              />
              {isError && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 right-0 -bottom-8 text-rose-500 text-xs font-bold uppercase tracking-widest"
                >
                  Mistake detected! Correct it to proceed.
                </motion.p>
              )}
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/5 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {completed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
        >
          <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl text-center max-w-md w-full">
            <div className="w-24 h-24 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12 text-indigo-400" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2">Excellent!</h2>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 my-8">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Average Speed</p>
              <p className="text-5xl font-black text-white">{wpm} <span className="text-xl text-slate-500">WPM</span></p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={initGame}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-20 flex items-center gap-8 text-slate-600">
        <div className="flex flex-col items-center">
          <Keyboard className="w-6 h-6 mb-2" />
          <span className="text-[10px] font-black uppercase tracking-widest">Type exactly what you see</span>
        </div>
        <div className="w-px h-8 bg-slate-800"></div>
        <div className="flex flex-col items-center">
          <CheckCircle2 className="w-6 h-6 mb-2" />
          <span className="text-[10px] font-black uppercase tracking-widest">Words must be perfect</span>
        </div>
      </div>
    </div>
  );
}
