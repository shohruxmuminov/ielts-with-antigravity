import React, { useState, useEffect } from 'react';
import { X, Trophy, CheckCircle, ArrowRight, BarChart3, Headphones } from 'lucide-react';
import { useAuth } from '../FirebaseProvider';
import { saveTestResult } from '../utils/testTracker';
import { generateTestReport, sendToTelegram } from '../utils/pdfGenerator';

interface StaticListeningLayoutProps {
  testId: string;
  testTitle: string;
  testUrl: string;
  onBack: () => void;
}

interface TestResult {
  score: number;
  total: number;
  band: number;
}

const StaticListeningLayout: React.FC<StaticListeningLayoutProps> = ({ testId, testTitle, testUrl, onBack }) => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'PRACTICE_TEST_RESULT' && event.data.result) {
        const { score, total, band } = event.data.result;
        const testResult = {
          score: typeof score === 'number' ? score : 0,
          total: typeof total === 'number' ? total : 40,
          band: typeof band === 'number' ? band : 0
        };
        setResult(testResult);
        setIsSubmitted(true);

        // Save and Report
        if (user) {
          try {
            await saveTestResult({
              userId: user.uid,
              testId,
              testType: 'listening',
              title: testTitle,
              score: `${testResult.score}/${testResult.total}`,
              band: testResult.band,
            });

            // Send to Telegram
            const pdfBase64 = await generateTestReport(user.displayName || user.email || 'Student', testTitle, {
              listening: { score: `${testResult.score}/${testResult.total}`, band: testResult.band }
            });
            await sendToTelegram(pdfBase64, `${testTitle}_${user.uid}`);
          } catch (err) {
            console.error('Failed to save or report test results:', err);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, testId, testTitle]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Top Bar Navigation */}
      <div className="h-14 bg-slate-900 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Headphones className="text-blue-500 w-5 h-5" />
          <span className="text-white font-black text-sm tracking-tight uppercase">IELTS Listening Simulation</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-lg"
        >
          <X className="w-4 h-4" />
          Exit
        </button>
      </div>

      <div className="flex-1 w-full bg-slate-50 relative">
        <iframe 
          src={testUrl} 
          className="w-full h-full border-none"
          title="Listening Test"
          allow="autoplay; fullscreen"
        />

        {/* Results Overlay */}
        {isSubmitted && result && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center space-y-8 transform animate-in zoom-in-95 duration-500">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center border-2 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  <Trophy className="w-12 h-12 text-blue-500" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white italic tracking-tight uppercase">Test Completed!</h2>
                <p className="text-slate-400 font-medium">Great job on finishing your practice session.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
                  <div className="text-blue-400 mb-1 flex justify-center"><CheckCircle className="w-5 h-5" /></div>
                  <div className="text-2xl font-black text-white">{result.score || 0}/{result.total || 40}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Raw Score</div>
                </div>
                <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
                  <div className="text-emerald-400 mb-1 flex justify-center"><BarChart3 className="w-5 h-5" /></div>
                  <div className="text-2xl font-black text-white">{result.band?.toFixed(1) || '0.0'}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Band</div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group"
                >
                  Review Answers
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onBack}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-900/20"
                >
                  Back to Dashboard
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
