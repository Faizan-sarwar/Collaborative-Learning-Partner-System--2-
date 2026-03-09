import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginCard.module.css';
import TextInput from '../TextInput/TextInput';
import Divider from '../Divider/Divider';
import GoogleButton from '../GoogleButton/GoogleButton';
import Alert from '../Alert/Alert';
import { Link } from 'react-router-dom';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setAlert({ type: 'error', message: data.message || 'Login failed' });
        return;
      }

      // 1. Handle Token Storage
      if (rememberMe) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }

      // 2. Handle User Storage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('user'); 

      setAlert({ type: 'success', message: 'Login successful! Redirecting...' });

      // 3. LOGIC UPDATE: Check Role Correctly
      setTimeout(() => {
        // 🟢 FIX: Check for BOTH 'admin' and 'super-admin'
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
      setAlert({ type: 'error', message: 'Server error. Please try again.' });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.secureBadge}>
          <span className={styles.greenDot}></span>
          <span>Secure</span>
        </div>
        <h1 className={styles.title}>Welcome</h1>
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

        <TextInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={styles.options}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className={styles.checkmark}></span>
            <span className={styles.checkboxLabel}>Remember me for 30 days</span>
          </label>
          <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
        </div>

        <button type="submit" className={styles.signInButton}>
          Sign In
        </button>

        <p className={styles.signupText}>
          Don't have an account?{' '}
          <Link to="/signup" className={styles.signupLink}>Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginCard;