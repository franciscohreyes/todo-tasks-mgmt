import { useState, useEffect } from 'react';
import { userPreferencesService } from '../services/userPreferencesService';

/**
 * Custom hook to handle dark mode state and persistence
 * @returns [isDarkMode, toggleDarkMode] tuple
 */
export const useDarkMode = (): [boolean, () => void] => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load initial dark mode preference
    const loadDarkModePreference = async () => {
      try {
        const preferences = await userPreferencesService.getUserPreferences();
        setIsDarkMode(preferences.isDarkMode);
        updateDocumentClass(preferences.isDarkMode);
      } catch (error) {
        console.error('Error loading dark mode preference:', error);
        // Fallback to system preference if no stored preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        updateDocumentClass(prefersDark);
      }
    };

    loadDarkModePreference();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      updateDocumentClass(e.matches);
      userPreferencesService.saveUserPreferences({ isDarkMode: e.matches });
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  /**
   * Update document class based on dark mode state
   * @param isDark boolean indicating if dark mode is enabled
   */
  const updateDocumentClass = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  /**
   * Toggle dark mode and persist the preference
   */
  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateDocumentClass(newDarkMode);

    try {
      await userPreferencesService.saveUserPreferences({ isDarkMode: newDarkMode });
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
    }
  };

  return [isDarkMode, toggleDarkMode];
}; 