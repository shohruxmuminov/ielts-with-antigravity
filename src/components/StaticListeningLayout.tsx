import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface StaticListeningLayoutProps {
  testUrl: string;
  onBack: () => void;
}

const StaticListeningLayout: React.FC<StaticListeningLayoutProps> = ({ testUrl, onBack }) => {
  const [practiceResult, setPracticeResult] = useState<{ score: number; total: number; band: number } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PRACTICE_TEST_RESULT') {
        const result = event.data.result;
        if (result && typeof result.score === 'number' && typeof result.total === 'number') {
          setPracticeResult({
            score: result.score,
            total: result.total,
            band: result.band || 0
          });
          setIsSubmitted(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Top Bar for Navigation */}
      <div className="h-12 bg-slate-900 flex items-center justify-between px-4 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
          <span className="text-white font-black text-sm tracking-tight">IELTS Listening Simulation</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-rose-900/20"
        >
          <X className="w-4 h-4" />
          Exit Test
        </button>
      </div>

      {/* Test Frame */}
      <div className="flex-1 w-full bg-slate-50 relative">
        <iframe 
          src={testUrl} 
          className="w-full h-full border-none"
          title="Listening Test"
          allow="autoplay; fullscreen"
        />

        {/* Results Overlay */}
        {isSubmitted && practiceResult && (
          <div className="absolute inset-0 z-[101] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center space-y-8 transform animate-in zoom-in-95 duration-500">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <span className="text-5xl">🎧</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white italic tracking-tight">LISTENING COMPLETED!</h2>
                <p className="text-slate-400 font-medium">Your results have been calculated based on the official IELTS scoring system.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
                  <div className="text-emerald-400 mb-1 text-xs font-black uppercase tracking-widest">Score</div>
                  <div className="text-3xl font-black text-white">{practiceResult.score} <span className="text-lg text-slate-500 font-bold">/ {practiceResult.total}</span></div>
                </div>
                <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
                  <div className="text-blue-400 mb-1 text-xs font-black uppercase tracking-widest">Band</div>
                  <div className="text-3xl font-black text-white">{practiceResult.band > 0 ? practiceResult.band.toFixed(1) : '-'}</div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group"
                >
                  Review My Answers
                </button>
                <button 
                  onClick={onBack}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-900/20"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaticListeningLayout;
