import React from 'react';
import { X } from 'lucide-react';

interface StaticReadingLayoutProps {
  testUrl: string;
  onBack: () => void;
}

const StaticReadingLayout: React.FC<StaticReadingLayoutProps> = ({ testUrl, onBack }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Top Bar for Navigation */}
      <div className="h-12 bg-blue-900 flex items-center justify-between px-4 border-b border-blue-700 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
          <span className="text-white font-black text-sm tracking-tight">IELTS Reading Simulation</span>
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
          title="Reading Test"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};

export default StaticReadingLayout;
