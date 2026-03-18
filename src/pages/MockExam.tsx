import { motion } from 'framer-motion';
import { Play, Clock, BookOpen, Headphones, PenTool, Mic, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../FirebaseProvider';

export default function MockExam() {
  const { user, profile } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testStep, setTestStep] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [user]);

  const fetchResults = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'results'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setResults(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      // Error fetching mock results
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    setIsTesting(true);
    setTestStep(1);
  };

  const handleCompleteTest = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Simulate band calculation
      const bands = {
        listening: (Math.random() * 3 + 6).toFixed(1),
        reading: (Math.random() * 3 + 6).toFixed(1),
        writing: (Math.random() * 3 + 6).toFixed(1),
        speaking: (Math.random() * 3 + 6).toFixed(1),
      };
      const overall = ((Number(bands.listening) + Number(bands.reading) + Number(bands.writing) + Number(bands.speaking)) / 4).toFixed(1);

      await addDoc(collection(db, 'results'), {
        userId: user.uid,
        createdAt: serverTimestamp(),
        overallBand: Number(overall),
        bands: bands,
        type: 'Full Mock'
      });

      await fetchResults();
      setIsTesting(false);
      setTestStep(0);
    } catch (error) {
      // Error saving test result
    } finally {
      setSaving(false);
    }
  };

  if (isTesting) {
    return (
      <div className="max-w-2xl mx-auto w-full bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-xl text-center space-y-8 text-slate-100">
        <div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-10 h-10 text-indigo-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white">Mock Exam in Progress</h2>
          <p className="text-slate-400 font-medium">Simulating the full IELTS experience...</p>
        </div>

        <div className="space-y-4 py-8">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-slate-200">Listening Section</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-slate-200">Reading Section</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-3">
              <PenTool className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-slate-200">Writing Section</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-pink-400" />
              <span className="font-bold text-slate-200">Speaking Section</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <button 
          onClick={handleCompleteTest}
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50"
        >
          {saving ? "Calculating Results..." : "Finish & Submit Exam"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 p-6 min-h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Full Mock Exam</h1>
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-sm text-center">
        <div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Ready for the real thing?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8 font-medium">
          This mock exam simulates the real IELTS test environment. It will take approximately 2 hours and 45 minutes to complete. Make sure you are in a quiet place and have a stable internet connection.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ExamSection icon={<Headphones className="w-6 h-6" />} title="Listening" time="30 mins" />
          <ExamSection icon={<BookOpen className="w-6 h-6" />} title="Reading" time="60 mins" />
          <ExamSection icon={<PenTool className="w-6 h-6" />} title="Writing" time="60 mins" />
          <ExamSection icon={<Mic className="w-6 h-6" />} title="Speaking" time="15 mins" />
        </div>

        <button 
          onClick={handleStartTest}
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-2 mx-auto"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Mock Exam
        </button>
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-sm">
        <h3 className="text-xl font-black text-white mb-6">Previous Mock Exams</h3>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-slate-500 font-medium">Loading results...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-medium">No mock exams completed yet.</div>
          ) : (
            results.map((result, idx) => (
              <div key={result.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-800/50">
                <div>
                  <p className="font-bold text-white text-lg">Mock Exam #{results.length - idx}</p>
                  <p className="text-sm text-slate-500 font-medium">
                    Completed on {result.createdAt?.toDate ? result.createdAt.toDate().toLocaleDateString() : new Date(result.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overall Band</p>
                    <p className="text-2xl font-black text-indigo-400">{result.overallBand}</p>
                  </div>
                  <button className="px-5 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-600 transition-colors">
                    View Report
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ExamSection({ icon, title, time }: any) {
  return (
    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-800/50 flex flex-col items-center justify-center gap-2">
      <div className="text-slate-500">{icon}</div>
      <p className="font-bold text-slate-200">{title}</p>
      <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
        <Clock className="w-3 h-3" />
        {time}
      </div>
    </div>
  );
}

