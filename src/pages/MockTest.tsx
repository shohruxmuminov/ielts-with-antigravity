import React, { useState, useEffect } from 'react';

export default function MockTest() {
  const [warnings, setWarnings] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(prev => {
          const next = prev + 1;
          if (next >= 4) {
            setMessage('Mock test tugatildi! Siz ko\'p marta boshqa oynaga o\'tdingiz.');
          } else {
            setMessage(`Ogohlantirish ${next}/3. Boshqa oynaga o'tish taqiqlanadi!`);
          }
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const calculateBand = (correct: number) => {
    if (correct >= 39) return 9;
    if (correct >= 37) return 8.5;
    if (correct >= 35) return 8;
    if (correct >= 33) return 7.5;
    if (correct >= 30) return 7;
    if (correct >= 27) return 6.5;
    if (correct >= 23) return 6;
    if (correct >= 19) return 5.5;
    if (correct >= 15) return 5;
    if (correct >= 13) return 4.5;
    if (correct >= 10) return 4;
    if (correct >= 8) return 3.5;
    if (correct >= 6) return 3;
    if (correct >= 4) return 2.5;
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-10 text-slate-100">
      <h1 className="text-4xl font-black mb-6">Mock Test</h1>
      
      {message && (
        <div className="mb-6 p-4 bg-rose-900/30 border border-rose-900/50 text-rose-400 rounded-2xl font-bold">
          {message}
        </div>
      )}

      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl max-w-2xl">
        <p className="text-slate-400 mb-6 text-lg">
          Testni boshlash uchun "Full-screen" tugmasini bosing. Test davomida boshqa oynaga o'tish taqiqlanadi.
        </p>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => document.documentElement.requestFullscreen()} 
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
          >
            Full-screen rejimini yoqish
          </button>
          
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mr-2">Ogohlantirishlar:</span>
            <span className={warnings > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {warnings}/3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
