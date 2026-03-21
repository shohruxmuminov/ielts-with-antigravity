import { useState, useEffect } from 'react';
import { Clock, Crown } from 'lucide-react';
import { usePremium } from '../context/PremiumContext';

export default function PremiumCountdown() {
  const { isPremium, premiumUntil } = usePremium();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!isPremium || !premiumUntil) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = premiumUntil - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(' '));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isPremium, premiumUntil]);

  if (!isPremium) return null;

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-900/20 animate-pulse-slow">
      <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-900/40">
        <Crown className="w-4 h-4" />
      </div>
      <div>
        <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Premium Time Left</p>
        <div className="flex items-center gap-1.5 text-white font-black tracking-tight">
          <Clock className="w-3 h-3 text-amber-400" />
          <span className="text-sm tabular-nums">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}
