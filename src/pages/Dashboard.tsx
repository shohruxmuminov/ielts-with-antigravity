import { motion } from 'framer-motion';
import { 
  Headphones, 
  Mic, 
  BookOpen, 
  PenTool, 
  Trophy, 
  ClipboardCheck, 
  Star, 
  Smartphone,
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  Clock,
  Calendar,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../FirebaseProvider';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { profile, loading, user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentScores, setRecentScores] = useState<number[]>([]);
  const [averageScore, setAverageScore] = useState(0);
  const [skillData, setSkillData] = useState<{subject: string, A: number, fullMark: number}[]>([]);
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
        // Fetch total users from metadata/stats
        const statsRef = doc(db, 'metadata', 'stats');
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          setTotalUsers(statsSnap.data().userCount || 0);
        }

        if (user) {
          // Fetch recent mock exam scores
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

          // Calculate skill averages
          if (docs.length > 0) {
            const latest = docs[0].data();
            setSkillData([
              { subject: 'Listening', A: latest.listeningBand || 0, fullMark: 9 },
              { subject: 'Reading', A: latest.readingBand || 0, fullMark: 9 },
              { subject: 'Writing', A: latest.writingBand || 0, fullMark: 9 },
              { subject: 'Speaking', A: latest.speakingBand || 0, fullMark: 9 },
            ]);
          }
        }
      } catch (error) {
        // Error fetching dashboard stats
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-indigo-600"
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
    { id: 'vocabulary', name: 'Vocabulary', icon: <Headphones className="w-6 h-6 text-indigo-400" />, path: '/vocabulary', desc: 'Expand your lexicon', color: 'from-indigo-500/20 to-blue-500/20', blurColor: 'bg-indigo-500/20' },
    { id: 'listening', name: 'Listening', icon: <Mic className="w-6 h-6 text-purple-400" />, path: '/listening', desc: 'Sharpen your ears', color: 'from-purple-500/20 to-fuchsia-500/20', blurColor: 'bg-purple-500/20' },
    { id: 'reading', name: 'Reading', icon: <BookOpen className="w-6 h-6 text-emerald-400" />, path: '/reading', desc: 'Analyze complex texts', color: 'from-emerald-500/20 to-teal-500/20', blurColor: 'bg-emerald-500/20' },
    { id: 'writing', name: 'Writing', icon: <PenTool className="w-6 h-6 text-orange-400" />, path: '/writing', desc: 'Master essay structure', color: 'from-orange-500/20 to-red-500/20', blurColor: 'bg-orange-500/20' },
    { id: 'speaking', name: 'Speaking', icon: <Smartphone className="w-6 h-6 text-pink-400" />, path: '/speaking', desc: 'Speak with confidence', color: 'from-pink-500/20 to-rose-500/20', blurColor: 'bg-pink-500/20' },
    { id: 'mock', name: 'Mock Exam', icon: <ClipboardCheck className="w-6 h-6 text-rose-400" />, path: '/mock-exam', desc: 'Test your limits', color: 'from-rose-500/20 to-red-500/20', blurColor: 'bg-rose-500/20' },
    { id: 'analytics', name: 'Analytics', icon: <TrendingUp className="w-6 h-6 text-sky-400" />, path: '/analytics', desc: 'Track your progress', color: 'from-sky-500/20 to-cyan-500/20', blurColor: 'bg-sky-500/20' },
    { id: 'profile', name: 'Profile', icon: <Star className="w-6 h-6 text-amber-400" />, path: '/profile', desc: 'Manage your account', color: 'from-amber-500/20 to-yellow-500/20', blurColor: 'bg-amber-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 bg-slate-950 text-slate-100 min-h-full relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Top Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10"
      >
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs tracking-widest uppercase mb-2"
          >
            <Sparkles className="w-3 h-3" />
            {greeting}
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-none">
            Ready to learn, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{profile?.displayName?.split(' ')[0] || 'Scholar'}</span>?
          </h1>
          <p className="text-slate-400 text-lg font-medium flex items-center gap-2">
            {averageScore > 0 
              ? <><Zap className="w-5 h-5 text-amber-400" /> Your average band is {averageScore}. Keep the momentum going!</> 
              : "Start your first mock exam to see your progress!"}
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-xl"
        >
          <div className="flex -space-x-3 px-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-md">
                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="px-2 pr-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Community</p>
            <p className="text-sm font-black text-slate-200">{totalUsers}+ Students</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        {/* Main Progress - Large */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-8 bg-gradient-to-br from-slate-900 to-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white flex items-center gap-3">
                  Current Standing
                  <Crown className="w-6 h-6 text-amber-400" />
                </h3>
                <p className="text-slate-400 font-medium">Based on your last {recentScores.length} mock exams</p>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800/50" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 402 }}
                      animate={{ strokeDashoffset: 402 * (1 - (averageScore / 9)) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      cx="72" cy="72" r="64" 
                      stroke="url(#gradient)" strokeWidth="12" strokeLinecap="round"
                      fill="transparent" 
                      strokeDasharray={402} 
                      className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{averageScore || '0.0'}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Band</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Band</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{profile?.targetBand || '7.0'}</p>
                  </div>
                </div>
              </div>
              
              <Link to="/analytics">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(79, 70, 229, 1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  View Detailed Analytics
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
            
            <div className="hidden lg:block relative">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#818cf8" fill="#6366f1" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
              
              <div className="space-y-4 mt-4">
                {skillData.map((skill) => (
                  <div key={skill.subject} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{skill.subject}</span>
                      <span className="text-white font-bold">{skill.A} / {skill.fullMark}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.A / skill.fullMark) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats - Sidebar */}
        <div className="md:col-span-4 grid grid-cols-1 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-1">Study Time</p>
                <h4 className="text-4xl font-black tracking-tight">{formatTime(profile?.practiceTime || 0)}</h4>
              </div>
              <p className="text-indigo-200/80 text-sm font-medium">Total time spent practicing</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-900/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-emerald-200 font-bold text-xs uppercase tracking-widest mb-1">Current Streak</p>
                <h4 className="text-4xl font-black tracking-tight">{profile?.studyStreak || 0} <span className="text-2xl text-emerald-200/80">Days</span></h4>
              </div>
              <p className="text-emerald-200/80 text-sm font-medium">Keep the fire burning! 🔥</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Practice Modules
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-widest rounded-full">Select to start</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + (index * 0.05) }}
            >
              <Link 
                to={feature.path}
                className="group block bg-slate-900/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-800 shadow-lg hover:shadow-xl hover:border-slate-700 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute -inset-4 ${feature.blurColor} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                      {feature.icon}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{feature.name}</h3>
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
