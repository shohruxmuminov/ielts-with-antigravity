import { useState, useEffect } from 'react';
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
  const [testResults, setTestResults] = useState<Record<string, { score: number | string, band: number | string, evaluation?: any }>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const data = event.data;
      if (data.type === 'MOCK_TEST_RESULT') {
        setTestResults(prev => ({
          ...prev,
          [data.section]: { score: data.score, band: data.band }
        }));
      } else if (data.type === 'MOCK_TEST_WRITING_SUBMIT') {
        await evaluateFullWriting(data.task1, data.task2);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const evaluateFullWriting = async (task1: string, task2: string) => {
    setIsEvaluating(true);
    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/evaluate/writing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: task1, taskType: 'Task 1', prompt: 'Academic Writing Task 1' })
        }).then(r => r.json()),
        fetch('/api/evaluate/writing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: task2, taskType: 'Task 2', prompt: 'Academic Writing Task 2' })
        }).then(r => r.json())
      ]);

      const averageBand = ((res1.band || 0) + (res2.band || 0)) / 2;
      const roundedBand = Math.round(averageBand * 2) / 2;

      setTestResults(prev => ({
        ...prev,
        writing: { 
          score: 'AI Evaluated', 
          band: roundedBand.toFixed(1),
          evaluation: { task1: res1, task2: res2 }
        }
      }));
    } catch (error) {
      console.error('Writing evaluation failed:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const calculateOverallBand = () => {
    const l = parseFloat(String(testResults.listening?.band || 0));
    const r = parseFloat(String(testResults.reading?.band || 0));
    const w = parseFloat(String(testResults.writing?.band || 0));
    
    if (l === 0 && r === 0 && w === 0) return "0.0";
    
    // Simple average of 3 sections
    const avg = (l + r + w) / 3;
    return (Math.round(avg * 2) / 2).toFixed(1);
  };

  const handleSelectTest = (test: typeof MOCK_TESTS[0]) => {
    setSelectedTest(test);
    setCurrentStep(-1);
    setTestResults({});
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
    const overallBand = calculateOverallBand();
    
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center py-10 px-6 overflow-y-auto">
        <div className="max-w-4xl w-full bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-xl text-center space-y-8">
          <div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-black text-white">{selectedTest.title} Overall Result</h2>
          
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl">
            <span className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">Overall Band Score</span>
            <div className="text-7xl font-black text-white mt-2">{overallBand}</div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="p-5 font-black text-slate-400 uppercase text-xs tracking-widest">Section</th>
                  <th className="p-5 font-black text-slate-400 uppercase text-xs tracking-widest">Raw Score</th>
                  <th className="p-5 font-black text-slate-400 uppercase text-xs tracking-widest text-right">Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sections.map(section => {
                  const result = testResults[section.id];
                  const Icon = ICON_MAP[section.icon];
                  
                  return (
                    <tr key={section.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-5 font-bold text-white">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-indigo-400" />
                          {section.title}
                        </div>
                      </td>
                      <td className="p-5 text-slate-400 font-bold">
                        {section.id === 'writing' && isEvaluating ? (
                          <div className="flex items-center gap-2 text-indigo-400">
                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            AI is grading...
                          </div>
                        ) : result?.score || '0'}
                      </td>
                      <td className="p-5 text-white font-black text-right text-xl">
                        {section.id === 'writing' && isEvaluating ? '...' : result?.band || '0.0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* AI Writing Feedback Section */}
          {testResults.writing?.evaluation && (
            <div className="space-y-6 text-left pt-8 border-t border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">AI Examiner Feedback</h3>
                  <p className="text-slate-500 text-sm font-medium">Detailed breakdown of your writing performance</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {['task1', 'task2'].map((key) => {
                  const evalData = testResults.writing?.evaluation[key];
                  if (!evalData) return null;
                  
                  return (
                    <div key={key} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-[2rem] space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Writing</span>
                          <span className="text-lg font-black text-white">{key === 'task1' ? 'Task 1' : 'Task 2'}</span>
                        </div>
                        <div className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center leading-none shadow-lg shadow-indigo-900/20">
                          <span className="text-[10px] font-black uppercase mb-1">Band</span>
                          <span className="text-xl font-black">{evalData.band}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-5">
                        <section>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             Grammar & Accuracy
                          </h4>
                          <ul className="space-y-2">
                            {evalData.grammar?.map((point: string, i: number) => (
                              <li key={i} className="text-sm text-slate-400 flex gap-2">
                                <span className="text-indigo-400 font-bold">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </section>

                        <section>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                             Vocabulary (Lexical)
                          </h4>
                          <ul className="space-y-2">
                            {evalData.vocabulary?.map((point: string, i: number) => (
                              <li key={i} className="text-sm text-slate-400 flex gap-2">
                                <span className="text-indigo-400 font-bold">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </section>

                        <section className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Coherence & Cohesion</h4>
                          <p className="text-sm text-slate-400 leading-relaxed italic">
                            "{evalData.coherence}"
                          </p>
                        </section>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleBackToList}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-4 rounded-2xl font-bold text-lg transition-all border border-slate-700 active:scale-95"
            >
              Finish Review
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-900/20 active:scale-95"
            >
              Save as PDF
            </button>
          </div>
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
