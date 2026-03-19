import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  ChevronRight,
  Clock,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../FirebaseProvider';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Dashboard() {
  const { profile, loading, user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentScores, setRecentScores] = useState<number[]>([]);
  const [averageScore, setAverageScore] = useState(0);
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

        if (user) {
          const resultsRef = collection(db, 'results');
          const q = query(
            resultsRef, 
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(5)
          );
          const resultsSnap = await getDocs(q);
          const docs = resultsSnap.docs;
          const scores = docs.map(doc => doc.data().overallBand || 0);
          setRecentScores(scores);
          
          if (scores.length > 0) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            setAverageScore(Number(avg.toFixed(1)));
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#080710]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-indigo-500"
        />
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const features = [
    { id: 'vocabulary', name: 'Vocabulary', path: '/vocabulary', desc: 'Expand your lexicon', color: 'from-indigo-500/20 to-blue-500/20', blurColor: 'bg-indigo-500/20' },
    { id: 'listening', name: 'Listening', path: '/listening', desc: 'Sharpen your ears', color: 'from-purple-500/20 to-fuchsia-500/20', blurColor: 'bg-purple-500/20' },
    { id: 'reading', name: 'Reading', path: '/reading', desc: 'Analyze complex texts', color: 'from-emerald-500/20 to-teal-500/20', blurColor: 'bg-emerald-500/20' },
    { id: 'writing', name: 'Writing', path: '/writing', desc: 'Master essay structure', color: 'from-orange-500/20 to-red-500/20', blurColor: 'bg-orange-500/20' },
    { id: 'speaking', name: 'Speaking', path: '/speaking', desc: 'Speak with confidence', color: 'from-pink-500/20 to-rose-500/20', blurColor: 'bg-pink-500/20' },
    { id: 'mock', name: 'Mock Exam', path: '/mock-exam', desc: 'Test your limits', color: 'from-rose-500/20 to-red-500/20', blurColor: 'bg-rose-500/20' },
  ];

  const displayName = profile?.displayName?.split(' ')[0] || 'Student';
  const targetBand = profile?.targetBand || '7.0';
  const displayBand = averageScore > 0 ? averageScore.toFixed(1) : '0.0';

  return (
    <div className="w-full min-h-full bg-[#05050f] text-slate-100 font-sans p-8 lg:p-12 relative overflow-hidden flex flex-col justify-center">
      
      {/* Cosmic Background Nebulas */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[30%] bg-fuchsia-600/10 rounded-full blur-[120px] transform -rotate-45 pointer-events-none" />
      
      {/* Light Streak Overlays */}
      <div className="absolute top-[10%] right-[20%] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent transform rotate-12 blur-[2px] pointer-events-none" />
      <div className="absolute top-[15%] right-[15%] w-[80%] h-[2px] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent transform rotate-[15deg] blur-[4px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[40px] bg-gradient-to-t from-indigo-900/30 to-transparent blur-xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-10">
        
        {/* TOP HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#11112b]/80 border border-indigo-500/30 text-indigo-300/80 font-bold text-[10px] tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {greeting}
            </div>
            
            <div className="space-y-1">
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
                Ready to learn, <span className="text-[#a48afd] drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">{displayName}?</span>
              </h1>
              <p className="text-slate-400/90 text-lg font-medium tracking-wide">
                Start your next mock exam to see your progress!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 bg-[#121124]/90 backdrop-blur-xl px-5 py-3 rounded-full border border-slate-700/50 shadow-2xl">
            <div className="flex -space-x-4">
              {[1,2,3].map(i => (
                <div key={i} className="w-11 h-11 rounded-full border-2 border-[#121124] bg-slate-800 overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="user" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Community</span>
              <span className="text-sm font-black text-white">{totalUsers + 824}+ Students</span>
            </div>
          </div>
        </motion.div>

        {/* ADVERTISEMENT WIDGET */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full relative rounded-[2.5rem] overflow-hidden border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.15)] group bg-[#050510]"
        >
          {/* Main Advertisement Image - Using h-auto to ensure full visibility without cropping */}
          <div className="w-full overflow-hidden">
            <img 
              src="/ad-banner.jpg" 
              alt="Ace Your IELTS Exam - Start Practicing with Us Today!" 
              className="w-full h-auto block transform group-hover:scale-[1.01] transition-transform duration-700"
            />
          </div>

          {/* Slight gradient overlay for better blending with dark mode */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#05050f] via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* PRACTICE MODULES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (index * 0.05) }}
            >
              <Link 
                to={feature.path}
                className="group block bg-[#12112e]/80 backdrop-blur-md rounded-[2rem] p-8 border border-slate-700/40 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-slate-500/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute -inset-4 ${feature.blurColor} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                      <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{feature.name}</h3>
                    <p className="text-slate-400 font-medium text-sm group-hover:text-slate-300 transition-colors">{feature.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
