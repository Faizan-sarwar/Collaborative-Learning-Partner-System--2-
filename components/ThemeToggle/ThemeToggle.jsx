import React, { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  // 🟢 Read from the single source of truth: localStorage + the DOM attribute
  useEffect(() => {
    const savedTheme =
      localStorage.getItem('theme') ||
      document.documentElement.getAttribute('data-theme') ||
      'dark';
    setIsDark(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const persistThemeToBackend = async (theme) => {
    // Only attempt if the user is logged in; failures are non-fatal.
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      // We only want to update settings.theme, so we send a minimal payload.
      // Backend /api/auth/profile accepts multipart, so we use FormData.
      const fd = new FormData();
      const storedUser = JSON.parse(
        localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
      );
      const mergedSettings = { ...(storedUser.settings || {}), theme };
      fd.append('settings', JSON.stringify(mergedSettings));

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const result = await res.json();
      if (result.success && result.user) {
        // Keep cached user in sync so Settings won't fight us next time it loads
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify({ ...storedUser, ...result.user }));
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch {
      /* network errors are non-fatal — the local theme still works */
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    persistThemeToBackend(newTheme);
  };

  return (
    <button
      className={styles.toggleButton}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;