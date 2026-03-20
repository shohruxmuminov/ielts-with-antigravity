import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const PREMIUM_CODE = '24122010';
const STORAGE_KEY = 'ielts_premium_active';

interface PremiumContextType {
  isPremium: boolean;
  activatePremium: (code: string) => boolean;
  deactivatePremium: () => void;
}

const PremiumContext = createContext<PremiumContextType | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const activatePremium = (code: string): boolean => {
    if (code.trim() === PREMIUM_CODE) {
      setIsPremium(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const deactivatePremium = () => {
    setIsPremium(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PremiumContext.Provider value={{ isPremium, activatePremium, deactivatePremium }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium(): PremiumContextType {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider');
  return ctx;
}
