import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useSettings } from '../../src/context/SettingsContext'; // 🟢 Added

const Contact = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // 🟢 Added loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Server error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Contact <span className={styles.gradient}>Our Team</span></h1>
          <p className={styles.heroSubtitle}>Have a question about {settings?.platformName}? We're here to help.</p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formCard}>
            
            {submitted && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={styles.successMessage}
                style={{ backgroundColor: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}
              >
                ✓ Message sent! We will get back to you at the email provided.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ flex: 1 }}
                />
                <input
                  type="email"
                  className={styles.input}
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ flex: 1 }}
                />
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                style={{ width: '100%', marginBottom: '15px' }}
              />
              <textarea
                className={styles.textarea}
                placeholder="How can we help?"
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                style={{ width: '100%', marginBottom: '20px' }}
              ></textarea>

              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;