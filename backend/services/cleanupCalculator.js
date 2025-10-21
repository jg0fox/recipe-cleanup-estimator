import { EQUIPMENT_TYPES } from '../utils/constants.js';

/**
 * Calculate total cleanup time with detailed breakdown
 * @param {Array} equipmentInstances - Array of detected equipment instances
 * @param {Object} userPreferences - User's cleaning preferences
 * @returns {Object} Cleanup time breakdown and total
 */
export function calculateCleanupTime(equipmentInstances, userPreferences = {}) {
  // Set defaults for user preferences
  const prefs = {
    hasDishwasher: userPreferences.hasDishwasher || false,
    cleaningStyle: userPreferences.cleaningStyle || 'normal',
    soakingPreference: userPreferences.soakingPreference || false
  };

  let totalTime = 0;
  const breakdown = [];

  // Calculate time for each equipment instance
  for (const equipment of equipmentInstances) {
    const equipmentConfig = EQUIPMENT_TYPES[equipment.type];
    if (!equipmentConfig) {
      console.warn(`Unknown equipment type: ${equipment.type}`);
      continue;
    }

    let equipmentTime = equipmentConfig.baseTime * equipment.quantity;
    const modifiers = [];

    // Apply complexity modifiers
    for (const modifier of equipment.complexity.modifiers) {
      const timeIncrease = calculateModifierImpact(modifier.type, equipmentConfig);
      equipmentTime += timeIncrease;
      modifiers.push({
        name: modifier.description,
        time: timeIncrease,
        type: 'complexity'
      });
    }

    // Apply equipment-specific material considerations
    const materialModifiers = calculateMaterialModifiers(equipment.type, equipment.complexity);
    for (const modifier of materialModifiers) {
      equipmentTime += modifier.time;
      modifiers.push(modifier);
    }

    // Apply user preference modifiers
    const preferenceModifiers = applyUserPreferences(equipmentTime, equipmentConfig, prefs);
    let finalTime = preferenceModifiers.adjustedTime;
    modifiers.push(...preferenceModifiers.modifiers);

    // Apply confidence adjustment (lower confidence = slightly longer estimate)
    const confidenceAdjustment = (1 - equipment.confidence) * 0.2 + 1;
    finalTime *= confidenceAdjustment;

    breakdown.push({
      item: formatEquipmentName(equipment.type),
      quantity: equipment.quantity,
      baseTime: equipmentConfig.baseTime,
      modifiers,
      subtotal: Math.round(finalTime),
      reasoning: generateDetailedReasoning(equipment),
      confidence: equipment.confidence,
      category: equipmentConfig.category
    });

    totalTime += finalTime;
  }

  // Add general cleanup tasks based on cooking complexity
  const generalCleanup = calculateGeneralCleanup(equipmentInstances, prefs);
  breakdown.push(...generalCleanup.tasks);
  totalTime += generalCleanup.totalTime;

  // Calculate overall confidence score
  const overallConfidence = calculateOverallConfidence(equipmentInstances);

  return {
    totalTime: Math.round(totalTime),
    breakdown,
    confidence: overallConfidence,
    categories: groupBreakdownByCategory(breakdown),
    estimateRange: calculateEstimateRange(totalTime, overallConfidence)
  };
}

/**
 * Calculate time impact of complexity modifiers based on equipment category
 */
