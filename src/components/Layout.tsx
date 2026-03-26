import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Library, 
  FileText, 
  BarChart3, 
  User, 
  LogOut,
  Crown,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import FocusTimer from './FocusTimer';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../FirebaseProvider';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: '#f97316' },
  { name: 'Reading', path: '/reading', icon: BookOpen, color: '#10b981' },
  { name: 'Listening', path: '/listening', icon: Headphones, color: '#8b5cf6' },
  { name: 'Writing', path: '/writing', icon: PenTool, color: '#f43f5e' },
  { name: 'Speaking', path: '/speaking', icon: Mic, color: '#ec4899' },
  { name: 'Vocabulary', path: '/vocabulary', icon: Library, color: '#06b6d4' },
  { name: 'Mock Exam', path: '/mock-exam', icon: FileText, color: '#3b82f6' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, color: '#fbbf24' },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden transition-colors duration-500">
      
      {/* Premium Floating Sidebar */}
      <aside className="my-6 ml-6 w-20 flex flex-col items-center py-6 z-50 rounded-[2.5rem] bg-[var(--sidebar-bg)] backdrop-blur-3xl border border-[var(--sidebar-border)] shadow-2xl relative">
        
        {/* App Logo/Icon */}
        <div className="mb-8 relative group">
          <div className="w-12 h-12 bg-linear-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/30 group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Global Navigation */}
        <nav className="flex-1 flex flex-col gap-3 w-full px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.name}
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group relative nav-link-premium mx-auto",
                  isActive ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
                style={{ '--section-color': item.color } as React.CSSProperties}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-orange-500 rounded-2xl shadow-lg shadow-orange-900/40"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className={cn("w-6 h-6 relative z-10 transition-transform duration-500 group-hover:scale-110", isActive && "drop-shadow-sm")} />
                
                {/* Tooltip */}
                {!isActive && (
                  <span className="absolute left-20 bg-[var(--sidebar-bg)] backdrop-blur-xl text-[var(--text-primary)] text-[10px] font-bold px-3 py-1.5 rounded-xl border border-[var(--sidebar-border)] opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl uppercase tracking-widest translate-x-2 group-hover:translate-x-0">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-4 mt-auto mb-2 w-full px-3">
          
          <div className="flex justify-center">
            <ThemeToggle />
          </div>

          <Link
            to="/premium"
            title="Premium"
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group relative mx-auto",
              location.pathname === '/premium'
                ? "bg-amber-500 text-white shadow-lg shadow-amber-900/40"
                : "text-amber-500 hover:bg-amber-500/10 border border-amber-500/20"
            )}
          >
            <Crown className="w-6 h-6 relative z-10" />
            <span className="absolute left-20 bg-amber-900/90 text-amber-100 text-[10px] font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 uppercase tracking-widest translate-x-2 group-hover:translate-x-0">
              Premium UI
            </span>
          </Link>

          <Link
            to="/profile"
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group mx-auto",
              location.pathname === '/profile'
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "text-[var(--text-secondary)] hover:bg-[var(--sidebar-border)] hover:text-[var(--text-primary)]"
            )}
          >
            <User className="w-6 h-6" />
          </Link>

          <button 
            onClick={handleLogout}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 mx-auto group"
          >
            <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative p-6">
        {/* High-end Ambient Background Lighting */}
        <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] -z-10" />

        <div className="flex-1 overflow-auto rounded-[2.5rem] bg-[var(--sidebar-bg)] dark:bg-black/10 backdrop-blur-sm border border-[var(--sidebar-border)] p-2 relative">
          <Outlet />
        </div>
      </main>

      <FocusTimer />
    </div>
  );
}
