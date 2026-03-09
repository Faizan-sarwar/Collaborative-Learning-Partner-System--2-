import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Privacy.module.css';

const Privacy = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
        
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: December 11, 2024</p>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>At Collaborative Learning Partner System, we collect information you provide directly to us, such as when you create an account, join study groups, or contact us for support.</p>
            <ul>
              <li>Account information (name, email, password)</li>
              <li>Profile information (avatar, bio, study preferences)</li>
              <li>Usage data (courses, study sessions, progress)</li>
              <li>Communication data (messages, feedback)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Match you with compatible study partners</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with:</p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Legal authorities when required by law</li>
              <li>Other users (only information you choose to make public)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits.</p>
          </section>

          <section className={styles.section}>
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className={styles.contactEmail}>clpsnoreply911@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
