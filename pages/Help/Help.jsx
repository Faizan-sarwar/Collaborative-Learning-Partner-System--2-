import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Help.module.css';
import { useSettings } from '../../src/context/SettingsContext'; //  Added

const Help = () => {
  const { settings } = useSettings(); //  Dynamic Settings
  const [openFaq, setOpenFaq] = useState(null);

  const platformName = settings?.platformName || 'Collaborative Learning Partner System';

  const faqs = [
    { question: "How do I create a study group?", answer: "Navigate to 'Courses' or 'Communities' from your dashboard and click 'Create Group'." },
    { question: "How does the matching system work?", answer: "Our AI analyzes your study style and subjects to suggest the best partners." },
    { question: `Is ${platformName} free to use?`, answer: "Yes! It is completely free for students." },
    { question: "How do I join a virtual study room?", answer: "Simply click 'Join Room' from your dashboard or group invites." },
    { question: "Can I track my study progress?", answer: "Yes, the Analytics dashboard shows your hours and improvement metrics." }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>Back to Home</Link>
        <h1 className={styles.title}>Help Center</h1>
        <p className={styles.subtitle}>Get the support you need for {platformName}.</p>
        
        <div className={styles.grid}>
          <div className={styles.contactCard}>
            <h3>Email Support</h3>
            <p>Direct help from our team</p>
            <a href={`mailto:${settings?.supportEmail}`} className={styles.contactLink}>{settings?.supportEmail || 'support@system.com'}</a>
          </div>
          <div className={styles.contactCard}>
            <h3>Community</h3>
            <p>Join our Discord</p>
            <a href="#" className={styles.contactLink}>Join Now</a>
          </div>
        </div>

        <div className={styles.faqSection}>
          <h2>Common Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} className={`${styles.faqItem} ${openFaq === index ? styles.open : ''}`}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{faq.question}</span>
                </button>
                <div className={styles.faqAnswer}><p>{faq.answer}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;