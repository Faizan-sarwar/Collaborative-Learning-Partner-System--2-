import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Quiz.module.css';

// 🟢 IMPORT THE QUESTION BANK
import QUESTION_BANK from './questionBank'; 

// 🟢 UPDATED COLORS
const subjectColors = {
  'Web Development': '#ec4899',
  'DSA': '#10b981',
  'Object Oriented Programming': '#6366f1',
  'Computer Networks': '#8b5cf6',
  'Database Management': '#f59e0b',
  'Cyber Security': '#ef4444',
  'Artificial Intelligence': '#3b82f6'
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 ANTI-CHEAT
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

    let filteredQuestions = QUESTION_BANK.filter(q => strengths.includes(q.category));

    if (filteredQuestions.length < 10) {
        const remaining = QUESTION_BANK.filter(q => !strengths.includes(q.category));
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
      const selectedIndex = selectedAnswers[index];
      if (selectedIndex !== undefined) {
          const selectedOptionText = q.options[selectedIndex];
          if (selectedOptionText === q.answer) correct++;
      }
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
          
          let currentUser = JSON.parse(sessionStorage.getItem('user')) || {};
          currentUser.quizCompleted = true; 
          sessionStorage.setItem('user', JSON.stringify(currentUser));

          const res = await fetch('http://localhost:5000/api/auth/submit-quiz', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ score: score, totalQuestions: 10 })
          });
          
          const data = await res.json();
          
          if(data.success && data.user) {
              sessionStorage.setItem('user', JSON.stringify(data.user));
              if (localStorage.getItem('user')) {
                  localStorage.setItem('user', JSON.stringify(data.user));
              }
          }
          
          setShowResult(true);

      } catch (err) {
          console.error("Failed to submit score", err);
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
  const isLastQuestion = currentQuestion === questions.length - 1;

  // 🔹 RENDER RESULT VIEW (SIDEBAR SHOWN)
  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      // 🟢 hideSidebar is false (default) here, so sidebar appears
      <DashboardLayout title="Results">
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

  // 🔹 RENDER QUIZ VIEW (SIDEBAR HIDDEN)
  return (
    // 🟢 hideSidebar={true} hides the sidebar during the quiz
    <DashboardLayout hideSidebar={true}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Reliability Assessment</h1>
            <p className={styles.subtitle}>
              Targeting: {question.category}
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
              <div className={styles.subjectBadge} style={{ backgroundColor: subjectColors[question.category] || '#666' }}>
                {question.category}
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
            
            {isLastQuestion ? (
                 <button 
                    className={`${styles.navBtn} ${styles.nextBtn}`} 
                    onClick={submitQuiz}
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