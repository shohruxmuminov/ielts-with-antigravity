import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, CheckCircle, AlertCircle, Volume2, Clock, ChevronRight, ArrowLeft, Trophy, Layout, FileText } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { GoogleGenAI, Type } from "@google/genai";
import { ieltsSpeakingMaterials, SpeakingMaterial } from '../data/ieltsSpeakingMaterial';

interface SpeakingTask {
  id: string;
  title: string;
  type: string;
  data: string;
  createdAt: any;
  part?: number;
  sampleAnswer?: string;
  vocabulary?: any[];
  isStatic?: boolean;
}

export default function SpeakingPractice() {
  const [tasks, setTasks] = useState<SpeakingTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<SpeakingTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const q = query(
      collection(db, 'materials'),
      where('type', '==', 'speaking'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isStatic: false
      })) as SpeakingTask[];

      const staticTasks: SpeakingTask[] = ieltsSpeakingMaterials.map(m => ({
        id: m.id,
        title: m.title,
        type: 'speaking',
        data: `<ul class="list-disc pl-5 space-y-2 text-slate-300">
          ${m.questions.map(q => `<li>${q}</li>`).join('')}
        </ul>`,
        createdAt: new Date(),
        part: m.part,
        sampleAnswer: m.sampleAnswer,
        vocabulary: m.vocabulary,
        isStatic: true
      }));

      setTasks([...staticTasks, ...firebaseTasks]);
      setLoading(false);
    }, (error) => {
      // Mock with static data if firebase fails or is empty
      const staticTasks: SpeakingTask[] = ieltsSpeakingMaterials.map(m => ({
        id: m.id,
        title: m.title,
        type: 'speaking',
        data: `<ul class="list-disc pl-5 space-y-2 text-slate-300">
          ${m.questions.map(q => `<li>${q}</li>`).join('')}
        </ul>`,
        createdAt: new Date(),
        part: m.part,
        sampleAnswer: m.sampleAnswer,
        vocabulary: m.vocabulary,
        isStatic: true
      }));
      setTasks(staticTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setFeedback(null);
    } catch (error) {
      // Error accessing microphone
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleEvaluate = async () => {
    if (!audioBlob || !selectedTask) return;
    
    setIsEvaluating(true);
    setFeedback(null);
    
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(audioBlob);
      const base64Audio = await base64Promise;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `Evaluate the following IELTS Speaking response for the task: "${selectedTask.title}".
              Task description: ${selectedTask.data}
              
              Provide feedback in JSON format with:
              - band: string (estimated overall band score)
              - pronunciation: string[] (list of points about pronunciation)
              - fluency: string[] (list of points about fluency and coherence)
              - vocabulary: string[] (list of points about lexical resource)` },
              {
                inlineData: {
                  mimeType: "audio/webm",
                  data: base64Audio
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              band: { type: Type.STRING },
              pronunciation: { type: Type.ARRAY, items: { type: Type.STRING } },
              fluency: { type: Type.ARRAY, items: { type: Type.STRING } },
              vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["band", "pronunciation", "fluency", "vocabulary"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      setFeedback(result);
    } catch (error) {
      // Error evaluating speaking
      alert('Error evaluating speaking. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStartTest = (task: SpeakingTask) => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
    setSelectedTask(task);
    setAudioUrl(null);
    setFeedback(null);
  };

  const handleBack = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    setSelectedTask(null);
    setAudioUrl(null);
    setFeedback(null);
  };
  
  const [activeTab, setActiveTab] = useState<'task' | 'sample' | 'vocab'>('task');

  if (selectedTask) {
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
                <p className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mt-2">Speaking Practice</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-slate-800 rounded-2xl border border-slate-700">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-black text-slate-200">11-14 min</span>
              </div>
              <button 
                onClick={handleEvaluate}
                disabled={isEvaluating || !audioBlob}
                className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Get AI Feedback
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
                  <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-purple-900/50">
                    Speaking Task
                  </span>
                </div>
                <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                  {selectedTask.title}
                </h2>
                <div className="h-2 w-24 bg-purple-600 rounded-full"></div>
              </div>

              <div className="flex gap-2 p-1 bg-slate-800 rounded-2xl border border-slate-700">
                <button 
                  onClick={() => setActiveTab('task')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'task' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <FileText className="w-4 h-4" />
                  Task
                </button>
                <button 
                  onClick={() => setActiveTab('sample')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'sample' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Layout className="w-4 h-4" />
                  Model Answer
                </button>
                <button 
                  onClick={() => setActiveTab('vocab')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'vocab' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Volume2 className="w-4 h-4" />
                  Vocab
                </button>
              </div>

              <div className="p-8 bg-slate-800 rounded-[2.5rem] border border-slate-700 shadow-inner min-h-[300px]">
                {activeTab === 'task' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="prose prose-invert prose-sm max-w-none font-medium text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedTask.data }} />
                  </motion.div>
                )}
                {activeTab === 'sample' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h4 className="text-emerald-400 font-black text-sm uppercase tracking-widest">Band 9.0 Sample Answer</h4>
                    <p className="text-slate-300 leading-relaxed text-sm italic">
                      {selectedTask.sampleAnswer || "Sample answer is being updated for this task. Use the AI feedback to get personalized improvements."}
                    </p>
                  </motion.div>
                )}
                {activeTab === 'vocab' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h4 className="text-blue-400 font-black text-sm uppercase tracking-widest">Useful Vocabulary</h4>
                    {selectedTask.vocabulary ? (
                      <div className="grid grid-cols-1 gap-3">
                        {selectedTask.vocabulary.map((v, i) => (
                          <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex flex-col">
                            <span className="text-white font-bold text-sm">{v.phrase}</span>
                            <span className="text-slate-500 text-xs mt-1">{v.meaning}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">Vocabulary list is being generated...</p>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Speaking Tips</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Speak fluently and avoid long pauses.",
                    "Use a wide range of vocabulary and idioms.",
                    "Extend your answers with reasons and examples.",
                    "Focus on clear pronunciation and intonation."
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg">
                      <div className="w-8 h-8 rounded-xl bg-purple-900/30 text-purple-400 flex items-center justify-center font-black text-sm shrink-0 border border-purple-900/50">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-300 font-medium leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Recording & Feedback */}
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
                          <FeedbackSection title="Pronunciation" items={feedback.pronunciation} icon={<Volume2 className="w-6 h-6 text-blue-400" />} />
                          <FeedbackSection title="Fluency & Coherence" items={feedback.fluency} icon={<CheckCircle className="w-6 h-6 text-emerald-400" />} />
                        </div>
                        <div className="space-y-8">
                          <FeedbackSection title="Lexical Resource" items={feedback.vocabulary} icon={<AlertCircle className="w-6 h-6 text-amber-400" />} />
                        </div>
                      </div>

                      <button 
                        onClick={() => { setFeedback(null); setAudioUrl(null); setAudioBlob(null); }}
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
                    className="flex flex-col items-center justify-center min-h-[500px] space-y-16"
                  >
                    <div className="relative">
                      <AnimatePresence>
                        {isRecording && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.8, opacity: 0.1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-rose-500 rounded-full"
                          />
                        )}
                      </AnimatePresence>
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                          isRecording 
                            ? 'bg-rose-600 hover:bg-rose-700 scale-110 shadow-rose-900/40' 
                            : 'bg-purple-600 hover:bg-purple-700 hover:scale-105 shadow-purple-900/40'
                        }`}
                      >
                        {isRecording ? (
                          <Square className="w-12 h-12 text-white fill-current" />
                        ) : (
                          <Mic className="w-16 h-16 text-white" />
                        )}
                      </button>
                      {isRecording && (
                        <div className="absolute -bottom-16 left-0 right-0 text-center font-mono text-3xl font-black text-rose-500 tracking-wider">
                          {formatTime(recordingTime)}
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-6">
                      <h3 className="text-3xl font-black text-white">
                        {isRecording ? 'Recording in Progress...' : 'Ready to Speak?'}
                      </h3>
                      <p className="text-slate-400 font-medium text-lg">
                        {isRecording ? 'Click the red button to stop recording' : 'Click the microphone to start your response'}
                      </p>
                    </div>

                    {audioUrl && !isRecording && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-lg bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                            <Volume2 className="w-7 h-7 text-slate-500" />
                          </div>
                          <audio src={audioUrl} controls className="flex-1 h-12 accent-purple-500" />
                        </div>
                        <button 
                          onClick={handleEvaluate}
                          disabled={isEvaluating}
                          className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-3 text-lg"
                        >
                          {isEvaluating ? (
                            <>
                              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                              Analyzing Audio...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-6 h-6" />
                              Submit for AI Review
                            </>
                          )}
                        </button>
                      </motion.div>
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
    if (activeFilter === 'part1') return task.part === 1 || task.title.toLowerCase().includes('part 1');
    if (activeFilter === 'part2') return task.part === 2 || task.title.toLowerCase().includes('part 2');
    if (activeFilter === 'part3') return task.part === 3 || task.title.toLowerCase().includes('part 3');
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
              <Mic className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">IELTS Speaking Tests</h1>
            </div>
            <p className="text-blue-100 text-lg font-medium max-w-2xl mx-auto">
              Practice IELTS Speaking Part 1, 2, and 3 with real-time AI feedback
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
                  { id: 'part1', label: 'Speaking Part 1', icon: FileText, count: tasks.filter(t => t.part === 1 || t.title.toLowerCase().includes('part 1')).length },
                  { id: 'part2', label: 'Speaking Part 2', icon: Mic, count: tasks.filter(t => t.part === 2 || t.title.toLowerCase().includes('part 2')).length },
                  { id: 'part3', label: 'Speaking Part 3', icon: Volume2, count: tasks.filter(t => t.part === 3 || t.title.toLowerCase().includes('part 3')).length },
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
                        ✓ Free
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
                  <Mic className="w-12 h-12 text-slate-700 mx-auto mb-4" />
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
    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-inner">
      <h3 className="font-black text-white text-lg mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
          {icon}
        </div>
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item: string, i: number) => (
          <li key={i} className="text-sm text-slate-300 flex items-start gap-4 leading-relaxed">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-lg shadow-indigo-900/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
