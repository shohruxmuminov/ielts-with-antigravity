import { useNavigate } from 'react-router-dom';
import FullWritingTestLayout from '../components/FullWritingTestLayout';

export default function WritingPractice() {
  const navigate = useNavigate();

  return <FullWritingTestLayout onBack={() => navigate('/dashboard')} />;
}
