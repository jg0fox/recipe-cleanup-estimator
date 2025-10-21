import express from 'express';
import { saveFeedback, getAllFeedback } from '../models/database.js';

const router = express.Router();

/**
 * POST /api/feedback
 * Submit user feedback on cleanup time estimates
 */
router.post('/feedback', async (req, res) => {
  try {
    const { recipeUrl, estimatedTime, actualTime, equipmentFeedback, comments } = req.body;

    // Validate input
    if (!recipeUrl || estimatedTime === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Recipe URL and estimated time are required'
      });
    }

    // Save feedback
    saveFeedback({
      recipeUrl,
      estimatedTime,
      actualTime,
      equipmentFeedback,
      comments
    });

    console.log('Feedback saved for recipe:', recipeUrl);

    res.json({
      success: true,
      message: 'Thank you for your feedback!'
    });

  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save feedback'
    });
  }
});

/**
 * GET /api/feedback
 * Get all feedback (for analytics/admin purposes)
 */
router.get('/feedback', async (req, res) => {
  try {
    const feedback = getAllFeedback();

    res.json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve feedback'
    });
  }
});

export default router;
