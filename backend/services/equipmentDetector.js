import { DETECTION_PATTERNS, createPattern, escapeRegex } from '../utils/patterns.js';
import { EQUIPMENT_TYPES } from '../utils/constants.js';

/**
 * Main equipment detection function with 5-phase algorithm
 * @param {Object} recipe - Normalized recipe object
 * @returns {Array} Array of detected equipment instances with metadata
 */
export function detectEquipment(recipe) {
  const recipeText = `${recipe.title} ${recipe.ingredients.join(' ')} ${recipe.instructions.join(' ')}`.toLowerCase();

  // Phase 1: Scan for all equipment mentions
  const allMentions = findAllEquipmentMentions(recipeText);

  // Phase 2: Group mentions by equipment type and detect quantities
  const groupedMentions = groupAndQuantifyMentions(allMentions, recipeText);

  // Phase 3: Analyze usage patterns and complexity
  const instances = [];
  for (const [equipmentType, mentionData] of Object.entries(groupedMentions)) {
    const usageAnalysis = analyzeUsagePatterns(mentionData, recipeText);

    instances.push({
      type: equipmentType,
      quantity: mentionData.quantity,
      usagePatterns: usageAnalysis.patterns,
      complexity: usageAnalysis.complexity,
      confidence: mentionData.confidence,
      reasoning: mentionData.reasoning
    });
  }

  // Phase 4: Add implied equipment
  const impliedEquipment = detectImpliedEquipment(recipeText, instances);
  instances.push(...impliedEquipment);

  // Phase 5: Resolve conflicts and deduplicate
  return resolveEquipmentConflicts(instances);
}

/**
 * Phase 1: Find all equipment mentions using comprehensive patterns
 */
function findAllEquipmentMentions(recipeText) {
  const mentions = [];

  // Direct mentions (highest confidence: 0.95)
  for (const [equipmentType, terms] of Object.entries(DETECTION_PATTERNS.direct_mentions)) {
    for (const term of terms) {
      const regex = createPattern(term);
      const matches = [...recipeText.matchAll(regex)];

      for (const match of matches) {
        // Extract context around the match (30 chars before and after)
        const contextStart = Math.max(0, match.index - 30);
        const contextEnd = Math.min(recipeText.length, match.index + match[0].length + 30);
        const context = recipeText.substring(contextStart, contextEnd).trim();

        mentions.push({
          type: equipmentType,
          term: match[0],
          position: match.index,
          confidence: 0.95,
          source: 'direct_mention',
          context: `...${context}...`
        });
      }
    }
  }

  // Technique-based detection (medium confidence: 0.75)
  for (const [equipmentType, techniques] of Object.entries(DETECTION_PATTERNS.technique_mappings)) {
    for (const technique of techniques) {
      const regex = createPattern(technique);
      const matches = [...recipeText.matchAll(regex)];

      for (const match of matches) {
        mentions.push({
          type: equipmentType,
          term: match[0],
          position: match.index,
          confidence: 0.75,
          source: 'technique_mapping'
        });
      }
    }
  }

  // Ingredient-based detection (lower confidence: 0.5)
  for (const [equipmentType, ingredients] of Object.entries(DETECTION_PATTERNS.ingredient_prep_patterns)) {
    for (const ingredient of ingredients) {
      const regex = createPattern(ingredient);
      if (regex.test(recipeText)) {
        mentions.push({
          type: equipmentType,
          term: ingredient,
          position: -1,
          confidence: 0.5,
          source: 'ingredient_pattern'
        });
      }
    }
  }

  // Cultural indicators (medium confidence: 0.7)
  for (const [equipmentType, indicators] of Object.entries(DETECTION_PATTERNS.cultural_indicators)) {
    for (const indicator of indicators) {
      const regex = createPattern(indicator);
      if (regex.test(recipeText)) {
        mentions.push({
          type: equipmentType,
          term: indicator,
          position: -1,
          confidence: 0.7,
          source: 'cultural_indicator'
        });
      }
    }
  }

  return mentions;
}

