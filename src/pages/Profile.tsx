import React, { useState, useEffect } from 'react';
import { useAuth } from '../FirebaseProvider';
import { User, Mail, Target, Calendar, Clock, BookOpen, Headphones, PenTool, Mic, FileText } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
  const { profile, user, loading } = useAuth();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'results'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(historyData);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-slate-950 text-slate-100 min-h-full">
      <h1 className="text-3xl font-black text-white">Your Profile</h1>

      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-slate-900 p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                <User className="w-12 h-12 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-white">{profile?.displayName || 'User'}</h2>
              <p className="text-slate-400 font-medium">IELTS Candidate</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileItem 
                icon={<Mail className="w-5 h-5 text-slate-500" />} 
                label="Email Address" 
                value={user?.email || 'N/A'} 
              />
              <ProfileItem 
                icon={<Target className="w-5 h-5 text-slate-500" />} 
                label="Target Band" 
                value={profile?.targetBand?.toString() || '7.0'} 
              />
              <ProfileItem 
                icon={<Calendar className="w-5 h-5 text-slate-500" />} 
                label="Joined" 
                value={profile?.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString() : 'Recently'} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-sm p-8">
        <h2 className="text-2xl font-black text-white mb-6">Practice History</h2>
        {history.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No practice tests completed yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-900/30 rounded-lg text-indigo-400">
                    {test.type === 'reading' && <BookOpen className="w-5 h-5" />}
                    {test.type === 'listening' && <Headphones className="w-5 h-5" />}
                    {test.type === 'writing' && <PenTool className="w-5 h-5" />}
                    {test.type === 'speaking' && <Mic className="w-5 h-5" />}
                    {!test.type && <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-white capitalize">{test.type || 'Practice Test'}</p>
                    <p className="text-xs text-slate-500">{test.createdAt?.toDate ? test.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-indigo-400">{test.overallBand || test.score || 'N/A'}</p>
                  <p className="text-xs text-slate-500">Band Score</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
