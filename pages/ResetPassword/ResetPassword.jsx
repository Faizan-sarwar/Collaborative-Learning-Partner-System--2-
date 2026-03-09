import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import TextInput from '../../components/TextInput/TextInput';
import PageTransition from '../../components/PageTransition/PageTransition';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the email passed from the VerifyOTP page
  const email = location.state?.email || '';

  // 🟢 SECURITY CHECK: If someone tries to visit /reset-password directly via URL, kick them back to login
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must include an uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must include a lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must include a number';
    if (!/[^A-Za-z0-9]/.test(pwd)) return 'Password must include a special character';
    return '';
  };

  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];
  const strength = getStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      // 🟢 CONNECT TO BACKEND API
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          newPassword: password // Send the new password to the backend
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to reset password');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSuccess(true); // Triggers the success UI animation

      // Redirect to login after showing success UI for 2 seconds
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } });
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server.');
      setIsSubmitting(false);
    }
  };

  if (!email) return null; // Prevent rendering if redirecting

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.illustrationWrapper}>
            <svg className={styles.illustration} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* New lock with checkmark */}
              <rect x="150" y="160" width="100" height="100" rx="16" fill="rgba(255,255,255,0.12)" />
              <rect x="155" y="165" width="90" height="90" rx="12" fill="rgba(16,185,129,0.15)" />
              <path d="M175 160V140C175 126.193 186.193 115 200 115V115C213.807 115 225 126.193 225 140V160" stroke="rgba(16,185,129,0.4)" strokeWidth="10" strokeLinecap="round" />
              <path d="M185 215L195 225L220 200" stroke="rgba(16,185,129,0.6)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Key turning */}
              <path d="M260 300L290 270" stroke="rgba(139,92,246,0.4)" strokeWidth="6" strokeLinecap="round" />
              <circle cx="300" cy="260" r="15" stroke="rgba(139,92,246,0.4)" strokeWidth="5" fill="none" />
              <rect x="285" y="273" width="6" height="12" rx="3" fill="rgba(139,92,246,0.3)" transform="rotate(-45 288 279)" />
              
              {/* Shield */}
              <path d="M80 200L110 185V215C110 235 97 248 80 255C63 248 50 235 50 215V185L80 200Z" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.3)" strokeWidth="2" />
              
              {/* Floating elements */}
              <circle cx="320" cy="120" r="8" fill="rgba(99,102,241,0.4)" />
              <circle cx="60" cy="300" r="6" fill="rgba(16,185,129,0.4)" />
              <circle cx="340" cy="340" r="5" fill="rgba(139,92,246,0.3)" />
              
              {/* Sparkles */}
              <path d="M100 130 L103 137 L110 140 L103 143 L100 150 L97 143 L90 140 L97 137Z" fill="rgba(255,255,255,0.3)" />
              <path d="M300 180 L302 185 L307 187 L302 189 L300 194 L298 189 L293 187 L298 185Z" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>

          <div className={styles.footerLinks}>
            <Link to="/terms">Terms</Link>
            <span className={styles.dot}>•</span>
            <Link to="/privacy">Privacy</Link>
            <span className={styles.dot}>•</span>
            <Link to="/help">Help</Link>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.card}>
            {success ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h1 className={styles.title}>Password Reset!</h1>
                <p className={styles.subtitle}>Your password has been changed successfully. Redirecting to login...</p>
                <div className={styles.redirectBar}></div>
              </div>
            ) : (
              <>
                <div className={styles.header}>
                  <div className={styles.iconWrapper}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h1 className={styles.title}>Create New Password</h1>
                  <p className={styles.subtitle}>Your new password must be different from your previous password</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <TextInput
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  />

                  {password && (
                    <div className={styles.strengthBar}>
                      <div className={styles.strengthTrack}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={styles.strengthSegment}
                            style={{ background: i <= strength ? strengthColor[strength] : 'var(--border-color)' }}
                          />
                        ))}
                      </div>
                      <span className={styles.strengthLabel} style={{ color: strengthColor[strength] }}>
                        {strengthLabel[strength]}
                      </span>
                    </div>
                  )}

                  <TextInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  />

                  {error && <p className={styles.error}>{error}</p>}

                  <ul className={styles.requirements}>
                    <li className={password.length >= 8 ? styles.met : ''}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(password) ? styles.met : ''}>One uppercase letter</li>
                    <li className={/[a-z]/.test(password) ? styles.met : ''}>One lowercase letter</li>
                    <li className={/[0-9]/.test(password) ? styles.met : ''}>One number</li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? styles.met : ''}>One special character</li>
                  </ul>

                  <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      'Reset Password'
                    )}
                  </button>

                  <Link to="/login" className={styles.backLink}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5" />
                      <path d="M12 19l-7-7 7-7" />
                    </svg>
                    Back to Sign In
                  </Link>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;