/**
 * Phase 2: Group mentions by type and detect quantities
 */
function groupAndQuantifyMentions(mentions, recipeText) {
  const grouped = {};

  // Group by equipment type and combine confidence scores
  for (const mention of mentions) {
    if (!grouped[mention.type]) {
      grouped[mention.type] = {
        mentions: [],
        quantity: 1,
        confidence: 0,
        reasoning: []
      };
    }

    grouped[mention.type].mentions.push(mention);
    // Keep the highest confidence score
    grouped[mention.type].confidence = Math.max(grouped[mention.type].confidence, mention.confidence);
  }

  // Detect quantities for each equipment type
  for (const equipmentType of Object.keys(grouped)) {
    const quantityAnalysis = detectQuantityForEquipment(equipmentType, recipeText, grouped[equipmentType].mentions);
    grouped[equipmentType].quantity = quantityAnalysis.quantity;

    // Add source citations from mentions
    const uniqueContexts = [...new Set(grouped[equipmentType].mentions.map(m => m.context).filter(Boolean))];
    if (uniqueContexts.length > 0) {
      grouped[equipmentType].reasoning.push(`Found in recipe: "${uniqueContexts[0]}"`);
    }

    grouped[equipmentType].reasoning.push(...quantityAnalysis.reasoning);
  }

  return grouped;
}

/**
 * Detect quantity of a specific equipment type
 */
function detectQuantityForEquipment(equipmentType, recipeText, mentions) {
  let quantity = 1;
  const reasoning = [];

  // Build equipment name variations for pattern matching
  const equipmentName = equipmentType.replace(/_/g, ' ');
  const nameVariations = [
    equipmentName,
    'pan', 'pot', 'bowl', 'knife', 'dish'  // Generic fallbacks
  ];

  // Check for explicit quantity mentions
  for (const nameVar of nameVariations) {
    const explicitPatterns = [
      new RegExp(`(\\d+)\\s*(?:large |medium |small |)${escapeRegex(nameVar)}`, 'gi'),
      new RegExp(`(two|three|four|five)\\s*${escapeRegex(nameVar)}`, 'gi'),
      new RegExp(`a pair of\\s*${escapeRegex(nameVar)}`, 'gi')
    ];

    for (const pattern of explicitPatterns) {
      const matches = [...recipeText.matchAll(pattern)];
      if (matches.length > 0) {
        const numberText = matches[0][1];
        const parsedQuantity = parseQuantityText(numberText);
        if (parsedQuantity > quantity) {
          quantity = parsedQuantity;
          reasoning.push(`Explicit quantity mentioned: "${matches[0][0]}"`);
        }
      }
    }
  }

  // Check for separating indicators
  for (const indicator of DETECTION_PATTERNS.quantity_indicators.separating_words) {
    const pattern = new RegExp(`${escapeRegex(indicator)}\\s*(?:${nameVariations.map(escapeRegex).join('|')})`, 'gi');
    if (pattern.test(recipeText)) {
      quantity = Math.max(quantity, 2);
      reasoning.push(`Separating word detected: "${indicator}"`);
      break;  // Only count once
    }
  }

  // Check for concurrent cooking indicators
  for (const indicator of DETECTION_PATTERNS.quantity_indicators.concurrent_cooking) {
    if (recipeText.includes(indicator)) {
      // Check if this indicator is near our equipment mentions
      const nearEquipment = mentions.some(m => {
        if (m.position < 0) return false;
        const indicatorPos = recipeText.indexOf(indicator);
        return Math.abs(indicatorPos - m.position) < 200;  // Within 200 characters
      });

      if (nearEquipment) {
        quantity = Math.max(quantity, 2);
        reasoning.push(`Concurrent cooking detected: "${indicator}"`);
        break;
      }
    }
  }

  // Check for size variations (might indicate multiple equipment)
  const sizePattern = new RegExp(
    `(${DETECTION_PATTERNS.quantity_indicators.size_descriptors.join('|')})\\s*(?:${nameVariations.map(escapeRegex).join('|')})`,
    'gi'
  );
  const sizeMatches = [...recipeText.matchAll(sizePattern)];
  const uniqueSizes = new Set(sizeMatches.map(m => m[1].toLowerCase()));

  if (uniqueSizes.size > 1) {
    quantity = Math.max(quantity, uniqueSizes.size);
    reasoning.push(`Multiple sizes detected: ${Array.from(uniqueSizes).join(', ')}`);
  }

  return { quantity, reasoning };
}

