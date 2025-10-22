import Anthropic from '@anthropic-ai/sdk';

/**
 * Analyze a kitchen photo using Claude Vision to estimate cleanup time
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} mimeType - Image MIME type (e.g., 'image/jpeg')
 * @param {Object} userPreferences - User cleaning preferences
 * @returns {Promise<Object>} Analysis results with cleanup estimate
 */
export async function analyzeKitchenPhoto(imageBuffer, mimeType, userPreferences = {}) {
  // Initialize Anthropic client
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const anthropic = new Anthropic({ apiKey });

  // Convert image buffer to base64
  const base64Image = imageBuffer.toString('base64');

  // Create detailed prompt for kitchen analysis
  const prompt = `You are an expert at analyzing kitchen mess and estimating cleanup time. Analyze this kitchen photo and provide a detailed cleanup estimate.

Please identify and assess:

1. **Dirty Dishes & Cookware**:
   - Count and type (pots, pans, plates, bowls, utensils)
   - Material (cast iron, stainless steel, nonstick, glass)
   - Mess level (light/medium/heavy for each)

2. **Countertops**:
   - Spills, stains, crumbs
   - Food prep residue
   - Clutter level

3. **Stovetop/Cooktop**:
   - Splatter and grease
   - Burnt-on food
   - Burner condition

4. **Sink Area**:
   - Dishes stacked in sink
   - Sink cleanliness

5. **Other Visible Areas**:
   - Floor condition if visible
   - Appliances needing wiping
   - Any other mess

Please respond in this EXACT JSON format (no markdown, just raw JSON):
{
  "equipment": [
    {
      "item": "item name",
      "quantity": number,
      "type": "cookware|prep|baking|utensil|appliance",
      "material": "cast_iron|stainless_steel|nonstick|glass|ceramic|plastic|generic",
      "messLevel": "light|medium|heavy",
      "estimatedTime": seconds as number,
      "notes": "specific observations"
    }
  ],
  "areas": [
    {
      "name": "countertops|stovetop|sink|floor",
      "condition": "clean|light_mess|moderate_mess|heavy_mess",
      "estimatedTime": seconds as number,
      "notes": "what needs to be done"
    }
  ],
  "overallAssessment": {
    "totalItems": number,
    "messLevel": "light|moderate|heavy|extreme",
    "complexity": "low|medium|high",
    "recommendations": ["specific tip 1", "specific tip 2"]
  },
  "confidence": 0.0 to 1.0
}

IMPORTANT:
- Be realistic with time estimates
- Light mess items: 30-90 seconds each
- Medium mess items: 90-180 seconds each
- Heavy mess items: 180-300+ seconds each
- Consider if items are dishwasher-safe
- Don't include items that are already clean
- If you can't see something clearly, note lower confidence`;

  try {
    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract the JSON response
    const textContent = response.content[0].text;

    // Parse the JSON (Claude might wrap it in markdown, so we need to extract it)
    let analysisData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) ||
                       textContent.match(/```\n([\s\S]*?)\n```/) ||
                       [null, textContent];
      analysisData = JSON.parse(jsonMatch[1] || textContent);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', textContent);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Calculate total cleanup time
    const equipmentTime = analysisData.equipment.reduce((sum, item) =>
      sum + (item.estimatedTime * item.quantity), 0
    );
    const areasTime = analysisData.areas.reduce((sum, area) =>
      sum + area.estimatedTime, 0
    );
    let totalTime = equipmentTime + areasTime;

    // Apply user preferences
    if (userPreferences.hasDishwasher) {
      // Reduce time for dishwasher-safe items
      const dishwasherSavings = analysisData.equipment
        .filter(item => ['glass', 'ceramic', 'stainless_steel', 'generic'].includes(item.material))
        .reduce((sum, item) => sum + (item.estimatedTime * item.quantity * 0.6), 0);
      totalTime = totalTime - dishwasherSavings;
    }

    if (userPreferences.cleaningStyle === 'quick') {
      totalTime = totalTime * 0.7;
    } else if (userPreferences.cleaningStyle === 'thorough') {
      totalTime = totalTime * 1.4;
    }

    // Format response
    return {
      success: true,
      analysis: {
        totalTime: Math.round(totalTime),
        equipment: analysisData.equipment,
        areas: analysisData.areas,
        breakdown: {
          equipment: Math.round(equipmentTime),
          areas: Math.round(areasTime),
        },
        assessment: analysisData.overallAssessment,
        confidence: analysisData.confidence,
        estimateRange: {
          min: Math.round(totalTime * 0.8),
          max: Math.round(totalTime * 1.2),
        },
      },
      userPreferences,
    };

  } catch (error) {
    console.error('Error analyzing kitchen photo:', error);

    if (error.status === 401) {
      throw new Error('Invalid Anthropic API key. Please check your configuration.');
    }

    throw new Error(error.message || 'Failed to analyze kitchen photo');
  }
}

/**
 * Validate image file
 * @param {Object} file - Multer file object
 * @returns {Object} Validation result
 */
export function validateImageFile(file) {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
    };
  }

  return { valid: true };
}