function calculateModifierImpact(modifierType, equipmentConfig) {
  const modifierImpacts = {
    'sticky_sauce': {
      'cookware': 120,
      'baking': 90,
      'utensils': 45,
      'default': 60
    },
    'oil_heavy': {
      'cookware': 90,
      'baking': 60,
      'utensils': 30,
      'default': 45
    },
    'burnt_potential': {
      'cookware': 150,
      'baking': 120,
      'utensils': 20,
      'default': 80
    },
    'dairy_burning': {
      'cookware': 100,
      'baking': 70,
      'utensils': 30,
      'default': 60
    },
    'tomato_staining': {
      'cookware': 60,
      'prep': 40,
      'utensils': 30,
      'default': 40
    },
    'raw_meat': {
      'prep': 90,
      'cookware': 60,
      'utensils': 45,
      'default': 60
    },
    'flour_batter': {
      'prep': 45,
      'cookware': 30,
      'utensils': 40,
      'appliances': 90,
      'default': 40
    },
    'egg_coating': {
      'prep': 60,
      'cookware': 45,
      'utensils': 50,
      'default': 45
    },
    'spice_grinding': {
      'cultural': 60,
      'appliances': 90,
      'prep': 30,
      'default': 40
    },
    'chocolate_melting': {
      'cookware': 80,
      'utensils': 60,
      'appliances': 100,
      'default': 70
    },
    'sugar_work': {
      'cookware': 140,
      'utensils': 80,
      'default': 100
    },
    'acidic_foods': {
      'cookware': 40,
      'prep': 30,
      'default': 30
    },
    'dough_work': {
      'prep': 60,
      'cookware': 40,
      'utensils': 50,
      'default': 50
    },
    'fermentation': {
      'storage': 45,
      'cookware': 60,
      'default': 50
    },
    'marinating': {
      'storage': 40,
      'prep': 50,
      'default': 45
    }
  };

  const category = equipmentConfig.category || 'default';
  const impacts = modifierImpacts[modifierType];

  return (impacts && (impacts[category] || impacts['default'])) || 60;
}

/**
 * Calculate material-based modifiers for specific equipment
 */
function calculateMaterialModifiers(equipmentType, complexity) {
  const modifiers = [];

  // Non-stick surfaces are easier to clean
  if (equipmentType.includes('nonstick')) {
    modifiers.push({
      name: 'Non-stick surface',
      time: -30,
      type: 'material'
    });
  }

  // Cast iron requires special care
  if (equipmentType.includes('cast_iron')) {
    modifiers.push({
      name: 'Cast iron maintenance',
      time: 45,
      type: 'material'
    });
  }

  // Wooden items can't go in dishwasher
  if (equipmentType.includes('wooden') || equipmentType.includes('bamboo')) {
    modifiers.push({
      name: 'Hand wash only (wood)',
      time: 15,
      type: 'material'
    });
  }

  // Fine mesh items trap particles
  if (equipmentType.includes('fine_mesh') || equipmentType.includes('microplane')) {
    modifiers.push({
      name: 'Fine mesh cleaning',
      time: 30,
      type: 'material'
    });
  }

  // Graters are notoriously difficult
  if (equipmentType.includes('grater') || equipmentType.includes('box_grater')) {
    modifiers.push({
      name: 'Multiple surfaces to clean',
      time: 20,
      type: 'material'
    });
  }

  return modifiers;
}

/**
 * Apply user preferences to adjust cleanup time
 */
function applyUserPreferences(baseTime, equipmentConfig, userPreferences) {
  const modifiers = [];
  let adjustedTime = baseTime;

  // Dishwasher preferences
  if (userPreferences.hasDishwasher) {
    if (equipmentConfig.dishwasherSafe === true) {
      const reduction = baseTime * 0.6;  // 60% time reduction
      adjustedTime -= reduction;
      modifiers.push({
        name: 'Dishwasher safe',
        time: -Math.round(reduction),
        type: 'preference'
      });
    } else if (equipmentConfig.dishwasherSafe === 'partial') {
      const reduction = baseTime * 0.3;  // 30% time reduction
      adjustedTime -= reduction;
      modifiers.push({
        name: 'Partially dishwasher safe',
        time: -Math.round(reduction),
        type: 'preference'
      });
    }
  }

  // Cleaning style preferences
  switch (userPreferences.cleaningStyle) {
    case 'quick':
      const quickReduction = baseTime * 0.3;
      adjustedTime *= 0.7;
      modifiers.push({
        name: 'Quick cleaning style',
        time: -Math.round(quickReduction),
        type: 'preference'
      });
      break;
    case 'thorough':
      const thoroughIncrease = baseTime * 0.4;
      adjustedTime *= 1.4;
      modifiers.push({
        name: 'Thorough cleaning style',
        time: Math.round(thoroughIncrease),
        type: 'preference'
      });
      break;
    // 'normal' is baseline, no modifier
  }

  // Soaking preferences (only for cookware)
  if (userPreferences.soakingPreference && equipmentConfig.category === 'cookware') {
    modifiers.push({
      name: 'Soaking time included',
      time: 120,  // 2 minutes soaking prep
      type: 'preference'
    });
    adjustedTime += 120;
  }

  return { adjustedTime, modifiers };
}

