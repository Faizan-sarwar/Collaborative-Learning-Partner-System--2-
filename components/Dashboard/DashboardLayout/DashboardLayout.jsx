import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DashboardLayout.module.css';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import { springs } from '../../../src/motion/motion';

/**
 * Persistent layout for all student pages.
 *
 *  CRITICAL FIX: Sidebar is rendered OUTSIDE any motion / PageWrapper /
 * transformed element. CSS `position: fixed` is broken by any ancestor with a
 * `transform`, `filter`, `perspective`, `backdrop-filter`, or
 * `will-change: transform` — the fixed element starts behaving like
 * `position: absolute` relative to that ancestor instead of the viewport,
 * which makes the sidebar grow with page content. By rendering it as a
 * top-level sibling we avoid this trap entirely.
 *
 * PageWrapper has been removed from this layout for the same reason. If you
 * want a fade on layout-mount, the inner motion.div on the Outlet already
 * provides per-page transitions.
 */
const DashboardLayout = ({ hideSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const location = useLocation();

  return (
    <div className={`${styles.dashboard} ${hideSidebar ? styles.dashboardFull : ''}`}>
      {/*  Sidebar at the TOP level — no transformed ancestors */}
      {!hideSidebar && (
        <DashboardSidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile overlay — also top-level so its fixed positioning works */}
      <AnimatePresence>
        {isSidebarOpen && !hideSidebar && (
          <motion.div
            key="overlay"
            className={styles.overlay}
            onClick={() => setIsSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Main area sits next to the fixed sidebar */}
      <div className={`${styles.mainArea} ${hideSidebar ? styles.mainAreaFull : ''}`}>
        {/* Header persists across navigations */}
        <DashboardHeader
          isFullWidth={hideSidebar}
          toggleSidebar={toggleSidebar}
        />

        <main className={styles.content}>
          {/*
             Page transitions live HERE — only the inner content gets a transform.
            The sidebar above is untouched, so position:fixed stays anchored to the viewport.
          */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className={styles.contentInner}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={springs.soft}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;