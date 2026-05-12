// src/components/motion/MotionButton.jsx
// =============================================================================
// MotionButton — drop-in replacement for <button>
//
// Features:
//   • Spring-driven hover lift + tap scale-down
//   • Magnetic cursor attraction (optional, on by default for primary)
//   • Animated glow halo behind the button
//   • Sheen sweep on hover
//
// Usage:
//   <MotionButton variant="primary" onClick={...}>Get Started</MotionButton>
//   <MotionButton variant="ghost" magnetic={false}>Cancel</MotionButton>
// =============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { springs, useMagnetic }  from './motion';
import styles from './MotionButton.module.css';

const MotionButton = React.forwardRef(function MotionButton(
  {
    variant = 'primary',
    magnetic = true,
    glow = true,
    children,
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...rest
  },
  forwardedRef
) {
  const { ref: magnetRef, style: magnetStyle } = useMagnetic({
    strength: magnetic && !disabled ? 0.25 : 0,
    radius: 100,
  });

  // Combine forwarded ref with the magnetic ref
  const setRefs = (node) => {
    magnetRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  return (
    <motion.button
      ref={setRefs}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${className}`}
      style={magnetic && !disabled ? magnetStyle : undefined}
      whileHover={disabled ? {} : { y: -2, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={springs.snappy}
      {...rest}
    >
      {/* Glow halo behind button */}
      {glow && variant === 'primary' && (
        <motion.span
          aria-hidden
          className={styles.glow}
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          transition={springs.soft}
        />
      )}

      {/* Sheen sweep */}
      <span aria-hidden className={styles.sheen} />

      <span className={styles.content}>{children}</span>
    </motion.button>
  );
});

export default MotionButton;