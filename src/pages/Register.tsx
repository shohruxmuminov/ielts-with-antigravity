import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, OAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const createProfile = async (user: any, name: string) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      const email = user.email || '';
      const defaultName = email ? email.split('@')[0] : 'IELTS Student';
      
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: name || user.displayName || defaultName,
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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      await createProfile(result.user, displayName);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu email manzili allaqachon ro\'yxatdan o\'tgan.');
      } else if (err.code === 'auth/weak-password') {
        setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email manzili noto\'g\'ri formatda.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Parol orqali ro\'yxatdan o\'tish o\'chirilgan. Iltimos, administrator bilan bog\'laning.');
      } else {
        setError('Xatolik yuz berdi: ' + (err.message || 'Noma\'lum xato'));
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Ro'yxatdan o'tish</h1>
          <p className="text-slate-400 font-medium mt-2">Bugun platformamizga qo'shiling</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-900/30 border border-rose-900/50 text-rose-400 text-sm rounded-2xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4 mb-6">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="To'liq ismingiz"
            className="w-full px-6 py-4 rounded-2xl bg-slate-800 border-transparent text-white focus:bg-slate-700 focus:border-indigo-600 outline-none transition-all font-bold"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email manzilingiz"
            className="w-full px-6 py-4 rounded-2xl bg-slate-800 border-transparent text-white focus:bg-slate-700 focus:border-indigo-600 outline-none transition-all font-bold"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            className="w-full px-6 py-4 rounded-2xl bg-slate-800 border-transparent text-white focus:bg-slate-700 focus:border-indigo-600 outline-none transition-all font-bold"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>




        <p className="mt-8 text-sm text-slate-400 font-medium">
          Akkauntingiz bormi? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Kirish</Link>
        </p>

        <p className="mt-10 text-xs text-slate-500 font-bold uppercase tracking-widest">
          Secure Authentication by Firebase
        </p>
      </div>
    </div>
  );
}
