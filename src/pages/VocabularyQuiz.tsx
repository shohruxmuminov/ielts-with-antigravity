import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Check, X, Trophy, ArrowRight, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { vocabularyData, VocabularyWord } from '../data/vocabulary';

export default function VocabularyQuiz() {
  const [questions, setQuestions] = useState<{ word: VocabularyWord, options: string[], correct: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const initQuiz = () => {
    const shuffled = [...vocabularyData].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 10);
    
    const newQuestions = selectedWords.map(word => {
      const options = [word.meaning];
      while (options.length < 4) {
        const randomWord = vocabularyData[Math.floor(Math.random() * vocabularyData.length)];
        if (!options.includes(randomWord.meaning)) {
          options.push(randomWord.meaning);
        }
      }
      return {
        word,
        options: options.sort(() => 0.5 - Math.random()),
        correct: word.meaning
      };
    });

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setCompleted(false);
  };

  useEffect(() => {
    initQuiz();
  }, []);

  const handleOptionClick = (option: string) => {
    if (selected) return;
    
    setSelected(option);
    const correct = option === questions[currentIndex].correct;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setIsCorrect(null);
      } else {
        setCompleted(true);
      }
    }, 1500);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full flex justify-between items-center mb-12">
        <Link to="/vocabulary" className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">Vocabulary Quiz</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Test your knowledge</p>
        </div>
        <div className="bg-indigo-600/20 px-6 py-2 rounded-2xl border border-indigo-600/30 text-indigo-400 font-black">
          Question: {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="max-w-2xl w-full space-y-8">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">What is the meaning of:</p>
          <h2 className="text-5xl font-black text-white mb-8 tracking-tight">{currentQuestion.word.word}</h2>
          
          <div className="grid gap-4">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selected === option;
              const isCorrectOption = option === currentQuestion.correct;
              const showResult = selected !== null;

              return (
                <button
                  key={i}
                  onClick={() => handleOptionClick(option)}
                  disabled={showResult}
                  className={`
                    w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 font-medium
                    ${!showResult ? 'bg-slate-950 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900' :
                      isSelected && isCorrectOption ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' :
                      isSelected && !isCorrectOption ? 'bg-rose-900/30 border-rose-500 text-rose-400' :
                      isCorrectOption ? 'bg-emerald-900/10 border-emerald-500/30 text-emerald-500/50' :
                      'bg-slate-950 border-slate-900 text-slate-600'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isSelected && isCorrectOption && <Check className="w-5 h-5" />}
                    {showResult && isSelected && !isCorrectOption && <X className="w-5 h-5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 font-bold text-sm">
            Current Score: <span className="text-white">{score}</span>
          </div>
        </div>
      </div>

      {completed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
        >
          <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl text-center max-w-md w-full">
            <div className="w-24 h-24 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2">Quiz Finished!</h2>
            <p className="text-slate-400 mb-8 text-lg font-medium">You scored {score} out of {questions.length} points.</p>
            <div className="flex gap-4">
              <button 
                onClick={initQuiz}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
