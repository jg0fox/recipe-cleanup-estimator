/**
 * Recipe Storage Service
 * Handles saving, retrieving, and managing recipes in localStorage
 */

const STORAGE_KEY = 'savedRecipes';

/**
 * Get all saved recipes from localStorage
 * @returns {Array} Array of saved recipe objects
 */
export function getSavedRecipes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading saved recipes:', error);
    return [];
  }
}

/**
 * Save a recipe to localStorage
 * @param {Object} recipeData - Recipe data including ingredients, instructions, cleanup time
 * @returns {Object} The saved recipe with generated ID
 */
export function saveRecipe(recipeData) {
  try {
    const savedRecipes = getSavedRecipes();

    // Generate unique ID using timestamp and random number
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const recipeToSave = {
      id,
      savedAt: new Date().toISOString(),
      ...recipeData
    };

    // Add to beginning of array (most recent first)
    savedRecipes.unshift(recipeToSave);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipes));

    return recipeToSave;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Failed to save recipe');
  }
}

/**
 * Get a specific recipe by ID
 * @param {string} recipeId - The unique recipe ID
 * @returns {Object|null} The recipe object or null if not found
 */
export function getRecipeById(recipeId) {
  try {
    const savedRecipes = getSavedRecipes();
    return savedRecipes.find(recipe => recipe.id === recipeId) || null;
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    return null;
  }
}

/**
 * Delete a recipe from localStorage
 * @param {string} recipeId - The unique recipe ID to delete
 * @returns {boolean} True if deleted successfully
 */
export function deleteRecipe(recipeId) {
  try {
    const savedRecipes = getSavedRecipes();
    const filteredRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecipes));
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
}

/**
 * Check if a recipe URL is already saved
 * @param {string} recipeUrl - The recipe URL to check
 * @returns {Object|null} The saved recipe if found, null otherwise
 */
export function isRecipeSaved(recipeUrl) {
  try {
    const savedRecipes = getSavedRecipes();
    return savedRecipes.find(recipe => recipe.url === recipeUrl) || null;
  } catch (error) {
    console.error('Error checking if recipe is saved:', error);
    return null;
  }
}

/**
 * Get the count of saved recipes
 * @returns {number} Number of saved recipes
 */
export function getSavedRecipesCount() {
  return getSavedRecipes().length;
}

/**
 * Clear all saved recipes (with confirmation recommended)
 * @returns {boolean} True if cleared successfully
 */
export function clearAllRecipes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing recipes:', error);
    return false;
  }
}

/**
 * Format recipe data for saving
 * Combines recipe metadata and cleanup analysis into saveable format
 * @param {Object} recipe - Recipe data from scraper
 * @param {Object} cleanup - Cleanup analysis data
 * @returns {Object} Formatted recipe data ready to save
 */
export function formatRecipeForSaving(recipe, cleanup) {
  return {
    title: recipe.title || 'Untitled Recipe',
    url: recipe.url || '',
    image: recipe.image || null,
    description: recipe.summary || recipe.description || '',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    metadata: {
      prepTime: recipe.prepTime || 'Unknown',
      cookTime: recipe.cookTime || 'Unknown',
      totalTime: recipe.totalTime || 'Unknown',
      servings: recipe.servings || 'Unknown',
      cleanupTime: cleanup.totalTime || 0,
      cleanupTimeFormatted: formatTime(cleanup.totalTime || 0),
      cleanupConfidence: cleanup.confidence || 0,
      cleanupRange: cleanup.estimateRange || null
    }
  };
}

/**
 * Format seconds into human-readable time
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  if (!seconds || seconds === 0) return '0 minutes';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0
      ? `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`
      : `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}
