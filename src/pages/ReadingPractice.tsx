import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layout, 
  Crown,
  Play,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { usePremium } from '../context/PremiumContext';
import { useAuth } from '../FirebaseProvider';
import { getUserCompletions } from '../utils/testTracker';
import IELTSReadingLayout from '../components/IELTSReadingLayout';
import StaticReadingLayout from '../components/StaticReadingLayout';
import { useNavigate } from 'react-router-dom';

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

type TabType = 'free' | 'premium';

export default function ReadingPractice() {
  const [tests, setTests] = useState<ReadingTest[]>([]);
  const [premiumTests, setPremiumTests] = useState<ReadingTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ReadingTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('free');
  const [completedTestIds, setCompletedTestIds] = useState<string[]>([]);
  const { isPremium } = usePremium();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserCompletions(user.uid, 'reading').then(results => {
        setCompletedTestIds(results.map(r => r.testId));
      });
    }
  }, [user]);

  useEffect(() => {
    const staticFreeTests: ReadingTest[] = [
      {
        id: 'premium-reading-13',
        title: 'Premium Full Reading 25',
        type: 'Academic',
        category: 'free',
        isNew: true,
        isStatic: true,
        url: '/reading/premiumreading/Full reading 25.html',
        htmlContent: '',
        correctAnswers: '',
        createdAt: { seconds: Date.now() / 1000 }
      } as ReadingTest,
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
      } as ReadingTest,
      {
        id: 'cdi-reading-full',
        title: 'CDI Full Reading',
        type: 'Academic',
        category: 'free',
        isNew: true,
        isStatic: true,
        url: '/reading/CDI Full reading.html',
        htmlContent: '',
        correctAnswers: '',
        createdAt: { seconds: Date.now() / 1000 }
      } as ReadingTest,
      {
        id: 'cdi-reading-single',
        title: 'CDI Reading',
        type: 'Academic',
        category: 'free',
        isNew: true,
        isStatic: true,
        url: '/reading/CDI Reading.html',
        htmlContent: '',
        correctAnswers: '',
        createdAt: { seconds: Date.now() / 1000 }
      } as ReadingTest
    ];

    const staticPremiumTests: ReadingTest[] = [
      { id: 'premium-reading-1', title: 'Premium Full Reading 1', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/IELTSwithJurabek FULL Reading 1.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-2', title: 'Premium Full Reading 2', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/IELTSwithJurabek Reading full 2.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-3', title: 'Premium Full Reading 3', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/IELTSwithJurabek Full reading 3.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-4', title: 'Premium Full Reading 4', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/IELTSwithJurabek Full reading 4.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-5', title: 'Premium Full Reading 5', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/IELTSwithJurabek full reading 5.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-6', title: 'Premium Full Reading 6', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/IELTSwithJurabek FULL Reading 6.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-7', title: 'Premium Full Reading 7', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/IELTSwithJurabek Reading full 7.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-8', title: 'Premium Full Reading 8', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/Full reading 8.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-9', title: 'Premium Full Reading 9 (3 Passages)', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/Full Reading 12.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-10', title: 'Premium Full Reading 10', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/Full reading 10.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-11', title: 'Premium Full Reading 11', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/IELTSwithJurabek FULL Reading 11.html', htmlContent: '', correctAnswers: '' },
      { id: 'premium-reading-12', title: 'Premium Full Reading 12', type: 'Academic', category: 'premium', isStatic: true, url: '/reading/premiumreading/Full Reading 12.html', htmlContent: '', correctAnswers: '' },
    ];

    // Initial state with static tests
    setTests(staticFreeTests);
    setPremiumTests(staticPremiumTests);

    const q = query(
      collection(db, 'materials'),
      where('type', '==', 'reading')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbTests = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          category: data.category || 'free',
          isNew: data.isNew ?? false,
          htmlContent: data.htmlContent || data.data || '',
        } as ReadingTest;
      });

      // Sort by createdAt desc locally
      dbTests.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      const freeDbTests = dbTests.filter(t => t.category !== 'premium');
      const premiumDbTests = dbTests.filter(t => t.category === 'premium');

      setTests([...staticFreeTests, ...freeDbTests]);
      setPremiumTests([...staticPremiumTests, ...premiumDbTests]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching materials:", error);
      // Even if fetch fails, we already have static tests from initial state
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStartTest = (test: ReadingTest) => {
    if (completedTestIds.includes(test.id) && !isPremium) {
      alert('Siz bu testni allaqachon bajargansiz!');
      return;
    }
    if (test.category === 'premium' && !isPremium) {
      navigate('/premium');
      return;
    }
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

  if (selectedTest) {
    if (selectedTest.isStatic && selectedTest.url) {
      return (
        <StaticReadingLayout 
          testId={selectedTest.id}
          testTitle={selectedTest.title}
          testUrl={selectedTest.url} 
          onBack={handleBack} 
        />
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

  const currentTests = activeTab === 'free' ? tests : premiumTests;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col">
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
        <aside className="w-72 hidden md:block">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sticky top-10 shadow-xl">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2">Testlar turi</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('free')}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all font-bold ${
                  activeTab === 'free' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layout className="w-5 h-5" />
                  <span className="text-sm">Free Testlar</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'free' ? 'bg-blue-500' : 'bg-slate-800 text-slate-500'}`}>
                  {tests.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('premium')}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all font-bold ${
                  activeTab === 'premium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/40' : 'text-amber-500 hover:bg-amber-500/10 border border-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5" />
                  <span className="text-sm">⭐ Premium Testlar</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'premium' ? 'bg-amber-400' : 'bg-amber-900/40 text-amber-500'}`}>
                  {isPremium ? premiumTests.length : '🔒'}
                </span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex gap-2 mb-6 md:hidden">
            <button onClick={() => setActiveTab('free')} className={`flex-1 py-3 rounded-xl font-bold text-sm ${activeTab === 'free' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Free</button>
            <button onClick={() => setActiveTab('premium')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'premium' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-amber-400 border border-amber-500/30'}`}>
              <Crown className="w-4 h-4" /> Premium
            </button>
          </div>

          {activeTab === 'premium' && !isPremium && (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-900 rounded-[2rem] border-2 border-dashed border-amber-500/30 p-12 text-center">
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

          {(activeTab === 'free' || isPremium) && (
            loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTests.map((test) => (
                  <div key={test.id} className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all group flex flex-col h-full">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        {test.category === 'premium' ? (
                          <span className="bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                            <Crown className="w-3 h-3" /> Premium
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
                            ✓ Free
                          </span>
                        )}
                        {test.isNew && (
                          <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded shadow-sm">NEW</span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-white leading-snug mb-6 flex-1">{test.title}</h3>
                      {completedTestIds.includes(test.id) && !isPremium ? (
                        <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Bajarilgan
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleStartTest(test)}
                          className={`w-full text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                            test.category === 'premium' ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                          }`}
                        >
                          <Play className="w-4 h-4 fill-current" />
                          {completedTestIds.includes(test.id) && isPremium ? 'Retake' : 'Start'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {currentTests.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800">
                    <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">
                      {activeTab === 'premium' ? "Premium testlar tez orada qo'shiladi." : 'No tests found.'}
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
