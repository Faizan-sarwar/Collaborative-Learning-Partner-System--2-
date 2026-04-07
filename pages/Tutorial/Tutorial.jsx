import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Tutorials.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Tutorials = () => {
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [expandedTutorial, setExpandedTutorial] = useState(null);

  const categories = [
    { name: 'Getting Started', icon: '🚀' },
    { name: 'Study Rooms', icon: '📚' },
    { name: 'Connections', icon: '🤝' },
    { name: 'Messaging', icon: '💬' },
    { name: 'Courses', icon: '📖' },
    { name: 'Account', icon: '⚙️' }
  ];

  const tutorials = {
    'Getting Started': [
      {
        title: 'Creating Your Account',
        duration: '2 min',
        steps: [
          'Go to the signup page and enter your name, email, and password.',
          'Select your department and semester from the dropdowns.',
          'Choose the subjects you find difficult — these will appear on your Courses page.',
          'Verify your email via the OTP sent to your inbox.',
          'You\'re in! Start exploring your dashboard.'
        ]
      },
      {
        title: 'Navigating the Dashboard',
        duration: '3 min',
        steps: [
          'The sidebar gives you quick access to all sections — Study Time, Courses, Social, and more.',
          'Your Welcome Banner shows personalized greetings and quick stats.',
          'Check the Mini Calendar for upcoming study sessions.',
          'Use Quick Actions to jump into a study room or find a partner instantly.',
          'The Study Streak tracker keeps you motivated day after day.'
        ]
      },
      {
        title: 'Setting Up Your Profile',
        duration: '2 min',
        steps: [
          'Click on your avatar in the sidebar to go to your profile.',
          'Add a bio so study partners know your interests.',
          'Update your difficult subjects anytime to get better recommendations.',
          'Set your availability to let others know when you\'re free to study.'
        ]
      }
    ],
    'Study Rooms': [
      {
        title: 'Creating a Study Room',
        duration: '3 min',
        steps: [
          'Navigate to Study Room from the sidebar.',
          'Click "Create Room" and give it a name and topic.',
          'Set the maximum number of participants.',
          'Share the room link with your friends or make it public.',
          'Wait in the lobby until everyone joins, then start!'
        ]
      },
      {
        title: 'Joining an Existing Room',
        duration: '1 min',
        steps: [
          'Browse available rooms on the Study Room page.',
          'Filter by subject or topic to find relevant sessions.',
          'Click "Join" to enter the waiting room.',
          'Once the host starts the session, you\'ll be taken to the active room.'
        ]
      },
      {
        title: 'Using In-Room Features',
        duration: '4 min',
        steps: [
          'Use the chat panel to discuss topics in real-time.',
          'Share notes and resources via the shared workspace.',
          'The timer helps everyone stay focused during study sprints.',
          'React with emojis to keep the energy up!',
          'End the session when done — your study time will be logged automatically.'
        ]
      }
    ],
    'Connections': [
      {
        title: 'Finding Study Partners',
        duration: '2 min',
        steps: [
          'Go to Study Matches from the sidebar.',
          'Browse recommended partners based on your subjects and schedule.',
          'Click "Connect" to send a connection request.',
          'Once accepted, you can start chatting and planning study sessions.'
        ]
      },
      {
        title: 'Managing Your Connections',
        duration: '2 min',
        steps: [
          'View all your connections on the Connections page.',
          'Check Pending Connections for requests you haven\'t responded to.',
          'Accept or decline incoming requests.',
          'Start a conversation directly from the connections list.'
        ]
      }
    ],
    'Messaging': [
      {
        title: 'Sending Your First Message',
        duration: '1 min',
        steps: [
          'Go to Messages from the sidebar.',
          'Select a connected study partner from the list.',
          'Type your message and hit send.',
          'Share study materials, links, or just chat about the topic!'
        ]
      },
      {
        title: 'Group Conversations',
        duration: '2 min',
        steps: [
          'Create a group chat with multiple study partners.',
          'Name the group based on the subject or project.',
          'Everyone in the group can share messages and resources.',
          'Pin important messages so nobody misses key info.'
        ]
      }
    ],
    'Courses': [
      {
        title: 'Understanding Your Courses Page',
        duration: '2 min',
        steps: [
          'Your Courses page shows subjects you marked as difficult during signup.',
          'Each subject card lists topics you can discuss with partners.',
          'Use the "Find a Study Partner" button to connect with someone in the same subject.',
          'Chat topics give you conversation starters for productive discussions.'
        ]
      },
      {
        title: 'Updating Your Subjects',
        duration: '1 min',
        steps: [
          'Go to Settings to update your difficult subjects.',
          'Add or remove subjects as your needs change.',
          'Your Courses page and study partner recommendations will update automatically.'
        ]
      }
    ],
    'Account': [
      {
        title: 'Changing Your Password',
        duration: '1 min',
        steps: [
          'Go to Settings from the sidebar.',
          'Click on "Security" or "Change Password".',
          'Enter your current password and your new password.',
          'Save changes — you\'ll stay logged in.'
        ]
      },
      {
        title: 'Managing Notifications',
        duration: '2 min',
        steps: [
          'Go to Settings and find the Notifications section.',
          'Toggle on/off email notifications for messages, connections, and study reminders.',
          'Customize which alerts you want to see on the dashboard.',
          'Save your preferences.'
        ]
      }
    ]
  };

  const currentTutorials = tutorials[activeCategory] || [];

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.glowOrb1}></div>
          <div className={styles.glowOrb2}></div>
          <div className={styles.gridOverlay}></div>
        </div>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.badge}>📘 Tutorials</span>
          <h1 className={styles.heroTitle}>
            Learn How to Use <span className={styles.gradient}>StudySync</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Step-by-step guides to help you get the most out of every feature.
          </p>
        </motion.div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Sidebar Categories */}
            <div className={styles.sidebar}>
              {categories.map(cat => (
                <button
                  key={cat.name}
                  className={`${styles.sidebarBtn} ${activeCategory === cat.name ? styles.sidebarActive : ''}`}
                  onClick={() => { setActiveCategory(cat.name); setExpandedTutorial(null); }}
                >
                  <span className={styles.sidebarIcon}>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Tutorials List */}
            <div className={styles.tutorialsList}>
              <h2 className={styles.sectionTitle}>{activeCategory}</h2>
              {currentTutorials.map((tutorial, i) => (
                <motion.div
                  key={`${activeCategory}-${i}`}
                  className={styles.tutorialCard}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    className={styles.tutorialHeader}
                    onClick={() => setExpandedTutorial(expandedTutorial === `${activeCategory}-${i}` ? null : `${activeCategory}-${i}`)}
                  >
                    <div className={styles.tutorialHeaderLeft}>
                      <span className={styles.tutorialNumber}>{String(i + 1).padStart(2, '0')}</span>
                      <h3 className={styles.tutorialTitle}>{tutorial.title}</h3>
                    </div>
                    <div className={styles.tutorialHeaderRight}>
                      <span className={styles.duration}>{tutorial.duration}</span>
                      <span className={`${styles.chevron} ${expandedTutorial === `${activeCategory}-${i}` ? styles.chevronOpen : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedTutorial === `${activeCategory}-${i}` && (
                      <motion.div
                        className={styles.tutorialSteps}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.stepsInner}>
                          {tutorial.steps.map((step, si) => (
                            <div key={si} className={styles.step}>
                              <span className={styles.stepNum}>{si + 1}</span>
                              <p className={styles.stepText}>{step}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Help CTA */}
          <motion.div
            className={styles.helpCta}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.ctaTitle}>Still need help?</h3>
            <p className={styles.ctaText}>Our support team is always ready to assist you.</p>
            <a href="/contact" className={styles.ctaBtn}>Contact Support</a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tutorials;
