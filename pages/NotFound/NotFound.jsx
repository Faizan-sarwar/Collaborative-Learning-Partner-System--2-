import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import styles from '../NotFound/NotFound.module.css';
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  return (
    <div className={styles.container}>
      <div className={styles.glowTopRight} />
      <div className={styles.glowBottomLeft} />
      <motion.div
        className={styles.orb}
        style={{ top: "20%", left: "10%", width: 6, height: 6, background: "var(--accent-purple)", boxShadow: "var(--glow-purple)" }}
        animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={styles.orb}
        style={{ top: "60%", right: "15%", width: 8, height: 8, background: "var(--accent-blue)", boxShadow: "var(--glow-blue)" }}
        animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className={styles.orb}
        style={{ top: "30%", right: "25%", width: 4, height: 4, background: "var(--accent-cyan)", boxShadow: "var(--glow-cyan)" }}
        animate={{ y: [0, -25, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className={styles.orb}
        style={{ bottom: "25%", left: "20%", width: 5, height: 5, background: "var(--accent-pink)" }}
        animate={{ y: [0, -18, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <div className={styles.gridOverlay} />
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={styles.logoWrapper}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
        </motion.div>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            className={styles.badgeDot}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Page Not Found
        </motion.div>
        <motion.h1
          className={styles.title}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          404
        </motion.h1>
        <motion.h2
          className={styles.subtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          Lost in the <span className={styles.subtitleGradient}>study session</span>
        </motion.h2>
        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </motion.p>
        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <motion.button
            onClick={() => navigate("/")}
            className={styles.primaryBtn}
            whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.97 }}
          >
            <Home size={18} />
            Back to Home
          </motion.button>
          <motion.button
            onClick={() => navigate(-1)}
            className={styles.secondaryBtn}
            whileHover={{ scale: 1.04, borderColor: "rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>
        </motion.div>
        <motion.div
          className={styles.pathInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>
            Attempted path: <code className={styles.pathCode}>{location.pathname}</code>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default NotFound;
