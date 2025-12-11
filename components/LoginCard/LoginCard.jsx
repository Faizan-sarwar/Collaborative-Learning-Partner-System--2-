import { useState } from 'react';
import styles from './LoginCard.module.css';
import TextInput from '../TextInput/TextInput';
import GoogleButton from '../GoogleButton/GoogleButton';
import Divider from '../Divider/Divider';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', { email, password, rememberMe });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.secureBadge}>
          <span className={styles.greenDot}></span>
          <span>Secure</span>
        </div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue your learning journey</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
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
          <a href="#" className={styles.forgotLink}>Forgot password?</a>
        </div>

        <button type="submit" className={styles.signInButton}>
          Sign In
        </button>

        <Divider text="Or" />

        {/* <GoogleButton /> */}

        <p className={styles.signupText}>
          Don't have an account?{' '}
          <a href="#" className={styles.signupLink}>Sign up for free</a>
        </p>
      </form>
    </div>
  );
};

export default LoginCard;
