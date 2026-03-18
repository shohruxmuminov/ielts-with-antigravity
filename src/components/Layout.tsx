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
  Settings,
  LogOut,
  Trophy,
  Crown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import FocusTimer from './FocusTimer';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Reading', path: '/reading', icon: BookOpen },
  { name: 'Listening', path: '/listening', icon: Headphones },
  { name: 'Writing', path: '/writing', icon: PenTool },
  { name: 'Speaking', path: '/speaking', icon: Mic },
  { name: 'Vocabulary', path: '/vocabulary', icon: Library },
  { name: 'Mock Exam', path: '/mock-exam', icon: FileText },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../FirebaseProvider';
import { useState, useEffect } from 'react';

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
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredNavItems = navItems;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      // Logout error
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Slim Sidebar */}
      <aside className="w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 gap-8 z-50">
        <Link to="/dashboard" className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/50 hover:scale-110 transition-transform">
          <Trophy className="w-6 h-6" />
        </Link>
        
        <div className="w-10 h-px bg-slate-800"></div>

        <nav className="flex-1 flex flex-col gap-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.name}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group relative",
                  isActive 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-900/50" 
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <Icon className="w-6 h-6" />
                {!isActive && (
                  <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-4 mt-auto">
          <Link
            to="/profile"
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              location.pathname === '/profile'
                ? "bg-indigo-900/50 text-indigo-400"
                : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            <User className="w-6 h-6" />
          </Link>
          <button 
            onClick={handleLogout}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-red-900/30 hover:text-red-400 transition-all"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-br from-indigo-900/20 to-transparent -z-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-orange-900/20 to-transparent -z-10 blur-3xl"></div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
      <FocusTimer />
    </div>
  );
}
