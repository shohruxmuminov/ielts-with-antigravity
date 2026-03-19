import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Send, 
  CheckCircle, 
  X, 
  Info, 
  Download,
  Moon,
  Sun,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

interface FullWritingTestLayoutProps {
  onBack: () => void;
}

declare global {
  interface Window {
    jspdf: any;
  }
}

export default function FullWritingTestLayout({ onBack }: FullWritingTestLayoutProps) {
  const [currentPart, setCurrentPart] = useState(1);
  const [timeInSeconds, setTimeInSeconds] = useState(3600);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [task1Content, setTask1Content] = useState('');
  const [task2Content, setTask2Content] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load jsPDF from CDN since npm install failed
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeInSeconds(prev => {
        if (prev <= 0) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  const currentContent = currentPart === 1 ? task1Content : task2Content;
  const wordCount = getWordCount(currentContent);

  const handleAutoSubmit = () => {
    setShowProcessing(true);
    setTimeout(() => {
      generatePDF();
      setShowProcessing(false);
      setShowSuccess(true);
      setIsSubmitted(true);
    }, 2000);
  };

  const onSubmit = () => {
    if (!task1Content.trim() && !task2Content.trim()) {
      alert('Please write your responses before submitting.');
      return;
    }
    if (window.confirm(`Submit your writing test?\nPart 1: ${getWordCount(task1Content)} words\nPart 2: ${getWordCount(task2Content)} words`)) {
      handleAutoSubmit();
    }
  };

  const generatePDF = () => {
    if (!window.jspdf) {
      console.error("jsPDF not loaded yet");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("IELTS Writing Test Report", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${date}`, 20, 35);
    doc.text(`Candidate ID: TEST_USER`, 20, 42);

    // Task 1
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TASK 1", 20, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const q1 = "The graph below shows the information about medical care in three European countries between 1980 and 2000.";
    doc.text(doc.splitTextToSize(q1, 170), 20, 70);
    doc.setFont("helvetica", "bold");
    doc.text(`Word Count: ${getWordCount(task1Content)}`, 20, 85);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(task1Content || "[No response provided]", 170), 20, 95);

    // Task 2
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TASK 2", 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const q2 = "In many countries, people now wear western clothes such as suits and jeans rather than traditional clothing. Is this a positive or negative development?";
    doc.text(doc.splitTextToSize(q2, 170), 20, 30);
    doc.setFont("helvetica", "bold");
    doc.text(`Word Count: ${getWordCount(task2Content)}`, 20, 45);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(task2Content || "[No response provided]", 170), 20, 55);

    doc.save("IELTS_Writing_Test_Result.pdf");
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Header */}
      <header className={`h-16 flex items-center justify-between px-6 border-b z-50 sticky top-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-6">
          <button onClick={onBack} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src="https://d2snzxottmona5.cloudfront.net/releases/3.46.0/images/logo/ielts.svg" alt="IELTS" className="h-6" />
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full font-bold ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeInSeconds)}</span>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-yellow-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-64px-60px)]">
        {/* Left Panel: Question */}
        <div className={`w-full md:w-1/2 overflow-y-auto p-8 border-r ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-200'}`}>
            <h2 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="bg-rose-600 text-white text-xs px-3 py-1 rounded-lg uppercase tracking-wider">Task {currentPart}</span>
              {currentPart === 1 ? 'Report Writing' : 'Essay Writing'}
            </h2>
            <p className="text-sm opacity-80 leading-relaxed">
              {currentPart === 1 
                ? "You should spend about 20 minutes on this task. Write at least 150 words."
                : "You should spend about 40 minutes on this task. Write at least 250 words."}
            </p>
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentPart === 1 ? (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border-l-4 border-rose-600 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                  <p className="font-bold leading-relaxed italic">
                    The graph below shows the information about medical care in three European countries between 1980 and 2000.
                  </p>
                  <p className="mt-4 font-bold text-sm">
                    Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
                  </p>
                </div>
                <div className={`rounded-3xl p-4 border ${isDarkMode ? 'bg-white border-slate-700' : 'bg-white border-slate-200'}`}>
                  <img 
                    src="https://engnovatewebsitestorage.blob.core.windows.net/ielts-writing-task-1-images/a6aad123f8d98350" 
                    alt="IELTS Writing Task 1" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="font-bold text-sm text-slate-500 uppercase tracking-widest">Write about the following topic:</p>
                <div className={`p-8 rounded-2xl border-l-4 border-rose-600 ${isDarkMode ? 'bg-slate-800 text-xl' : 'bg-white shadow-sm text-xl'}`}>
                  <p className="font-bold leading-relaxed italic">
                    In many countries, people now wear western clothes such as suits and jeans rather than traditional clothing.
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white border border-slate-200'}`}>
                  <p className="font-bold">Is this a positive or negative development?</p>
                  <p className="mt-4 text-sm opacity-80">
                    Give reasons for your answer and include any relevant examples from your own knowledge or experience.
                  </p>
                </div>
              </div>
            )}
            
            {/* Tips Section */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <button 
                onClick={() => setShowInstructions(true)}
                className="w-full flex items-center justify-between text-sm font-bold opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  View Test Instructions
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className={`h-12 flex items-center justify-between px-6 border-b text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-4">
              <span className="text-rose-500">Writing Area</span>
              <span className={`px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{wordCount} Words</span>
            </div>
            {currentPart === 1 && wordCount < 150 && <span className="text-amber-500">Target: 150+</span>}
            {currentPart === 2 && wordCount < 250 && <span className="text-amber-500">Target: 250+</span>}
          </div>
          <textarea
            ref={textareaRef}
            value={currentContent}
            onChange={(e) => currentPart === 1 ? setTask1Content(e.target.value) : setTask2Content(e.target.value)}
            disabled={isSubmitted}
            placeholder="Start typing your response here..."
            className={`flex-1 p-8 outline-none resize-none text-lg font-medium leading-relaxed ${isDarkMode ? 'bg-slate-950 text-slate-200 placeholder:text-slate-800' : 'bg-white text-slate-900 placeholder:text-slate-300'}`}
          />
        </div>
      </div>

      {/* Footer Nav */}
      <footer className={`h-16 border-t flex items-stretch z-50 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]'}`}>
        <button 
          onClick={() => setCurrentPart(1)}
          className={`flex-1 flex items-center justify-start px-8 gap-4 font-black transition-all relative ${currentPart === 1 ? (isDarkMode ? 'bg-slate-800' : 'bg-slate-50') : 'opacity-50 hover:opacity-80'}`}
        >
          {currentPart === 1 && <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600"></div>}
          <div className="flex flex-col text-left">
            <span className="text-sm">Part 1</span>
            <span className="text-[10px] opacity-50 uppercase tracking-widest">{getWordCount(task1Content) >= 150 ? 'Completed' : '0 of 1'}</span>
          </div>
          {getWordCount(task1Content) >= 150 && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />}
        </button>
        <div className="w-px bg-slate-200 dark:bg-slate-800"></div>
        <button 
          onClick={() => setCurrentPart(2)}
          className={`flex-1 flex items-center justify-start px-8 gap-4 font-black transition-all relative ${currentPart === 2 ? (isDarkMode ? 'bg-slate-800' : 'bg-slate-50') : 'opacity-50 hover:opacity-80'}`}
        >
          {currentPart === 2 && <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600"></div>}
          <div className="flex flex-col text-left">
            <span className="text-sm">Part 2</span>
            <span className="text-[10px] opacity-50 uppercase tracking-widest">{getWordCount(task2Content) >= 250 ? 'Completed' : '0 of 1'}</span>
          </div>
          {getWordCount(task2Content) >= 250 && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />}
        </button>

        <button 
          onClick={onSubmit}
          disabled={isSubmitted}
          className="w-20 bg-rose-600 text-white flex items-center justify-center hover:bg-rose-500 transition-colors disabled:opacity-50"
        >
          <Send className="w-6 h-6" />
        </button>
      </footer>

      {/* Overlays */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 relative ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-2xl'}`}
            >
              <button 
                onClick={() => setShowInstructions(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-black mb-6">Test Instructions</h3>
              <div className="space-y-6 text-sm leading-relaxed opacity-80">
                <p><strong>Total time:</strong> 60 minutes for both tasks.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Task 1: Spend about 20 minutes, write at least 150 words.</li>
                  <li>Task 2: Spend about 40 minutes, write at least 250 words.</li>
                  <li>Your responses are automatically tracked.</li>
                  <li>Click the send icon to submit and download your report.</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showProcessing && (
          <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center text-center p-12">
            <div className="space-y-6 max-w-md">
              <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h2 className="text-2xl font-black text-white">Processing Submission...</h2>
              <p className="text-slate-400">Your writing test is being analyzed and your report is being generated.</p>
            </div>
          </div>
        )}

        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6">
            <div className={`w-full max-w-sm rounded-[3rem] p-12 text-center space-y-8 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <Download className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black">Test Completed!</h3>
                <p className="text-sm opacity-60">Your PDF report has been downloaded. You can now close this test.</p>
              </div>
              <button 
                onClick={onBack}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-500 transition-all shadow-xl shadow-rose-900/40"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
