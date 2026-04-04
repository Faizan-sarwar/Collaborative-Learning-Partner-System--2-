import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context (The Tower)
const SettingsContext = createContext();

// 2. Create the Provider (The Broadcaster)
export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        platformName: 'Collaborative Learning', // Fallback defaults
        allowNewRegistrations: true,
        maintenanceMode: false,
        supportEmail: 'support@example.com'
    });
    const [loadingSettings, setLoadingSettings] = useState(true);

    const fetchSettings = async () => {
        try {
            // Fetch global settings from your backend
            const res = await fetch('http://localhost:5000/api/auth/admin/settings');
            const data = await res.json();
            
            if (data.success && data.settings) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error("Failed to fetch global settings:", error);
        } finally {
            setLoadingSettings(false);
        }
    };

    // Fetch once when the app loads
    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loadingSettings, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

// 3. Custom Hook so other files can easily "tune in"
export const useSettings = () => useContext(SettingsContext);