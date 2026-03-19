import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../FirebaseProvider';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Dashboard() {
  const { profile, loading, user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#05050f]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-indigo-500"
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
      id: 'mock', 
      name: 'Take a Full Mock', 
      path: '/mock-exam', 
      icon: ClipboardList,
      colors: { start: '#ee0979', mid: '#ff6a00', glow: '#ee0979', shadow: 'rgba(238, 9, 121, 0.3)' }
    },
    { 
      id: 'speaking', 
      name: 'Speaking Practice', 
      path: '/speaking', 
      icon: Smartphone,
      colors: { start: '#ff0084', mid: '#33001b', glow: '#ff0084', shadow: 'rgba(255, 0, 132, 0.2)' }
    },
    { 
      id: 'writing', 
      name: 'Writing Practice', 
      path: '/writing', 
      icon: PenTool,
      colors: { start: '#ff9966', mid: '#ff5e62', glow: '#ff9966', shadow: 'rgba(255, 153, 102, 0.3)' }
    },
  ];

  const displayName = profile?.displayName?.split(' ')[0] || 'Student';
  const targetBand = profile?.targetBand || '7.0';

  return (
    <div className="w-full min-h-screen bg-[#05050f] text-white font-sans p-8 lg:p-12 relative overflow-hidden">
      
      {/* Cosmic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[30%] bg-fuchsia-600/10 rounded-full blur-[120px] transform -rotate-45 pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-16">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-xs border border-indigo-500/20 uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {greeting}, IELTS Achiever
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to learn,<br />
              <span className="text-[#a48afd] drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">{displayName}!</span>
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 bg-[#121124]/90 backdrop-blur-xl px-6 py-3 rounded-3xl border border-slate-700/50 shadow-2xl">
              <div className="flex -space-x-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#121124] bg-slate-800 overflow-hidden shadow-md">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="user" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Community</span>
                <span className="text-sm font-black text-white">{totalUsers + 824}+ Students</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#121124]/90 backdrop-blur-xl px-6 py-4 rounded-3xl border border-slate-700/50 shadow-2xl">
               <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)]">
                  <Trophy className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Target Band</p>
                  <p className="text-2xl font-black text-white tracking-tighter">{targetBand}</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* ADVERTISEMENT WIDGET */}
        <div className="w-full flex justify-center py-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl relative rounded-[2.5rem] overflow-hidden border border-indigo-500/20 shadow-[0_0_50px_rgba(0,0,0,1)] group bg-black"
          >
            <div className="w-full flex justify-center relative">
              <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted 
                playsInline
                poster="/ad-banner.jpg"
                className="w-full h-auto max-h-[450px] object-contain block transform group-hover:scale-[1.01] transition-transform duration-700 opacity-90 group-hover:opacity-100"
              >
                <source src="/ad-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Mute/Unmute Overlay */}
              <button 
                onClick={toggleMute}
                className="absolute bottom-6 right-6 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all z-20 group/mute"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-indigo-300" />
                ) : (
                  <Volume2 className="w-5 h-5 text-green-400" />
                )}
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (idx * 0.05), type: 'spring', stiffness: 260, damping: 20 }}
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
                  {React.createElement(feature.icon)}
                </div>
                
                <h3 className="text-lg font-extrabold text-white leading-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[var(--section-color)] transition-all">
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
