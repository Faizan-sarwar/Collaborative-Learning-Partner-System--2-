import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TextInput.module.css';
import { springs } from '../../src/motion/motion';

const TextInput = ({ label, type = 'text', placeholder, value, onChange, icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={styles.inputGroup}>
      <motion.label
        className={styles.label}
        animate={{ color: focused ? '#a5b4fc' : undefined }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <motion.div
        className={styles.inputWrapper}
        animate={{ scale: focused ? 1.01 : 1 }}
        transition={springs.snappy}
      >
        {icon && <span className={styles.inputIcon}>{icon}</span>}
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPassword && (
          <motion.button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={springs.snappy}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={showPassword ? 'hide' : 'show'}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex' }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default TextInput;