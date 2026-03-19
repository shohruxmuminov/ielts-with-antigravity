import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, CheckCircle, AlertCircle, BookOpen, Clock, ChevronRight, ArrowLeft, Play, Trophy, Send, Sparkles, Wand2, BookA, Layout, Box, FileText } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { GoogleGenAI, Type } from "@google/genai";
import FullWritingTestLayout from '../components/FullWritingTestLayout';

interface WritingTask {
  id: string;
  title: string;
  type: string;
  data: string;
  createdAt: any;
}

export default function WritingPractice() {
  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<WritingTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState<string | null>(null);

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
          createdAt: { seconds: Date.now() / 1000 }
        }
      ];

      setTasks([...staticTasks, ...tasksData]);
      setLoading(false);
    }, (error) => {
      // Error fetching writing tasks
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Evaluate the following IELTS Writing response for the task: "${selectedTask.title}".
        Task description: ${selectedTask.data}
        User response: ${text}
        
        Provide feedback in JSON format with:
        - band: string (estimated overall band score)
        - grammar: string[] (list of points about grammar and accuracy)
        - vocabulary: string[] (list of points about lexical resource)
        - coherence: string (summary of coherence and cohesion)`,
        config: {
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
      
      const result = JSON.parse(response.text || '{}');
      setFeedback(result);
    } catch (err: any) {
      // Evaluation error
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
    if (selectedTask.id === 'full-writing-test') {
      return <FullWritingTestLayout onBack={handleBack} />;
    }
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="p-3 hover:bg-slate-800 rounded-2xl transition-colors text-slate-400 hover:text-white"
              >
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
          {/* Left Panel: Task & Instructions */}
          <div className="w-full lg:w-[500px] bg-slate-900 border-r border-slate-800 p-8 lg:p-12 sticky top-[73px] h-fit lg:h-[calc(100vh-73px)] overflow-y-auto">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-rose-900/30 text-rose-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-rose-900/50">
                    Writing Task
                  </span>
                </div>
                <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                  {selectedTask.title}
                </h2>
                <div className="h-2 w-24 bg-rose-600 rounded-full"></div>
              </div>

              <div className="p-10 bg-slate-800 rounded-[2.5rem] border border-slate-700 shadow-inner">
                <p className="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedTask.data}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Writing Tips</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Plan your essay for 5 minutes before writing.",
                    "Use a variety of complex sentence structures.",
                    "Ensure clear paragraphing with topic sentences.",
                    "Leave 2-3 minutes at the end for proofreading."
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg">
                      <div className="w-8 h-8 rounded-xl bg-rose-900/30 text-rose-400 flex items-center justify-center font-black text-sm shrink-0 border border-rose-900/50">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-300 font-medium leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Writing Area & Feedback */}
          <div className="flex-1 bg-slate-950 p-8 lg:p-16 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-12">
              <AnimatePresence mode="wait">
                {feedback ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    <div className="bg-slate-900 rounded-[3rem] p-12 border border-slate-800 shadow-2xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
                            <Trophy className="w-9 h-9 text-white" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-white">Evaluation Result</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">Based on IELTS assessment criteria</p>
                          </div>
                        </div>
                        <div className="text-center bg-emerald-900/20 px-10 py-5 rounded-3xl border border-emerald-900/30">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Band Score</p>
                          <p className="text-5xl font-black text-emerald-100 leading-none">{feedback.band}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-8">
                          <div className="p-8 bg-slate-800 rounded-[2rem] border border-slate-700 shadow-inner">
                            <h3 className="font-black text-white text-lg mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                              </div>
                              Grammar & Accuracy
                            </h3>
                            <ul className="space-y-4">
                              {feedback.grammar.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-slate-300 font-medium flex items-start gap-4 leading-relaxed">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-lg shadow-emerald-900/50" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-8 bg-slate-800 rounded-[2rem] border border-slate-700 shadow-inner">
                            <h3 className="font-black text-white text-lg mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
                                <BookOpen className="w-6 h-6 text-blue-400" />
                              </div>
                              Lexical Resource
                            </h3>
                            <ul className="space-y-4">
                              {feedback.vocabulary.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-slate-300 font-medium flex items-start gap-4 leading-relaxed">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 shadow-lg shadow-blue-900/50" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-8">
                          <div className="p-8 bg-slate-800 rounded-[2rem] border border-slate-700 shadow-inner h-full">
                            <h3 className="font-black text-white text-lg mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
                                <AlertCircle className="w-6 h-6 text-amber-400" />
                              </div>
                              Coherence & Cohesion
                            </h3>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                              {feedback.coherence}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setFeedback(null); setText(''); }}
                        className="mt-12 w-full py-5 bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-700 transition-all border border-slate-700 shadow-lg"
                      >
                        Try Another Task
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
                      <div className="p-8 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
                            <PenTool className="w-5 h-5 text-slate-500" />
                          </div>
                          <span className="font-black text-white tracking-tight">Your Response</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${wordCount < 150 ? 'bg-amber-900/30 text-amber-400 border border-amber-900/50' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50'}`}>
                            {wordCount} Words
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 p-4 bg-indigo-950/30 border-b border-indigo-900/30">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mr-4 flex items-center gap-2">
                          <Sparkles className="w-3 h-3"/> AI Co-Pilot
                        </span>
                        <button onClick={() => runCopilot('grammar')} disabled={copilotLoading} className="px-4 py-2 bg-slate-800 text-indigo-300 rounded-xl text-sm font-black border border-slate-700 shadow-sm hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50">
                          {copilotLoading ? <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> : <Wand2 className="w-4 h-4" />} Fix Grammar
                        </button>
                        <button onClick={() => runCopilot('vocabulary')} disabled={copilotLoading} className="px-4 py-2 bg-slate-800 text-indigo-300 rounded-xl text-sm font-black border border-slate-700 shadow-sm hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50">
                          {copilotLoading ? <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> : <BookA className="w-4 h-4" />} Upgrade Vocab
                        </button>
                        <button onClick={() => runCopilot('expand')} disabled={copilotLoading} className="px-4 py-2 bg-slate-800 text-indigo-300 rounded-xl text-sm font-black border border-slate-700 shadow-sm hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50">
                          {copilotLoading ? <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> : <PenTool className="w-4 h-4" />} Expand Ideas
                        </button>
                      </div>
                      <AnimatePresence>
                        {copilotResult && (
                          <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="bg-indigo-900 text-white p-10 border-b border-indigo-800">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 bg-indigo-800 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-indigo-300" />
                              </div>
                              <h4 className="font-black text-indigo-100 text-lg uppercase tracking-tight">AI Suggestion</h4>
                            </div>
                            <p className="text-xl leading-relaxed mb-8 whitespace-pre-wrap text-indigo-50 font-medium">{copilotResult}</p>
                            <div className="flex gap-4">
                              <button onClick={() => { setText(copilotResult); setCopilotResult(null); }} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-500 shadow-lg shadow-emerald-900/40 transition-all">Apply Changes</button>
                              <button onClick={() => setCopilotResult(null)} className="px-8 py-3 bg-white/10 text-white rounded-xl font-black hover:bg-white/20 transition-all">Discard</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Start writing your essay here..."
                        className="w-full h-[600px] p-12 bg-slate-900 outline-none text-xl font-medium text-slate-200 leading-relaxed resize-none placeholder:text-slate-700"
                      />
                    </div>
                    
                    {error && (
                      <div className="p-6 bg-rose-900/20 border border-rose-900/30 rounded-3xl text-rose-400 text-sm font-black flex items-center gap-4">
                        <AlertCircle className="w-6 h-6" />
                        {error}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'task1') return task.type === 'task1';
    if (activeFilter === 'task2') return task.type === 'task2';
    if (activeFilter === 'full') return task.type === 'full';
    return true;
  });

  if (!selectedTask) {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col">
        {/* Redesigned Header */}
        <header className="bg-blue-600 py-12 px-6 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-90"></div>
          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <div className="flex justify-center items-center gap-3">
              <PenTool className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">IELTS Writing Tests</h1>
            </div>
            <p className="text-blue-100 text-lg font-medium max-w-2xl mx-auto">
              Improve your writing with AI-powered feedback on Task 1 and Task 2 essays
            </p>
          </div>
        </header>

        <div className="flex-1 flex max-w-[1400px] mx-auto w-full p-6 lg:p-10 gap-8">
          {/* Sidebar */}
          <aside className="w-72 hidden md:block">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sticky top-10 shadow-xl">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2">Filter Tasks</h2>
              
              <nav className="space-y-1">
                {[
                  { id: 'all', label: 'All Tasks', icon: Layout, count: tasks.length },
                  { id: 'task1', label: 'Writing Task 1', icon: FileText, count: tasks.filter(t => t.type === 'task1').length },
                  { id: 'task2', label: 'Writing Task 2', icon: PenTool, count: tasks.filter(t => t.type === 'task2').length },
                  { id: 'full', label: 'Full Tests', icon: PenTool, count: tasks.filter(t => t.type === 'full').length },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFilter(item.id)}
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
                      {item.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all group flex flex-col h-full">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
                        {task.type === 'task1' ? 'Task 1' : task.type === 'task2' ? 'Task 2' : 'Full Test'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-black text-white leading-snug mb-6 flex-1">
                      {task.title}
                    </h3>
                    
                    <button 
                      onClick={() => handleStartTest(task)}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Start
                    </button>
                  </div>
                </div>
              ))}

              {filteredTasks.length === 0 && (
                <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800">
                  <PenTool className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">No tasks found in this category.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

function FeedbackSection({ title, items, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        {icon} {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item: string, i: number) => (
          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
