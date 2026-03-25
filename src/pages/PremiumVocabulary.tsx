import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Search, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  Layers, 
  Trophy, 
  List, 
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Volume2,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../FirebaseProvider';
import { usePremium } from '../context/PremiumContext';
import { premiumVocabulary, VocabWord } from '../data/premiumVocabulary';

export default function PremiumVocabulary() {
  const { profile, loading } = useAuth();
  const { isPremium: isLocalPremium } = usePremium();
  const [viewMode, setViewMode] = useState<'list' | 'flashcards' | 'quiz'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Filtered words for list view
  const filteredWords = useMemo(() => {
    return premiumVocabulary.filter(w => 
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const [quizWords, setQuizWords] = useState<VocabWord[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  const startQuiz = () => {
    const shuffled = [...premiumVocabulary].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizWords(shuffled);
    setQuizStep(0);
    setQuizScore(0);
    setQuizFinished(false);
    generateOptions(shuffled[0]);
    setViewMode('quiz');
  };

  const generateOptions = (correctWord: VocabWord) => {
    const otherWords = premiumVocabulary
      .filter(w => w.word !== correctWord.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.translation);
    const options = [...otherWords, correctWord.translation].sort(() => 0.5 - Math.random());
    setCurrentOptions(options);
  };

  const handleAnswer = (selectedTranslation: string) => {
    if (selectedTranslation === quizWords[quizStep].translation) {
      setQuizScore(prev => prev + 1);
    }

    if (quizStep < 9) {
      const nextStep = quizStep + 1;
      setQuizStep(nextStep);
      generateOptions(quizWords[nextStep]);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) return null;

  const isPremium = !!profile?.isPremium || isLocalPremium;

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % premiumVocabulary.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + premiumVocabulary.length) % premiumVocabulary.length);
  };

  const handleSpeech = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-[#05050f] text-white p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
          <div className="w-24 h-24 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-amber-900/50 mb-8">
            <Lock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-none">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Vocabulary</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Unlock over 150+ advanced academic words with definitions, Uzbek translations, and interactive learning tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
            {[
              { icon: CheckCircle, text: "150+ Academic Words" },
              { icon: Layers, text: "Interactive Flashcards" },
              { icon: Trophy, text: "Vocabulary Quizzes" },
              { icon: Globe, text: "Uzbek Translations" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                <item.icon className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <Link 
              to="/premium"
              className="px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-[2rem] font-black text-xl transition-all shadow-xl shadow-amber-900/30 hover:scale-105 active:scale-95 inline-block"
            >
              Get Premium Access
            </Link>
            <p className="mt-4 text-slate-500 text-sm font-medium">Start mastering IELTS vocabulary today.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050514] text-white selection:bg-indigo-500/30">
      {/* Sidebar/Header Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <Link to="/premium" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-2 text-xs font-black uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Premium Panel
            </Link>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter flex items-center gap-4">
              <Sparkles className="w-10 h-10 text-indigo-500" />
              Premium <span className="text-indigo-500">Vocabulary</span>
            </h1>
            <p className="text-slate-400 font-medium">Master advanced academic terms for an 8.0+ Band Score.</p>
          </div>

          <div className="flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden self-start">
            {[
              { id: 'list', icon: List, label: 'List' },
              { id: 'flashcards', icon: Layers, label: 'Cards' },
              { id: 'quiz', icon: Trophy, label: 'Quiz' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all ${
                  viewMode === mode.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="relative group max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search 150+ premium words..."
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-indigo-500 outline-none rounded-[1.5rem] py-4 pl-14 pr-6 font-bold text-white transition-all focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWords.map((word, i) => (
                  <motion.div
                    key={word.word}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all group hover:bg-slate-900/60"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{word.word}</h3>
                        <p className="text-indigo-500 text-xs font-black uppercase tracking-widest mt-1">{word.translation}</p>
                      </div>
                      <button 
                        onClick={() => handleSpeech(word.word)}
                        className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all scale-0 group-hover:scale-100"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-4">
                      {word.definition}
                    </p>
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mb-1 select-none opacity-50">Example Usage:</p>
                      <p className="text-xs font-bold text-slate-300 italic">"{word.example}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {viewMode === 'flashcards' && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-xl mx-auto py-12"
            >
              <div className="text-center mb-8">
                <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] mb-2">Word {currentIndex + 1} of {premiumVocabulary.length}</p>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-500" 
                    style={{ width: `${((currentIndex + 1) / premiumVocabulary.length) * 100}%` }}
                  />
                </div>
              </div>

              <div 
                className="perspective-1000 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="relative w-full aspect-[4/3] rounded-[3rem] shadow-2xl transition-all duration-500 transform-style-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* Front */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-6 backface-hidden ${isFlipped ? 'invisible' : ''}`}>
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20">
                      <Layers className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-black text-white text-center tracking-tighter">{premiumVocabulary[currentIndex].word}</h2>
                    <p className="text-indigo-200/60 font-black text-xs uppercase tracking-widest mt-4">Tap to reveal translation</p>
                  </div>

                  {/* Back */}
                  <div 
                    className={`absolute inset-0 bg-slate-900 border-4 border-indigo-600/30 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-6 backface-hidden [transform:rotateY(180deg)] ${!isFlipped ? 'invisible' : ''}`}
                  >
                    <div className="text-center space-y-4">
                      <span className="px-4 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                        {premiumVocabulary[currentIndex].translation}
                      </span>
                      <h3 className="text-2xl font-bold text-white leading-tight">
                        {premiumVocabulary[currentIndex].definition}
                      </h3>
                      <div className="pt-6 border-t border-slate-800 w-full">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-tighter mb-2">Example Sentence</p>
                        <p className="text-lg text-slate-300 font-medium italic">"{premiumVocabulary[currentIndex].example}"</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-12">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevCard(); }}
                  className="w-16 h-16 bg-slate-900 rounded-[1.5rem] border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSpeech(premiumVocabulary[currentIndex].word); }}
                  className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-900/40 hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextCard(); }}
                  className="w-16 h-16 bg-slate-900 rounded-[1.5rem] border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {viewMode === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto py-12 text-center"
            >
              {!quizWords.length || quizFinished ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-12 space-y-8">
                  <div className="w-24 h-24 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center mx-auto border border-indigo-500/20">
                    {quizFinished ? <Trophy className="w-12 h-12 text-amber-400" /> : <Zap className="w-12 h-12 text-indigo-400" />}
                  </div>
                  <h2 className="text-4xl font-black">{quizFinished ? 'Quiz Results' : 'Vocabulary Quiz'}</h2>
                  
                  {quizFinished ? (
                    <div className="space-y-4">
                      <p className="text-5xl font-black text-white">{quizScore} / 10</p>
                      <p className="text-slate-400 font-medium text-lg">
                        {quizScore >= 8 ? 'Excellent! You are ready for Band 8.0+' : 'Keep practicing to master these words!'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 font-medium">
                      Test your mastery of the premium vocabulary. 10 random words to prove your Lexical Resource skills.
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Words</p>
                      <p className="text-2xl font-black text-white">150+</p>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Difficulty</p>
                      <p className="text-2xl font-black text-white text-indigo-400">Advanced</p>
                    </div>
                  </div>

                  <button 
                    onClick={startQuiz}
                    className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40"
                  >
                    {quizFinished ? 'Try Again' : 'Start Quick Quiz'}
                  </button>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Built for Advanced Learners</p>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-12 space-y-8 text-left">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Question {quizStep + 1} of 10</p>
                    <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">Score: {quizScore}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-slate-400 text-sm font-black uppercase tracking-tighter">Choose the correct translation for:</h3>
                    <h2 className="text-5xl font-black text-white tracking-tight">{quizWords[quizStep].word}</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-8">
                    {currentOptions.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(option)}
                        className="w-full bg-slate-800 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500 p-5 rounded-2xl text-left font-bold text-white transition-all group flex items-center justify-between"
                      >
                        {option}
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
