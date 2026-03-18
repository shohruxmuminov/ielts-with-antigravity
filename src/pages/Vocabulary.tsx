import React from 'react';
import { motion } from 'framer-motion';
import { 
  Book, 
  Brain, 
  Zap, 
  Search, 
  ArrowRight, 
  Star, 
  Clock, 
  Trophy,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Vocabulary() {
  const activities = [
    { 
      id: 'flashcards', 
      title: 'Flashcards', 
      icon: <Brain className="w-8 h-8 text-indigo-400" />, 
      desc: 'Master words with spaced repetition',
      color: 'bg-indigo-900/20',
      borderColor: 'border-indigo-900/30',
      path: '/vocabulary/trainer'
    },
    { 
      id: 'matching', 
      title: 'Matching Game', 
      icon: <Zap className="w-8 h-8 text-amber-400" />, 
      desc: 'Connect words with their meanings',
      color: 'bg-amber-900/20',
      borderColor: 'border-amber-900/30',
      path: '/vocabulary/matching'
    },
    { 
      id: 'quiz', 
      title: 'Vocabulary Quiz', 
      icon: <Trophy className="w-8 h-8 text-emerald-400" />, 
      desc: 'Test your knowledge under pressure',
      color: 'bg-emerald-900/20',
      borderColor: 'border-emerald-900/30',
      path: '/vocabulary/quiz'
    },
    { 
      id: 'typing', 
      title: 'Typing Practice', 
      icon: <Sparkles className="w-8 h-8 text-rose-400" />, 
      desc: 'Improve spelling and typing speed',
      color: 'bg-rose-900/20',
      borderColor: 'border-rose-900/30',
      path: '/vocabulary/typing'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-widest uppercase">
              <Book className="w-4 h-4" />
              Lexical Resource
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-none">
              Vocabulary <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Mastery</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-2xl">
              Expand your vocabulary with interactive tools designed to help you achieve a Band 8.0+ in Lexical Resource.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Words Mastered</p>
              <p className="text-xl font-black text-white">1,240</p>
            </div>
            <div className="w-12 h-12 bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Featured Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-sm relative overflow-hidden group"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-900/30 text-indigo-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-900/50">
                    Recommended
                  </span>
                </div>
                <h2 className="text-4xl font-black text-white leading-tight">
                  Daily Vocabulary <br />
                  <span className="text-indigo-400">Flashcards</span>
                </h2>
                <p className="text-slate-400 font-medium text-lg max-w-md">
                  Our AI-powered trainer selects the most relevant IELTS words based on your current level and progress.
                </p>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <Link 
                  to="/vocabulary/trainer"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
                >
                  Start Training
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 text-slate-500 font-bold">
                  <Clock className="w-4 h-4" />
                  15 mins daily
                </div>
              </div>
            </div>
            
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/10 to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-900 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          </motion.div>

          {/* Stats Card */}
          <div className="md:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl">Your Progress</h3>
                <Star className="w-6 h-6 text-amber-400 fill-current" />
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Academic Words', progress: 75, color: 'bg-indigo-500' },
                  { label: 'Topic Vocabulary', progress: 45, color: 'bg-emerald-500' },
                  { label: 'Idioms & Phrases', progress: 30, color: 'bg-rose-500' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>{item.label}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-sm transition-all border border-slate-700 text-slate-300">
                View Word List
              </button>
            </div>
          </div>

          {/* Activity Cards */}
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              whileHover={{ y: -5 }}
              className="md:col-span-3 bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-sm group cursor-pointer"
            >
              <Link to={activity.path} className="space-y-6 block">
                <div className={`w-16 h-16 ${activity.color} rounded-2xl flex items-center justify-center border ${activity.borderColor} group-hover:scale-110 transition-transform`}>
                  {activity.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">{activity.title}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    {activity.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  Play Now <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
