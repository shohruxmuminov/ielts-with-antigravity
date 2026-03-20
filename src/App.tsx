import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ReadingPractice from './pages/ReadingPractice';
import ListeningPractice from './pages/ListeningPractice';
import WritingPractice from './pages/WritingPractice';
import SpeakingPractice from './pages/SpeakingPractice';
import VocabularyTrainer from './pages/VocabularyTrainer';
import MockExam from './pages/MockExam';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PremiumPanel from './pages/PremiumPanel';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reading" element={<ReadingPractice />} />
          <Route path="/listening" element={<ListeningPractice />} />
          <Route path="/writing" element={<WritingPractice />} />
          <Route path="/speaking" element={<SpeakingPractice />} />
          <Route path="/vocabulary" element={<VocabularyTrainer />} />
          <Route path="/mock-exam" element={<MockExam />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/premium" element={<PremiumPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}
