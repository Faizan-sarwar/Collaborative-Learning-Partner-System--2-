import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../FAQ/FAQ.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useSettings } from '../../src/context/SettingsContext'; // 🟢 Added

const FAQPage = () => {
  const { settings } = useSettings(); // 🟢 Dynamic Settings
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' },
    { id: 'features', label: 'Features' },
    { id: 'billing', label: 'Billing' }
  ];

  const platformName = settings?.platformName || 'Collaborative Learning Partner System';

  const faqs = {
    general: [
      { question: `What is ${platformName}?`, answer: `${platformName} is a collaborative learning platform that connects students with compatible study partners using AI-powered matching. It provides virtual study rooms, progress tracking, gamification, and more.` },
      { question: `Is ${platformName} free to use?`, answer: `Yes! ${platformName} is completely free for all students. We believe education should be accessible to everyone.` },
      { question: `What devices can I use ${platformName} on?`, answer: `It works on all modern browsers and is fully responsive on desktops, tablets, and mobile devices.` },
      { question: 'How do I get started?', answer: 'Simply sign up with your email, complete your profile, and our AI will start matching you with compatible study partners right away.' }
    ],
    account: [
      { question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you an OTP to verify your identity.' },
      { question: 'Can I change my email address?', answer: 'Yes, go to Settings > Account and click "Change Email".' },
      { question: 'How do I delete my account?', answer: 'Go to Settings > Account > Delete Account. This action is permanent.' },
      { question: 'Can I have multiple accounts?', answer: 'No, each student should have one account to maintain community integrity.' }
    ],
    features: [
      { question: 'How does the matching algorithm work?', answer: 'Our AI analyzes your study preferences, schedule, subjects, and learning style to find the most compatible partners.' },
      { question: 'How do virtual study rooms work?', answer: 'They provide a collaborative space with video chat, screen sharing, and shared notes.' },
      { question: 'What is the XP system?', answer: 'XP rewards you for studying consistently and helping others. Earn XP to level up and unlock achievements.' },
      { question: 'How do study streaks work?', answer: 'Study streaks track consecutive days of activity. Maintaining streaks earns bonus XP.' }
    ],
    billing: [
      { question: `Will ${platformName} always be free?`, answer: 'Our core features will always remain free for students.' },
      { question: 'Are there any hidden charges?', answer: 'Absolutely not. The platform is 100% free with no subscription fees required for current features.' },
      { question: 'Do you offer institutional plans?', answer: `Yes! universities can contact us at ${settings?.supportEmail || 'support@system.com'} for more information.` },
      { question: 'How is the system funded?', answer: 'We are funded through grants, partnerships, and optional enterprise features for organizations.' }
    ]
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.heroBg}><div className={styles.gridOverlay}></div></div>
        <div className={styles.heroContent}>
          <motion.span className={styles.badge} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>FAQ</motion.span>
          <motion.h1 className={styles.heroTitle} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            Frequently Asked <span className={styles.gradient}>Questions</span>
          </motion.h1>
          <motion.p className={styles.heroSubtitle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Everything you need to know about {platformName}. Can't find an answer? Contact support.
          </motion.p>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.categoryTabs}>
            {categories.map((cat) => (
              <button key={cat.id} className={`${styles.categoryTab} ${activeCategory === cat.id ? styles.activeTab : ''}`} onClick={() => { setActiveCategory(cat.id); setOpenIndex(0); }}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className={styles.faqList}>
            {faqs[activeCategory].map((faq, index) => (
              <motion.div key={index} className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}>
                <button className={styles.faqQuestion} onClick={() => setOpenIndex(openIndex === index ? -1 : index)}>
                  <span className={styles.questionText}>{faq.question}</span>
                </button>
                <div className={styles.faqAnswer}><p>{faq.answer}</p></div>
              </motion.div>
            ))}
          </div>
          <div className={styles.contactCta}>
            <h3 className={styles.ctaTitle}>Still have questions?</h3>
            <p className={styles.ctaText}>Reach out to us at <strong>{settings?.supportEmail}</strong></p>
            <a href="/contact" className={styles.ctaButton}>Contact Support</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FAQPage;