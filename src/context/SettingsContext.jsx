import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  // 1. FETCH SETTINGS
  // `silent` suppresses console noise. The backend may not be up the instant
  // the app mounts (especially in dev), so a failed first attempt is expected —
  // we quietly retry rather than spamming red errors into the console.
  const fetchSettings = async (silent = false) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000`;
      const res = await fetch(`${apiUrl}/api/auth/admin/settings`);
      const data = await res.json();

      if (data.success && data.settings) {
        setSettings(data.settings);

        //  GLOBAL DOM MANIPULATION:
        // This instantly changes the Browser Tab title across all 50+ pages!
        if (data.settings.platformName) {
          document.title = data.settings.platformName;
        }
      }
      return true;
    } catch (err) {
      // Network/connection error (backend not reachable yet). Stay quiet unless
      // explicitly asked to report — see the retry logic below.
      if (!silent && import.meta.env.DEV) {
        console.warn('[settings] backend not reachable yet — will retry');
      }
      return false;
    }
  };

  // Run on initial load, with a few quiet retries in case the backend is still
  // starting up. Stops as soon as it succeeds; no red errors in the console.
  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    const MAX_ATTEMPTS = 5;

    const tryLoad = async () => {
      if (cancelled) return;
      const ok = await fetchSettings(true); // silent
      attempt += 1;
      if (!ok && !cancelled && attempt < MAX_ATTEMPTS) {
        setTimeout(tryLoad, 2000); // retry in 2s
      }
    };

    tryLoad();
    return () => { cancelled = true; };
  }, []);

  //  GLOBAL SESSION TIMEOUT LOGIC
  // This watches the user's mouse and keyboard. If they are idle for X minutes, it boots them out.
  useEffect(() => {
    if (!settings?.sessionTimeout) return;
    
    let timeoutId;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Find out who is logged in
        const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            
            // Only auto-logout students (optional: you can remove this check to logout admins too)
            if (user && user.role !== 'admin' && user.role !== 'super-admin') {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
                
                // Alert the backend they went offline
                fetch(`http://${window.location.hostname}:5000/api/auth/logout`, { method: 'POST' }).catch(() => {});
                
                // Kick them back to login page
                window.location.href = '/login?timeout=true';
            }
        }
      }, settings.sessionTimeout * 60 * 1000); // Convert minutes to milliseconds
    };

    // Listeners for activity
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    
    // Attach global listeners
    events.forEach(e => window.addEventListener(e, resetTimeout));
    resetTimeout(); // Start the timer

    // Cleanup listeners when component unmounts
    return () => {
      clearTimeout(timeoutId);
      events.forEach(e => window.removeEventListener(e, resetTimeout));
    };
  }, [settings?.sessionTimeout]); // Re-run if admin changes the timeout in settings

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);