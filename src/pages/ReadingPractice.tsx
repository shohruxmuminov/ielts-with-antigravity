import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layout, 
  Box, 
  Crown, 
  FileText, 
  Play,
  ArrowRight
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import IELTSReadingLayout from '../components/IELTSReadingLayout';
import FullTest29Layout from '../components/FullTest29Layout';
import StaticReadingLayout from '../components/StaticReadingLayout';
import { FULL_TEST_29 } from '../data/fullTest29';
import '../styles/fullTest29.css';

interface ReadingTest {
  id: string;
  title: string;
  type: string;
  category?: 'free' | 'premium' | 'full';
  isNew?: boolean;
  htmlContent: string;
  questionsHtml?: string;
  correctAnswers: string;
  isStatic?: boolean;
  url?: string;
  createdAt?: any;
}

type FilterType = 'all' | 'free' | 'premium' | 'full';

export default function ReadingPractice() {
  const [tests, setTests] = useState<ReadingTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ReadingTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    const q = query(
      collection(db, 'materials'),
      where('type', '==', 'reading'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbTests = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          category: data.category || 'free', // Default to free if not specified
          isNew: data.isNew ?? false,
          htmlContent: data.htmlContent || data.data || '',
        };
      }) as ReadingTest[];
      
      const staticTests: ReadingTest[] = [
        { ...FULL_TEST_29, type: 'Academic', category: 'full', isNew: true } as ReadingTest,
        {
          id: 'jurabek-reading-1',
          title: 'IELTS with Jurabek - Reading Test 1',
          type: 'Academic',
          category: 'free',
          isNew: true,
          htmlContent: '/reading/IELTSwithJurabek Reading.html',
          correctAnswers: '',
          createdAt: { seconds: Date.now() / 1000 }
        } as ReadingTest,
        {
          id: 'jurabek-reading-2',
          title: 'IELTS with Jurabek - Reading Test 2',
          type: 'Academic',
          category: 'free',
          isNew: true,
          htmlContent: '/reading/IELTSwithJurabek.html',
          correctAnswers: '',
          createdAt: { seconds: Date.now() / 1000 }
        } as ReadingTest
      ];

      setTests([...staticTests, ...dbTests]);
      setLoading(false);
    }, (error) => {
      const staticTests: ReadingTest[] = [
        { ...FULL_TEST_29, type: 'Academic', category: 'full', isNew: true } as ReadingTest,
        {
          id: 'jurabek-reading-1',
          title: 'IELTS with Jurabek - Reading Test 1',
          type: 'Academic',
          category: 'free',
          isNew: true,
          isStatic: true,
          url: '/reading/IELTSwithJurabek Reading.html',
          htmlContent: '',
          correctAnswers: '',
          createdAt: { seconds: Date.now() / 1000 }
        } as ReadingTest,
        {
          id: 'jurabek-reading-2',
          title: 'IELTS with Jurabek - Reading Test 2',
          type: 'Academic',
          category: 'free',
          isNew: true,
          isStatic: true,
          url: '/reading/IELTSwithJurabek.html',
          htmlContent: '',
          correctAnswers: '',
          createdAt: { seconds: Date.now() / 1000 }
        } as ReadingTest
      ];
      setTests(staticTests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStartTest = (test: ReadingTest) => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
    setSelectedTest(test);
  };

  const handleBack = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    setSelectedTest(null);
  };

  const filteredTests = tests.filter(test => {
    if (activeFilter === 'all') return true;
    return test.category === activeFilter;
  });

  const counts = {
    all: tests.length,
    free: tests.filter(t => t.category === 'free').length,
    premium: tests.filter(t => t.category === 'premium').length,
    full: tests.filter(t => t.category === 'full').length,
  };

  if (selectedTest) {
    if (selectedTest.isStatic && selectedTest.url) {
      return (
        <StaticReadingLayout 
          testUrl={selectedTest.url} 
          onBack={handleBack} 
        />
      );
    }
    if (selectedTest.id === 'full-test-29') {
      return (
        <div className="fixed inset-0 z-50 bg-white overflow-hidden">
          <FullTest29Layout onBack={handleBack} />
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 overflow-hidden">
        <IELTSReadingLayout 
          test={selectedTest} 
          onBack={handleBack} 
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col">
      {/* Redesigned Header */}
      <header className="bg-blue-600 py-12 px-6 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-3">
            <BookOpen className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">IELTS Reading Tests</h1>
          </div>
          <p className="text-blue-100 text-lg font-medium max-w-2xl mx-auto">
            Comprehensive reading practice with authentic IELTS materials and detailed feedback
          </p>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1400px] mx-auto w-full p-6 lg:p-10 gap-8">
        {/* Sidebar */}
        <aside className="w-72 hidden md:block">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sticky top-10 shadow-xl">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2">Filter Tests</h2>
            
            <nav className="space-y-1">
              {[
                { id: 'all', label: 'All Tests', icon: Layout },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveFilter(item.id as FilterType)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all font-bold group ${
                    activeFilter === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    activeFilter === item.id ? 'bg-blue-500' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {counts[item.id as keyof typeof counts]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div key={test.id} className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all group flex flex-col h-full">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
                        ✓ Free
                      </span>
                      {test.isNew && (
                        <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded shadow-sm">
                          NEW
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-black text-white leading-snug mb-6 flex-1">
                      {test.title}
                    </h3>
                    
                    <button 
                      onClick={() => handleStartTest(test)}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Start
                    </button>
                  </div>
                </div>
              ))}

              {filteredTests.length === 0 && (
                <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800">
                  <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">No tests found in this category.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
