import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Help.module.css';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I create a study group?",
      answer: "To create a study group, navigate to the 'Communities' section from your dashboard, click 'Create Group', fill in the details like group name, subject, and study goals, then invite members or make it public for others to join."
    },
    {
      question: "How does the matching system work?",
      answer: "Our AI-powered matching system analyzes your study preferences, subjects, learning style, and availability to connect you with compatible study partners. The more you use the platform, the better our recommendations become."
    },
    {
      question: "Is Collaborative Learning Partner System free to use?",
      answer: "Yes! Collaborative Learning Partner System is completely free for students. We believe everyone deserves access to quality collaborative learning tools without any financial barriers."
    },
    {
      question: "How do I join a virtual study room?",
      answer: "You can join study rooms from your dashboard or through group invitations. Simply click 'Join Room' and you'll be connected to the video session with your study partners."
    },
    {
      question: "Can I track my study progress?",
      answer: "Absolutely! Our analytics dashboard shows your study hours, completed sessions, improvement metrics, and personalized insights to help you optimize your learning journey."
    },
    {
      question: "How do I report inappropriate behavior?",
      answer: "If you encounter any inappropriate behavior, click the 'Report' button in the study room or user profile. Our moderation team reviews all reports within 24 hours and takes appropriate action."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
        
        <h1 className={styles.title}>Help Center</h1>
        <p className={styles.subtitle}>Find answers to common questions or get in touch with our support team.</p>
        
        <div className={styles.grid}>
          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Email Support</h3>
            <p>Get help from our support team</p>
            <a href="clpsnoreply911@gmail.com" className={styles.contactLink}>clpsnoreply911@gmail.com</a>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Live Chat</h3>
            <p>Chat with us in real-time</p>
            <span className={styles.availability}>Available 9AM - 6PM EST</span>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Community</h3>
            <p>Join our Discord community</p>
            <a href="#" className={styles.contactLink}>Join Discord</a>
          </div>
        </div>

        <div className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`${styles.faqItem} ${openFaq === index ? styles.open : ''}`}
              >
                <button 
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <svg 
                    className={styles.chevron}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
