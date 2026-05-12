// src/components/motion/PageWrapper.jsx
// =============================================================================
// PageWrapper — wrap any route/page with this for orchestrated entry.
//
// Replaces the old PageTransition. Wrap a page's outermost element with it,
// then mark any direct child with `<motion.div variants={fadeUpItem}>` to
// have it cascade in.
//
// Usage:
//   import PageWrapper from '@/components/motion/PageWrapper';
//   import { fadeUpItem } from '@/motion/motion';
//   import { motion } from 'framer-motion';
//
//   const About = () => (
//     <PageWrapper>
//       <motion.h1 variants={fadeUpItem}>About us</motion.h1>
//       <motion.p  variants={fadeUpItem}>...</motion.p>
//     </PageWrapper>
//   );
//
// For route-level AnimatePresence, see App.jsx integration notes.
// =============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from './motion';

const PageWrapper = ({ children, className = '', ...rest }) => {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;