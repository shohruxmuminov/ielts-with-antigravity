import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Clock, CheckCircle, Volume2, ChevronLeft, ChevronRight, Info, BookOpen, Headphones, ArrowRight, Trophy, Crown, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { calculateBandScore } from '../utils/scoring';
import StaticListeningLayout from '../components/StaticListeningLayout';
import { usePremium } from '../context/PremiumContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../FirebaseProvider';
import { saveTestResult, getUserCompletions } from '../utils/testTracker';
import { generateTestReport, sendToTelegram } from '../utils/pdfGenerator';

export default function ListeningPractice() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [premiumMaterials, setPremiumMaterials] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [score, setScore] = useState(0);
  const [bandScore, setBandScore] = useState("0.0");
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');
  const [completedTestIds, setCompletedTestIds] = useState<string[]>([]);
  const audioRef = useRef<HTMLVideoElement>(null);
  const { isPremium } = usePremium();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserCompletions(user.uid, 'listening').then(results => {
        setCompletedTestIds(results.map(r => r.testId));
      });
    }
  }, [user]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const staticTests = [
      { 
        id: 'jurabek-listening-1', 
        title: 'IELTS with Jurabek - Listening Test 1', 
        isStatic: true, 
        url: '/listening/IELTSwithJurabek Listening.html',
        receivedFrom: 'IELTSwithJurabek',
        createdAt: { seconds: 1710900000 } 
      },
      { 
        id: 'jurabek-listening-2', 
        title: 'IELTS with Jurabek - Listening Test 2', 
        isStatic: true, 
        url: '/listening/IELTSwithJurabek Listening2.html',
        receivedFrom: 'IELTSwithJurabek',
        createdAt: { seconds: 1710900001 } 
      },
      { 
        id: 'jurabek-listening-3', 
        title: 'IELTS with Jurabek - Listening Test 3', 
        isStatic: true, 
        url: '/listening/IELTSwithJurabek Listening3.html',
        receivedFrom: 'IELTSwithJurabek',
        createdAt: { seconds: 1710900002 } 
      },
      { 
        id: 'jurabek-listening-4', 
        title: 'IELTS with Jurabek - Final Test', 
        isStatic: true, 
        url: '/listening/IELTSwithJurabek Lis.html',
        receivedFrom: 'IELTSwithJurabek',
        createdAt: { seconds: 1710900003 } 
      },
    ];

    setLoading(true);
    try {
      const q = query(
        collection(db, 'materials'),
        where('type', '==', 'listening')
      );
      const querySnapshot = await getDocs(q);
      const dbDocs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const sortedDbDocs = dbDocs.sort((a: any, b: any) => 
        (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      setMaterials([...staticTests, ...sortedDbDocs]);
    } catch (error) {
      console.error("Error fetching listening materials:", error);
      setMaterials(staticTests);
    } finally {
      setLoading(false);
    }

    const premiumListeningTests = [
      { id: 'premium-listening-9', title: 'Premium Listening Test 9', isStatic: true, url: '/listening/premiumlistening/Listening test 9.html', receivedFrom: 'IELTSwithShohrux', createdAt: { seconds: Date.now() / 1000 } },
      { id: 'premium-listening-10', title: 'Premium Listening Test 10', isStatic: true, url: '/listening/premiumlistening/Listening test 10.html', receivedFrom: 'IELTSwithShohrux', createdAt: { seconds: Date.now() / 1000 } },
      { id: 'premium-listening-part1', title: 'Premium Part 1 - Australian Agency', isStatic: true, url: '/listening/premiumlistening/PART 1-Australian Overseas Relocation Agency.html', receivedFrom: 'IELTSwithShohrux', createdAt: { seconds: Date.now() / 1000 } },
      { id: 'premium-listening-cdi-2', title: 'Premium Listening Test 11 (CDI)', isStatic: true, url: '/listening/premiumlistening/CDI Listening 2 (@realexamielts).html', receivedFrom: 'IELTSwithShohrux', createdAt: { seconds: Date.now() / 1000 } },
    ];
    setPremiumMaterials(premiumListeningTests);
  };

  const handleStartTest = (m: any) => {
    if (completedTestIds.includes(m.id) && !isPremium) {
      alert('Siz bu testni allaqachon bajargansiz!');
      return;
    }
    if (m.isStatic) {
      setSelectedMaterial(m);
      return;
    }
    
    try {
      const data = JSON.parse(m.data);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
      setSelectedMaterial({ ...m, parsedData: data });
    } catch (e) {
      alert("Error parsing test data. Please contact admin.");
    }
  };

  const handleBack = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    setSelectedMaterial(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (selectedMaterial?.isStatic) {
    return (
      <StaticListeningLayout 
        testId={selectedMaterial.id}
        testTitle={selectedMaterial.title}
        testUrl={selectedMaterial.url} 
        onBack={handleBack} 
      />
    );
  }

  if (!selectedMaterial) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Header */}
        <div className="bg-emerald-600 text-white py-16 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                <Headphones className="w-12 h-12" />
              </div>
              <h1 className="text-5xl font-black tracking-tight">IELTS Listening Tests</h1>
            </div>
            <p className="text-emerald-50 text-xl font-medium opacity-90 max-w-2xl mx-auto">
              Authentic audio materials with native speakers to improve your listening comprehension
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-800 p-8 sticky top-8">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Filter Tests</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('free')}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'free'
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">Free Tests</div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${activeTab === 'free' ? 'bg-white/20' : 'bg-slate-800 text-slate-500'}`}>
                    {materials.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'premium'
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-900/40" 
                      : "text-amber-500 hover:bg-amber-500/10 border border-amber-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4" />
                    ⭐ Premium
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${activeTab === 'premium' ? 'bg-white/20' : 'bg-amber-900/40 text-amber-500'}`}>
                    {isPremium ? premiumMaterials.length.toString() : '🔒'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-black text-white">
                  {activeTab === 'free' ? `Available Tests (${materials.length})` : '⭐ Premium Tests'}
                </h2>
              </div>
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

            {(activeTab === 'free' || isPremium) && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {(activeTab === 'free' ? materials : premiumMaterials).map((m: any) => (
                  <motion.div
                    key={m.id}
                    whileHover={{ y: -8 }}
                    className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 shadow-lg hover:shadow-2xl hover:border-emerald-500/30 transition-all group relative"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border flex items-center gap-1.5 uppercase tracking-widest ${
                        activeTab === 'premium' ? 'bg-amber-900/40 text-amber-400 border-amber-900/50' : 'bg-emerald-900/40 text-emerald-400 border-emerald-900/50'
                      }`}>
                        {activeTab === 'premium' ? <Crown className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        {activeTab === 'premium' ? 'PREMIUM' : 'FREE'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 line-clamp-2 min-h-[3rem] leading-tight">{m.title}</h3>
                    {m.receivedFrom && (
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-1.5 opacity-70">
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                        Received from {m.receivedFrom}
                      </p>
                    )}
                    
                    {completedTestIds.includes(m.id) && !isPremium ? (
                      <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Bajarilgan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartTest(m)}
                        className={`w-full text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                          activeTab === 'premium' ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-900/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        {completedTestIds.includes(m.id) && isPremium ? 'Retake Test' : 'Start Test'}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const testData = selectedMaterial.parsedData;
  const currentPart = testData.parts[currentPartIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, value: string | number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let correct = 0;
    if (!testData.answers) return 0;
    Object.entries(testData.answers).forEach(([id, correctAns]) => {
      const userAns = answers[Number(id)];
      if (typeof correctAns === 'string') {
        if (String(userAns || '').toLowerCase().trim() === correctAns.toLowerCase().trim()) correct++;
      } else {
        if (userAns === correctAns) correct++;
      }
    });
    return correct;
  };

  const isQuestionCorrect = (id: number) => {
    if (!testData.answers) return false;
    const correctAns = testData.answers[id as keyof typeof testData.answers];
    const userAns = answers[id];
    if (typeof correctAns === 'string') {
      return String(userAns || '').toLowerCase().trim() === correctAns.toLowerCase().trim();
    }
    return userAns === correctAns;
  };

  const handleSubmit = async () => {
    if (window.confirm("Finish and submit your answers?")) {
      const correctCount = calculateScore();
      const bScore = calculateBandScore(correctCount);
      setScore(correctCount);
      setBandScore(bScore);
      setSubmitted(true);
      
      if (user) {
        await saveTestResult({
          userId: user.uid,
          testId: selectedMaterial.id,
          testType: 'listening',
          title: selectedMaterial.title,
          score: correctCount,
          band: bScore
        });

        const report = await generateTestReport(user.displayName || user.email || 'Student', selectedMaterial.title, {
          listening: { score: correctCount, band: bScore }
        });

        await sendToTelegram(report, `${selectedMaterial.title}_Result.pdf`);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-3 hover:bg-slate-800 rounded-2xl transition-colors text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white leading-none">{selectedMaterial.title}</h1>
              <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mt-2">Listening Practice</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-slate-800 rounded-2xl border border-slate-700">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-black text-slate-200">30:00</span>
            </div>
            {submitted && (
              <div className="flex items-center gap-4 bg-emerald-900/30 px-6 py-2.5 rounded-2xl border border-emerald-900/50">
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Band Score</p>
                  <p className="text-2xl font-black text-emerald-100">{bandScore}</p>
                </div>
                <Trophy className="w-7 h-7 text-emerald-400" />
              </div>
            )}
            {!submitted && (
              <button 
                onClick={handleSubmit}
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        <div className="w-full lg:w-[450px] bg-slate-900 border-r border-slate-800 p-8 flex flex-col gap-8 sticky top-[73px] h-fit lg:h-[calc(100vh-73px)] overflow-y-auto">
          <div className="space-y-8">
            <div className="bg-slate-800 rounded-[2.5rem] p-8 border border-slate-700 shadow-inner">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
                  <Volume2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-white text-lg">Audio Player</h2>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Section {currentPartIndex + 1}</p>
                </div>
              </div>

              <audio 
                ref={audioRef} 
                src={testData.audioSrc} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <button 
                    onClick={togglePlay}
                    className="w-16 h-16 bg-slate-700 border border-slate-600 rounded-2xl flex items-center justify-center hover:border-emerald-500 hover:text-emerald-400 transition-all shadow-lg active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                  </button>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <input 
                      type="range" 
                      min={0} 
                      max={duration || 100} 
                      value={currentTime} 
                      onChange={handleSeek}
                      className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Test Progress</h3>
              <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 40 }).map((_, i) => {
                  const qId = i + 1;
                  const hasAnswer = answers[qId] !== undefined && answers[qId] !== '';
                  const isCorrect = submitted && isQuestionCorrect(qId);
                  
                  return (
                    <div 
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all border ${
                        submitted
                          ? isCorrect ? "bg-emerald-500 border-emerald-400 text-white" : "bg-rose-500 border-rose-400 text-white"
                          : hasAnswer ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20" : "bg-slate-800 border-slate-700 text-slate-500"
                      }`}
                    >
                      {qId}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-8 bg-emerald-900/20 rounded-[2rem] border border-emerald-900/30">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <Info className="w-6 h-6" />
                <h4 className="font-black text-lg">Instructions</h4>
              </div>
              <p className="text-sm text-emerald-100 font-medium leading-relaxed">
                {currentPart.instruction}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-950 p-8 lg:p-16 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-16">
            <div className="flex gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl w-fit mx-auto lg:mx-0">
              {testData.parts.map((part: any, idx: number) => (
                <button
                  key={part.id}
                  onClick={() => setCurrentPartIndex(idx)}
                  className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${
                    currentPartIndex === idx 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" 
                      : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  Part {idx + 1}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white tracking-tight leading-tight">{currentPart.title}</h2>
                  <div className="h-2 w-24 bg-emerald-500 rounded-full"></div>
                </div>

                <div className="space-y-10">
                  {currentPart.questions.map((q: any) => (
                    <div key={q.id} className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-lg hover:border-slate-700 transition-all">
                      <div className="flex items-start gap-6 mb-8">
                        <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-lg border border-slate-700 shadow-inner">
                          {q.id}
                        </span>
                        <div className="flex-1 pt-1">
                          <p className="font-black text-white text-xl leading-tight">
                            {q.label}
                          </p>
                          {q.prompt && (
                            <p className="text-xs text-slate-500 font-black mt-3 uppercase tracking-[0.15em] flex items-center gap-2">
                              <Info className="w-4 h-4 text-emerald-500" />
                              {q.prompt}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="pl-18">
                        {q.type === 'text' ? (
                          <div className="max-w-md relative">
                            <input 
                              type="text" 
                              value={answers[q.id] as string || ''}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              disabled={submitted}
                              className={`w-full px-8 py-5 rounded-2xl border-2 outline-none transition-all font-black text-xl ${
                                submitted 
                                  ? isQuestionCorrect(q.id)
                                    ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                                    : 'bg-rose-900/30 border-rose-500 text-rose-400'
                                  : 'bg-slate-800 border-transparent text-white focus:bg-slate-800 focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/10'
                              }`}
                              placeholder="Type answer..."
                            />
                            {submitted && !isQuestionCorrect(q.id) && (
                              <div className="mt-6 flex items-center gap-4 text-emerald-400 font-bold text-sm bg-emerald-900/30 p-5 rounded-2xl border border-emerald-900/50">
                                <CheckCircle className="w-6 h-6" />
                                <span>Correct Answer: <span className="underline decoration-emerald-500/50 underline-offset-4">{testData.answers[q.id]}</span></span>
                              </div>
                            )}
                          </div>
                        ) : q.type === 'select' ? (
                          <div className="max-w-md">
                            <select
                              value={answers[q.id] as string || ''}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              disabled={submitted}
                              className={`w-full px-8 py-5 rounded-2xl border-2 outline-none transition-all font-black text-xl appearance-none cursor-pointer ${
                                submitted 
                                  ? isQuestionCorrect(q.id)
                                    ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                                    : 'bg-rose-900/30 border-rose-500 text-rose-400'
                                  : 'bg-slate-800 border-transparent text-white focus:bg-slate-800 focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/10'
                              }`}
                            >
                              <option value="">Select option</option>
                              {q.options?.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            {submitted && !isQuestionCorrect(q.id) && (
                              <div className="mt-6 flex items-center gap-4 text-emerald-400 font-bold text-sm bg-emerald-900/30 p-5 rounded-2xl border border-emerald-900/50">
                                <CheckCircle className="w-6 h-6" />
                                <span>Correct Answer: <span className="underline decoration-emerald-500/50 underline-offset-4">{testData.answers[q.id]}</span></span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {q.options?.map((opt: string, optIndex: number) => {
                              const isSelected = answers[q.id] === optIndex;
                              const correctAns = testData.answers[q.id];
                              const isCorrect = correctAns === optIndex;
                              
                              let btnClass = "w-full text-left px-8 py-5 rounded-2xl border-2 font-black transition-all text-xl flex items-center gap-4 ";
                              if (submitted) {
                                if (isCorrect) btnClass += "bg-emerald-900/30 border-emerald-500 text-emerald-400";
                                else if (isSelected) btnClass += "bg-rose-900/30 border-rose-500 text-rose-400";
                                else btnClass += "bg-slate-800 border-transparent opacity-30 text-slate-500";
                              } else {
                                btnClass += isSelected 
                                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-900/40" 
                                  : "bg-slate-800 border-transparent text-slate-300 hover:bg-slate-700 hover:border-slate-600";
                              }

                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => handleAnswerChange(q.id, optIndex)}
                                  disabled={submitted}
                                  className={btnClass}
                                >
                                  <span className={`inline-block w-10 h-10 rounded-xl text-center leading-10 text-sm font-black ${isSelected && !submitted ? 'bg-white/20' : 'bg-slate-900/50 text-slate-400'}`}>
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between pt-12 border-t border-slate-800">
              <button 
                onClick={() => setCurrentPartIndex(prev => Math.max(0, prev - 1))}
                disabled={currentPartIndex === 0}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl font-black hover:bg-slate-800 disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
                Previous
              </button>
              
              <div className="flex items-center gap-3">
                {testData.parts.map((_: any, i: number) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${currentPartIndex === i ? 'bg-emerald-500 w-10' : 'bg-slate-800'} transition-all duration-500`}></div>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPartIndex(prev => Math.min(testData.parts.length - 1, prev + 1))}
                disabled={currentPartIndex === testData.parts.length - 1}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl font-black hover:bg-slate-800 disabled:opacity-20 transition-all"
              >
                Next
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
