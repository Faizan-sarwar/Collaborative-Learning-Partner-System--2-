// src/motion/motion.js
// =============================================================================
// CENTRAL MOTION SYSTEM
// All spring physics, durations, and variants live here.
// Import from this single file to keep animation language consistent.
// =============================================================================

import { useRef, useEffect, useState } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

// -----------------------------------------------------------------------------
// 1. SPRING TOKENS — the "personality" of every motion
// -----------------------------------------------------------------------------

export const springs = {
  // Default — for most UI transitions (buttons, modal opens, layout shifts)
  soft:   { type: 'spring', stiffness: 100, damping: 20, mass: 1 },

  // Bouncier — for CTAs, success states, anything celebratory
  bouncy: { type: 'spring', stiffness: 280, damping: 18, mass: 0.9 },

  // Snappy — for micro-interactions (hover, tap, toggles)
  snappy: { type: 'spring', stiffness: 400, damping: 30 },

  // Slow & majestic — for hero entries, big reveals
  slow:   { type: 'spring', stiffness: 60,  damping: 18 },

  // Stiff — almost no bounce, but still spring-driven (page transitions)
  stiff:  { type: 'spring', stiffness: 350, damping: 40 },
};

// -----------------------------------------------------------------------------
// 2. EASE TOKENS — fallback when we need timing curves (rarely)
// -----------------------------------------------------------------------------

export const eases = {
  out:     [0.16, 1, 0.3, 1],     // expo-out — for elegant slides
  inOut:   [0.83, 0, 0.17, 1],    // expo-inOut — for scrubbed reveals
  smooth:  [0.4, 0, 0.2, 1],      // material-style
};

// -----------------------------------------------------------------------------
// 3. ORCHESTRATION VARIANTS — staggered container/item pattern
// -----------------------------------------------------------------------------

// Use on a wrapping element. Children with `variants={fadeUpItem}` will stagger.
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

// Slightly slower stagger for hero-scale sections
export const staggerHero = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.12,
    },
  },
};

// -----------------------------------------------------------------------------
// 4. ITEM VARIANTS — drop these into any child of a stagger container
// -----------------------------------------------------------------------------

export const fadeUpItem = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: springs.soft,
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(6px)',
    transition: { duration: 0.25, ease: eases.smooth },
  },
};

export const fadeInItem = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5, ease: eases.out } },
  exit:   { opacity: 0, transition: { duration: 0.2 } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: springs.soft },
  exit:   { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: springs.soft },
  exit:   { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export const scaleInItem = {
  hidden: { opacity: 0, scale: 0.85 },
  show:   { opacity: 1, scale: 1, transition: springs.bouncy },
  exit:   { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

// Used by cards with viewport detection (whileInView)
export const viewportRise = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springs.soft, delay: 0.05 },
  },
};

// -----------------------------------------------------------------------------
// 5. PAGE TRANSITION VARIANTS — for routes, modals, slide-deck flows
// -----------------------------------------------------------------------------

export const pageVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      ...springs.stiff,
      when: 'beforeChildren',
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: eases.smooth },
  },
};

// Slide-deck — for multi-step forms / wizards / onboarding
export const slideDeckVariants = {
  hidden: (direction = 1) => ({
    opacity: 0,
    x: direction * 60,
    scale: 0.97,
  }),
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springs.soft,
  },
  exit: (direction = 1) => ({
    opacity: 0,
    x: direction * -60,
    scale: 0.97,
    transition: { duration: 0.25, ease: eases.smooth },
  }),
};

// -----------------------------------------------------------------------------
// 6. INTERACTION PRESETS — drop directly onto motion components
// -----------------------------------------------------------------------------

// Buttons: tap scales down, hover lifts subtly. Glow comes from CSS.
export const buttonInteraction = {
  whileHover: { y: -2, scale: 1.02, transition: springs.snappy },
  whileTap:   { scale: 0.96, transition: springs.snappy },
};

// Cards: lift + slight scale on hover
export const cardInteraction = {
  whileHover: { y: -6, transition: springs.snappy },
};

// Nav links: subtle lift
export const navLinkInteraction = {
  whileHover: { y: -1, transition: springs.snappy },
  whileTap:   { scale: 0.95 },
};

// -----------------------------------------------------------------------------
// 7. HOOKS — 3D tilt, magnetic cursor attraction, reduced-motion respect
// -----------------------------------------------------------------------------

/**
 * useTilt — gives any ref element a 3D tilt that tracks the cursor.
 *
 * Usage:
 *   const { ref, style } = useTilt({ max: 12 });
 *   <motion.div ref={ref} style={style}>...</motion.div>
 *
 * The element must have `transform-style: preserve-3d` and a parent with
 * `perspective: 1000px` (or use the `perspective` option below).
 */
export function useTilt({ max = 10, scale = 1.02, perspective = 1000 } = {}) {
  const ref = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scaleMV = useMotionValue(1);

  const sx = useSpring(rotateX, springs.snappy);
  const sy = useSpring(rotateY, springs.snappy);
  const ss = useSpring(scaleMV, springs.snappy);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // -1 .. 1
      const px = (e.clientX - cx) / (rect.width / 2);
      const py = (e.clientY - cy) / (rect.height / 2);
      rotateY.set(px * max);
      rotateX.set(-py * max);
      scaleMV.set(scale);
    };

    const handleLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
      scaleMV.set(1);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [max, scale, rotateX, rotateY, scaleMV]);

  return {
    ref,
    style: {
      perspective,
      rotateX: sx,
      rotateY: sy,
      scale: ss,
      transformStyle: 'preserve-3d',
    },
  };
}

/**
 * useMagnetic — element drifts toward the cursor while hovered.
 *
 * Usage:
 *   const { ref, style } = useMagnetic({ strength: 0.35 });
 *   <motion.button ref={ref} style={style}>Click</motion.button>
 */
export function useMagnetic({ strength = 0.3, radius = 120 } = {}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springs.snappy);
  const sy = useSpring(y, springs.snappy);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    // Track on the window so the magnet feels alive even before direct hover
    window.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength, radius, x, y]);

  return { ref, style: { x: sx, y: sy } };
}

/**
 * useReducedMotion — wraps `window.matchMedia` so animations can collapse
 * to opacity-only when the user has prefers-reduced-motion enabled.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}