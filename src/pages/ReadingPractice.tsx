import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import IELTSReadingLayout from '../components/IELTSReadingLayout';
import { DYNAMIC_TEST_21 } from '../data/dynamic21';


interface ReadingTest {
  id: string;
  title: string;
  type: string;
  htmlContent: string;
  questionsHtml?: string;
  correctAnswers: string;
  createdAt?: any;
}

export default function ReadingPractice() {
  const [tests, setTests] = useState<ReadingTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ReadingTest | null>(null);
  const [loading, setLoading] = useState(true);

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
          htmlContent: data.htmlContent || data.data || '', // Support both field names
        };
      }) as ReadingTest[];
      
      // Add strict raw HTML test with Firebase tests
      setTests([DYNAMIC_TEST_21 as ReadingTest, ...dbTests]);
      setLoading(false);
    }, (error) => {
      // If Firestore fails, show local raw test
      setTests([DYNAMIC_TEST_21 as ReadingTest]);
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

  if (selectedTest) {
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
    <div className="p-10 max-w-5xl mx-auto bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Reading Practice</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl flex items-center justify-between hover:border-slate-700 transition-all group">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{test.title}</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Academic Reading</p>
              </div>
              <button 
                onClick={() => handleStartTest(test)}
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-2"
              >
                Start Test
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ))}
          {tests.length === 0 && (
            <div className="text-center p-20 bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-500 font-bold">
              No reading tests available yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
