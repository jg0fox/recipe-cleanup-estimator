import recipeScraper from '@brandonrjguth/recipe-scraper';

/**
 * Scrape recipe data from a URL
 * @param {string} url - Recipe URL to scrape
 * @returns {Promise<Object>} Scraped recipe data
 */
export async function scrapeRecipe(url) {
  try {
    // Validate URL format
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url)) {
      throw new Error('Invalid URL format. Please provide a valid HTTP/HTTPS URL.');
    }

    // Use recipe-scraper to fetch and parse recipe
    const recipe = await recipeScraper(url);

    // Normalize the recipe data
    const normalizedRecipe = {
      title: recipe.name || 'Unknown Recipe',
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: normalizeInstructions(recipe.instructions),
      totalTime: recipe.time?.total || recipe.totalTime || 'Unknown',
      prepTime: recipe.time?.prep || recipe.prepTime || null,
      cookTime: recipe.time?.cook || recipe.cookTime || null,
      servings: recipe.servings || recipe.yields || 'Unknown',
      image: recipe.image || null,
      url: url
    };

    // Ensure we have valid data
    if (!normalizedRecipe.ingredients.length && !normalizedRecipe.instructions.length) {
      throw new Error('Unable to extract recipe data from this URL. The site may not be supported.');
    }

    return normalizedRecipe;
  } catch (error) {
    // Provide more helpful error messages
    if (error.message.includes('fetch')) {
      throw new Error('Unable to fetch the recipe. Please check the URL and try again.');
    }
    if (error.message.includes('parse')) {
      throw new Error('Unable to parse the recipe. This site may not be supported.');
    }
    throw error;
  }
}

/**
 * Normalize instructions into an array of strings
 * @param {string|Array|Object} instructions - Raw instructions from scraper
 * @returns {Array<string>} Normalized instruction steps
 */
function normalizeInstructions(instructions) {
  if (!instructions) {
    return [];
  }

  // If already an array of strings
  if (Array.isArray(instructions)) {
    return instructions.filter(step => typeof step === 'string' && step.trim().length > 0);
  }

  // If it's a string, try to split by common delimiters
  if (typeof instructions === 'string') {
    // Try splitting by numbered steps first
    let steps = instructions.split(/\d+\.\s+/).filter(s => s.trim().length > 0);

    // If that doesn't work, try splitting by newlines
    if (steps.length <= 1) {
      steps = instructions.split(/\n+/).filter(s => s.trim().length > 0);
    }

    // If still only one step, try splitting by periods followed by capital letters
    if (steps.length <= 1) {
      steps = instructions.split(/\.\s+(?=[A-Z])/).filter(s => s.trim().length > 0);
    }

    return steps;
  }

  // If it's an object with a text property
  if (typeof instructions === 'object' && instructions.text) {
    return normalizeInstructions(instructions.text);
  }

  return [];
}

/**
 * Get combined text from recipe for equipment detection
 * @param {Object} recipe - Normalized recipe object
 * @returns {string} Combined text of ingredients and instructions
 */
export function getRecipeText(recipe) {
  const ingredientsText = recipe.ingredients.join(' ');
  const instructionsText = recipe.instructions.join(' ');
  return `${recipe.title} ${ingredientsText} ${instructionsText}`.toLowerCase();
}

/**
 * Validate if a URL is likely to be a recipe
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL looks like a recipe URL
 */
export function isLikelyRecipeUrl(url) {
  const recipePatterns = [
    /recipe/i,
    /cooking/i,
    /kitchen/i,
    /food/i,
    /allrecipes/i,
    /foodnetwork/i,
    /bonappetit/i,
    /seriouseats/i,
    /epicurious/i,
    /tasty/i,
    /delish/i,
    /yummly/i
  ];

  return recipePatterns.some(pattern => pattern.test(url));
}
