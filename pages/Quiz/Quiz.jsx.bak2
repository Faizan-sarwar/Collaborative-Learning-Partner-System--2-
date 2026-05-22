import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Quiz.module.css';

// IMPORT THE QUESTION BANK
import QUESTION_BANK from './questionBank';

// Map curriculum subject names → question bank category names
// Lets students see "Data Structure and Algorithms" in the dropdown but quiz pulls from "DSA"
const SUBJECT_ALIASES = {
  // --- MAPPING NEW ADMIN PANEL NAMES TO THE QUESTION BANK ---
  'English Composition & Comprehension': 'English Language Skills',
  'Calculus & Analytical Geometry': 'Calculus and Analytical Geometry',
  'Islamic Studies / Ethics': 'Islamic Studies',

  // --- MAPPING SIGNUP FALLBACK SUBJECTS TO THE QUESTION BANK ---
  'Web Development': 'Web Technologies',
  'Data Structures': 'Data Structure and Algorithms',
  'Algorithms': 'Data Structure and Algorithms',
  'Database Management': 'Database Systems',
  'Networking': 'Computer Networks',
  'Machine Learning': 'Artificial Intelligence',
  'Computer Science': 'Programming Fundamentals'

  // Notice we removed all the direct passthroughs like 'Web Technologies': 'Web Technologies'.
  // We don't need them anymore because of Step 2!
};

const subjectColors = {
  'Web Development': '#ec4899',
  'DSA': '#10b981',
  'Object Oriented Programming': '#6366f1',
  'Computer Networks': '#8b5cf6',
  'Database Management': '#f59e0b',
  'Cyber Security': '#ef4444',
  'Artificial Intelligence': '#3b82f6'
};

// 🟢 NEW: Professional Trust Tiers & Colors
const getTrustTier = (score) => {
  if (score >= 90) return { label: 'Elite Scholar', color: '#059669', emoji: '💎' }; // Emerald
  if (score >= 75) return { label: 'Trusted Partner', color: '#3b82f6', emoji: '🛡️' }; // Blue
  if (score >= 60) return { label: 'Average', color: '#f59e0b', emoji: '⭐' }; // Amber
  return { label: 'Needs Improvement', color: '#ef4444', emoji: '📈' }; // Red
};

