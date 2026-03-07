import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './VerifyOTP.module.css';
import PageTransition from '../../components/PageTransition/PageTransition';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';
  const type = location.state?.type || 'verification';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      pasted.split('').forEach((char, i) => { newOtp[i] = char; });
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsVerifying(false);

    // Simulate success
    if (type === 'password-reset') {
      navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } });
    } else {
      navigate('/dashboard');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    // Simulate resend API call
    console.log('Resending OTP to', email);
  };

  const maskedEmail = email.includes('@')
    ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : email;

  return (
    <PageTransition>
      <div className={styles.container}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <div className={styles.illustrationWrapper}>
            <svg
              className={styles.illustration}
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Shield */}
              <path d="M200 100L260 130V200C260 245 235 275 200 290C165 275 140 245 140 200V130L200 100Z" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.3)" strokeWidth="3" />
              <path d="M185 200L195 210L220 185" stroke="rgba(16,185,129,0.6)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* OTP boxes */}
              <rect x="95" y="320" width="35" height="40" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <rect x="138" y="320" width="35" height="40" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <rect x="181" y="320" width="35" height="40" rx="6" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
              <rect x="224" y="320" width="35" height="40" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <rect x="267" y="320" width="35" height="40" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              
              {/* Phone */}
              <rect x="280" y="100" width="50" height="80" rx="8" fill="rgba(255,255,255,0.1)" />
              <rect x="285" y="108" width="40" height="55" rx="4" fill="rgba(99,102,241,0.15)" />
              <circle cx="305" cy="172" r="4" fill="rgba(255,255,255,0.12)" />
              
              {/* Notification bell */}
              <path d="M305 115C305 112 307 110 310 110C313 110 315 112 315 115V125H305V115Z" fill="rgba(255,255,255,0.2)" />
              <circle cx="310" cy="128" r="3" fill="rgba(255,255,255,0.15)" />
              
              {/* Floating elements */}
              <circle cx="80" cy="150" r="6" fill="rgba(139,92,246,0.4)" />
              <circle cx="340" cy="250" r="5" fill="rgba(16,185,129,0.4)" />
              <circle cx="100" cy="280" r="4" fill="rgba(99,102,241,0.3)" />
              
              {/* Sparkles */}
              <path d="M330 140 L332 145 L337 147 L332 149 L330 154 L328 149 L323 147 L328 145Z" fill="rgba(255,255,255,0.3)" />
              <path d="M70 200 L73 207 L80 210 L73 213 L70 220 L67 213 L60 210 L67 207Z" fill="rgba(255,255,255,0.25)" />
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

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h1 className={styles.title}>Verify Your Identity</h1>
              <p className={styles.subtitle}>
                We've sent a 6-digit verification code to <strong className={styles.emailHighlight}>{maskedEmail}</strong>
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`${styles.otpInput} ${digit ? styles.filled : ''} ${error ? styles.otpError : ''}`}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.verifyButton} disabled={isVerifying}>
                {isVerifying ? (
                  <span className={styles.spinner}></span>
                ) : (
                  'Verify Code'
                )}
              </button>

              <div className={styles.resendSection}>
                <p className={styles.resendText}>Didn't receive the code?</p>
                {canResend ? (
                  <button type="button" className={styles.resendButton} onClick={handleResend}>
                    Resend Code
                  </button>
                ) : (
                  <span className={styles.timerText}>Resend in {resendTimer}s</span>
                )}
              </div>

              <Link to={type === 'password-reset' ? '/forgot-password' : '/login'} className={styles.backLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
                {type === 'password-reset' ? 'Change email' : 'Back to Sign In'}
              </Link>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyOTP;
