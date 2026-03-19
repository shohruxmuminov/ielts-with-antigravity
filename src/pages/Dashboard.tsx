import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  ChevronRight,
  Headphones,
  Mic2,
  BookOpen,
  PenTool,
  ClipboardList,
  Star,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../FirebaseProvider';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Dashboard() {
  const { profile, loading, user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRef = doc(db, 'metadata', 'stats');
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          setTotalUsers(statsSnap.data().userCount || 0);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  const features = [
    { 
      id: 'vocabulary', 
      name: 'Learn Vocabulary', 
      path: '/vocabulary', 
      icon: Headphones,
      colors: { start: '#00d2ff', mid: '#3a7bd5', glow: '#00d2ff', shadow: 'rgba(0, 210, 255, 0.3)' }
    },
    { 
      id: 'listening', 
      name: 'Listening Practice', 
      path: '/listening', 
      icon: Mic2,
      colors: { start: '#9d50bb', mid: '#6e48aa', glow: '#9d50bb', shadow: 'rgba(157, 80, 187, 0.3)' }
    },
    { 
      id: 'reading', 
      name: 'Reading Practice', 
      path: '/reading', 
      icon: BookOpen,
      colors: { start: '#00b09b', mid: '#96c93d', glow: '#00b09b', shadow: 'rgba(0, 176, 155, 0.3)' }
    },
    { 
      id: 'writing', 
      name: 'Writing Practice', 
      path: '/writing', 
      icon: PenTool,
      colors: { start: '#ff9966', mid: '#ff5e62', glow: '#ff9966', shadow: 'rgba(255, 153, 102, 0.3)' }
    },
    { 
      id: 'samples', 
      name: 'Band 9.0 Samples', 
      path: '/samples', 
      icon: Trophy,
      colors: { start: '#f7971e', mid: '#ffd200', glow: '#f7971e', shadow: 'rgba(247, 151, 30, 0.3)' }
    },
    { 
      id: 'mock', 
      name: 'Take a Full Mock', 
      path: '/mock-exam', 
      icon: ClipboardList,
      colors: { start: '#ee0979', mid: '#ff6a00', glow: '#ee0979', shadow: 'rgba(238, 9, 121, 0.3)' }
    },
    { 
      id: 'materials', 
      name: 'Special Materials', 
      path: '/special-materials', 
      icon: Star,
      colors: { start: '#2193b0', mid: '#6dd5ed', glow: '#2193b0', shadow: 'rgba(33, 147, 176, 0.3)' }
    },
    { 
      id: 'speaking', 
      name: 'Speaking Practice', 
      path: '/speaking', 
      icon: Smartphone,
      colors: { start: '#ff0084', mid: '#33001b', glow: '#ff0084', shadow: 'rgba(255, 0, 132, 0.2)' }
    },
  ];

  const displayName = profile?.displayName?.split(' ')[0] || 'Student';
  const targetBand = profile?.targetBand || '7.0';

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans p-8 lg:p-12 relative overflow-hidden">
      
      {/* Decorative Overlays */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-16">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs border border-blue-100 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              {greeting}, IELTS Achiever
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Ready to learn,<br />
              <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">{displayName}!</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
             <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)]">
                <Trophy className="w-6 h-6" />
             </div>
             <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Target Band</p>
                <p className="text-2xl font-black text-slate-800 tracking-tighter">{targetBand}</p>
             </div>
          </div>
        </motion.div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Link 
                to={feature.path}
                className="clean-card group"
                style={{
                  '--section-color': feature.colors.glow,
                  '--gradient-start': feature.colors.start,
                  '--gradient-end': feature.colors.mid,
                  '--shadow-color': feature.colors.shadow,
                } as React.CSSProperties}
              >
                <div className="icon-squircle group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <feature.icon />
                </div>
                
                <h3 className="text-lg font-extrabold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