// 🟢 Reliability calculation — scales with however many questions the student answered
const calculateProfessionalReliability = (correctAnswers, totalQuestions) => {
  const baseScore = 40;
  if (!totalQuestions || totalQuestions === 0) return baseScore;
  // 58 points distributed across however many questions there are
  const earnedScore = Math.round((correctAnswers / totalQuestions) * 58);
  return Math.min(baseScore + earnedScore, 98); // Capped at 98%
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

  // ANTI-CHEAT
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

  // INITIALIZE QUIZ
  useEffect(() => {
    const storedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    const strengths = user.academicStrengths || [];
    setUserStrengths(strengths);

    const testableCategories = strengths
      .map(s => SUBJECT_ALIASES[s] || s)
      .filter(Boolean);
    const uniqueCategories = [...new Set(testableCategories)];

    let balancedQuestions = [];

    if (uniqueCategories.length > 0) {
      const totalDesired = 10;
      // Base amount every subject gets (e.g., 10 / 3 = 3)
      const baseCount = Math.floor(totalDesired / uniqueCategories.length);
      // Leftover questions to distribute (e.g., 10 % 3 = 1)
      let remainder = totalDesired % uniqueCategories.length;

      uniqueCategories.forEach(category => {
        // Determine exactly how many questions to pull for THIS specific subject
        let numToPull = baseCount;
        if (remainder > 0) {
          numToPull += 1;
          remainder -= 1; // Subtract from leftovers
        }

        const subjectQuestions = QUESTION_BANK.filter(q => q.category === category);

        const selectedForSubject = subjectQuestions
          .sort(() => 0.5 - Math.random())
          .slice(0, numToPull);

        balancedQuestions = [...balancedQuestions, ...selectedForSubject];
      });
    }

    // Mix all the collected questions together so the subjects don't appear in solid blocks
    const finalQuestions = balancedQuestions.sort(() => 0.5 - Math.random());

    setQuestions(finalQuestions);
    setLoading(false);
  }, [navigate]);

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

  const submitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const score = calculateScore();

    try {
      const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');

      let currentUser = JSON.parse((localStorage.getItem('user') || sessionStorage.getItem('user'))) || {};
      currentUser.quizCompleted = true;
      sessionStorage.setItem('user', JSON.stringify(currentUser));

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score: score, totalQuestions: questions.length })
      });

      const data = await res.json();

      if (data.success && data.user) {
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

  const cardVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.8 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0, scale: 0.8 }),
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.3 } }),
  };

  if (loading) return <div className={styles.container}>Loading Quiz...</div>;

  // Handle case: student's strengths have no questions in the bank
  if (questions.length === 0) {
    const handleSkip = async () => {
      try {
        const token = (localStorage.getItem('token') || sessionStorage.getItem('token'));
        await fetch(`http://${window.location.hostname}:5000/api/auth/submit-quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ score: 0, totalQuestions: 0 })
        });
        let currentUser = JSON.parse((localStorage.getItem('user') || sessionStorage.getItem('user'))) || {};
        currentUser.quizCompleted = true;
        currentUser.reliability = 40;
        sessionStorage.setItem('user', JSON.stringify(currentUser));
        if (localStorage.getItem('user')) localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (err) {
        console.error('Failed to mark quiz complete', err);
      }
      window.location.href = '/dashboard';
    };

    return (
      <DashboardLayout title="Quiz">
        <div className={styles.container}>
          <motion.div className={styles.resultCard} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <span style={{ fontSize: '3rem' }}>📚</span>
              <h2 className={styles.resultTitle}>No Quiz Available</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.6 }}>
                None of your selected strengths have a question bank yet. Your reliability score will start at <strong>40%</strong> and grow based on your platform activity, study consistency, and peer interactions.
              </p>
              <motion.button
                className={styles.finishBtn}
                onClick={handleSkip}
                whileHover={{ scale: 1.05 }}
                style={{ marginTop: '20px' }}
              >
                Continue to Dashboard
              </motion.button>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  // 🟢 UPDATED: Result view utilizing Trust Tiers
  if (showResult) {
    const rawScore = calculateScore();
    const finalReliability = calculateProfessionalReliability(rawScore, questions.length);
    const tier = getTrustTier(finalReliability);

    return (
      <DashboardLayout title="Results">
        <div className={styles.container}>
          <motion.div className={styles.resultCard} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '4rem' }}>{tier.emoji}</span>
              <h3 style={{ color: tier.color, margin: '10px 0 5px 0', fontSize: '1.5rem' }}>{tier.label}</h3>
            </div>

            <h2 className={styles.resultTitle}>Assessment Complete</h2>

            <div className={styles.scoreCircle}>
              <svg viewBox="0 0 100 100">
                <circle className={styles.scoreCircleBg} cx="50" cy="50" r="45" />
                <motion.circle
                  className={styles.scoreCircleProgress}
                  cx="50" cy="50" r="45"
                  stroke={tier.color} // Apply dynamic color to ring
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * finalReliability) / 100 }}
                />
              </svg>
              <div className={styles.scoreText}>
                <span className={styles.scoreNumber} style={{ color: tier.color }}>{finalReliability}%</span>
                <span className={styles.scoreTotal}>Trust Score</span>
              </div>
            </div>

            <p className={styles.resultMessage} style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              You scored {rawScore}/{questions.length} on the technical quiz.<br />
              Study consistently on the platform to unlock the remaining {100 - finalReliability}% reliability!
            </p>

            <motion.button
              className={styles.finishBtn}
              onClick={handleFinish}
              whileHover={{ scale: 1.05 }}
              style={{ backgroundColor: tier.color }} // Match button to tier
            >
              Go to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // RENDER QUIZ VIEW
  return (
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
            <span className={styles.questionCount}>Question {currentQuestion + 1} of {questions.length}</span>
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