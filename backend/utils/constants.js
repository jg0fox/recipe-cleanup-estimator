/**
 * Comprehensive Equipment Types Database
 * Each equipment type includes:
 * - baseTime: cleanup time in seconds
 * - dishwasherSafe: true | false | 'partial'
 * - category: equipment category for grouping
 */

export const EQUIPMENT_TYPES = {
  // COOKWARE - Pots & Pans
  'frying_pan': { baseTime: 180, dishwasherSafe: true, category: 'cookware' },
  'skillet': { baseTime: 180, dishwasherSafe: true, category: 'cookware' },
  'saute_pan': { baseTime: 200, dishwasherSafe: true, category: 'cookware' },
  'cast_iron_pan': { baseTime: 240, dishwasherSafe: false, category: 'cookware' },
  'nonstick_pan': { baseTime: 120, dishwasherSafe: true, category: 'cookware' },
  'wok': { baseTime: 150, dishwasherSafe: false, category: 'cookware' },
  'grill_pan': { baseTime: 250, dishwasherSafe: true, category: 'cookware' },
  'griddle': { baseTime: 200, dishwasherSafe: true, category: 'cookware' },

  'saucepan': { baseTime: 120, dishwasherSafe: true, category: 'cookware' },
  'stockpot': { baseTime: 180, dishwasherSafe: true, category: 'cookware' },
  'dutch_oven': { baseTime: 200, dishwasherSafe: true, category: 'cookware' },
  'pressure_cooker': { baseTime: 300, dishwasherSafe: 'partial', category: 'cookware' },
  'slow_cooker': { baseTime: 180, dishwasherSafe: true, category: 'cookware' },
  'double_boiler': { baseTime: 150, dishwasherSafe: true, category: 'cookware' },
  'pasta_pot': { baseTime: 140, dishwasherSafe: true, category: 'cookware' },

  // BAKING EQUIPMENT
  'baking_sheet': { baseTime: 90, dishwasherSafe: true, category: 'baking' },
  'cookie_sheet': { baseTime: 90, dishwasherSafe: true, category: 'baking' },
  'sheet_pan': { baseTime: 120, dishwasherSafe: true, category: 'baking' },
  'roasting_pan': { baseTime: 200, dishwasherSafe: true, category: 'baking' },
  'cake_pan': { baseTime: 100, dishwasherSafe: true, category: 'baking' },
  'loaf_pan': { baseTime: 80, dishwasherSafe: true, category: 'baking' },
  'muffin_tin': { baseTime: 180, dishwasherSafe: true, category: 'baking' },
  'pie_pan': { baseTime: 90, dishwasherSafe: true, category: 'baking' },
  'tart_pan': { baseTime: 120, dishwasherSafe: true, category: 'baking' },
  'bundt_pan': { baseTime: 150, dishwasherSafe: true, category: 'baking' },
  'springform_pan': { baseTime: 140, dishwasherSafe: true, category: 'baking' },
  'casserole_dish': { baseTime: 120, dishwasherSafe: true, category: 'baking' },
  'ramekins': { baseTime: 60, dishwasherSafe: true, category: 'baking' },
  'cooling_rack': { baseTime: 30, dishwasherSafe: true, category: 'baking' },
  'pastry_ring': { baseTime: 45, dishwasherSafe: true, category: 'baking' },

  // PREP TOOLS - Cutting & Chopping
  'chef_knife': { baseTime: 45, dishwasherSafe: false, category: 'prep' },
  'paring_knife': { baseTime: 30, dishwasherSafe: false, category: 'prep' },
  'bread_knife': { baseTime: 35, dishwasherSafe: false, category: 'prep' },
  'cleaver': { baseTime: 60, dishwasherSafe: false, category: 'prep' },
  'utility_knife': { baseTime: 35, dishwasherSafe: false, category: 'prep' },
  'kitchen_shears': { baseTime: 40, dishwasherSafe: true, category: 'prep' },
  'cutting_board': { baseTime: 45, dishwasherSafe: false, category: 'prep' },
  'bamboo_cutting_board': { baseTime: 50, dishwasherSafe: false, category: 'prep' },

  // PREP TOOLS - Grating & Shredding
  'box_grater': { baseTime: 120, dishwasherSafe: true, category: 'prep' },
  'microplane': { baseTime: 90, dishwasherSafe: true, category: 'prep' },
  'zester': { baseTime: 60, dishwasherSafe: true, category: 'prep' },
  'mandoline': { baseTime: 180, dishwasherSafe: 'partial', category: 'prep' },
  'julienne_peeler': { baseTime: 40, dishwasherSafe: true, category: 'prep' },
  'vegetable_peeler': { baseTime: 30, dishwasherSafe: true, category: 'prep' },

  // PREP TOOLS - Measuring & Mixing
  'measuring_cups': { baseTime: 40, dishwasherSafe: true, category: 'prep' },
  'measuring_spoons': { baseTime: 30, dishwasherSafe: true, category: 'prep' },
  'kitchen_scale': { baseTime: 20, dishwasherSafe: false, category: 'prep' },
  'mixing_bowl': { baseTime: 60, dishwasherSafe: true, category: 'prep' },
  'large_mixing_bowl': { baseTime: 90, dishwasherSafe: true, category: 'prep' },
  'glass_bowl': { baseTime: 50, dishwasherSafe: true, category: 'prep' },
  'metal_bowl': { baseTime: 45, dishwasherSafe: true, category: 'prep' },

  // UTENSILS & HAND TOOLS
  'whisk': { baseTime: 35, dishwasherSafe: true, category: 'utensils' },
  'balloon_whisk': { baseTime: 40, dishwasherSafe: true, category: 'utensils' },
  'silicone_spatula': { baseTime: 25, dishwasherSafe: true, category: 'utensils' },
  'rubber_spatula': { baseTime: 25, dishwasherSafe: true, category: 'utensils' },
  'wooden_spoon': { baseTime: 30, dishwasherSafe: false, category: 'utensils' },
  'slotted_spoon': { baseTime: 35, dishwasherSafe: true, category: 'utensils' },
  'ladle': { baseTime: 40, dishwasherSafe: true, category: 'utensils' },
  'tongs': { baseTime: 45, dishwasherSafe: true, category: 'utensils' },
  'turner': { baseTime: 30, dishwasherSafe: true, category: 'utensils' },
  'fish_turner': { baseTime: 35, dishwasherSafe: true, category: 'utensils' },
  'potato_masher': { baseTime: 60, dishwasherSafe: true, category: 'utensils' },
  'pastry_brush': { baseTime: 45, dishwasherSafe: true, category: 'utensils' },
  'rolling_pin': { baseTime: 50, dishwasherSafe: false, category: 'utensils' },
  'pastry_cutter': { baseTime: 40, dishwasherSafe: true, category: 'utensils' },
  'pizza_cutter': { baseTime: 35, dishwasherSafe: true, category: 'utensils' },
  'can_opener': { baseTime: 25, dishwasherSafe: true, category: 'utensils' },
  'garlic_press': { baseTime: 90, dishwasherSafe: true, category: 'utensils' },
  'citrus_juicer': { baseTime: 60, dishwasherSafe: true, category: 'utensils' },
  'meat_mallet': { baseTime: 45, dishwasherSafe: true, category: 'utensils' },
  'ice_cream_scoop': { baseTime: 30, dishwasherSafe: true, category: 'utensils' },
  'cookie_scoop': { baseTime: 25, dishwasherSafe: true, category: 'utensils' },

  // STRAINING & DRAINING
  'colander': { baseTime: 45, dishwasherSafe: true, category: 'straining' },
  'fine_mesh_strainer': { baseTime: 60, dishwasherSafe: true, category: 'straining' },
  'sieve': { baseTime: 75, dishwasherSafe: true, category: 'straining' },
  'spider_strainer': { baseTime: 50, dishwasherSafe: true, category: 'straining' },
  'salad_spinner': { baseTime: 120, dishwasherSafe: 'partial', category: 'straining' },

  // APPLIANCES
  'food_processor': { baseTime: 300, dishwasherSafe: 'partial', category: 'appliances' },
  'blender': { baseTime: 180, dishwasherSafe: 'partial', category: 'appliances' },
  'immersion_blender': { baseTime: 120, dishwasherSafe: 'partial', category: 'appliances' },
  'stand_mixer': { baseTime: 240, dishwasherSafe: 'partial', category: 'appliances' },
  'hand_mixer': { baseTime: 90, dishwasherSafe: 'partial', category: 'appliances' },
  'rice_cooker': { baseTime: 120, dishwasherSafe: true, category: 'appliances' },
  'coffee_grinder': { baseTime: 60, dishwasherSafe: false, category: 'appliances' },
  'spice_grinder': { baseTime: 90, dishwasherSafe: false, category: 'appliances' },
  'juicer': { baseTime: 300, dishwasherSafe: 'partial', category: 'appliances' },

  // ASIAN/CULTURAL COOKING TOOLS
  'mortar_pestle': { baseTime: 180, dishwasherSafe: false, category: 'cultural' },
  'bamboo_steamer': { baseTime: 90, dishwasherSafe: false, category: 'cultural' },
  'wok_spatula': { baseTime: 40, dishwasherSafe: true, category: 'cultural' },
  'chopsticks': { baseTime: 20, dishwasherSafe: true, category: 'cultural' },
  'sushi_mat': { baseTime: 30, dishwasherSafe: false, category: 'cultural' },
  'dumpling_press': { baseTime: 45, dishwasherSafe: true, category: 'cultural' },
  'rice_paddle': { baseTime: 25, dishwasherSafe: true, category: 'cultural' },
  'wok_brush': { baseTime: 20, dishwasherSafe: false, category: 'cultural' },
  'tagine': { baseTime: 150, dishwasherSafe: true, category: 'cultural' },
  'molcajete': { baseTime: 240, dishwasherSafe: false, category: 'cultural' },
  'comal': { baseTime: 120, dishwasherSafe: true, category: 'cultural' },
  'tortilla_press': { baseTime: 60, dishwasherSafe: true, category: 'cultural' },

  // SERVING & STORAGE
  'serving_bowl': { baseTime: 40, dishwasherSafe: true, category: 'serving' },
  'serving_platter': { baseTime: 50, dishwasherSafe: true, category: 'serving' },
  'cake_stand': { baseTime: 60, dishwasherSafe: true, category: 'serving' },
  'gravy_boat': { baseTime: 45, dishwasherSafe: true, category: 'serving' },
  'trivets': { baseTime: 20, dishwasherSafe: true, category: 'serving' },
  'storage_containers': { baseTime: 30, dishwasherSafe: true, category: 'storage' },
  'mason_jars': { baseTime: 25, dishwasherSafe: true, category: 'storage' }
};

/**
 * Get all equipment types for a specific category
 */
export function getEquipmentByCategory(category) {
  return Object.entries(EQUIPMENT_TYPES)
    .filter(([_, config]) => config.category === category)
    .reduce((acc, [name, config]) => ({ ...acc, [name]: config }), {});
}

/**
 * Get all categories
 */
export function getAllCategories() {
  return [...new Set(Object.values(EQUIPMENT_TYPES).map(config => config.category))];
}
