import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { GoogleGenAI, Type } from "@google/genai";
import FullWritingTestLayout from '../components/FullWritingTestLayout';
import StaticWritingLayout from '../components/StaticWritingLayout';
import { PenTool, CheckCircle, AlertCircle, BookOpen, Clock, ArrowLeft, Sparkles, Wand2, BookA, Layout, Play, Bot, Home, FileText, Crown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../context/PremiumContext';

interface WritingTask {
  id: string;
  title: string;
  type: string;
  data: string;
  createdAt: any;
  imageUrl?: string;
  task1Type?: string;
  task2Type?: string;
  isStatic?: boolean;
  isPremium?: boolean;
}

export default function WritingPractice() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<WritingTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');
  const { isPremium } = usePremium();

  const runCopilot = async (action: string) => {
    if (!text.trim()) return;
    setCopilotLoading(true);
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action })
      });
      const data = await res.json();
      setCopilotResult(data.result);
    } catch (e) {
      setError('Failed to run AI Co-Pilot');
    } finally {
      setCopilotLoading(false);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, 'materials'),
      where('type', '==', 'writing'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WritingTask[];
      
      const staticTasks: WritingTask[] = [
        {
          id: 'full-writing-test',
          title: 'Full Writing Practice Test',
          type: 'full',
          data: 'Complete both Task 1 and Task 2 in 60 minutes.',
          task1Type: 'Line Graph',
          task2Type: 'Opinion Essay',
          imageUrl: 'https://engnovatewebsitestorage.blob.core.windows.net/ielts-writing-task-1-images/a6aad123f8d98350',
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'jurabek-writing-1',
          title: 'IELTS with Jurabek - Writing Test',
          type: 'full',
          data: '/writing/IELTSwithJurabek.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'appeared-full-writing-2',
          title: 'APPEARED Full Writing 2',
          type: 'full',
          data: '/writing/APPEARED full writing 2.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'appeared-writing-1',
          title: 'APPEARED Writing 1',
          type: 'full',
          data: '/writing/APPEARED writing 1.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'jurabek-writing-2nd',
          title: 'IELTS with Jurabek 2',
          type: 'full',
          data: '/writing/IELTSwithJurabek2.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'writing-day-1',
          title: 'Writing Day 1',
          type: 'full',
          data: '/writing/writing day 1.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'writing-day-2',
          title: 'Writing Day 2',
          type: 'full',
          data: '/writing/writing day 2.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'writing-practice-27',
          title: 'Writing Practice 27',
          type: 'full',
          data: '/writing/Writing Practice 27.html',
          isStatic: true,
          isPremium: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'writing-practice-set-20',
          title: 'Writing Practice Set 20',
          type: 'full',
          data: '/writing/PracticeSet20.html',
          isStatic: true,
          isPremium: true,
          imageUrl: '/writing/images/practice20_barchart.jpg',
          task1Type: 'Bar Chart',
          task2Type: 'TO WHAT EXTENT DO YOU AGREE OR DISAGREE?',
          createdAt: { seconds: Date.now() / 1000 }
        }
      ];

      setTasks([...staticTasks, ...tasksData]);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error in WritingPractice:", error);
      const staticTasks: WritingTask[] = [
        {
          id: 'full-writing-test',
          title: 'Full Writing Practice Test',
          type: 'full',
          data: 'Complete both Task 1 and Task 2 in 60 minutes.',
          task1Type: 'Line Graph',
          task2Type: 'Opinion Essay',
          imageUrl: 'https://engnovatewebsitestorage.blob.core.windows.net/ielts-writing-task-1-images/a6aad123f8d98350',
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'jurabek-writing-1',
          title: 'IELTS with Jurabek - Writing Test',
          type: 'full',
          data: '/writing/IELTSwithJurabek.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'appeared-full-writing-2',
          title: 'APPEARED Full Writing 2',
          type: 'full',
          data: '/writing/APPEARED full writing 2.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'appeared-writing-1',
          title: 'APPEARED Writing 1',
          type: 'full',
          data: '/writing/APPEARED writing 1.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'jurabek-writing-2nd',
          title: 'IELTS with Jurabek 2',
          type: 'full',
          data: '/writing/IELTSwithJurabek2.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'writing-day-1',
          title: 'Writing Day 1',
          type: 'full',
          data: '/writing/writing day 1.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'writing-day-2',
          title: 'Writing Day 2',
          type: 'full',
          data: '/writing/writing day 2.html',
          isStatic: true,
          createdAt: { seconds: Date.now() / 1000 }
        },
        {
          id: 'writing-practice-27',
          title: 'Writing Practice 27',
          type: 'full',
          data: '/writing/Writing Practice 27.html',
          isStatic: true,
          isPremium: true,
          createdAt: { seconds: Date.now() / 1000 }
        }
      ];
      setTasks(staticTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleEvaluate = async () => {
    if (!selectedTask) return;
    setIsEvaluating(true);
    setFeedback(null);
    setError(null);
    try {
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              band: { type: Type.STRING },
              grammar: { type: Type.ARRAY, items: { type: Type.STRING } },
              vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
              coherence: { type: Type.STRING }
            },
            required: ["band", "grammar", "vocabulary", "coherence"]
          }
        }
      });

      const response = await model.generateContent({
        contents: [{
          parts: [{
            text: `Evaluate the following IELTS Writing response for the task: "${selectedTask.title}".
            Task description: ${selectedTask.data}
            User response: ${text}
            
            Provide feedback in JSON format with:
            - band: string (estimated overall band score)
            - grammar: string[] (list of points about grammar and accuracy)
            - vocabulary: string[] (list of points about lexical resource)
            - coherence: string (summary of coherence and cohesion)`
          }]
        }]
      });
      const responseText = await response.response.text();
      const result = JSON.parse(responseText || '{}');
      setFeedback(result);
    } catch (err: any) {
      setError('An error occurred during evaluation. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStartTest = (task: WritingTask) => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
    setSelectedTask(task);
  };

  const handleBack = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    setSelectedTask(null);
    setFeedback(null);
    setText('');
  };

  if (selectedTask) {
    if (selectedTask.isStatic && selectedTask.data) {
      return (
        <StaticWritingLayout 
          testUrl={selectedTask.data} 
          onBack={handleBack} 
        />
      );
    }
    if (selectedTask.id === 'full-writing-test' || selectedTask.type === 'full') {
      return <FullWritingTestLayout onBack={handleBack} />;
    }
    
    // Single Task Single Evaluation Layout
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="p-3 hover:bg-slate-800 rounded-2xl transition-colors text-slate-400 hover:text-white">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-black text-white leading-none">{selectedTask.title}</h1>
                <p className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] mt-2">Writing Practice</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-slate-800 rounded-2xl border border-slate-700">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-black text-slate-200">60:00</span>
              </div>
              <button 
                onClick={handleEvaluate}
                disabled={isEvaluating || text.trim().length < 50}
                className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-rose-500 transition-all shadow-lg shadow-rose-900/40 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit for AI Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
          <div className="flex-1 lg:max-w-[600px] border-r border-slate-800 bg-slate-900/50 flex flex-col">
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-0.5 shadow-lg shadow-rose-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white">{selectedTask.type === 'task1' ? 'Task 1' : 'Task 2'}</h2>
                </div>

                <div className="bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                  <p className="text-slate-200 text-lg leading-relaxed relative z-10 whitespace-pre-wrap">
                    {selectedTask.data}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[500px] flex flex-col bg-slate-950">
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Writing Area</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm font-bold text-slate-400">
                  <span className="text-slate-200">{wordCount}</span> words
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto">
              {feedback ? (
                <div className="p-8 lg:p-12 space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-rose-500" />
                      AI Evaluation
                    </h2>
                    <div className="w-24 h-24 rounded-full bg-slate-900 flex flex-col items-center justify-center border border-rose-500/30">
                      <span className="text-3xl font-black text-white">{feedback.band}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">Band</span>
                    </div>
                  </div>
                  {/* Additional feedback fields here... */}
                  <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
                    <h3 className="text-blue-400 font-black flex items-center gap-2 mb-4 uppercase tracking-wider text-sm">
                      <Layout className="w-5 h-5" />
                      Coherence & Cohesion
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm bg-slate-950/50 p-6 rounded-2xl">{feedback.coherence}</p>
                  </div>
                </div>
              ) : (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start writing your essay here..."
                  className="w-full h-[600px] p-12 bg-slate-900 outline-none text-xl font-medium text-slate-200 leading-relaxed resize-none placeholder:text-slate-700"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List Layout using the user's requested grid
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Top Main Header */}
      <div className="bg-[#e61e25] dark:bg-rose-700 py-6 px-4 md:px-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3 mb-2">
            <PenTool className="w-8 h-8 fill-white" />
            IELTS Writing Practice
          </h1>
          <p className="text-rose-100 font-medium tracking-wide">Choose a question set to practice</p>
          <div className="absolute bottom-2 right-4 opacity-40 hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-100">
              Received from IELTSwithJurabek and Sanokulov.uz
            </p>
          </div>
        </div>
      </div>

      {/* Sub Header for Stats and Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-rose-100 dark:border-slate-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#e61e25] dark:bg-rose-600 hover:bg-[#d01920] dark:hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" />
              Back Home
            </button>
            <div className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium border-l border-slate-200 dark:border-slate-700 pl-6">
              <Layout className="w-5 h-5" />
              <span>Available Question Sets: <span className="text-[#e61e25] dark:text-rose-500 font-black text-lg">{tasks.length}</span></span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/writing/ai-checker')}
            className="bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Bot className="w-4 h-4" />
            AI Essay Checker
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('free')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'free' ? 'bg-rose-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Free Testlar
          </button>
          <button
            onClick={() => setActiveTab('premium')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'premium' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-amber-600 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/10'
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

        {activeTab === 'premium' && isPremium && (
          tasks.filter(t => t.isPremium).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tasks.filter(t => t.isPremium).map((task) => (
                <div key={task.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-800 flex flex-col">
                  
                  {/* Card Red Header */}
                  <div className={`${task.task1Type ? 'bg-[#e61e25]' : 'bg-amber-500'} p-4 text-white`}>
                    <h3 className="font-bold text-lg leading-tight">{task.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1 opacity-90 text-sm font-medium">
                      <Crown className="w-3.5 h-3.5" />
                      Premium Practice Set
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col relative bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="mb-6 h-[120px] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden p-2">
                       {task.imageUrl ? (
                        <img src={task.imageUrl} alt="Task Image" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-slate-400 dark:text-slate-500 text-sm font-medium flex flex-col items-center">
                          <Crown className="w-8 h-8 mb-2 opacity-50 text-amber-500" />
                          Premium Material
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      {task.task1Type && (
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Task 1:</p>
                          <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded inline-flex items-center gap-1.5 shadow-sm">
                            <Layout className="w-3.5 h-3.5" />
                            {task.task1Type}
                          </div>
                        </div>
                      )}
                      
                      {task.task2Type && (
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Task 2:</p>
                          <div className="bg-[#e61e25] text-white text-xs font-bold px-3 py-1.5 rounded inline-flex items-center gap-1.5 shadow-sm w-full leading-tight text-center justify-center">
                            <PenTool className="w-3.5 h-3.5 flex-shrink-0" />
                            {task.task2Type}
                          </div>
                        </div>
                      )}

                      {!task.task1Type && (
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Type:</p>
                          <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded inline-flex items-center gap-1.5 shadow-sm">
                            <Crown className="w-3.5 h-3.5" />
                            Premium Writing
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Start Button */}
                  <button 
                    onClick={() => handleStartTest(task)}
                    className={`${task.task1Type ? 'bg-[#e61e25] hover:bg-[#d01920]' : 'bg-amber-500 hover:bg-amber-600'} text-white py-3.5 w-full font-bold flex items-center justify-center gap-2 transition-colors border-t ${task.task1Type ? 'border-rose-700/50' : 'border-amber-600/50'}`}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Start Practice
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-amber-500/30">
              <Crown className="w-12 h-12 text-amber-500/50 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Premium writing testlar tez orada qo'shiladi.</p>
            </div>
          )
        )}

        {activeTab === 'free' && (loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-[450px] animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-800 flex flex-col">
                
                {/* Card Red Header */}
                <div className="bg-[#e61e25] dark:bg-rose-600 p-4 text-white">
                  <h3 className="font-bold text-lg leading-tight">{task.title || new Date(task.createdAt?.seconds ? task.createdAt.seconds * 1000 : Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                  <div className="flex items-center gap-1.5 mt-1 opacity-90 text-sm font-medium">
                    <BookOpen className="w-3.5 h-3.5" />
                    Practice Set
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col relative bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="mb-6 h-[120px] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden p-2">
                    {task.imageUrl ? (
                      <img src={task.imageUrl} alt="Task Image" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="text-slate-400 dark:text-slate-500 text-sm font-medium flex flex-col items-center">
                        <FileText className="w-8 h-8 mb-2 opacity-50" />
                        No Image Available
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Task 1:</p>
                      <div className="bg-blue-500 dark:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded inline-flex items-center gap-1.5 shadow-sm">
                        <Layout className="w-3.5 h-3.5" />
                        {task.task1Type || 'Line Graph'}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Task 2:</p>
                      <div className="bg-[#e61e25] dark:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded inline-flex items-center gap-1.5 shadow-sm w-full leading-tight">
                        <PenTool className="w-3.5 h-3.5 flex-shrink-0" />
                        {task.task2Type || 'TO WHAT EXTENT DO YOU AGREE OR DISAGREE?'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Start Button */}
                <button 
                  onClick={() => handleStartTest(task)}
                  className="bg-[#e61e25] hover:bg-[#d01920] dark:bg-rose-600 dark:hover:bg-rose-500 text-white py-3.5 w-full font-bold flex items-center justify-center gap-2 transition-colors border-t border-rose-700/50"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No question sets available</h3>
            <p className="text-slate-500 dark:text-slate-400">Please check back later or add new tests to the database.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
