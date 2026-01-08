import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Quiz.module.css';

// 🔹 MOCK QUESTIONS DATA
const questionPool = [
  { subject: 'Mathematics', question: 'What is the derivative of x² + 3x + 5?', options: ['2x + 3', 'x² + 3', '2x + 5', 'x + 3'], correctAnswer: 0 },
  { subject: 'Mathematics', question: 'Value of Pi to 2 decimals?', options: ['3.12', '3.14', '3.16', '3.18'], correctAnswer: 1 },
  { subject: 'Mathematics', question: 'Integral of 1/x?', options: ['ln(x)', 'e^x', '1/x^2', 'x'], correctAnswer: 0 },
  { subject: 'Physics', question: 'SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctAnswer: 1 },
  { subject: 'Physics', question: 'Speed of light in vacuum?', options: ['3x10^6', '3x10^7', '3x10^8', '3x10^9'], correctAnswer: 2 },
  { subject: 'Chemistry', question: 'Symbol for Gold?', options: ['Ag', 'Fe', 'Au', 'Cu'], correctAnswer: 2 },
  { subject: 'Chemistry', question: 'pH of pure water?', options: ['5', '6', '7', '8'], correctAnswer: 2 },
  { subject: 'Computer Science', question: 'HTML stands for?', options: ['Hyper Text Markup Language', 'High Tech Modern', 'Hyper Transfer', 'Home Tool'], correctAnswer: 0 },
  { subject: 'Computer Science', question: 'LIFO data structure?', options: ['Queue', 'Stack', 'Array', 'List'], correctAnswer: 1 },
  { subject: 'Data Structures', question: 'Time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correctAnswer: 1 },
  { subject: 'Data Structures', question: 'Which is non-linear?', options: ['Array', 'Stack', 'Tree', 'Queue'], correctAnswer: 2 },
  { subject: 'Algorithms', question: 'Worst case for QuickSort?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correctAnswer: 2 },
  { subject: 'Database Management', question: 'What is a primary key?', options: ['Unique ID', 'Any column', 'Foreign key', 'Duplicate allowed'], correctAnswer: 0 },
  { subject: 'Database Management', question: 'SQL command to remove data?', options: ['DELETE', 'REMOVE', 'CLEAR', 'DROP'], correctAnswer: 0 },
  { subject: 'Web Development', question: 'CSS stands for?', options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'None'], correctAnswer: 1 },
  { subject: 'Web Development', question: 'React is a?', options: ['Database', 'Framework', 'Library', 'Language'], correctAnswer: 2 },
  { subject: 'Networking', question: 'OSI model has how many layers?', options: ['5', '6', '7', '4'], correctAnswer: 2 },
  { subject: 'Networking', question: 'Standard port for HTTP?', options: ['80', '443', '21', '25'], correctAnswer: 0 },
  { subject: 'Machine Learning', question: 'Supervised learning requires?', options: ['Labeled data', 'Unlabeled data', 'No data', 'Reinforcement'], correctAnswer: 0 },
];

const subjectColors = {
  'Mathematics': '#6366f1', 'Physics': '#8b5cf6', 'Chemistry': '#ec4899',
  'Computer Science': '#f59e0b', 'Data Structures': '#10b981', 'Algorithms': '#ef4444',
  'Database Management': '#3b82f6', 'Web Development': '#ec4899', 'Networking': '#6366f1',
  'Machine Learning': '#8b5cf6'
};

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(1);
  const [userStrengths, setUserStrengths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🟢 Prevents double clicks

  // 🔹 ANTI-CHEAT: Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !showResult) {
        alert("⚠️ Cheating Detected! You switched tabs. The quiz will reset immediately.");
        window.location.reload(); 
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [showResult]);

  // 🔹 INITIALIZE QUIZ
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
        navigate('/login');
        return;
    }

    const user = JSON.parse(storedUser);
    const strengths = user.academicStrengths || [];
    setUserStrengths(strengths);

    let filteredQuestions = questionPool.filter(q => strengths.includes(q.subject));

    if (filteredQuestions.length < 10) {
        const remaining = questionPool.filter(q => !strengths.includes(q.subject));
        const needed = 10 - filteredQuestions.length;
        const extra = remaining.sort(() => 0.5 - Math.random()).slice(0, needed);
        filteredQuestions = [...filteredQuestions, ...extra];
    }

    const finalQuestions = filteredQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

    setQuestions(finalQuestions);
    setLoading(false);
  }, [navigate]);

  // 🔹 HELPER FUNCTIONS
  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) correct++;
    });
    return correct;
  };

  // 🔹 SUBMIT LOGIC
  const submitQuiz = async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const score = calculateScore();
      
      try {
          const token = sessionStorage.getItem('token') || localStorage.getItem('token');
          
          // 1. Optimistic Update (Prevent Loop Immediately)
          let currentUser = JSON.parse(sessionStorage.getItem('user')) || {};
          currentUser.quizCompleted = true; // Mark as done immediately locally
          sessionStorage.setItem('user', JSON.stringify(currentUser));

          // 2. Send to Server
          const res = await fetch('http://localhost:5000/api/auth/submit-quiz', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ score: score, totalQuestions: 10 })
          });
          
          const data = await res.json();
          
          // 3. Update with official server data
          if(data.success && data.user) {
              sessionStorage.setItem('user', JSON.stringify(data.user));
              if (localStorage.getItem('user')) {
                  localStorage.setItem('user', JSON.stringify(data.user));
              }
              console.log("Quiz saved successfully. New Reliability:", data.user.reliability);
          }
          
          setShowResult(true);

      } catch (err) {
          console.error("Failed to submit score", err);
          // If server fails, we already updated session storage above, so user is safe.
          setShowResult(true);
      } finally {
          setIsSubmitting(false);
      }
  };

  // 🔹 NAVIGATION HANDLERS
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    // Force hard reload to Dashboard to ensure App Guard reads new session data
    window.location.href = '/dashboard';
  };

  // 🔹 ANIMATION VARIANTS
  const cardVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.8 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0, scale: 0.8 }),
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.3 } }),
  };

  if (loading || questions.length === 0) return <div className={styles.container}>Loading Quiz...</div>;

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  // 🟢 DYNAMICALLY CHECK IF THIS IS THE LAST QUESTION
  const isLastQuestion = currentQuestion === questions.length - 1;

  // 🔹 RENDER RESULT VIEW
  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <DashboardLayout>
        <div className={styles.container}>
          <motion.div className={styles.resultCard} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <motion.div className={styles.resultIcon} initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }}>
              {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
            </motion.div>
            
            <h2 className={styles.resultTitle}>Assessment Complete!</h2>
            
            <div className={styles.scoreCircle}>
               <svg viewBox="0 0 100 100">
                  <circle className={styles.scoreCircleBg} cx="50" cy="50" r="45" />
                  <motion.circle className={styles.scoreCircleProgress} cx="50" cy="50" r="45"
                     initial={{ strokeDashoffset: 283 }}
                     animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
                  />
               </svg>
               <div className={styles.scoreText}>
                  <span className={styles.scoreNumber}>{score}</span>
                  <span className={styles.scoreTotal}>/10</span>
               </div>
            </div>
            
            <p className={styles.resultMessage}>
               Reliability Score Awarded: <strong>{percentage}%</strong>
               <br/>
               Progress saved. Click below to continue.
            </p>

            <motion.button className={styles.finishBtn} onClick={handleFinish} whileHover={{ scale: 1.05 }}>
              Go to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // 🔹 RENDER QUIZ VIEW
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Reliability Assessment</h1>
            <p className={styles.subtitle}>
              Based on your strengths: {userStrengths.join(', ').substring(0, 50)}...
            </p>
          </div>
          <div className={styles.progressSection}>
             <span className={styles.questionCount}>Question {currentQuestion + 1} of 10</span>
             <div className={styles.progressBar}>
                <motion.div className={styles.progressFill} initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>

        <div className={styles.quizArea}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion}
              className={styles.questionCard}
              custom={direction}
              variants={cardVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className={styles.subjectBadge} style={{ backgroundColor: subjectColors[question.subject] || '#666' }}>
                {question.subject}
              </div>

              <h2 className={styles.questionText}>{question.question}</h2>

              <div className={styles.options}>
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    custom={index}
                    variants={optionVariants}
                    initial="hidden" animate="visible"
                    className={`${styles.optionBtn} ${selectedAnswers[currentQuestion] === index ? styles.selected : ''}`}
                    onClick={() => handleSelectAnswer(index)}
                  >
                    <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                    <span className={styles.optionText}>{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className={styles.navigation}>
            <button className={styles.navBtn} onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
            </button>
            
            {/* 🟢 SEPARATE BUTTON LOGIC to fix the "Disabled" issue */}
            {isLastQuestion ? (
                 <button 
                    className={`${styles.navBtn} ${styles.nextBtn}`} 
                    onClick={submitQuiz}
                    /* 🛑 Button enabled if answer selected OR if submitting */
                    disabled={selectedAnswers[currentQuestion] === undefined || isSubmitting}
                 >
                    {isSubmitting ? 'Grading...' : 'Finish & Submit'}
                 </button>
            ) : (
                <button 
                    className={`${styles.navBtn} ${styles.nextBtn}`} 
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestion] === undefined}
                >
                    Next
                </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Quiz;