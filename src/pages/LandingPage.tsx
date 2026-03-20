import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Instagram, 
  Twitter, 
  Facebook,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../FirebaseProvider';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// --- Components ---

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600"
          animate={{ 
            textShadow: ["0 0 20px rgba(99, 102, 241, 0.3)", "0 0 40px rgba(147, 51, 234, 0.6)", "0 0 20px rgba(99, 102, 241, 0.3)"] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          IELTS BAND 9
        </motion.h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mt-4 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};

const ProfessionalBlur = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -150, 100, 0],
          y: [0, 150, -100, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px]"
      />
      <motion.div
        animate={{
          x: [0, 50, -100, 0],
          y: [0, 100, -50, 0],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[100px]"
      />
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-slate-800 rounded-xl group-hover:rotate-12 transition-all overflow-hidden border border-white/10 shadow-lg shadow-indigo-500/10">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase italic">Antigravity</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Courses', 'Mock Exams', 'Testimonials'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all"
                >
                  Join Now
                </motion.button>
              </Link>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const [text, setText] = useState('');
  const fullText = "Unlock Your Band 8.0+ Potential.";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse Parallax
  const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 40;
    const y = (clientY / innerHeight - 0.5) * 40;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useTransform(mouseY, [-20, 20], [10, -10]);
  const rotateY = useTransform(mouseX, [-20, 20], [-10, 10]);

  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const statsRef = doc(db, 'metadata', 'stats');
        const snap = await getDoc(statsRef);
        if (snap.exists()) {
          setUserCount(snap.data().userCount || 0);
        }
      } catch (error) {
        // Error fetching user count
      }
    };
    fetchUserCount();
  }, []);

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div style={{ y, opacity }} className="z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Next Generation Learning</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6">
            {text}<span className="animate-pulse text-indigo-500">|</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-lg mb-8 leading-relaxed">
            Master Listening, Reading, Writing, and Speaking with AI-driven insights and comprehensive curriculum designed for ambitious students.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg flex items-center gap-2 group transition-all"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <span className="text-white font-bold">{userCount > 0 ? userCount.toLocaleString() : '100+'}</span> students joined already
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ rotateX, rotateY, perspective: 1000 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-8 shadow-2xl transition-all duration-700">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-500 text-[10px] font-bold uppercase tracking-tighter">Live Session</div>
            </div>
            
            <div className="space-y-6">
              <div className="h-4 w-3/4 bg-white/10 rounded-full" />
              <div className="h-4 w-1/2 bg-white/10 rounded-full" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2">
                  <div className="text-3xl font-black text-indigo-500">8.5</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Writing Score</div>
                </div>
                <div className="h-32 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2">
                  <div className="text-3xl font-black text-purple-500">9.0</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Listening Score</div>
                </div>
              </div>
              <div className="h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl" />
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { title: 'Listening', icon: Headphones, color: 'from-blue-500 to-indigo-600', desc: 'Immersive audio sessions with real-time transcription and AI analysis.' },
    { title: 'Reading', icon: BookOpen, color: 'from-emerald-500 to-teal-600', desc: 'Advanced comprehension tools and speed-reading techniques for Band 9.' },
    { title: 'Writing', icon: PenTool, color: 'from-orange-500 to-red-600', desc: 'Instant AI grading with detailed feedback on grammar, task response, and cohesion.' },
    { title: 'Speaking', icon: Mic, color: 'from-purple-500 to-pink-600', desc: 'Live AI conversation partner to improve fluency, pronunciation, and confidence.' },
  ];

  return (
    <section id="courses" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-6"
          >
            Master All <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">4 Modules</span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Our comprehensive platform covers every aspect of the IELTS exam with cutting-edge technology and expert-crafted curriculum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 hover:border-indigo-500/50 transition-all duration-500 overflow-hidden fire-blur-hover"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{f.desc}</p>
              <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </div>
              
              {/* Hover Glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Marquee = () => {
  const scores = [
    { name: "Azizbek", score: "8.5", icon: "🔥" },
    { name: "Malika", score: "8.0", icon: "🚀" },
    { name: "Jasur", score: "7.5", icon: "✨" },
    { name: "Nilufar", score: "8.5", icon: "👑" },
    { name: "Sardor", score: "8.0", icon: "🎯" },
    { name: "Madina", score: "9.0", icon: "💎" },
  ];

  return (
    <div className="py-20 bg-white/5 border-y border-white/10 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...scores, ...scores].map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-12">
            <span className="text-2xl font-black text-white">{s.name}</span>
            <div className="px-3 py-1 rounded-full bg-indigo-500 text-white font-black text-sm">
              Band {s.score} {s.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="pt-32 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl overflow-hidden border border-white/10">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">Antigravity</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              The world's most advanced IELTS preparation platform. Powered by AI, designed for excellence.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: "#6366f1" }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Mock Exams</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">AI Writing Lab</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Speaking Partner</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Study Guides</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Vocabulary Lists</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Get Band 9 tips delivered to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500">© 2026 Antigravity. All rights reserved.</p>
          <div className="flex gap-8 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans selection:bg-indigo-500 selection:text-white scroll-smooth">
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && !user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <ProfessionalBlur />
          <Navbar />
          
          <main>
            <Hero />
            <Marquee />
            <Features />
            
            {/* CTA Section */}
            <section className="py-32 px-6">
              <div className="max-w-5xl mx-auto relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/20 p-12 md:p-20 text-center overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                  >
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                      Ready to Achieve Your <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Dream Band?</span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                      Join thousands of successful students who transformed their future with our AI-powered IELTS platform.
                    </p>
                    <Link to="/register">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99, 102, 241, 0.8)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-5 bg-white text-[#0a0a0a] rounded-2xl font-black text-xl hover:bg-indigo-500 hover:text-white transition-all duration-500"
                      >
                        Start Your Journey Today
                      </motion.button>
                    </Link>
                  </motion.div>
                  
                  {/* Background Accents */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </motion.div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
        html {
          scroll-behavior: smooth;
        }
      `}} />
    </div>
  );
}