/**
 * Calculate general cleanup tasks (counters, stovetop, etc.)
 */
function calculateGeneralCleanup(equipmentInstances, userPreferences) {
  const tasks = [];
  let totalTime = 0;

  // Counter wiping (always needed)
  const counterTime = 30;
  tasks.push({
    item: 'Counter wiping',
    quantity: 1,
    baseTime: counterTime,
    modifiers: [],
    subtotal: counterTime,
    reasoning: ['Food preparation creates counter mess'],
    category: 'general',
    confidence: 1.0
  });
  totalTime += counterTime;

  // Stovetop cleaning (if cookware was used)
  const hasCookware = equipmentInstances.some(e =>
    EQUIPMENT_TYPES[e.type]?.category === 'cookware'
  );
  if (hasCookware) {
    const stovetopTime = 45;
    tasks.push({
      item: 'Stovetop cleaning',
      quantity: 1,
      baseTime: stovetopTime,
      modifiers: [],
      subtotal: stovetopTime,
      reasoning: ['Cooking on stovetop creates spills and splatters'],
      category: 'general',
      confidence: 1.0
    });
    totalTime += stovetopTime;
  }

  // Sink cleanup (always needed when cooking)
  const sinkTime = 25;
  tasks.push({
    item: 'Sink cleanup',
    quantity: 1,
    baseTime: sinkTime,
    modifiers: [],
    subtotal: sinkTime,
    reasoning: ['Washing dishes creates sink mess'],
    category: 'general',
    confidence: 1.0
  });
  totalTime += sinkTime;

  // Floor sweeping (if extensive prep work)
  const hasExtensivePrep = equipmentInstances.some(e =>
    e.usagePatterns.some(pattern =>
      ['flour_batter', 'spice_grinding', 'dough_work'].includes(pattern)
    )
  );
  if (hasExtensivePrep) {
    const floorTime = 60;
    tasks.push({
      item: 'Floor sweeping',
      quantity: 1,
      baseTime: floorTime,
      modifiers: [],
      subtotal: floorTime,
      reasoning: ['Flour/spice work creates floor mess'],
      category: 'general',
      confidence: 1.0
    });
    totalTime += floorTime;
  }

  return { tasks, totalTime };
}

/**
 * Calculate overall confidence from all equipment instances
 */
function calculateOverallConfidence(equipmentInstances) {
  if (equipmentInstances.length === 0) return 0.5;

  const totalConfidence = equipmentInstances.reduce((sum, instance) => sum + instance.confidence, 0);
  return Math.round((totalConfidence / equipmentInstances.length) * 100) / 100;
}

/**
 * Group breakdown items by category
 */
function groupBreakdownByCategory(breakdown) {
  const categories = {};

  for (const item of breakdown) {
    const category = item.category || 'other';
    if (!categories[category]) {
      categories[category] = {
        items: [],
        totalTime: 0
      };
    }

    categories[category].items.push(item);
    categories[category].totalTime += item.subtotal;
  }

  return categories;
}

/**
 * Calculate estimate range based on confidence
 */
function calculateEstimateRange(totalTime, confidence) {
  // Lower confidence = wider range
  const variability = (1 - confidence) * 0.4 + 0.1;  // 10-50% variability

  return {
    min: Math.round(totalTime * (1 - variability)),
    max: Math.round(totalTime * (1 + variability)),
    confidence: confidence
  };
}

/**
 * Format equipment name for display
 */
function formatEquipmentName(equipmentType) {
  return equipmentType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate detailed reasoning text
 */
function generateDetailedReasoning(equipment) {
  const reasons = [...equipment.reasoning];

  if (equipment.quantity > 1) {
    reasons.push(`${equipment.quantity} items detected`);
  }

  if (equipment.complexity.modifiers.length > 0) {
    const modifierTypes = equipment.complexity.modifiers.map(m => m.type).join(', ');
    reasons.push(`Complexity factors: ${modifierTypes}`);
  }

  return reasons;
}

/**
 * Helper to format time in human-readable format
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
