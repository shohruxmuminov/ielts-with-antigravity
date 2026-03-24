import { createContext, useContext, ReactNode } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../FirebaseProvider';

const PREMIUM_CODES: Record<string, number> = {
  '24122010': 7 * 24 * 60 * 60 * 1000,   // 7 days
  '2010': 30 * 24 * 60 * 60 * 1000,      // 30 days
  'Shohrux': 365 * 24 * 60 * 60 * 1000,  // 1 year
};

interface PremiumContextType {
  isPremium: boolean;
  premiumUntil: number;
  activatePremium: (code: string) => Promise<boolean>;
  grantPremium: (days: number) => Promise<boolean>;
  deactivatePremium: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  
  const premiumUntil = profile?.premiumUntil || 0;
  const isPremium = premiumUntil > Date.now();

  const activatePremium = async (code: string): Promise<boolean> => {
    if (!user) return false;

    const duration = PREMIUM_CODES[code.trim()];
    if (duration) {
      const newExpiry = Date.now() + duration;
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          premiumUntil: newExpiry,
          isPremium: true // Keeping boolean for backward compatibility if needed
        });
        return true;
      } catch (error) {
        console.error('Error activating premium:', error);
        return false;
      }
    }
    return false;
  };

  const grantPremium = async (days: number): Promise<boolean> => {
    if (!user) return false;
    const duration = days * 24 * 60 * 60 * 1000;
    const newExpiry = Math.max(premiumUntil, Date.now()) + duration;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        premiumUntil: newExpiry,
        isPremium: true
      });
      return true;
    } catch (error) {
      console.error('Error granting premium:', error);
      return false;
    }
  };

  const deactivatePremium = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        premiumUntil: 0,
        isPremium: false
      });
    } catch (error) {
      console.error('Error deactivating premium:', error);
    }
  };

  return (
    <PremiumContext.Provider value={{ isPremium, premiumUntil, activatePremium, grantPremium, deactivatePremium }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium(): PremiumContextType {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider');
  return ctx;
}
