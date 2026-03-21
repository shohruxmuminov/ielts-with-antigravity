import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ReadingPractice from './pages/ReadingPractice';
import ListeningPractice from './pages/ListeningPractice';
import WritingPractice from './pages/WritingPractice';
import SpeakingPractice from './pages/SpeakingPractice';
import VocabularyTrainer from './pages/VocabularyTrainer';
import Vocabulary from './pages/Vocabulary';
import MockExam from './pages/MockExam';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PremiumPanel from './pages/PremiumPanel';
import PremiumBooks from './pages/PremiumBooks';
import VocabularyBank from './pages/VocabularyBank';
import MatchingGame from './pages/MatchingGame';
import VocabularyQuiz from './pages/VocabularyQuiz';
import TypingPractice from './pages/TypingPractice';
import AiEssayChecker from './pages/AiEssayChecker';

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
          <Route path="/writing/ai-checker" element={<AiEssayChecker />} />
          <Route path="/speaking" element={<SpeakingPractice />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/vocabulary/trainer" element={<VocabularyTrainer />} />
          <Route path="/vocabulary/bank" element={<VocabularyBank />} />
          <Route path="/vocabulary/matching" element={<MatchingGame />} />
          <Route path="/vocabulary/quiz" element={<VocabularyQuiz />} />
          <Route path="/vocabulary/typing" element={<TypingPractice />} />
          <Route path="/mock-exam" element={<MockExam />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/premium" element={<PremiumPanel />} />
          <Route path="/premium-books" element={<PremiumBooks />} />
        </Route>
      </Routes>
    </Router>
  );
}
