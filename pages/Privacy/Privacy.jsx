import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Share2, Mail } from 'lucide-react';
import styles from './Privacy.module.css';

const sections = [
  {
    icon: <Eye size={22} />,
    title: '1. Information We Collect',
    content: 'At StudySync, we collect information you provide directly to us, such as when you create an account, join study groups, or contact us for support.',
    items: ['Account information (name, email, password)', 'Profile information (avatar, bio, study preferences)', 'Usage data (courses, study sessions, progress)', 'Communication data (messages, feedback)']
  },
  {
    icon: <UserCheck size={22} />,
    title: '2. How We Use Your Information',
    content: 'We use the information we collect to:',
    items: ['Provide, maintain, and improve our services', 'Match you with compatible study partners', 'Send you technical notices and support messages', 'Respond to your comments and questions', 'Analyze usage patterns to enhance user experience']
  },
  {
    icon: <Share2 size={22} />,
    title: '3. Information Sharing',
    content: 'We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with:',
    items: ['Service providers who assist in our operations', 'Legal authorities when required by law', 'Other users (only information you choose to make public)']
  },
  {
    icon: <Lock size={22} />,
    title: '4. Data Security',
    content: 'We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits.',
    items: []
  },
  {
    icon: <Shield size={22} />,
    title: '5. Your Rights',
    content: 'You have the right to:',
    items: ['Access your personal data', 'Correct inaccurate data', 'Request deletion of your data', 'Opt-out of marketing communications']
  },
  {
    icon: <Mail size={22} />,
    title: '6. Contact Us',
    content: 'If you have any questions about this Privacy Policy, please contact us at:',
    items: [],
    email: 'privacy@studysync.com'
  }
];

const Privacy = () => {
  return (
    <div className={styles.page}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={styles.container}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </motion.div>

        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className={styles.iconBadge}>
            <Shield size={28} />
          </div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>Your privacy matters to us. Here's how we handle your data.</p>
          <p className={styles.lastUpdated}>Last updated: December 11, 2024</p>
        </motion.div>

        <div className={styles.content}>
          {sections.map((section, index) => (
            <motion.section
              key={index}
              className={styles.section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
            >
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>{section.icon}</span>
                <h2>{section.title}</h2>
              </div>
              <p>{section.content}</p>
              {section.items.length > 0 && (
                <ul>
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.email && <p className={styles.contactEmail}>{section.email}</p>}
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
