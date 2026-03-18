import React, { useState, useEffect, useRef } from 'react';
import { calculateBandScore } from '../utils/scoring';
import '../styles/ielts-reading.css';

interface IELTSReadingLayoutProps {
  test: {
    id: string;
    title: string;
    htmlContent: string;
    questionsHtml?: string;
    correctAnswers: string;
  };
  onBack: () => void;
}

export default function IELTSReadingLayout({ test, onBack }: IELTSReadingLayoutProps) {
  const [nightMode, setNightMode] = useState(false);
  const [timeInSeconds, setTimeInSeconds] = useState(3600);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [currentPart, setCurrentPart] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const passageRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeInSeconds > 0) {
      interval = setInterval(() => {
        setTimeInSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeInSeconds]);

  // Effect to handle visibility of parts in the injected HTML
  useEffect(() => {
    if (passageRef.current) {
      const passages = passageRef.current.querySelectorAll('.reading-passage');
      passages.forEach((p: any, i) => {
        if (i + 1 === currentPart) {
          p.classList.remove('ielts-hidden', 'hidden');
        } else {
          p.classList.add('ielts-hidden', 'hidden');
        }
      });
    }
    if (questionsRef.current) {
      const questionSets = questionsRef.current.querySelectorAll('.question-set');
      questionSets.forEach((qs: any, i) => {
        if (i + 1 === currentPart) {
          qs.classList.remove('ielts-hidden', 'hidden');
        } else {
          qs.classList.add('ielts-hidden', 'hidden');
        }
      });
      // Scroll to top when part changes
      questionsRef.current.scrollTop = 0;
    }
  }, [currentPart, test.htmlContent, test.questionsHtml]);

  // Scroll to question when currentQuestion changes
  useEffect(() => {
    if (questionsRef.current) {
      const questionElement = questionsRef.current.querySelector(`[data-q-start="${currentQuestion}"]`);
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentQuestion]);

  // Accessibility: Add ARIA labels to injected inputs
  useEffect(() => {
    if (questionsRef.current) {
      const inputs = questionsRef.current.querySelectorAll('.answer-input');
      inputs.forEach((input: any) => {
        if (!input.getAttribute('aria-label')) {
          const qId = input.getAttribute('id');
          input.setAttribute('aria-label', `Answer for question ${qId?.replace('q', '')}`);
        }
      });
      const radios = questionsRef.current.querySelectorAll('input[type="radio"]');
      radios.forEach((radio: any) => {
        if (!radio.getAttribute('aria-label')) {
          const name = radio.getAttribute('name');
          const value = radio.getAttribute('value');
          radio.setAttribute('aria-label', `Question ${name?.replace('q', '')} option: ${value}`);
        }
      });
    }
  }, [test.questionsHtml, currentPart]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Resizer logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const doDrag = (dragEvent: MouseEvent) => {
      const deltaX = dragEvent.clientX - startX;
      const newWidth = startWidth + (deltaX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUserAnswers(prev => {
        const currentVals = prev[name] ? prev[name].split(',') : [];
        if (checked) {
          return { ...prev, [name]: [...currentVals, value].join(',') };
        } else {
          return { ...prev, [name]: currentVals.filter(v => v !== value).join(',') };
        }
      });
    } else {
      setUserAnswers(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const answers = test.correctAnswers.split(',').reduce((acc, curr) => {
      const [q, a] = curr.split(':');
      acc[`q${q}`] = a;
      return acc;
    }, {} as Record<string, string>);

    let correctCount = 0;
    Object.keys(answers).forEach(qKey => {
      const uAns = (userAnswers[qKey] || '').toLowerCase().trim();
      const cAns = (answers[qKey] || '').toLowerCase().trim();
      
      // Handle multiple possible correct answers (pipe separated in DB)
      const possibleAnswers = cAns.split('|').map(a => a.trim().toLowerCase());
      
      // Handle comma-separated user answers (from checkboxes)
      const userSelected = uAns.split(',').map(a => a.trim().toLowerCase());
      
      // If any of the user's selections match any of the possible answers
      // This is a bit simplified but works for "Choose TWO" if they are separate questions
      // or for single answers with multiple options.
      if (userSelected.some(u => possibleAnswers.includes(u))) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
    setIsTimerRunning(false);
  };

  const isAnswered = (qNum: number) => {
    const ans = userAnswers[`q${qNum}`];
    if (ans && ans.trim() !== '') return true;
    
    // Check for sub-questions like q12a, q12b
    const subAnsA = userAnswers[`q${qNum}a`];
    const subAnsB = userAnswers[`q${qNum}b`];
    if ((subAnsA && subAnsA.trim() !== '') || (subAnsB && subAnsB.trim() !== '')) return true;
    
    return false;
  };

  return (
    <div className="ielts-test-container">
      <header className="ielts-header">
        <div className="ielts-header-left">
          <button onClick={onBack} className="ielts-btn" style={{ marginRight: '10px' }} aria-label="Back to Practice">
            &larr; Back to Practice
          </button>
          <div className="ielts-timer-container">
            <span className="timer-display">{formatTime(timeInSeconds)}</span>
            <div className="ielts-timer-controls">
              <button onClick={() => setIsTimerRunning(!isTimerRunning)} aria-label={isTimerRunning ? "Pause timer" : "Resume timer"}>
                {isTimerRunning ? '⏸' : '▶'}
              </button>
              <button onClick={() => { setTimeInSeconds(3600); setIsTimerRunning(true); }} aria-label="Reset timer">
                🔄
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{test.title}</h2>
        </div>
      </header>

      <main className="ielts-main">
        <div className="ielts-part-header">
          <p><strong>Part {currentPart}</strong> — Reading Passage {currentPart}</p>
        </div>
        
        <div className="ielts-panels">
          <div 
            className="ielts-passage-panel" 
            style={{ flex: `0 0 ${leftWidth}%` }}
            ref={passageRef}
            dangerouslySetInnerHTML={{ __html: test.htmlContent }}
          />

          <div 
            className="ielts-resizer" 
            onMouseDown={handleMouseDown} 
            role="separator" 
            aria-orientation="vertical" 
            aria-label="Resize panels" 
            tabIndex={0}
          />

          <div 
            className="ielts-questions-panel" 
            style={{ flex: 1 }}
            ref={questionsRef}
            onChange={handleInputChange}
            onInput={handleInputChange}
          >
            {isSubmitted && (
              <div className="mb-6 p-6 bg-indigo-900/30 rounded-xl border border-indigo-900/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-indigo-100">Test Completed</h3>
                  <p className="text-indigo-300">You scored {score} out of 40.</p>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-indigo-400 uppercase">Band Score</div>
                  <div className="text-4xl font-black text-indigo-100">{calculateBandScore(score)}</div>
                </div>
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: test.questionsHtml || '' }} />
          </div>
        </div>
      </main>

      <nav className="ielts-nav-row" aria-label="Test navigation">
        {[1, 2, 3].map(part => (
          <div key={part} className={`footer__questionWrapper___1tZ46 ${currentPart === part ? 'selected' : ''}`}>
            <button className="footer__questionNo___3WNct" onClick={() => setCurrentPart(part)} aria-label={`Go to Part ${part}`}>
              <span>Part <strong>{part}</strong></span>
            </button>
            <div className="footer__subquestionWrapper___9GgoP">
              {Array.from({ length: part === 3 ? 14 : 13 }).map((_, i) => {
                const qNum = (part === 1 ? 0 : part === 2 ? 13 : 26) + i + 1;
                return (
                  <button 
                    key={qNum} 
                    className={`subQuestion ${isAnswered(qNum) ? 'answered' : ''} ${currentQuestion === qNum ? 'active' : ''}`}
                    onClick={() => {
                      const part = qNum <= 13 ? 1 : qNum <= 26 ? 2 : 3;
                      setCurrentPart(part);
                      setCurrentQuestion(qNum);
                    }}
                    aria-label={`Go to question ${qNum}`}
                  >
                    {qNum}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        <button 
          className="footer__deliverButton___3FM07" 
          onClick={handleSubmit}
          disabled={isSubmitted}
          aria-label="Check answers"
        >
          ✓ Check Answers
        </button>
      </nav>
    </div>
  );
}
