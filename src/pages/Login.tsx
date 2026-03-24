import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, OAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const createProfile = async (user: any) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      const email = user.email || '';
      const defaultName = email ? email.split('@')[0] : 'IELTS Student';
      
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: user.displayName || defaultName,
        email: email,
        targetBand: 7.0,
        currentBand: 0,
        studyStreak: 0,
        practiceTime: 0,
        createdAt: serverTimestamp(),
        role: 'user'
      });
    }
  };


  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email yoki parol noto\'g\'ri.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email manzili noto\'g\'ri formatda.');
      } else if (err.code === 'auth/user-disabled') {
        setError('Ushbu foydalanuvchi bloklangan.');
      } else {
        setError('Kirishda xatolik yuz berdi: ' + (err.message || 'Noma\'lum xato'));
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-xl shadow-indigo-900/20 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/50">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a9.993 9.993 0 007.391-3.263M12 11V9a4 4 0 00-4-4H5m11 4v2a4 4 0 004 4h3m-6 0a1 1 0 001-1v-1a1 1 0 00-1-1h-1a1 1 0 00-1 1v1a1 1 0 001 1h1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Xush kelibsiz</h1>
          <p className="text-slate-400 font-medium mt-2">Akkauntingizga kiring</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-900/30 border border-rose-900/50 text-rose-400 text-sm rounded-2xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email manzilingiz"
            className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-800 border-transparent text-white focus:bg-slate-700 focus:border-indigo-600 outline-none transition-all font-bold"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-800 border-transparent text-white focus:bg-slate-700 focus:border-indigo-600 outline-none transition-all font-bold"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>




        <p className="mt-8 text-sm text-slate-400 font-medium">
          Akkauntingiz yo'qmi? <Link to="/register" className="text-indigo-400 font-bold hover:underline">Ro'yxatdan o'tish</Link>
        </p>

        <p className="mt-10 text-xs text-slate-500 font-bold uppercase tracking-widest">
          Secure Authentication by Firebase
        </p>
      </div>
    </div>
  );
}
