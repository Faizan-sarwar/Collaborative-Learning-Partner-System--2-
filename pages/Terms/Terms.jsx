import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Terms.module.css';

const Terms = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
        
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last updated: December 11, 2024</p>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Collaborative Learning Partner System, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.</p>
          </section>

          <section className={styles.section}>
            <h2>2. Description of Service</h2>
            <p>Collaborative Learning Partner System is an online platform that connects students for collaborative learning. Our services include:</p>
            <ul>
              <li>Study group matching and creation</li>
              <li>Virtual study rooms and video conferencing</li>
              <li>Progress tracking and analytics</li>
              <li>Resource sharing and collaboration tools</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. User Accounts</h2>
            <p>To use certain features of our service, you must register for an account. You agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Share inappropriate or offensive content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the service</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Intellectual Property</h2>
            <p>All content, features, and functionality of Collaborative Learning Partner System are owned by us and protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section className={styles.section}>
            <h2>6. Limitation of Liability</h2>
            <p>Collaborative Learning Partner System shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
          </section>

          <section className={styles.section}>
            <h2>7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform.</p>
          </section>

          <section className={styles.section}>
            <h2>8. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at:</p>
            <p className={styles.contactEmail}>legal@clps.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
