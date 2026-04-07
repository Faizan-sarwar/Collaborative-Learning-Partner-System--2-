import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  // 1. FETCH SETTINGS
  const fetchSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/admin/settings');
      const data = await res.json();
      
      if (data.success && data.settings) {
        setSettings(data.settings);
        
        // 🟢 GLOBAL DOM MANIPULATION: 
        // This instantly changes the Browser Tab title across all 50+ pages!
        if (data.settings.platformName) {
            document.title = data.settings.platformName;
        }
      }
    } catch (err) {
      console.error('Failed to load global settings', err);
    }
  };

  // Run on initial load
  useEffect(() => {
    fetchSettings();
  }, []);

  // 🟢 GLOBAL SESSION TIMEOUT LOGIC
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
                fetch('http://localhost:5000/api/auth/logout', { method: 'POST' }).catch(()=>console.log("Logout signal failed"));
                
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