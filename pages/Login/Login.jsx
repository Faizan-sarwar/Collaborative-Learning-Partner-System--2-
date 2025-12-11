import styles from './Login.module.css';
import LoginCard from '../../components/LoginCard/LoginCard';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className={styles.container}>
      {/* Left Panel - Illustration */}
      <div className={styles.leftPanel}>
        <div className={styles.illustrationWrapper}>
          <svg
            className={styles.illustration}
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Desk */}
            <rect x="80" y="280" width="240" height="12" rx="6" fill="rgba(255,255,255,0.1)" />
            <rect x="100" y="292" width="8" height="60" rx="4" fill="rgba(255,255,255,0.08)" />
            <rect x="292" y="292" width="8" height="60" rx="4" fill="rgba(255,255,255,0.08)" />

            {/* Laptop */}
            <rect x="130" y="220" width="140" height="60" rx="8" fill="rgba(255,255,255,0.15)" />
            <rect x="140" y="230" width="120" height="40" rx="4" fill="rgba(99,102,241,0.3)" />
            <rect x="120" y="280" width="160" height="8" rx="4" fill="rgba(255,255,255,0.1)" />

            {/* Screen glow */}
            <ellipse cx="200" cy="250" rx="60" ry="30" fill="url(#screenGlow)" opacity="0.5" />

            {/* Person - Body */}
            <ellipse cx="200" cy="200" rx="35" ry="45" fill="rgba(255,255,255,0.12)" />

            {/* Person - Head */}
            <circle cx="200" cy="130" r="35" fill="rgba(255,255,255,0.15)" />

            {/* Hair */}
            <path
              d="M165 120 Q200 80 235 120 Q240 100 230 95 Q200 70 170 95 Q160 100 165 120Z"
              fill="rgba(139,92,246,0.4)"
            />

            {/* Arms */}
            <path
              d="M165 180 Q140 200 145 230"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M235 180 Q260 200 255 230"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Book on side */}
            <rect x="290" y="255" width="30" height="40" rx="3" fill="rgba(99,102,241,0.3)" transform="rotate(-15 290 255)" />
            <rect x="292" y="257" width="26" height="2" rx="1" fill="rgba(255,255,255,0.2)" transform="rotate(-15 292 257)" />

            {/* Coffee cup */}
            <rect x="70" y="260" width="20" height="25" rx="3" fill="rgba(255,255,255,0.1)" />
            <ellipse cx="80" cy="260" rx="10" ry="3" fill="rgba(255,255,255,0.08)" />
            <path d="M90 267 Q100 270 95 280" stroke="rgba(255,255,255,0.08)" strokeWidth="4" strokeLinecap="round" />

            {/* Floating elements */}
            <circle cx="320" cy="100" r="8" fill="rgba(99,102,241,0.4)" />
            <circle cx="80" cy="150" r="6" fill="rgba(139,92,246,0.4)" />
            <circle cx="340" cy="200" r="5" fill="rgba(16,185,129,0.4)" />
            <circle cx="60" cy="220" r="4" fill="rgba(99,102,241,0.3)" />

            {/* Stars/sparkles */}
            <path d="M100 100 L103 107 L110 110 L103 113 L100 120 L97 113 L90 110 L97 107Z" fill="rgba(255,255,255,0.3)" />
            <path d="M300 150 L302 155 L307 157 L302 159 L300 164 L298 159 L293 157 L298 155Z" fill="rgba(255,255,255,0.25)" />

            <defs>
              <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </radialGradient>
            </defs>
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

      {/* Right Panel - Login Card */}
      <div className={styles.rightPanel}>
        <LoginCard />
      </div>
    </div>
  );
};

export default Login;
