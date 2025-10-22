import express from 'express';
import multer from 'multer';
import { analyzeKitchenPhoto, validateImageFile } from '../services/kitchenPhotoAnalyzer.js';

const router = express.Router();

// Configure multer for memory storage (we'll process and delete immediately)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

/**
 * POST /api/analyze-photo
 * Analyze a kitchen photo and estimate cleanup time
 */
router.post('/analyze-photo', upload.single('photo'), async (req, res) => {
  try {
    // Validate file
    const validation = validateImageFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Parse user preferences
    let userPreferences = {};
    try {
      userPreferences = req.body.userPreferences ?
        JSON.parse(req.body.userPreferences) :
        {};
    } catch (e) {
      console.warn('Failed to parse userPreferences, using defaults');
    }

    console.log('Analyzing kitchen photo...');
    console.log('File:', req.file.originalname, req.file.mimetype, `${(req.file.size / 1024).toFixed(2)}KB`);

    // Analyze the photo
    const result = await analyzeKitchenPhoto(
      req.file.buffer,
      req.file.mimetype,
      userPreferences
    );

    console.log('Analysis complete:', {
      totalTime: result.analysis.totalTime,
      itemsDetected: result.analysis.equipment.length,
      areasDetected: result.analysis.areas.length,
      confidence: result.analysis.confidence
    });

    // Return results (file buffer is automatically garbage collected)
    res.json({
      success: true,
      data: result.analysis
    });

  } catch (error) {
    console.error('Error analyzing photo:', error);

    // Don't expose internal error messages to client
    const userMessage = error.message.includes('API key') ?
      error.message :
      'Failed to analyze photo. Please try again with a clearer image.';

    res.status(500).json({
      success: false,
      error: userMessage
    });
  }
});

export default router;
