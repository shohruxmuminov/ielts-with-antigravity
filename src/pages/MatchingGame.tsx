import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Check, X, Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { vocabularyData, VocabularyWord } from '../data/vocabulary';

interface Card {
  id: string;
  content: string;
  type: 'word' | 'translation';
  matchId: string;
}

export default function MatchingGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const initGame = () => {
    // Pick 6 random words
    const shuffled = [...vocabularyData].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 6);
    
    const gameCards: Card[] = [];
    selectedWords.forEach(word => {
      gameCards.push({
        id: `word-${word.word}`,
        content: word.word,
        type: 'word',
        matchId: word.word
      });
      gameCards.push({
        id: `trans-${word.word}`,
        content: word.uzbek,
        type: 'translation',
        matchId: word.word
      });
    });

    setCards(gameCards.sort(() => 0.5 - Math.random()));
    setMatched([]);
    setSelected(null);
    setScore(0);
    setCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (card: Card) => {
    if (matched.includes(card.id) || (selected && selected.id === card.id)) return;

    if (!selected) {
      setSelected(card);
    } else {
      if (selected.matchId === card.matchId && selected.type !== card.type) {
        // Match!
        const newMatched = [...matched, selected.id, card.id];
        setMatched(newMatched);
        setSelected(null);
        setScore(prev => prev + 10);
        
        if (newMatched.length === cards.length) {
          setTimeout(() => setCompleted(true), 500);
        }
      } else {
        // No match
        setWrong(card.id);
        const firstSelected = selected.id;
        const secondSelected = card.id;
        setSelected(null);
        setTimeout(() => setWrong(null), 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full flex justify-between items-center mb-12">
        <Link to="/vocabulary" className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">Matching Game</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Match words with translations</p>
        </div>
        <div className="bg-indigo-600/20 px-6 py-2 rounded-2xl border border-indigo-600/30 text-indigo-400 font-black">
          Score: {score}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
        <AnimatePresence>
          {cards.map(card => {
            const isMatched = matched.includes(card.id);
            const isSelected = selected?.id === card.id;
            const isWrong = wrong === card.id || (wrong && selected?.id === card.id);

            return (
              <motion.div
                key={card.id}
                layout
                onClick={() => handleCardClick(card)}
                className={`
                  aspect-[4/3] rounded-3xl border-2 flex items-center justify-center p-4 text-center cursor-pointer transition-all duration-300
                  ${isMatched ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400 opacity-50 cursor-default' : 
                    isSelected ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50' :
                    isWrong ? 'bg-rose-900/20 border-rose-500 text-rose-400' :
                    'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-300'}
                `}
              >
                <span className={`font-bold ${card.type === 'word' ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>
                  {card.content}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {completed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
        >
          <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl text-center max-w-md w-full">
            <div className="w-24 h-24 bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2">Well Done!</h2>
            <p className="text-slate-400 mb-8 text-lg font-medium">You matched all the words perfectly.</p>
            <div className="flex gap-4">
              <button 
                onClick={initGame}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all"
              >
                <RefreshCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <button 
        onClick={initGame}
        className="mt-12 flex items-center gap-2 text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest text-xs transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        Reset Board
      </button>
    </div>
  );
}