/**
 * Parse quantity text (numbers or words) to integer
 */
function parseQuantityText(text) {
  const numberMap = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'a pair': 2
  };

  const lowerText = text.toLowerCase();
  if (numberMap[lowerText]) {
    return numberMap[lowerText];
  }

  const parsed = parseInt(text);
  return isNaN(parsed) ? 1 : parsed;
}

/**
 * Phase 3: Analyze usage patterns and complexity modifiers
 */
function analyzeUsagePatterns(mentionData, recipeText) {
  const patterns = [];
  const complexity = { base: 'low', modifiers: [] };

  // Check for complexity modifiers
  for (const [modifierType, indicators] of Object.entries(DETECTION_PATTERNS.complexity_modifiers)) {
    for (const indicator of indicators) {
      if (recipeText.includes(indicator.toLowerCase())) {
        patterns.push(modifierType);
        complexity.modifiers.push({
          type: modifierType,
          indicator,
          description: getModifierDescription(modifierType)
        });
        break;  // Only add each modifier type once
      }
    }
  }

  // Determine overall complexity
  if (complexity.modifiers.length === 0) {
    complexity.base = 'low';
  } else if (complexity.modifiers.length <= 2) {
    complexity.base = 'medium';
  } else {
    complexity.base = 'high';
  }

  return { patterns, complexity };
}

/**
 * Get human-readable description for complexity modifiers
 */
function getModifierDescription(modifierType) {
  const descriptions = {
    'sticky_sauce': 'Sticky or caramelized substances that require extra scrubbing',
    'oil_heavy': 'Heavy oil usage that creates greasy residue',
    'burnt_potential': 'High heat cooking that may create burnt-on food',
    'dairy_burning': 'Dairy products that can burn and stick to surfaces',
    'tomato_staining': 'Tomato-based ingredients that can stain surfaces',
    'raw_meat': 'Raw meat handling requiring sanitization',
    'flour_batter': 'Flour or batter that can create dusty, sticky messes',
    'egg_coating': 'Egg-based mixtures that can be difficult to clean',
    'spice_grinding': 'Spice residue that can stain and be hard to remove',
    'acidic_foods': 'Acidic ingredients that may require special cleaning',
    'sugar_work': 'Sugar-based cooking that creates very sticky residues',
    'chocolate_melting': 'Melted chocolate that can be difficult to clean',
    'dough_work': 'Dough preparation that can leave flour residue everywhere',
    'fermentation': 'Fermentation processes that create additional cleanup',
    'marinating': 'Marinating that uses containers and creates spills'
  };

  return descriptions[modifierType] || 'Additional cleaning complexity';
}

/**
 * Phase 4: Detect implied equipment based on other detected equipment
 */
