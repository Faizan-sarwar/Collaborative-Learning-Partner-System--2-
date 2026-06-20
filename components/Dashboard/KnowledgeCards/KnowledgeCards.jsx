import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import styles from './KnowledgeCards.module.css';

const facts = [
  "Small goals create momentum—progress fuels more progress (Zeigarnik effect).",
  "Teaching others helps you retain 90% of what you learn.",
  "Spaced repetition increases long-term memory retention by 200%.",
  "The brain processes visual info 60,000x faster than text.",
  "Taking breaks improves focus and creativity (Pomodoro Technique)."
];

const challenges = [
  { title: "Do Pomodoro sprints and reward yourself after finishing.", cta: "Start Timer", path: "/study-time" },
  { title: "Complete 5 study sessions this week with a partner.", cta: "Find Partner", path: "/study-matches" },
  { title: "Finish reviewing all flashcards for one subject.", cta: "View Courses", path: "/courses" }
];

const tools = [
  { title: "Deadlines Manager", desc: "Track assignments, set reminders, and never miss a due date.", cta: "View Deadlines", path: "/dashboard" },
  { title: "Focus Timer", desc: "Use Pomodoro technique to maximize your study sessions.", cta: "Launch Timer", path: "/study-time" },
  { title: "Network Hub", desc: "Find peers who excel in subjects you find difficult.", cta: "Explore Matches", path: "/study-matches" }
];

const KnowledgeCards = () => {
  const navigate = useNavigate();
  const [currentFact, setCurrentFact] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [currentTool, setCurrentTool] = useState(0);

  useEffect(() => {
    setCurrentFact(Math.floor(Math.random() * facts.length));
    setCurrentChallenge(Math.floor(Math.random() * challenges.length));
    setCurrentTool(Math.floor(Math.random() * tools.length));
  }, []);

  return (
    <div className={styles.container}>
      {/*  FACT CARD */}
      <motion.div 
        className={`${styles.card} ${styles.purpleCard}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.cardHeader}>
          <div className={`${styles.iconWrapper} ${styles.purpleIcon}`}>
            <Lightbulb size={20} />
          </div>
          <h3 className={styles.cardTitle}>Did You Know?</h3>
        </div>
        <p className={styles.cardText}>{facts[currentFact]}</p>
      </motion.div>

      {/*  CHALLENGE CARD */}
      <motion.div 
        className={`${styles.card} ${styles.greenCard}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.cardHeader}>
          <span className={styles.cardBadge}>Weekly Goal</span>
          <div className={`${styles.iconWrapper} ${styles.greenIcon} ${styles.mobileIcon}`}>
             <Trophy size={18} />
          </div>
          <h3 className={styles.cardTitle}>Study Challenge</h3>
        </div>
        <p className={styles.cardText}>{challenges[currentChallenge].title}</p>
        <button 
          className={styles.textLink} 
          onClick={() => navigate(challenges[currentChallenge].path)}
        >
          {challenges[currentChallenge].cta} <ArrowRight size={14} />
        </button>
      </motion.div>

      {/*  TOOL CARD */}
      <motion.div 
        className={`${styles.card} ${styles.amberCard}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.cardHeader}>
          <div className={`${styles.iconWrapper} ${styles.amberIcon}`}>
            <Sparkles size={20} />
          </div>
          <h3 className={styles.cardTitle}>Tool of the Day</h3>
        </div>
        <div className={styles.toolContent}>
            <h4 className={styles.toolTitle}>{tools[currentTool].title}</h4>
            <p className={styles.cardText}>{tools[currentTool].desc}</p>
        </div>
        <button 
          className={styles.actionBtn}
          onClick={() => navigate(tools[currentTool].path)}
        >
          {tools[currentTool].cta}
        </button>
      </motion.div>
    </div>
  );
};

export default KnowledgeCards;