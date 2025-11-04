import recipeScraper from '@brandonrjguth/recipe-scraper';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Normalize JSON-LD instructions into an array of strings
 * @param {string|Array|Object} instructions - Raw instructions from JSON-LD
 * @returns {Array<string>} Normalized instruction steps
 */
function normalizeJsonLdInstructions(instructions) {
  if (!instructions) {
    return [];
  }

  // If it's an array
  if (Array.isArray(instructions)) {
    return instructions
      .map(step => {
        // HowToStep objects have a 'text' property
        if (typeof step === 'object' && step.text) {
          return step.text;
        }
        // HowToSection objects have itemListElement
        if (typeof step === 'object' && step.itemListElement) {
          return normalizeJsonLdInstructions(step.itemListElement);
        }
        // Plain strings
        if (typeof step === 'string') {
          return step;
        }
        return null;
      })
      .flat()
      .filter(step => typeof step === 'string' && step.trim().length > 0);
  }

  // If it's a string, split it into steps
  if (typeof instructions === 'string') {
    return normalizeInstructions(instructions);
  }

  return [];
}

/**
 * Scrape recipe data from generic HTML using common patterns
 * @param {string} url - Recipe URL to scrape
 * @param {string} html - HTML content
 * @returns {Object} Scraped recipe data from HTML patterns
 */
function scrapeGenericHtml(url, html) {
  const $ = cheerio.load(html);

  // Detect which recipe plugin/system is being used
  const hasWPRM = html.includes('wprm-recipe');
  const hasTasty = html.includes('tasty-recipe');
  const hasCard = html.includes('card ingredients') || html.includes('card directions');

  let title = '';
  let ingredients = [];
  let instructions = [];

  // Try different extraction strategies based on detected plugin
  if (hasWPRM) {
    // WP Recipe Maker plugin
    title = $('.wprm-recipe-name').first().text().trim() ||
            $('.recipe h1').first().text().trim() ||
            $('.recipe h2').first().text().trim();

    // Ingredients
    $('.wprm-recipe-ingredients-container li, .wprm-recipe-ingredient').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 0) {
        ingredients.push(text);
      }
    });

    // Instructions
    $('.wprm-recipe-instructions-container li, .wprm-recipe-instruction').each((i, elem) => {
      const text = $(elem).find('.wprm-recipe-instruction-text').text().trim() || $(elem).text().trim();
      if (text && text.length > 0) {
        instructions.push(text);
      }
    });
  } else if (hasTasty) {
    // Tasty Recipes plugin
    title = $('.tasty-recipes-title, .tasty-recipe-title').first().text().trim() ||
            $('.recipe h1').first().text().trim();

    // Ingredients
    $('.tasty-recipes-ingredients li, .tasty-recipe-ingredients li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 0) {
        ingredients.push(text);
      }
    });

    // Instructions
    $('.tasty-recipes-instructions li, .tasty-recipe-instructions li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 0) {
        instructions.push(text);
      }
    });
  } else if (hasCard) {
    // Card-based recipe layout (Webflow, custom themes)
    title = $('.recipe h1, .recipe h2').first().text().trim();

    // Ingredients
    $('.card.ingredients ul li, [class*="ingredient"] ul li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 0) {
        ingredients.push(text);
      }
    });

    // Instructions
    $('.card.directions ol li, [class*="direction"] ol li, [class*="instruction"] ol li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 0) {
        instructions.push(text);
      }
    });
  } else {
    // Generic fallback - look for common patterns
    title = $('h1[class*="recipe"], h2[class*="recipe"]').first().text().trim() ||
            $('.recipe h1, .recipe h2').first().text().trim() ||
            $('h1').first().text().trim();

    // Try to find ingredients by looking for headings containing "ingredient"
    $('h2, h3, h4').each((i, heading) => {
      const headingText = $(heading).text().toLowerCase();
      if (headingText.includes('ingredient')) {
        // Get the next sibling ul
        const list = $(heading).next('ul');
        if (list.length > 0) {
          list.find('li').each((j, li) => {
            const text = $(li).text().trim();
            if (text && text.length > 0) {
              ingredients.push(text);
            }
          });
        }
      }
    });

    // Try to find instructions by looking for headings containing "instruction" or "direction"
    $('h2, h3, h4').each((i, heading) => {
      const headingText = $(heading).text().toLowerCase();
      if (headingText.includes('instruction') || headingText.includes('direction')) {
        // Get the next sibling ol or ul
        const list = $(heading).next('ol, ul');
        if (list.length > 0) {
          list.find('li').each((j, li) => {
            const text = $(li).text().trim();
            if (text && text.length > 0) {
              instructions.push(text);
            }
          });
        }
      }
    });

    // If still no ingredients/instructions, look for any lists with ingredient/instruction classes
    if (ingredients.length === 0) {
      $('[class*="ingredient"] li').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length > 0) {
          ingredients.push(text);
        }
      });
    }

    if (instructions.length === 0) {
      $('[class*="instruction"] li, [class*="direction"] li').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length > 0) {
          instructions.push(text);
        }
      });
    }
  }

  // Validate we got minimum data
  if (!title || ingredients.length === 0 || instructions.length === 0) {
    throw new Error(
      `Incomplete recipe data from HTML parsing (title: ${!!title}, ` +
      `ingredients: ${ingredients.length}, instructions: ${instructions.length})`
    );
  }

  // Return normalized format
  return {
    title: title,
    ingredients: ingredients,
    instructions: instructions,
    totalTime: 'Unknown',
    prepTime: null,
    cookTime: null,
    servings: 'Unknown',
    image: null,
    url: url
  };
}

