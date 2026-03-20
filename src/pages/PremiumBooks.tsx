import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Search, 
  CheckCircle, 
  Lock, 
  ArrowLeft,
  FileText,
  Clock,
  ExternalLink,
  Book,
  Headphones,
  BookOpen,
  PenTool,
  Mic2
} from 'lucide-react';
import { useAuth } from '../FirebaseProvider';
import { usePremium } from '../context/PremiumContext';
import { Link, Navigate } from 'react-router-dom';

const categories = [
  { id: 'listening', name: 'Listening', icon: Headphones, color: '#9d50bb' },
  { id: 'reading', name: 'Reading', icon: BookOpen, color: '#00b09b' },
  { id: 'writing', name: 'Writing', icon: PenTool, color: '#ff9966' },
  { id: 'speaking', name: 'Speaking', icon: Mic2, color: '#ff0084' },
];

const booksData = {
  listening: [
    "1200 IELTS Listening Vocabulary @mockTashkent.pdf",
    "1200 most commonly used words in Listening 2.pdf",
    "1200 most commonly used words in Listening.pdf",
    "1200_most_commonly_repeated_words_in_Listening_@realexamielts.pdf",
    "Frequently misspelt words Pauline Cullen.pdf",
    "Synonyms-Word-List-A-Z-Band-8-or-9.pdf"
  ],
  reading: [
    "ELS reading.pdf",
    "IELTS Journal - Reading.pdf",
    "ISSUES.pdf",
    "Makkar AC Reading (50 Tests).pdf",
    "Over the hill - meaning_ old and past one's best life.pdf",
    "P2 coastal regions 06.07.pdf",
    "Should_you_read_George_Orwell's__1984__with_your_kids.pdf",
    "[@IELTS_WITH_US_N1]__A Resource for Reading and Words.pdf",
    "insect-decision-making  READING PASSAGE.pdf",
    "stories_for_reading_comprehension_1.pdf"
  ],
  writing: [
    "2023-ielts-writing-band-descriptors.pdf",
    "@IELTSwithJurabek authentic material.pdf",
    "Achieve IELTS Academic Writing success.pdf",
    "Alisher _ Ambitious IELTS Writing _ 2023 (2) (1).docx",
    "ESSAY BANK WRITING 2024.pdf",
    "Essay Writing Template .pdf",
    "Formal Words for IELTS Writing Task 2 .pdf",
    "Grammar for IELTS WRITING.pdf",
    "How the poor stopped catching up.pdf",
    "How to Write Task 1.pdf",
    "IELTS Advantage Writing Skills.pdf",
    "IELTS Made Easy step-by-step guide to writing a Taask 2 .pdf",
    "IELTS Special Journal 3 - Standard.pdf",
    "IELTS WRITING RECAP 2023.pdf",
    "IELTS Writing 9.0 Proficiency Task 1.pdf",
    "IELTS Writing Masterclass 8.5 (Superingenious.com).pdf",
    "IELTS Writing Review 2022 (ZIM).pdf",
    "IELTS Writing Task 1&2 (@Mokhidas_Tutorials).pdf",
    "Master IELTS Writing Band 9.0 Essays.pdf",
    "THE KEY TO IELTS WRITING - PAULINE CULLEN.pdf",
    "Writing Task 1 (Letter writing).pdf",
    "Writing Task 2 Actual Tests.pdf",
    "[@IELTS_WITH_US_N1]_100 Writing Mistakes.pdf",
    "england_usa Topic Ideas,.pdf",
    "how_to_structure_your_writing_task_for_Academic_task_1_pie_chart.pdf"
  ],
  speaking: [
    "10 Most Common Mistakes In IELTS Speaking  (1).pdf",
    "31 Formulas for IELTS Speaking.pdf",
    "@pdfbooksyouneed_Kiran_Makkars_Speaking_Cue_Cards_May_Aug_2023_Final.pdf",
    "All speaking part 2 questions @Shahzod_Abdiev.pdf",
    "Assessment Criteria SPeaking.pdf",
    "FORECAST_SPEAKING_QUÝ_3_SEPTEMBER_TO_DECEMBER_2025_PHẦN_1_còn_update.pdf",
    "IELTS Journal - Speaking.pdf",
    "IELTS Special Journal 3 - Standard.pdf",
    "IELTS-Speaking-Preparation-Full-Course (2).pdf",
    "IELTS_Speaking_Actual_Tests_with_Answers_January.pdf",
    "IELTS_speaking_study_planner_May_August_Full_version.pdf",
    "Master IELTS Speaking.pdf",
    "Question speaking quý 1.2025 (Jan to April)- còn update.pdf",
    "SPEAKING 2025-JANUARTY TO APRIL.pdf",
    "Speaking Keith @zafarsobitovv.pdf",
    "Speaking may to august.pdf",
    "The Key to IELTS Speaking by Pauline Cullen.pdf",
    "Why we speak.pdf",
    "england_usa Topic Ideas,.pdf",
    "ielts-speaking-library by @iielts_materials.pdf",
    "towards_new_avenues_for_the_ielts_speaking_test_inoue_et_al_2021.pdf"
  ]
};

