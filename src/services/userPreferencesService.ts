import { api } from './api';
// Types
import { UserPreferences } from '../types/preferences';

/**
 * Service to handle user preferences persistence
 */
export const userPreferencesService = {
  /**
   * Get user preferences from localStorage or API
   * @returns Promise<UserPreferences>
   */
  async getUserPreferences(): Promise<UserPreferences> {
    // Check if we're in production
    if (import.meta.env.PROD) {
      try {
        const response = await api.get('/user/preferences');
        return response.data;
      } catch (error) {
        console.error('Error fetching user preferences:', error);
        return this.getLocalPreferences();
      }
    }
    return this.getLocalPreferences();
  },

  /**
   * Get preferences from localStorage
   * @returns UserPreferences
   */
  getLocalPreferences(): UserPreferences {
    const preferences = localStorage.getItem('userPreferences');
    if (preferences) {
      return JSON.parse(preferences);
    }
    return { isDarkMode: false };
  },

  /**
   * Save user preferences to localStorage or API
   * @param preferences UserPreferences to save
   * @returns Promise<void>
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    // Check if we're in production
    if (import.meta.env.PROD) {
      try {
        await api.post('/user/preferences', preferences);
      } catch (error) {
        console.error('Error saving user preferences:', error);
        this.saveLocalPreferences(preferences);
      }
    } else {
      this.saveLocalPreferences(preferences);
    }
  },

  /**
   * Save preferences to localStorage
   * @param preferences UserPreferences to save
   */
  saveLocalPreferences(preferences: UserPreferences): void {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  },
}; 