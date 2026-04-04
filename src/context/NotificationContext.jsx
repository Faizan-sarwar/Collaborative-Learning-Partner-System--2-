import React, { createContext, useState, useContext, useCallback } from 'react';

// Create Context
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to trigger a new notification
  const addNotification = useCallback((message, type = 'xp', points = 0) => {
    const id = Date.now();
    const newNotification = { id, message, type, points };
    
    setNotifications((prev) => [newNotification, ...prev]);

    // Automatically remove the notification after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for easy access
export const useNotification = () => useContext(NotificationContext);