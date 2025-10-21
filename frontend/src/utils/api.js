/**
 * API client for Recipe Cleanup Time Estimator backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Analyze a recipe URL and get cleanup time estimate
 * @param {string} url - Recipe URL
 * @param {Object} userPreferences - User cleaning preferences
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeRecipe(url, userPreferences = {}) {
  const response = await fetch(`${API_BASE_URL}/api/analyze-recipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      userPreferences: {
        hasDishwasher: userPreferences.hasDishwasher || false,
        cleaningStyle: userPreferences.cleaningStyle || 'normal',
        soakingPreference: userPreferences.soakingPreference || false,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze recipe');
  }

  return response.json();
}

/**
 * Submit user feedback
 * @param {Object} feedbackData - Feedback data
 * @returns {Promise<Object>} Submission result
 */
export async function submitFeedback(feedbackData) {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit feedback');
  }

  return response.json();
}

/**
 * Format seconds into human-readable time
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}
