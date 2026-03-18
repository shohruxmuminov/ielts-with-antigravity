import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ChevronRight, Check, X, RotateCcw } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function VocabularyTrainer() {
  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const q = query(collection(db, 'vocabulary'), orderBy('word', 'asc'));
        const snap = await getDocs(q);
        const wordsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWords(wordsData);
      } catch (error) {
        // Error fetching vocabulary
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, []);

  const currentWord = words[currentIndex];

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-950">
        <div className="text-center text-slate-500 font-bold">No words available yet.</div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-950">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Daily Goal Reached!</h2>
          <p className="text-slate-400 mb-8 font-medium">You've reviewed all your scheduled words for today.</p>
          <button 
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
          >
            <RotateCcw className="w-5 h-5" />
            Review Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center max-w-2xl mx-auto w-full p-6 bg-slate-950 text-slate-100">
      <div className="w-full flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Vocabulary Trainer</h1>
        <span className="text-sm font-bold text-slate-500 bg-slate-900 px-4 py-1 rounded-full border border-slate-800">
          {currentIndex + 1} / {words.length}
        </span>
      </div>

      <div className="w-full aspect-[4/3] perspective-1000 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? '-flipped' : '')}
            initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
            transition={{ duration: 0.3 }}
            onClick={() => !isFlipped && setIsFlipped(true)}
            className={`absolute inset-0 w-full h-full bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xl cursor-pointer flex flex-col items-center justify-center p-12 text-center ${!isFlipped ? 'hover:border-indigo-500/50 transition-all' : ''}`}
          >
            {!isFlipped ? (
              <>
                <h2 className="text-6xl font-black text-white mb-6 tracking-tight">{currentWord.word}</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Click to reveal meaning</p>
              </>
            ) : (
              <div className="w-full h-full flex flex-col text-left">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-4xl font-black text-white">{currentWord.word}</h2>
                  <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors">
                    <Volume2 className="w-6 h-6 text-indigo-400" />
                  </button>
                </div>
                <span className="inline-block px-4 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-xs font-black uppercase tracking-widest w-fit mb-6 border border-indigo-900/50">
                  {currentWord.type}
                </span>
                <p className="text-2xl text-slate-200 mb-8 leading-relaxed font-medium">{currentWord.meaning}</p>
                {currentWord.example && (
                  <div className="mt-auto bg-slate-800/50 p-6 rounded-2xl text-left border border-slate-800">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Example</p>
                    <p className="text-slate-300 italic mb-4 text-lg leading-relaxed">"{currentWord.example}"</p>
                    {currentWord.ieltsExample && (
                      <>
                        <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">IELTS Context</p>
                        <p className="text-slate-200 font-bold leading-relaxed">"{currentWord.ieltsExample}"</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isFlipped && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full grid grid-cols-3 gap-4 mt-8"
        >
          <button onClick={handleNext} className="py-5 rounded-2xl font-bold bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 border border-rose-900/50 transition-all flex flex-col items-center gap-1">
            <X className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest">Hard</span>
          </button>
          <button onClick={handleNext} className="py-5 rounded-2xl font-bold bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 border border-amber-900/50 transition-all flex flex-col items-center gap-1">
            <ChevronRight className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest">Good</span>
          </button>
          <button onClick={handleNext} className="py-5 rounded-2xl font-bold bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-900/50 transition-all flex flex-col items-center gap-1">
            <Check className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest">Easy</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}

