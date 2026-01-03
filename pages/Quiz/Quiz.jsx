import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Quiz.module.css';

const mockQuestions = [
  {
    id: 1,
    subject: 'Mathematics',
    question: 'What is the derivative of x² + 3x + 5?',
    options: ['2x + 3', 'x² + 3', '2x + 5', 'x + 3'],
    correctAnswer: 0,
  },
  {
    id: 2,
    subject: 'Physics',
    question: 'What is the SI unit of force?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 1,
  },
  {
    id: 3,
    subject: 'Chemistry',
    question: 'What is the chemical symbol for Gold?',
    options: ['Ag', 'Fe', 'Au', 'Cu'],
    correctAnswer: 2,
  },
  {
    id: 4,
    subject: 'Biology',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'],
    correctAnswer: 2,
  },
  {
    id: 5,
    subject: 'Computer Science',
    question: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
    correctAnswer: 0,
  },
  {
    id: 6,
    subject: 'Mathematics',
    question: 'What is the value of π (pi) to two decimal places?',
    options: ['3.12', '3.14', '3.16', '3.18'],
    correctAnswer: 1,
  },
  {
    id: 7,
    subject: 'Physics',
    question: 'What is the speed of light in vacuum?',
    options: ['3 × 10⁶ m/s', '3 × 10⁷ m/s', '3 × 10⁸ m/s', '3 × 10⁹ m/s'],
    correctAnswer: 2,
  },
  {
    id: 8,
    subject: 'Chemistry',
    question: 'What is the pH of pure water?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
  },
  {
    id: 9,
    subject: 'Biology',
    question: 'How many chromosomes do humans have?',
    options: ['23', '44', '46', '48'],
    correctAnswer: 2,
  },
  {
    id: 10,
    subject: 'Computer Science',
    question: 'Which data structure uses LIFO?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswer: 1,
  },
];

const subjectColors = {
  'Mathematics': '#6366f1',
  'Physics': '#8b5cf6',
  'Chemistry': '#ec4899',
  'Biology': '#10b981',
  'Computer Science': '#f59e0b',
};

const subjectIcons = {
  'Mathematics': '📐',
  'Physics': '⚛️',
  'Chemistry': '🧪',
  'Biology': '🧬',
  'Computer Science': '💻',
};

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(1);

  const question = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    mockQuestions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinish = () => {
    navigate('/study-matches');
  };

  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  if (showResult) {
    const score = calculateScore();
    const percentage = (score / mockQuestions.length) * 100;

    return (
      <DashboardLayout>
        <div className={styles.container}>
          <motion.div
            className={styles.resultCard}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <motion.div
              className={styles.resultIcon}
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
            </motion.div>

            <h2 className={styles.resultTitle}>Quiz Complete!</h2>

            <div className={styles.scoreCircle}>
              <svg viewBox="0 0 100 100">
                <circle
                  className={styles.scoreCircleBg}
                  cx="50"
                  cy="50"
                  r="45"
                />
                <motion.circle
                  className={styles.scoreCircleProgress}
                  cx="50"
                  cy="50"
                  r="45"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className={styles.scoreText}>
                <span className={styles.scoreNumber}>{score}</span>
                <span className={styles.scoreTotal}>/{mockQuestions.length}</span>
              </div>
            </div>

            <p className={styles.resultMessage}>
              {percentage >= 70
                ? "Excellent! You're ready to find your study matches!"
                : percentage >= 50
                ? 'Good effort! You can improve with study partners.'
                : 'Keep learning! Finding study partners will help you improve.'}
            </p>

            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span className={styles.statValue}>{score}</span>
                <span className={styles.statLabel}>Correct</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.statValue}>{mockQuestions.length - score}</span>
                <span className={styles.statLabel}>Incorrect</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.statValue}>{percentage.toFixed(0)}%</span>
                <span className={styles.statLabel}>Score</span>
              </div>
            </div>

            <motion.button
              className={styles.finishBtn}
              onClick={handleFinish}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Study Matches
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Skill Assessment Quiz</h1>
            <p className={styles.subtitle}>
              Answer these questions to find your perfect study match
            </p>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressInfo}>
              <span className={styles.questionCount}>
                Question {currentQuestion + 1} of {mockQuestions.length}
              </span>
              <span className={styles.progressPercent}>{progress.toFixed(0)}%</span>
            </div>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
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
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                rotateY: { duration: 0.3 },
              }}
            >
              <div
                className={styles.subjectBadge}
                style={{ backgroundColor: subjectColors[question.subject] }}
              >
                <span className={styles.subjectIcon}>{subjectIcons[question.subject]}</span>
                {question.subject}
              </div>

              <div className={styles.questionNumber}>
                <span className={styles.qNum}>{String(currentQuestion + 1).padStart(2, '0')}</span>
              </div>

              <h2 className={styles.questionText}>{question.question}</h2>

              <div className={styles.options}>
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    custom={index}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    className={`${styles.optionBtn} ${
                      selectedAnswers[currentQuestion] === index ? styles.selected : ''
                    }`}
                    onClick={() => handleSelectAnswer(index)}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={styles.optionLetter}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={styles.optionText}>{option}</span>
                    {selectedAnswers[currentQuestion] === index && (
                      <motion.span
                        className={styles.checkmark}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className={styles.navigation}>
            <motion.button
              className={styles.navBtn}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Previous
            </motion.button>

            <div className={styles.dots}>
              {mockQuestions.map((_, index) => (
                <motion.span
                  key={index}
                  className={`${styles.dot} ${
                    index === currentQuestion ? styles.activeDot : ''
                  } ${selectedAnswers[index] !== undefined ? styles.answeredDot : ''}`}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => {
                    setDirection(index > currentQuestion ? 1 : -1);
                    setCurrentQuestion(index);
                  }}
                />
              ))}
            </div>

            <motion.button
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentQuestion === mockQuestions.length - 1 ? 'Finish' : 'Next'}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className={styles.questionIndicators}>
          {mockQuestions.map((q, index) => (
            <motion.div
              key={index}
              className={`${styles.indicator} ${
                index === currentQuestion ? styles.activeIndicator : ''
              } ${selectedAnswers[index] !== undefined ? styles.answeredIndicator : ''}`}
              style={{
                borderColor: index === currentQuestion ? subjectColors[q.subject] : undefined,
              }}
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setDirection(index > currentQuestion ? 1 : -1);
                setCurrentQuestion(index);
              }}
            >
              <span className={styles.indicatorIcon}>{subjectIcons[q.subject]}</span>
              <span className={styles.indicatorNum}>{index + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Quiz;
