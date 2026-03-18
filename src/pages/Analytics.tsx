import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../FirebaseProvider';

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'results'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'asc')
        );
        const snap = await getDocs(q);
        const results = snap.docs.map((doc, index) => {
          const d = doc.data();
          return {
            name: `Test ${index + 1}`,
            reading: d.reading || 0,
            listening: d.listening || 0,
            writing: d.writing || 0,
            speaking: d.speaking || 0,
            overall: d.overallBand || 0
          };
        });
        setData(results);
      } catch (error) {
        // Error fetching analytics data
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const calculateAverages = () => {
    if (data.length === 0) return [];
    const avg = (key: string) => data.reduce((sum, item) => sum + Number(item[key] || 0), 0) / data.length;
    return [
      { subject: 'Listening', A: avg('listening'), fullMark: 9 },
      { subject: 'Reading', A: avg('reading'), fullMark: 9 },
      { subject: 'Writing', A: avg('writing'), fullMark: 9 },
      { subject: 'Speaking', A: avg('speaking'), fullMark: 9 },
    ];
  };

  const radarData = calculateAverages();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Progress Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm h-96">
        <h3 className="text-lg font-bold text-white mb-6">Band Score Trend</h3>
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400">Loading analytics...</div>
        ) : data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <p>No data available yet.</p>
            <p className="text-sm">Complete some mock exams to see your progress!</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis domain={[0, 9]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="reading" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="listening" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="writing" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="speaking" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="overall" stroke="#6366f1" strokeWidth={4} strokeDasharray="5 5" dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
        </div>
        
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">Skill Balance</h3>
          <p className="text-sm text-slate-400 mb-4">Your average performance across all modules</p>
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>
          ) : data.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">No data</div>
          ) : (
            <div className="flex-1 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 9]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar name="Average Score" dataKey="A" stroke="#6366f1" fill="#818cf8" fillOpacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
