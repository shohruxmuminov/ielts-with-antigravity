import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  X,
  Languages,
  Info,
  Trophy,
  Activity,
  Zap
} from 'lucide-react';
import { vocabularyData, VocabularyWord } from '../data/vocabulary';

export default function VocabularyBank() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'B2' | 'C1' | 'C2'>('all');
  const [ieltsOnly, setIeltsOnly] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  const stats = useMemo(() => {
    return {
      total: vocabularyData.length,
      b2: vocabularyData.filter(v => v.level === 'B2').length,
      c1: vocabularyData.filter(v => v.level === 'C1').length,
      c2: vocabularyData.filter(v => v.level === 'C2').length,
      ielts: vocabularyData.filter(v => v.ielts).length
    };
  }, []);

  const filteredWords = useMemo(() => {
    return vocabularyData.filter(word => {
      const matchesSearch = 
        word.word.toLowerCase().includes(search.toLowerCase()) ||
        word.meaning.toLowerCase().includes(search.toLowerCase()) ||
        word.uzbek.toLowerCase().includes(search.toLowerCase());
      
      const matchesLevel = levelFilter === 'all' || word.level === levelFilter;
      const matchesIelts = !ieltsOnly || word.ielts;

      return matchesSearch && matchesLevel && matchesIelts;
    }).sort((a, b) => a.word.localeCompare(b.word));
  }, [search, levelFilter, ieltsOnly]);

  const groupedWords = useMemo(() => {
    const groups: { [key: string]: VocabularyWord[] } = {};
    filteredWords.forEach(word => {
      const char = word.word[0].toUpperCase();
      if (!groups[char]) groups[char] = [];
      groups[char].push(word);
    });
    return groups;
  }, [filteredWords]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-900/50 border-b border-slate-800 pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                <Star className="w-3 h-3 fill-current" />
                Premium Resource
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                Vocabulary <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Bank</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
                A comprehensive collection of 260 curated words for B2, C1, and C2 levels. 
                Perfect for achieving Band 8.0+ in IELTS Speaking and Writing.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
              {[
                { label: 'Total Words', value: stats.total, icon: BookOpen, color: 'text-indigo-400' },
                { label: 'B2 Level', value: stats.b2, icon: Activity, color: 'text-blue-400' },
                { label: 'C1 Level', value: stats.c1, icon: Zap, color: 'text-purple-400' },
                { label: 'C2 Level', value: stats.c2, icon: Trophy, color: 'text-rose-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-2xl font-black text-white leading-none">{stat.value}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        {/* Controls */}
        <div className="bg-slate-900 rounded-[2rem] p-4 border border-slate-800 shadow-2xl backdrop-blur-xl mb-12 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search words, meanings, or translations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
              {['all', 'B2', 'C1', 'C2'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    levelFilter === lvl 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIeltsOnly(!ieltsOnly)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                ieltsOnly 
                  ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-900/40' 
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Star className={`w-4 h-4 ${ieltsOnly ? 'fill-current' : ''}`} />
              IELTS Top
            </button>
          </div>
        </div>

        {/* Word List Grouped by Letter */}
        <div className="space-y-16">
          {Object.keys(groupedWords).sort().map(char => (
            <section key={char} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-900/40">
                  {char}
                </div>
                <div className="h-px flex-1 bg-slate-800"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {groupedWords[char].length} Words
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {groupedWords[char].map((word) => (
                  <motion.div
                    key={word.word}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedWord(word)}
                    className="group bg-slate-900/50 hover:bg-slate-900 p-6 rounded-[2rem] border border-slate-800/50 hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                            {word.word}
                          </h3>
                          <div className="flex gap-2">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${
                              word.level === 'B2' ? 'bg-blue-900/30 text-blue-400' :
                              word.level === 'C1' ? 'bg-purple-900/30 text-purple-400' :
                              'bg-rose-900/30 text-rose-400'
                            }`}>
                              {word.level}
                            </span>
                            {word.ielts && (
                              <span className="bg-amber-900/30 text-amber-500 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-sm border border-amber-500/20">
                                IELTS
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">
                          {word.meaning}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-400/80 text-xs font-bold">
                          <Languages className="w-4 h-4" />
                          <span>Show Translation</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                    
                    {/* Shadow effect */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/10 transition-colors"></div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
          
          {filteredWords.length === 0 && (
            <div className="text-center py-40 bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">No matching words</h3>
              <p className="text-slate-500 font-medium">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setSearch(''); setLevelFilter('all'); setIeltsOnly(false); }}
                className="mt-8 text-indigo-400 font-bold hover:text-indigo-300 underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Word Detail Modal */}
      <AnimatePresence>
        {selectedWord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWord(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              layoutId={`card-${selectedWord.word}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedWord(null)}
                className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-12 space-y-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      selectedWord.level === 'B2' ? 'bg-blue-900/30 text-blue-400 border-blue-900/50' :
                      selectedWord.level === 'C1' ? 'bg-purple-900/30 text-purple-400 border-purple-900/50' :
                      'bg-rose-900/30 text-rose-400 border-rose-900/50'
                    }`}>
                      {selectedWord.level} Level
                    </span>
                    {selectedWord.ielts && (
                      <span className="bg-amber-900/30 text-amber-500 text-[10px] font-black px-4 py-1 rounded-full border border-amber-900/50 uppercase tracking-widest">
                        IELTS Essential
                      </span>
                    )}
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                    {selectedWord.word}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Info className="w-3 h-3 text-indigo-400" />
                        Meaning
                      </p>
                      <p className="text-xl text-slate-200 font-medium leading-relaxed">
                        {selectedWord.meaning}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Languages className="w-3 h-3 text-indigo-400" />
                        Uzbek Translation
                      </p>
                      <p className="text-2xl text-indigo-400 font-bold">
                        {selectedWord.uzbek}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Sentence Example</p>
                    <p className="text-lg text-slate-300 italic leading-relaxed">
                      "{selectedWord.example}"
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-center text-center md:text-left">
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-10 h-10 bg-indigo-900/30 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-widest leading-none">Status</p>
                      <p className="text-sm">Verified Premium Word</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedWord(null)}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/40"
                  >
                    Got It
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
