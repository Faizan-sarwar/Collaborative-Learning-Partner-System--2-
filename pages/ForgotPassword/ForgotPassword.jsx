import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import TextInput from '../../components/TextInput/TextInput';
import PageTransition from '../../components/PageTransition/PageTransition';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Will display "No such email exists" directly from the backend
        setError(data.message || 'Something went wrong');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      // Navigate to OTP verification with email
      navigate('/verify-otp', { state: { email, type: 'password-reset' } });

    } catch (err) {
      setError('Failed to connect to the server.');
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <div className={styles.illustrationWrapper}>
            <svg className={styles.illustration} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="150" y="180" width="100" height="90" rx="12" fill="rgba(255,255,255,0.12)" />
              <rect x="155" y="185" width="90" height="80" rx="8" fill="rgba(99,102,241,0.2)" />
              <path d="M175 180V155C175 141.193 186.193 130 200 130V130C213.807 130 225 141.193 225 155V180" stroke="rgba(255,255,255,0.15)" strokeWidth="12" strokeLinecap="round" />
              <circle cx="200" cy="225" r="12" fill="rgba(255,255,255,0.25)" />
              <rect x="196" y="230" width="8" height="18" rx="4" fill="rgba(255,255,255,0.2)" />
              <circle cx="310" cy="300" r="20" stroke="rgba(139,92,246,0.4)" strokeWidth="6" fill="none" />
              <rect x="290" y="296" width="40" height="8" rx="4" fill="rgba(139,92,246,0.3)" transform="rotate(-45 310 300)" />
              <rect x="70" y="120" width="60" height="40" rx="6" fill="rgba(255,255,255,0.1)" />
              <path d="M70 126L100 145L130 126" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="320" cy="100" r="8" fill="rgba(99,102,241,0.4)" />
              <circle cx="80" cy="250" r="6" fill="rgba(139,92,246,0.4)" />
              <circle cx="340" cy="200" r="5" fill="rgba(16,185,129,0.4)" />
              <path d="M100 300 L103 307 L110 310 L103 313 L100 320 L97 313 L90 310 L97 307Z" fill="rgba(255,255,255,0.3)" />
              <path d="M280 130 L282 135 L287 137 L282 139 L280 144 L278 139 L273 137 L278 135Z" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/terms">Terms</Link><span className={styles.dot}>•</span><Link to="/privacy">Privacy</Link><span className={styles.dot}>•</span><Link to="/help">Help</Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className={styles.title}>Forgot Password?</h1>
              <p className={styles.subtitle}>No worries! Enter your email and we'll send you a verification code to reset your password.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <TextInput
                label="Email Address"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
              />

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? <span className={styles.spinner}></span> : 'Send Verification Code'}
              </button>

              <Link to="/login" className={styles.backLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
                Back to Sign In
              </Link>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;