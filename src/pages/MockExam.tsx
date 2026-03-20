import { useState } from 'react';
import { Play, Clock, BookOpen, Headphones, PenTool, AlertCircle, CheckCircle2, X, ChevronRight, ArrowLeft, Crown, Lock } from 'lucide-react';
import { usePremium } from '../context/PremiumContext';
import { useNavigate } from 'react-router-dom';

// ─── MOCK TEST DEFINITIONS ───
// Har safar yangi mock test qo'shganda, shu arrayga bitta yangi object qo'shing
const MOCK_TESTS = [
  {
    id: 'mock-1',
    title: 'Mock Test 1',
    description: 'IELTS Full Mock — Listening, Reading, Writing',
    sections: [
      { id: 'listening', title: 'Listening', icon: 'headphones', time: '30 min', url: '/mock test/Listening (2).html' },
      { id: 'reading',   title: 'Reading',   icon: 'book',       time: '60 min', url: '/mock test/R.html' },
      { id: 'writing',   title: 'Writing',   icon: 'pen',        time: '60 min', url: '/mock test/Writing-Task 1 and 2.html' },
    ],
  },
  // Yangi test qo'shish uchun nusxa oling:
  // {
  //   id: 'mock-2',
  //   title: 'Mock Test 2',
  //   description: 'IELTS Full Mock — Listening, Reading, Writing',
  //   sections: [
  //     { id: 'listening', title: 'Listening', icon: 'headphones', time: '30 min', url: '/mock test/...' },
  //     { id: 'reading',   title: 'Reading',   icon: 'book',       time: '60 min', url: '/mock test/...' },
  //     { id: 'writing',   title: 'Writing',   icon: 'pen',        time: '60 min', url: '/mock test/...' },
  //   ],
  // },
];

const ICON_MAP: Record<string, any> = {
  headphones: Headphones,
  book: BookOpen,
  pen: PenTool,
};

export default function MockExam() {
  const [selectedTest, setSelectedTest] = useState<typeof MOCK_TESTS[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  const handleSelectTest = (test: typeof MOCK_TESTS[0]) => {
    setSelectedTest(test);
    setCurrentStep(-1);
  };

  const handleStart = () => {
    setCurrentStep(0);
  };

  const handleNextSection = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleExit = () => {
    if (window.confirm('Testni yakunlamoqchimisiz?')) {
      setSelectedTest(null);
      setCurrentStep(-1);
    }
  };

  const handleBackToList = () => {
    setSelectedTest(null);
    setCurrentStep(-1);
  };

  // ─── NO TEST SELECTED → SHOW LIST ───
  if (!selectedTest) {
    return (
      <div className="max-w-5xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 p-6 min-h-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-white">Full Mock Exams</h1>
          <span className="text-slate-500 text-sm font-bold">{MOCK_TESTS.length} ta test mavjud</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('free')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'free' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Free Testlar
          </button>
          <button
            onClick={() => setActiveTab('premium')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'premium' ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-800 text-amber-400 border border-amber-500/30 hover:bg-amber-500/10'
            }`}
          >
            <Crown className="w-4 h-4" /> ⭐ Premium Testlar
          </button>
        </div>

        {/* Premium locked */}
        {activeTab === 'premium' && !isPremium && (
          <div className="flex flex-col items-center justify-center min-h-[350px] bg-slate-900 rounded-[2rem] border-2 border-dashed border-amber-500/30 p-12 text-center">
            <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-6 border border-amber-500/20">
              <Lock className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3">Premium bo'lim</h3>
            <p className="text-slate-500 text-lg font-medium mb-8 max-w-sm">
              Bu bo'limdagi testlarga kirish uchun premium obuna kerak
            </p>
            <button
              onClick={() => navigate('/premium')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-black text-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl shadow-amber-900/30 flex items-center gap-3"
            >
              <Crown className="w-5 h-5" />
              Premium olish
            </button>
          </div>
        )}

        {/* Premium unlocked - empty for now */}
        {activeTab === 'premium' && isPremium && (
          <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-amber-500/30">
            <Crown className="w-12 h-12 text-amber-500/50 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Premium mock testlar tez orada qo'shiladi.</p>
          </div>
        )}

        {/* Free tests */}
        {activeTab === 'free' && (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TESTS.map((test, idx) => (
            <div
              key={test.id}
              className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl hover:border-indigo-600/50 transition-all group flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/20">
                    Full Mock
                  </span>
                  <span className="text-slate-600 text-xs font-bold">#{idx + 1}</span>
                </div>

                <h3 className="text-xl font-black text-white leading-snug mb-2">
                  {test.title}
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-5 flex-1">
                  {test.description}
                </p>

                {/* Section Pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {test.sections.map(section => {
                    const Icon = ICON_MAP[section.icon];
                    return (
                      <div key={section.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-400">
                        <Icon className="w-3.5 h-3.5" />
                        {section.title}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleSelectTest(test)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Boshlash
                </button>
              </div>
            </div>
          ))}
        </div>

        {MOCK_TESTS.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800">
            <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Hozircha mock testlar mavjud emas.</p>
          </div>
        )}
          </>
        )}
      </div>
    );
  }

  const sections = selectedTest.sections;

  // ─── COMPLETION SCREEN ───
  if (currentStep >= sections.length) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-xl text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white">{selectedTest.title} Yakunlandi!</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Siz barcha bo'limlarni muvaffaqiyatli yakunladingiz. Tabriklaymiz!
          </p>

          <div className="space-y-3 text-left">
            {sections.map(section => {
              const Icon = ICON_MAP[section.icon];
              return (
                <div key={section.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-200">{section.title}</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              );
            })}
          </div>

          <button
            onClick={handleBackToList}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
          >
            Testlar ro'yxatiga qaytish
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST INFO / CONFIRM SCREEN ───
  if (currentStep === -1) {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 p-6 min-h-full">
        <button onClick={handleBackToList} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Barcha testlar
        </button>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-sm text-center">
          <div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{selectedTest.title}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8 font-medium">
            {selectedTest.description}. Har bir bo'limni ketma-ket bajarasiz. Tayyor bo'lganingizdan keyin "Boshlash" tugmasini bosing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {sections.map((section, idx) => {
              const Icon = ICON_MAP[section.icon];
              return (
                <div key={section.id} className="p-6 rounded-2xl border border-slate-800 bg-slate-800/50 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-900/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="font-bold text-slate-200">{section.title}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                    <Clock className="w-3 h-3" />
                    {section.time}
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Bo'lim {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleStart}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5 fill-current" />
            Testni boshlash
          </button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE TEST SECTION (iframe) ───
  const section = sections[currentStep];
  const Icon = ICON_MAP[section.icon];
  const isLast = currentStep === sections.length - 1;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <div className="h-14 bg-slate-900 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-indigo-400" />
          <span className="text-white font-black text-sm tracking-tight">
            {selectedTest.title} — {section.title} ({section.time})
          </span>
          <span className="text-slate-500 text-xs font-bold ml-2">
            {currentStep + 1} / {sections.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNextSection}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-900/20"
          >
            {isLast ? 'Yakunlash' : "Keyingi bo'lim"}
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleExit}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
          >
            <X className="w-4 h-4" />
            Chiqish
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-800">
        <div
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
        />
      </div>

      {/* Test iframe */}
      <div className="flex-1 w-full bg-white relative">
        <iframe
          key={section.id + currentStep}
          src={section.url}
          className="w-full h-full border-none"
          title={`${selectedTest.title} - ${section.title}`}
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
}
