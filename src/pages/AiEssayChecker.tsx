import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bot, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Layout, 
  PenTool, 
  BookOpen, 
  History, 
  Crown, 
  Lightbulb,
  Trash2,
  Send,
  Loader2,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { usePremium } from '../context/PremiumContext';

interface GrammarIssue {
  original: string;
  corrected: string;
  explanation: string;
}

interface VocabularyIssue {
  weak_wording: string;
  better_option: string;
  explanation: string;
}

interface EvaluationResult {
  overall_band: number;
  scores: {
    task_response: number;
    coherence_and_cohesion: number;
    lexical_resource: number;
    grammatical_range_and_accuracy: number;
  };
  grammar_issues: GrammarIssue[];
  vocabulary_issues: VocabularyIssue[];
  advice: string[];
  improved_essay: string;
}

export default function AiEssayChecker() {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [text, setText] = useState('');
  const [taskType, setTaskType] = useState<'Task 1' | 'Task 2'>('Task 2');
  const [prompt, setPrompt] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleEvaluate = async () => {
    if (wordCount < 50) {
      setError('Please write at least 50 words for a meaningful evaluation.');
      return;
    }

    setIsEvaluating(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('taskType', taskType);
      formData.append('prompt', prompt || `General IELTS Writing ${taskType}`);
      if (taskType === 'Task 1' && image) {
        formData.append('image', image);
      }

      const response = await fetch('/api/evaluate/writing', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        let errorMessage = 'Failed to evaluate essay';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = `Server Error (${response.status}): The API endpoint is unreachable or misconfigured.`;
          }
        } catch (e) {
          // Fallback if parsing fails
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
         throw new Error('Server returned an invalid response format instead of JSON data.');
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear your essay?')) {
      setText('');
      setResult(null);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/writing')}
              className="p-2.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white leading-tight">AI Essay Checker</h1>
                <p className="text-[10px] uppercase tracking-widest font-black text-rose-500">IELTS Writing Expert</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className={`w-2 h-2 rounded-full ${wordCount >= 250 ? 'bg-emerald-500' : wordCount >= 150 ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
                <span className="text-sm font-bold text-slate-300">{wordCount} Words</span>
             </div>
             {!isPremium && (
               <button className="flex items-center gap-2 text-amber-500 font-bold text-sm px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                 <Crown className="w-4 h-4" />
                 Premium Feature
               </button>
             )}
          </div>
          <div className="absolute bottom-2 right-6 opacity-30 hidden lg:block text-slate-500">
            <p className="text-[9px] font-black uppercase tracking-widest ">
              Received from IELTSwithJurabek and Sanokulov.uz
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Input Section */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700/50 text-slate-500">
                  <PenTool className="w-5 h-5" />
                </div>
              </div>

              <div className="mb-8">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 block">Select Task Type</label>
                <div className="flex gap-3">
                  {(['Task 1', 'Task 2'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTaskType(t)}
                      className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border ${
                        taskType === t 
                          ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/20' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                {taskType === 'Task 1' ? (
                  <>
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 block">Upload Task 1 Image (Graph/Chart/Map)</label>
                    {!imagePreview ? (
                      <div className="relative group">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={onImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 group-hover:border-rose-500/50 transition-all">
                          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-rose-500 transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-300">Click or drag image to upload</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-4">
                        <img 
                          src={imagePreview} 
                          alt="Task 1 Preview" 
                          className="w-full h-48 object-contain rounded-2xl"
                        />
                        <button 
                          onClick={removeImage}
                          className="absolute top-6 right-6 p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute inset-x-4 bottom-4 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 flex items-center gap-3">
                          <ImageIcon className="w-4 h-4 text-rose-500" />
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">{image?.name}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 block">Question / Topic</label>
                    <input 
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Paste the writing prompt here..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-rose-500 transition-colors text-slate-200"
                    />
                  </>
                )}
              </div>

              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 block">Your Essay</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your essay here..."
                  className="w-full h-[400px] bg-slate-950 border border-slate-800 rounded-[2rem] p-8 outline-none focus:border-rose-500 transition-colors text-slate-200 text-lg leading-relaxed resize-none custom-scrollbar"
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button 
                  onClick={clearAll}
                  className="flex items-center gap-2 text-slate-500 hover:text-rose-400 font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
                <button 
                  onClick={handleEvaluate}
                  disabled={isEvaluating || wordCount < 50}
                  className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-rose-900/30"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Check Essay
                    </>
                  )}
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm font-bold"
                >
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5 relative">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sticky top-28"
                >
                   {/* Band Score Card */}
                   <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2.5rem] border border-slate-800 p-8 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-rose-500/5 blur-[80px] rounded-full translate-y-1/2"></div>
                      <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Overall Band Score</h3>
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-slate-800"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (result.overall_band / 9) * 364.4}
                            className="text-rose-500"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-4xl font-black text-white">{result.overall_band}</span>
                      </div>
                      
                      {/* Sub-scores */}
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Task Response</p>
                          <p className="text-xl font-black text-white">{result.scores.task_response}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Coherence</p>
                          <p className="text-xl font-black text-white">{result.scores.coherence_and_cohesion}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Vocabulary</p>
                          <p className="text-xl font-black text-white">{result.scores.lexical_resource}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Grammar</p>
                          <p className="text-xl font-black text-white">{result.scores.grammatical_range_and_accuracy}</p>
                        </div>
                      </div>
                   </div>

                   {/* Categorized Feedback */}
                   <div className="grid grid-cols-1 gap-4">
                      {/* Grammar Issues */}
                      <div className="bg-slate-900/50 rounded-[2rem] border border-slate-800 p-6">
                        <h4 className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-widest mb-4">
                          <CheckCircle className="w-4 h-4" /> Grammar Corrections
                        </h4>
                        <div className="space-y-4">
                          {result.grammar_issues?.length > 0 ? result.grammar_issues.map((issue, i) => (
                            <div key={i} className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                              <p className="line-through text-rose-400 text-sm mb-1">{issue.original}</p>
                              <p className="text-emerald-400 font-bold mb-2">{issue.corrected}</p>
                              <p className="text-xs text-slate-500">{issue.explanation}</p>
                            </div>
                          )) : (
                            <p className="text-sm text-slate-500 italic">No major grammatical errors found. Great job!</p>
                          )}
                        </div>
                      </div>

                      {/* Vocabulary Issues */}
                      <div className="bg-slate-900/50 rounded-[2rem] border border-slate-800 p-6">
                        <h4 className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest mb-4">
                          <BookOpen className="w-4 h-4" /> Vocabulary Enhancement
                        </h4>
                        <div className="space-y-4">
                          {result.vocabulary_issues?.length > 0 ? result.vocabulary_issues.map((issue, i) => (
                            <div key={i} className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                              <p className="text-slate-400 text-sm mb-1">Weak: <span className="text-rose-400 italic">{issue.weak_wording}</span></p>
                              <p className="text-blue-400 font-bold mb-2">Better: {issue.better_option}</p>
                              <p className="text-xs text-slate-500">{issue.explanation}</p>
                            </div>
                          )) : (
                            <p className="text-sm text-slate-500 italic">Excellent vocabulary usage throughout the essay.</p>
                          )}
                        </div>
                      </div>

                      {/* General Advice */}
                      <div className="bg-emerald-500/5 rounded-[2rem] border border-emerald-500/20 p-6">
                        <h4 className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">
                          <Lightbulb className="w-4 h-4" /> Key Improvements & Advice
                        </h4>
                        <ul className="space-y-3">
                          {result.advice.map((item, i) => (
                            <li key={i} className="text-sm text-slate-300 flex gap-3 leading-relaxed">
                              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] text-emerald-400 font-black">{i+1}</span>
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Improved Essay Version */}
                      <div className="bg-amber-500/5 rounded-[2rem] border border-amber-500/20 p-6">
                        <h4 className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest mb-4">
                          <Sparkles className="w-4 h-4" /> Rewritten Stronger Version
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                          {result.improved_essay}
                        </p>
                      </div>
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800/50 min-h-[600px]"
                >
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800">
                    <History className="w-10 h-10 text-rose-500/30" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-600 mb-2">Awaiting Analysis</h3>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto">
                    Submit your essay to receive a detailed band score and feedback from our Gemini-powered AI examiner.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
