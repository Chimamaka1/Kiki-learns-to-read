/**
 * Helper Utilities
 * Common utility functions
 * 
 * @module firebase/utils/helpers
 */

const FirebaseHelpers = (function() {
  'use strict';

  /**
   * Show message notification
   * @param {string} message - Message text
   * @param {string} type - Message type (success, error, info)
   */
  function showMessage(message, type = 'info') {
    let messageDiv = document.getElementById('auth-message');
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.id = 'auth-message';
      messageDiv.className = 'auth-message';
      document.body.appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 4000);
  }

  /**
   * Open modal by ID
   * @param {string} modalId - Modal element ID
   */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
  }

  /**
   * Close modal by ID
   * @param {string} modalId - Modal element ID
   */
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  }

  /**
   * Format duration in seconds to MM:SS
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted time
   */
  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Calculate stars based on score
   * @param {number} score - Game score
   * @param {Object} thresholds - Score thresholds {three: 90, two: 70, one: 50}
   * @returns {number} Number of stars (0-3)
   */
  function calculateStars(score, thresholds = { three: 90, two: 70, one: 50 }) {
    if (score >= thresholds.three) return 3;
    if (score >= thresholds.two) return 2;
    if (score >= thresholds.one) return 1;
    return 0;
  }

  /**
   * Format timestamp to readable date
   * @param {Object} timestamp - Firestore timestamp
   * @returns {string} Formatted date
   */
  function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public API
  return {
    showMessage,
    openModal,
    closeModal,
    formatDuration,
    calculateStars,
    formatTimestamp,
    debounce
  };
})();