export default function PremiumBooks() {
  const { profile, loading } = useAuth();
  const [activeCategory, setActiveCategory] = useState('listening');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return null;

  const isPremium = !!profile?.isPremium;

  const currentBooks = booksData[activeCategory as keyof typeof booksData].filter(book => 
    book.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05050f] text-white p-6 lg:p-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link to="/dashboard" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-2 text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3 text-white">
              <Book className="w-8 h-8 text-indigo-500" />
              My Premium <span className="text-indigo-500">Books</span>
            </h1>
            <p className="text-slate-400 font-medium">Exclusive strategy guides and practice materials for premium members.</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search premium books..."
              className="w-full md:w-80 bg-[#121124] border border-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-white rounded-2xl py-3 pl-11 pr-4 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 border ${
                activeCategory === cat.id 
                  ? 'bg-indigo-600 border-indigo-500 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] scale-105' 
                  : 'bg-[#121124] border-slate-800 text-slate-400 hover:bg-[#1a1932] hover:border-slate-700'
              }`}
            >
              <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : ''}`} style={{ color: activeCategory === cat.id ? '' : cat.color }} />
              {cat.name}
              {activeCategory === cat.id && (
                <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                  {booksData[cat.id as keyof typeof booksData].length}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentBooks.length > 0 ? (
              currentBooks.map((book, idx) => (
                <motion.div
                  key={book}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-[#121124]/60 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] p-5 hover:border-indigo-500/30 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                      {book.toLowerCase().endsWith('.pdf') ? (
                        <FileText className="w-6 h-6 text-indigo-400" />
                      ) : (
                        <Book className="w-6 h-6 text-indigo-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-extrabold text-slate-100 leading-tight line-clamp-2 group-hover:text-white transition-all ${!isPremium ? 'blur-sm select-none' : ''}`}>
                        {isPremium ? book : 'Premium Resource Title'}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                        {isPremium ? book.toLowerCase().split('.').pop() : 'FILE'} Resource
                      </p>
                    </div>
                  </div>

                  {isPremium ? (
                    <a
                      href={`/My premium books/${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}/${book}`}
                      download={book}
                      className="w-full flex items-center justify-center gap-2 bg-[#1a1932] hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-white rounded-xl py-3 text-xs font-black transition-all group/btn"
                    >
                      <Download className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                      Download Kitob
                    </a>
                  ) : (
                    <Link
                      to="/premium"
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl py-3 text-xs font-black transition-all hover:bg-indigo-600/20"
                    >
                      <Lock className="w-4 h-4" />
                      Unlock Premium
                    </Link>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-bold">No books found matching your search</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-indigo-400 hover:underline font-bold"
                >
                  Clear search
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Premium Badge / CTA */}
        <div className={`mt-12 bg-gradient-to-r ${isPremium ? 'from-indigo-600/20 to-purple-600/20' : 'from-amber-600/20 to-orange-600/20'} border border-indigo-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6`}>
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-3xl ${isPremium ? 'bg-indigo-600' : 'bg-amber-600'} flex items-center justify-center shadow-lg shadow-indigo-600/20`}>
              {isPremium ? <CheckCircle className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
            </div>
            <div>
              <h4 className="text-xl font-black text-white">{isPremium ? 'Full Premium Access Active' : 'Premium Membership Required'}</h4>
              <p className="text-slate-400 text-sm font-medium">
                {isPremium 
                  ? 'You have unlimited access to all preparation materials.' 
                  : 'Upgrade to premium to unlock over 60 exclusive IELTS books and guides.'}
              </p>
            </div>
          </div>
          {!isPremium && (
            <Link 
              to="/premium"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-600/30 text-center"
            >
              Get Premium Now
            </Link>
          )}
          {isPremium && (
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0a0a1a] bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i + 50}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="h-10 px-4 rounded-full border-4 border-[#0a0a1a] bg-indigo-600 flex items-center justify-center text-[10px] font-black">
                +2k users
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
