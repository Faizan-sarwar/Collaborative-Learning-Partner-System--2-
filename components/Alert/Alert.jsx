import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Alert.module.css';
import { springs } from '../../src/motion/motion';

const Alert = ({ type = 'error', message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            className={`${styles.alert} ${styles[type]}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={springs.bouncy}
            layout
        >
            <motion.div
                className={styles.iconWrapper}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ ...springs.bouncy, delay: 0.1 }}
            >
                {type === 'success' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                )}
            </motion.div>
            <motion.span
                className={styles.message}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
            >
                {message}
            </motion.span>
            <motion.button
                className={styles.closeBtn}
                onClick={onClose}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={springs.snappy}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </motion.button>
        </motion.div>
    );
};

export default Alert;