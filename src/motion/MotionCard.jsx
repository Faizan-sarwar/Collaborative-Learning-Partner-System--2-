// src/components/motion/MotionCard.jsx
// =============================================================================
// MotionCard — drop-in glassy card with 3D tilt and viewport reveal.
//
// Props:
//   • tilt          — enable 3D tilt-on-hover (default true)
//   • elevation     — base shadow depth: 'subtle' | 'medium' | 'glow' (default 'medium')
//   • reveal        — animate in on scroll-into-view (default true)
//   • glow          — colored shadow glow: 'purple' | 'cyan' | 'blue' | null
//   • delay         — extra delay (sec) for staggered reveals
//
// Usage:
//   <MotionCard glow="purple" reveal>
//     <h3>Card title</h3>
//     <p>...</p>
//   </MotionCard>
// =============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { springs, useTilt, viewportRise } from './motion';
import styles from './MotionCard.module.css';

const MotionCard = React.forwardRef(function MotionCard(
  {
    tilt = true,
    elevation = 'medium',
    reveal = true,
    glow = null,
    delay = 0,
    className = '',
    children,
    ...rest
  },
  forwardedRef
) {
  const { ref: tiltRef, style: tiltStyle } = useTilt({ max: tilt ? 8 : 0, scale: 1.015 });

  const setRefs = (node) => {
    tiltRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const classes = [
    styles.card,
    styles[`elevation_${elevation}`],
    glow ? styles[`glow_${glow}`] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // If reveal is enabled, use viewport-triggered entry. Otherwise render static.
  const motionProps = reveal
    ? {
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once: true, amount: 0.25 },
        variants: viewportRise,
        transition: { ...springs.soft, delay },
      }
    : {};

  return (
    <motion.div
      ref={setRefs}
      className={classes}
      style={tilt ? tiltStyle : undefined}
      whileHover={{ y: -4 }}
      transition={springs.snappy}
      {...motionProps}
      {...rest}
    >
      {/* Inner wrapper carries the transformZ for parallax depth */}
      <div className={styles.inner} style={tilt ? { transform: 'translateZ(20px)' } : undefined}>
        {children}
      </div>
    </motion.div>
  );
});

export default MotionCard;