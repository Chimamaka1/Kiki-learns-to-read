/**
 * Local Storage Utilities
 * Handles local storage operations
 * 
 * @module firebase/utils/storage
 */

const StorageUtil = (function() {
  'use strict';

  const CURRENT_KID_KEY = 'currentKidId';
  const SETTINGS_KEY = 'appSettings';

  /**
   * Get current active kid ID
   * @returns {string|null} Kid ID or null
   */
  function getCurrentKid() {
    return localStorage.getItem(CURRENT_KID_KEY);
  }

  /**
   * Set current active kid
   * @param {string} kidId - Kid ID
   */
  function setCurrentKid(kidId) {
    localStorage.setItem(CURRENT_KID_KEY, kidId);
    window.dispatchEvent(new CustomEvent('currentKidChanged', { 
      detail: { kidId } 
    }));
  }

  /**
   * Clear current kid
   */
  function clearCurrentKid() {
    localStorage.removeItem(CURRENT_KID_KEY);
  }

  /**
   * Save app settings to local storage
   * @param {Object} settings - Settings object
   */
  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  /**
   * Load app settings from local storage
   * @returns {Object|null} Settings object or null
   */
  function loadSettings() {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : null;
  }

  /**
   * Clear all app data
   */
  function clearAll() {
    localStorage.removeItem(CURRENT_KID_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  }

  // Public API
  return {
    getCurrentKid,
    setCurrentKid,
    clearCurrentKid,
    saveSettings,
    loadSettings,
    clearAll
  };
})();
