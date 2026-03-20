import { useState } from 'react';
import { Play, Clock, BookOpen, Headphones, PenTool, Mic, AlertCircle, CheckCircle2, X, ChevronRight } from 'lucide-react';

const MOCK_SECTIONS = [
  {
    id: 'listening',
    title: 'Listening',
    icon: 'headphones',
    time: '30 min',
    url: '/mock test/Listening (2).html',
    color: 'indigo',
  },
  {
    id: 'reading',
    title: 'Reading',
    icon: 'book',
    time: '60 min',
    url: '/mock test/R.html',
    color: 'emerald',
  },
  {
    id: 'writing',
    title: 'Writing',
    icon: 'pen',
    time: '60 min',
    url: '/mock test/Writing-Task 1 and 2.html',
    color: 'orange',
  },
];

const ICON_MAP: Record<string, any> = {
  headphones: Headphones,
  book: BookOpen,
  pen: PenTool,
};

export default function MockExam() {
  // -1 = landing, 0..2 = active section index, 3 = completed
  const [currentStep, setCurrentStep] = useState(-1);

  const handleStart = () => {
    setCurrentStep(0);
  };

  const handleNextSection = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleExit = () => {
    if (window.confirm('Testni yakunlamoqchimisiz? Barcha natijalar saqlanmaydi.')) {
      setCurrentStep(-1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(-1);
  };

  // ─── COMPLETION SCREEN ───
  if (currentStep >= MOCK_SECTIONS.length) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-xl text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white">Mock Test Yakunlandi!</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Siz barcha bo'limlarni muvaffaqiyatli yakunladingiz. Tabriklaymiz!
          </p>

          <div className="space-y-3 text-left">
            {MOCK_SECTIONS.map((section, idx) => {
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
            onClick={handleRestart}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE TEST SECTION (iframe) ───
  if (currentStep >= 0) {
    const section = MOCK_SECTIONS[currentStep];
    const Icon = ICON_MAP[section.icon];
    const isLast = currentStep === MOCK_SECTIONS.length - 1;

    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-slate-900 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-indigo-400" />
            <span className="text-white font-black text-sm tracking-tight">
              Mock Test — {section.title} ({section.time})
            </span>
            <span className="text-slate-500 text-xs font-bold ml-2">
              {currentStep + 1} / {MOCK_SECTIONS.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNextSection}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-900/20"
            >
              {isLast ? 'Yakunlash' : 'Keyingi bo\'lim'}
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
            style={{ width: `${((currentStep + 1) / MOCK_SECTIONS.length) * 100}%` }}
          />
        </div>

        {/* Test iframe */}
        <div className="flex-1 w-full bg-white relative">
          <iframe
            key={section.id}
            src={section.url}
            className="w-full h-full border-none"
            title={`Mock Test - ${section.title}`}
            allow="autoplay; fullscreen"
          />
        </div>
      </div>
    );
  }

  // ─── LANDING PAGE ───
  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 p-6 min-h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Full Mock Exam</h1>
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-sm text-center">
        <div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Haqiqiy imtihonga tayyormisiz?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8 font-medium">
          Bu mock test haqiqiy IELTS imtihonini simulatsiya qiladi. Test 3 ta bo'limdan iborat:
          Listening, Reading va Writing. Har bir bo'limni ketma-ket bajarasiz.
        </p>

        {/* Section previews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {MOCK_SECTIONS.map((section, idx) => {
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
          Mock Testni boshlash
        </button>
      </div>
    </div>
  );
}