function detectImpliedEquipment(recipeText, existingInstances) {
  const implied = [];
  const existingTypes = new Set(existingInstances.map(i => i.type));

  // Add cutting board if knives are detected
  const hasKnife = existingTypes.has('chef_knife') ||
    existingTypes.has('paring_knife') ||
    existingTypes.has('cleaver') ||
    existingTypes.has('utility_knife');

  if (hasKnife && !existingTypes.has('cutting_board')) {
    implied.push({
      type: 'cutting_board',
      quantity: 1,
      usagePatterns: ['chopping'],
      complexity: { base: 'low', modifiers: [] },
      confidence: 0.9,
      reasoning: ['Implied by knife usage']
    });
  }

  // Add measuring tools if recipe has specific measurements
  const hasMeasurements = /\b(\d+\/?\d*\s*(?:cup|tablespoon|teaspoon|tsp|tbsp|ml|oz))/gi.test(recipeText);

  if (hasMeasurements) {
    if (!existingTypes.has('measuring_cups') && !existingTypes.has('measuring_spoons')) {
      implied.push({
        type: 'measuring_cups',
        quantity: 1,
        usagePatterns: ['measuring'],
        complexity: { base: 'low', modifiers: [] },
        confidence: 0.8,
        reasoning: ['Implied by specific measurements in recipe']
      });

      implied.push({
        type: 'measuring_spoons',
        quantity: 1,
        usagePatterns: ['measuring'],
        complexity: { base: 'low', modifiers: [] },
        confidence: 0.8,
        reasoning: ['Implied by specific measurements in recipe']
      });
    }
  }

  // Add mixing bowl for baking/mixing recipes
  const hasMixingWords = /(mix|combine|stir together|blend)/gi.test(recipeText);
  if (hasMixingWords && !existingTypes.has('mixing_bowl')) {
    implied.push({
      type: 'mixing_bowl',
      quantity: 1,
      usagePatterns: ['mixing'],
      complexity: { base: 'low', modifiers: [] },
      confidence: 0.7,
      reasoning: ['Implied by mixing instructions']
    });
  }

  return implied;
}

/**
 * Phase 5: Resolve equipment conflicts and remove duplicates
 */
function resolveEquipmentConflicts(instances) {
  const resolved = {};

  // Define pan type hierarchy - more specific types take precedence
  const panTypes = new Set(['cast_iron_pan', 'stainless_steel_pan', 'nonstick_pan', 'frying_pan', 'skillet']);
  const panTypeSpecificity = {
    'cast_iron_pan': 3,
    'stainless_steel_pan': 3,
    'nonstick_pan': 3,
    'frying_pan': 1,
    'skillet': 1
  };

  for (const instance of instances) {
    // If we haven't seen this type before, or this instance has higher confidence, use it
    if (!resolved[instance.type] || resolved[instance.type].confidence < instance.confidence) {
      resolved[instance.type] = instance;
    } else if (resolved[instance.type].confidence === instance.confidence) {
      // If equal confidence, take the higher quantity
      if (instance.quantity > resolved[instance.type].quantity) {
        resolved[instance.type].quantity = instance.quantity;
      }
      // Merge reasoning
      resolved[instance.type].reasoning = [
        ...new Set([...resolved[instance.type].reasoning, ...instance.reasoning])
      ];
    }
  }

  // Remove generic pan types if we have specific material types
  const detectedPanTypes = Object.keys(resolved).filter(type => panTypes.has(type));

  if (detectedPanTypes.length > 1) {
    // Find the most specific pan type
    const mostSpecific = detectedPanTypes.reduce((best, current) => {
      const bestSpec = panTypeSpecificity[best] || 0;
      const currentSpec = panTypeSpecificity[current] || 0;
      return currentSpec > bestSpec ? current : best;
    });

    // Remove generic pan types if we have a more specific one
    detectedPanTypes.forEach(panType => {
      if (panType !== mostSpecific && panTypeSpecificity[panType] < panTypeSpecificity[mostSpecific]) {
        delete resolved[panType];
      }
    });
  }

  return Object.values(resolved);
}

/**
 * Helper function to debug equipment detection
 */
export function getDetectionDebugInfo(recipe) {
  const recipeText = `${recipe.title} ${recipe.ingredients.join(' ')} ${recipe.instructions.join(' ')}`.toLowerCase();
  const allMentions = findAllEquipmentMentions(recipeText);

  return {
    totalMentions: allMentions.length,
    mentionsBySource: allMentions.reduce((acc, m) => {
      acc[m.source] = (acc[m.source] || 0) + 1;
      return acc;
    }, {}),
    uniqueEquipmentTypes: new Set(allMentions.map(m => m.type)).size,
    mentions: allMentions
  };
}
