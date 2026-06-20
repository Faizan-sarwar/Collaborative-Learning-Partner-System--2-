import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Lightbulb, BookOpen, ArrowRight, Sparkles, Brain, Heart, Loader2 } from 'lucide-react';
import styles from './Courses.module.css';

const Courses = () => {
  const navigate = useNavigate();

  const [difficultSubjects, setDifficultSubjects] = useState([]);
  const [aiData, setAiData] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(true);

  // 1. FETCH USER PROFILE TO GET THEIR WEAK SUBJECTS
  useEffect(() => {
    const fetchProfileAndTopics = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`http://${window.location.hostname}:5000/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.user.subjectsOfDifficulty && data.user.subjectsOfDifficulty.length > 0) {
          const subjects = data.user.subjectsOfDifficulty;
          setDifficultSubjects(subjects);

          // The moment we know their weak subjects, we ask AI for advice on each one!
          subjects.forEach(subject => fetchAITopics(subject, token));
        } else {
          // Fallback just in case they have an empty profile
          const fallbackSubjects = ['Mathematics', 'Data Structures', 'Algorithms'];
          setDifficultSubjects(fallbackSubjects);
          fallbackSubjects.forEach(subject => fetchAITopics(subject, token));
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileAndTopics();
  }, []);

  // 2. THE AI FETCHER (Talks to your new backend route)
  const fetchAITopics = async (subject, token) => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/ai/chat-topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject })
      });
      const data = await res.json();

      if (data.success) {
        setAiData(prev => ({
          ...prev,
          [subject]: {
            icon: data.icon,
            color: data.color,
            chatTopics: data.topics,
            howToDiscuss: data.tip,
          }
        }));
      } else {
        throw new Error(data.message || "AI failed to respond");
      }
    } catch (err) {
      console.error(`Failed to fetch AI data for ${subject}:`, err);
      //  FIX: Stop the infinite spin! Set a fallback if the AI fails.
      setAiData(prev => ({
        ...prev,
        [subject]: {
          icon: '⚠️',
          color: '#ef4444', // Red color for error
          chatTopics: ['Discuss core concepts', 'Review past papers', 'Watch a tutorial together', 'Practice problem solving'],
          howToDiscuss: 'AI generation failed right now. Start by asking your partner what they find hardest about this subject.',
        }
      }));
    }
  };  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loadingProfile) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
          <Loader2 className={styles.spin} size={40} style={{ marginBottom: '15px', color: '#6366f1' }} />
          <span style={{ fontSize: '1.1rem' }}>Analyzing your learning profile...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <motion.div className={styles.container} variants={containerVariants} initial="hidden" animate="visible">

        {/* Hero */}
        <motion.div className={styles.hero} variants={itemVariants}>
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Sparkles size={14} />
              <span>AI-Powered Study Guide</span>
            </div>
            <h1 className={styles.heroTitle}>
              Conquer Your <span className={styles.gradientText}>Tough Subjects</span>
            </h1>
            <p className={styles.heroSubtitle}>
              We noticed you struggle with these subjects. Our AI has generated custom conversation starters so you and a study partner can tackle them together.
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <BookOpen size={20} />
              <span className={styles.heroStatNum}>{difficultSubjects.length}</span>
              <span className={styles.heroStatLabel}>Weak Subjects</span>
            </div>
            <div className={styles.heroStat}>
              <MessageCircle size={20} />
              <span className={styles.heroStatNum}>
                {difficultSubjects.reduce((sum, s) => sum + (aiData[s]?.chatTopics?.length || 0), 0)}
              </span>
              <span className={styles.heroStatLabel}>AI Ideas Ready</span>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Subjects Grid */}
        <div className={styles.subjectsGrid}>
          {difficultSubjects.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
              You haven't selected any subjects of difficulty yet! Update your profile to get AI recommendations.
            </div>
          )}

          {difficultSubjects.map((subject) => {
            const data = aiData[subject];
            const isLoading = !data; // If we don't have the AI data yet, it's loading

            return (
              <motion.div key={subject} className={styles.subjectCard} variants={itemVariants}>

                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrap} style={{ background: isLoading ? '#333' : `${data.color}20`, borderColor: isLoading ? '#444' : `${data.color}40` }}>
                    <span className={styles.cardIcon}>{isLoading ? <Loader2 size={20} className={styles.spin} color="#888" /> : data.icon}</span>
                  </div>
                  <div className={styles.cardHeaderInfo}>
                    <h3 className={styles.cardTitle}>{subject}</h3>
                    <p className={styles.cardSubtitle}>
                      {isLoading ? 'AI is generating topics...' : 'Custom AI Recommendations'}
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  /*  Skeleton Loader while waiting for Gemini AI */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', opacity: 0.5 }}>
                    <div style={{ height: '40px', background: 'var(--bg-secondary)', borderRadius: '8px', width: '100%' }}></div>
                    <div style={{ height: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', width: '80%' }}></div>
                    <div style={{ height: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', width: '90%' }}></div>
                    <div style={{ height: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', width: '70%' }}></div>
                  </div>
                ) : (
                  /*  AI Loaded Content! */
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                    {/* How to discuss tip */}
                    <div className={styles.discussTip}>
                      <Lightbulb size={16} style={{ color: data.color, flexShrink: 0 }} />
                      <span>{data.howToDiscuss}</span>
                    </div>

                    {/* Chat Topics */}
                    <div className={styles.topicsSection}>
                      <h4 className={styles.topicsTitle}>
                        <MessageCircle size={14} style={{ color: data.color }} />
                        Ask your partner about:
                      </h4>
                      <div className={styles.topicsGrid}>
                        {data.chatTopics.map((topic, i) => (
                          <div key={i} className={styles.topicChip} style={{ borderColor: `${data.color}30`, background: `${data.color}08` }}>
                            <span style={{ color: data.color, marginRight: '6px', fontSize: '0.8rem' }}>•</span>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className={styles.findPartnerBtn}
                      style={{ background: data.color, marginTop: 'auto', border: 'none', borderRadius: '8px', padding: '12px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                      onClick={() => navigate('/study-matches')}
                    >
                      <Users size={16} />
                      Find a partner for {subject}
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div className={styles.motivation} variants={itemVariants}>
          <div className={styles.motivationIcon}>
            <Brain size={28} />
          </div>
          <div>
            <h3 className={styles.motivationTitle}>Learning is better together</h3>
            <p className={styles.motivationText}>
              You don't need to master everything alone. Pick one of the AI conversation starters above, find a match, and start talking!
            </p>
          </div>
          <button className={styles.startChatBtn} onClick={() => navigate('/messages')}>
            <Heart size={16} />
            Open Messages
          </button>
        </motion.div>

      </motion.div>
    </>
  );
};

export default Courses;