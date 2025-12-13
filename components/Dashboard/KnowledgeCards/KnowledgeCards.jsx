import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './KnowledgeCards.module.css';

const facts = [
  "Small goals create momentum—progress fuels more progress (Zeigarnik effect).",
  "Teaching others helps you retain 90% of what you learn.",
  "Spaced repetition increases long-term memory retention by 200%.",
  "The brain processes visual info 60,000x faster than text.",
  "Taking breaks improves focus and creativity (Pomodoro Technique)."
];

const challenges = [
  { title: "Do Pomodoro sprints and reward yourself after finishing.", cta: "View full challenge →" },
  { title: "Complete 5 study sessions this week with a partner.", cta: "View full challenge →" },
  { title: "Finish reviewing all flashcards for one subject.", cta: "View full challenge →" }
];

const tools = [
  { title: "Deadlines Manager", desc: "Track assignments, set reminders, and never miss a due date.", cta: "Try it" },
  { title: "Focus Timer", desc: "Use Pomodoro technique to maximize your study sessions.", cta: "Try it" },
  { title: "Flashcard Creator", desc: "Create and review flashcards for better retention.", cta: "Try it" }
];

const KnowledgeCards = () => {
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
      <motion.div 
        className={`${styles.card} ${styles.purple}`}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}>💡</span>
          <h3 className={styles.cardTitle}>Did You Know?</h3>
        </div>
        <p className={styles.cardText}>{facts[currentFact]}</p>
      </motion.div>

      <motion.div 
        className={`${styles.card} ${styles.green}`}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.cardHeader}>
          <span className={styles.cardBadge}>Unranked this month</span>
          <h3 className={styles.cardTitle}>Study Challenge</h3>
        </div>
        <p className={styles.cardText}>{challenges[currentChallenge].title}</p>
        <button className={styles.cardLink}>{challenges[currentChallenge].cta}</button>
      </motion.div>

      <motion.div 
        className={`${styles.card} ${styles.coral}`}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Tool of the Day</h3>
        </div>
        <h4 className={styles.toolTitle}>{tools[currentTool].title}</h4>
        <p className={styles.cardText}>{tools[currentTool].desc}</p>
        <button className={styles.tryBtn}>{tools[currentTool].cta}</button>
      </motion.div>
    </div>
  );
};

export default KnowledgeCards;
