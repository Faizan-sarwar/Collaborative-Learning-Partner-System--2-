import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, Users, AlertTriangle, BookOpen, Scale, RefreshCw, Mail } from 'lucide-react';
import styles from './Terms.module.css';

const sections = [
  {
    icon: <CheckCircle size={22} />,
    title: '1. Acceptance of Terms',
    content: 'By accessing and using StudySync, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.',
    items: []
  },
  {
    icon: <BookOpen size={22} />,
    title: '2. Description of Service',
    content: 'StudySync is an online platform that connects students for collaborative learning. Our services include:',
    items: ['Study group matching and creation', 'Virtual study rooms and video conferencing', 'Progress tracking and analytics', 'Resource sharing and collaboration tools']
  },
  {
    icon: <Users size={22} />,
    title: '3. User Accounts',
    content: 'To use certain features of our service, you must register for an account. You agree to:',
    items: ['Provide accurate and complete information', 'Maintain the security of your account credentials', 'Notify us immediately of any unauthorized access', 'Be responsible for all activities under your account']
  },
  {
    icon: <AlertTriangle size={22} />,
    title: '4. User Conduct',
    content: 'You agree not to:',
    items: ['Use the service for any illegal purpose', 'Harass, abuse, or harm other users', 'Share inappropriate or offensive content', 'Attempt to gain unauthorized access to our systems', 'Interfere with the proper functioning of the service']
  },
  {
    icon: <Scale size={22} />,
    title: '5. Intellectual Property',
    content: 'All content, features, and functionality of StudySync are owned by us and protected by international copyright, trademark, and other intellectual property laws.',
    items: []
  },
  {
    icon: <Scale size={22} />,
    title: '6. Limitation of Liability',
    content: 'StudySync shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.',
    items: []
  },
  {
    icon: <RefreshCw size={22} />,
    title: '7. Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform.',
    items: []
  },
  {
    icon: <Mail size={22} />,
    title: '8. Contact Information',
    content: 'For questions about these Terms of Service, please contact us at:',
    items: [],
    email: 'legal@studysync.com'
  }
];

const Terms = () => {
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
            <FileText size={28} />
          </div>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>Please read these terms carefully before using StudySync.</p>
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

export default Terms;
  