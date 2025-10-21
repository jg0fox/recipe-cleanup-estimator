import express from 'express';
import { scrapeRecipe } from '../services/recipeScraper.js';
import { detectEquipment } from '../services/equipmentDetector.js';
import { calculateCleanupTime } from '../services/cleanupCalculator.js';
import { getCachedRecipeAnalysis, cacheRecipeAnalysis } from '../models/database.js';

const router = express.Router();

/**
 * POST /api/analyze-recipe
 * Analyze a recipe URL and estimate cleanup time
 */
router.post('/analyze-recipe', async (req, res) => {
  try {
    const { url, userPreferences } = req.body;

    // Validate input
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Recipe URL is required'
      });
    }

    // Check cache first
    const cached = getCachedRecipeAnalysis(url);
    if (cached) {
      console.log('Returning cached analysis for:', url);

      // Recalculate cleanup with user preferences (cached equipment detection)
      const cleanup = calculateCleanupTime(cached.equipmentInstances, userPreferences);

      return res.json({
        success: true,
        data: {
          recipe: {
            title: cached.scrapedData.title,
            totalTime: cached.scrapedData.totalTime,
            servings: cached.scrapedData.servings,
            image: cached.scrapedData.image,
            url: cached.scrapedData.url
          },
          cleanup,
          cached: true
        }
      });
    }

    // Scrape recipe
    console.log('Scraping recipe from:', url);
    const recipe = await scrapeRecipe(url);

    // Detect equipment
    console.log('Detecting equipment...');
    const equipmentInstances = detectEquipment(recipe);
    console.log(`Detected ${equipmentInstances.length} equipment items`);

    // Calculate cleanup time
    console.log('Calculating cleanup time...');
    const cleanup = calculateCleanupTime(equipmentInstances, userPreferences);

    // Cache the analysis
    cacheRecipeAnalysis(url, recipe, equipmentInstances);

    // Return results
    res.json({
      success: true,
      data: {
        recipe: {
          title: recipe.title,
          totalTime: recipe.totalTime,
          servings: recipe.servings,
          image: recipe.image,
          url: recipe.url
        },
        cleanup,
        cached: false
      }
    });

  } catch (error) {
    console.error('Error analyzing recipe:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze recipe'
    });
  }
});

/**
 * GET /api/analyze-recipe/debug
 * Debug endpoint to test equipment detection
 */
router.post('/analyze-recipe/debug', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Recipe URL is required'
      });
    }

    const recipe = await scrapeRecipe(url);
    const equipmentInstances = detectEquipment(recipe);

    res.json({
      success: true,
      data: {
        recipe: {
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions
        },
        equipmentDetected: equipmentInstances.map(e => ({
          type: e.type,
          quantity: e.quantity,
          confidence: e.confidence,
          reasoning: e.reasoning,
          complexity: e.complexity
        }))
      }
    });

  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
