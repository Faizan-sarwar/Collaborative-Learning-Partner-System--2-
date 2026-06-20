import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import styles from './LoginCard.module.css';
import Alert from '../Alert/Alert';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setAlert(null);
    setIsSubmitting(true);

    //  Fetch the dynamic URL from your .env file
    const apiUrl = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000`;

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });

      const data = await response.json();

      if (!response.ok) {
        setAlert({ type: 'error', message: data.message || 'Invalid email or password.' });
        setIsSubmitting(false);
        return;
      }

      //  Secure Storage Logic
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      setAlert({ type: 'success', message: 'Authentication successful. Redirecting...' });

      //  Smart Redirection Logic
      setTimeout(() => {
        if (data.user.role === 'admin' || data.user.role === 'super-admin') {
          navigate('/admin');
        } else {
          // Quiz check logic for students ONLY
          const hasStrengths = data.user.academicStrengths && data.user.academicStrengths.length > 0;
          const quizNotTaken = !data.user.quizCompleted;

          if (hasStrengths && quizNotTaken) {
            navigate('/quiz');
          } else {
            navigate('/dashboard');
          }
        }
      }, 1000);

    } catch (err) {
      console.error('Login error:', err);
      setAlert({ type: 'error', message: 'Server communication failed. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <div className={styles.secureBadge}>
          <ShieldCheck size={14} className={styles.shieldIcon} />
          <span>Secure Login</span>
        </div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue your learning journey</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/*  ENTERPRISE EMAIL INPUT */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Email Address</label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.inputIcon} />
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/*  ENTERPRISE PASSWORD INPUT WITH TOGGLE */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Password</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              required
              disabled={isSubmitting}
            />
            <button 
              type="button" 
              className={styles.eyeBtn} 
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/*  OPTIONS ROW */}
        <div className={styles.options}>
          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
            />
            <div className={styles.customCheckmark}></div>
            <span className={styles.checkboxLabel}>Remember me</span>
          </label>
          <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
        </div>

        <button type="submit" className={styles.signInButton} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              Authenticating...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <p className={styles.signupText}>
          Don't have an account?{' '}
          <Link to="/signup" className={styles.signupLink}>Sign up here</Link>
        </p>
      </form>
    </motion.div>
  );
};

export default LoginCard;