/**
 * Scrape recipe data from JSON-LD structured data
 * @param {string} url - Recipe URL to scrape
 * @returns {Promise<Object>} Scraped recipe data from JSON-LD
 */
async function scrapeJsonLd(url) {
  try {
    // Fetch the HTML with browser-like headers
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Find all JSON-LD script tags
    const jsonLdScripts = $('script[type="application/ld+json"]');

    let recipeData = null;

    // Parse each JSON-LD script and look for Recipe schema
    jsonLdScripts.each((i, elem) => {
      try {
        const jsonContent = $(elem).html();
        const data = JSON.parse(jsonContent);

        // Handle single object or array of objects
        const dataArray = Array.isArray(data) ? data : [data];

        // Look for Recipe type
        for (const item of dataArray) {
          if (item['@type'] === 'Recipe' ||
              (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))) {
            recipeData = item;
            break;
          }
          // Sometimes Recipe is nested in @graph
          if (item['@graph']) {
            const graphRecipe = item['@graph'].find(g =>
              g['@type'] === 'Recipe' ||
              (Array.isArray(g['@type']) && g['@type'].includes('Recipe'))
            );
            if (graphRecipe) {
              recipeData = graphRecipe;
              break;
            }
          }
        }

        if (recipeData) return false; // Break the .each loop
      } catch (parseError) {
        // Continue to next script tag if this one fails to parse
      }
    });

    if (!recipeData) {
      throw new Error('No Recipe structured data found in JSON-LD');
    }

    // Extract and normalize recipe data
    const ingredients = Array.isArray(recipeData.recipeIngredient)
      ? recipeData.recipeIngredient
      : [];

    const instructions = normalizeJsonLdInstructions(
      recipeData.recipeInstructions || []
    );

    // Validate minimum required data
    if (!recipeData.name || ingredients.length === 0 || instructions.length === 0) {
      throw new Error('Incomplete recipe data in JSON-LD (missing name, ingredients, or instructions)');
    }

    // Normalize to app's data structure
    const normalizedRecipe = {
      title: recipeData.name || 'Unknown Recipe',
      ingredients: ingredients,
      instructions: instructions,
      totalTime: recipeData.totalTime || 'Unknown',
      prepTime: recipeData.prepTime || null,
      cookTime: recipeData.cookTime || null,
      servings: recipeData.recipeYield || recipeData.yield || 'Unknown',
      image: recipeData.image?.url || recipeData.image || null,
      url: url
    };

    return normalizedRecipe;
  } catch (error) {
    // Re-throw with context
    throw new Error(`JSON-LD scraping failed: ${error.message}`);
  }
}

/**
 * Scrape recipe data from a URL
 * @param {string} url - Recipe URL to scrape
 * @returns {Promise<Object>} Scraped recipe data
 */
export async function scrapeRecipe(url) {
  // Validate URL format
  const urlPattern = /^https?:\/\/.+/i;
  if (!urlPattern.test(url)) {
    throw new Error('Invalid URL format. Please provide a valid HTTP/HTTPS URL.');
  }

  // Try the primary scraper first
  try {
    // Use recipe-scraper library to fetch and parse recipe
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

    console.log(`✓ Recipe scraped successfully using primary scraper: ${normalizedRecipe.title}`);
    return normalizedRecipe;

  } catch (primaryError) {
    // Primary scraper failed, try JSON-LD fallback
    console.log(`Primary scraper failed (${primaryError.message}), attempting JSON-LD fallback...`);

    let htmlContent = null;

    try {
      const jsonLdRecipe = await scrapeJsonLd(url);
      console.log(`✓ Recipe scraped successfully using JSON-LD fallback: ${jsonLdRecipe.title}`);
      return jsonLdRecipe;

    } catch (jsonLdError) {
      // JSON-LD failed, try generic HTML scraping (Layer 3)
      console.log(`JSON-LD scraping failed (${jsonLdError.message}), attempting generic HTML scraping...`);

      try {
        // Fetch HTML if we don't have it yet
        if (!htmlContent) {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'DNT': '1',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000
          });
          htmlContent = response.data;
        }

        const genericRecipe = scrapeGenericHtml(url, htmlContent);
        console.log(`✓ Recipe scraped successfully using generic HTML scraping: ${genericRecipe.title}`);
        return genericRecipe;

      } catch (genericHtmlError) {
        // All three methods failed, provide helpful error message
        console.error('All scraping methods failed:', {
          primary: primaryError.message,
          jsonLd: jsonLdError.message,
          genericHtml: genericHtmlError.message
        });

        const hostname = new URL(url).hostname;

        // Provide specific error messages based on failure type
        if (primaryError.message && primaryError.message.includes('validation failed')) {
          throw new Error(
            `Unable to scrape this recipe from ${hostname}. The site may not be supported or the recipe format is unusual. ` +
            `We tried standard scraping, JSON-LD extraction, and generic HTML parsing.`
          );
        }

        if (primaryError.message && primaryError.message.includes('Site not yet supported')) {
          throw new Error(
            `This recipe site (${hostname}) is not directly supported, and we couldn't extract recipe data using fallback methods. ` +
            `Try a recipe from AllRecipes, Food Network, Bon Appétit, or other major recipe sites.`
          );
        }

        // Generic error with helpful guidance
        throw new Error(
          `Unable to extract recipe data from ${hostname}. ` +
          `This site may not have properly formatted recipe data. ` +
          `We tried multiple extraction methods without success. ` +
          `Try a different recipe or use a recipe from a major recipe website.`
        );
      }
    }
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
