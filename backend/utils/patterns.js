/**
 * Comprehensive Detection Patterns for Equipment Detection
 * Organized by detection method:
 * - Direct mentions (explicit equipment references)
 * - Technique mappings (cooking verbs → equipment)
 * - Ingredient prep patterns (ingredients → required tools)
 * - Cultural indicators (cuisine type → traditional equipment)
 * - Quantity indicators (words suggesting multiple equipment)
 * - Complexity modifiers (cooking methods that increase cleanup difficulty)
 */

export const DETECTION_PATTERNS = {
  // DIRECT EQUIPMENT MENTIONS - Explicit references to tools
  direct_mentions: {
    // Pans & Skillets
    'frying_pan': ['frying pan', 'skillet', 'pan', 'non-stick pan', 'nonstick pan'],
    'saute_pan': ['sauté pan', 'saute pan', 'sautéing pan'],
    'cast_iron_pan': ['cast iron', 'cast-iron pan', 'cast iron skillet', 'iron skillet'],
    'wok': ['wok', 'stir-fry pan', 'asian pan'],
    'grill_pan': ['grill pan', 'grilling pan', 'ridged pan'],
    'griddle': ['griddle', 'flat griddle', 'electric griddle'],

    // Pots
    'saucepan': ['saucepan', 'sauce pan', 'small pot', 'medium pot'],
    'stockpot': ['stockpot', 'stock pot', 'large pot', 'soup pot'],
    'dutch_oven': ['dutch oven', 'dutch-oven', 'heavy pot', 'enamel pot'],
    'pressure_cooker': ['pressure cooker', 'instant pot', 'pressure pot'],
    'slow_cooker': ['slow cooker', 'crock pot', 'crockpot'],
    'double_boiler': ['double boiler', 'bain marie', 'water bath'],

    // Baking Equipment
    'baking_sheet': ['baking sheet', 'cookie sheet', 'sheet pan', 'rimmed baking sheet'],
    'roasting_pan': ['roasting pan', 'roaster', 'roasting dish'],
    'cake_pan': ['cake pan', 'round pan', '9-inch pan', '8-inch pan'],
    'loaf_pan': ['loaf pan', 'bread pan', '9x5 pan'],
    'muffin_tin': ['muffin tin', 'muffin pan', 'cupcake pan', '12-cup tin'],
    'pie_pan': ['pie pan', 'pie plate', 'pie dish', '9-inch pie'],
    'tart_pan': ['tart pan', 'tart shell', 'removable bottom'],
    'bundt_pan': ['bundt pan', 'tube pan', 'fluted pan'],
    'springform_pan': ['springform', 'springform pan', 'removable sides'],
    'casserole_dish': ['casserole dish', 'baking dish', '9x13 pan', 'glass dish'],
    'ramekins': ['ramekin', 'ramekins', 'small dishes', 'individual dishes'],

    // Cutting Tools
    'chef_knife': ['chef knife', 'chefs knife', "chef's knife", '8-inch knife', '10-inch knife'],
    'paring_knife': ['paring knife', 'small knife', 'peeling knife'],
    'bread_knife': ['bread knife', 'serrated knife', 'slicing knife'],
    'cleaver': ['cleaver', 'meat cleaver', 'chinese cleaver', 'heavy knife'],
    'kitchen_shears': ['kitchen shears', 'kitchen scissors', 'cooking scissors'],
    'cutting_board': ['cutting board', 'chopping board', 'prep board'],

    // Prep Tools
    'box_grater': ['grater', 'box grater', 'cheese grater', '4-sided grater'],
    'microplane': ['microplane', 'zester', 'fine grater', 'citrus zester'],
    'mandoline': ['mandoline', 'mandolin', 'vegetable slicer'],
    'vegetable_peeler': ['peeler', 'vegetable peeler', 'potato peeler'],
    'measuring_cups': ['measuring cups', 'dry measuring cups', 'liquid measuring'],
    'measuring_spoons': ['measuring spoons', 'teaspoon', 'tablespoon'],
    'kitchen_scale': ['kitchen scale', 'food scale', 'digital scale'],

    // Mixing Tools
    'mixing_bowl': ['mixing bowl', 'bowl', 'large bowl', 'medium bowl', 'small bowl'],
    'whisk': ['whisk', 'wire whisk', 'balloon whisk'],
    'wooden_spoon': ['wooden spoon', 'wood spoon', 'cooking spoon'],
    'silicone_spatula': ['spatula', 'rubber spatula', 'silicone spatula', 'scraper'],
    'tongs': ['tongs', 'kitchen tongs', 'serving tongs'],
    'ladle': ['ladle', 'soup ladle', 'serving ladle'],

    // Strainers
    'colander': ['colander', 'pasta strainer', 'vegetable strainer'],
    'fine_mesh_strainer': ['strainer', 'fine strainer', 'mesh strainer', 'sieve'],
    'salad_spinner': ['salad spinner', 'lettuce spinner', 'greens spinner'],

    // Appliances
    'food_processor': ['food processor', 'cuisinart', 'processor'],
    'blender': ['blender', 'vitamix', 'blendtec', 'smoothie maker'],
    'immersion_blender': ['immersion blender', 'stick blender', 'hand blender'],
    'stand_mixer': ['stand mixer', 'kitchenaid', 'mixer', 'electric mixer'],
    'hand_mixer': ['hand mixer', 'electric beaters', 'handheld mixer'],
    'rice_cooker': ['rice cooker', 'rice maker', 'electric rice cooker'],

    // Asian Tools
    'mortar_pestle': ['mortar and pestle', 'mortar & pestle', 'pestle', 'molcajete'],
    'bamboo_steamer': ['bamboo steamer', 'steamer basket', 'steaming basket'],
    'wok_spatula': ['wok spatula', 'wok spoon', 'chinese spatula'],
    'chopsticks': ['chopsticks', 'cooking chopsticks', 'bamboo sticks'],
    'sushi_mat': ['sushi mat', 'bamboo mat', 'rolling mat'],

    // Specialty Items
    'garlic_press': ['garlic press', 'garlic crusher'],
    'citrus_juicer': ['citrus juicer', 'lemon juicer', 'lime juicer'],
    'can_opener': ['can opener', 'tin opener'],
    'rolling_pin': ['rolling pin', 'pastry roller'],
    'pastry_brush': ['pastry brush', 'basting brush', 'silicone brush'],
    'pizza_cutter': ['pizza cutter', 'pizza wheel'],
    'meat_mallet': ['meat mallet', 'meat tenderizer', 'meat hammer'],
    'ice_cream_scoop': ['ice cream scoop', 'scoop', 'cookie scoop']
  },

  // COOKING TECHNIQUE IMPLICATIONS - Verbs that suggest equipment
  technique_mappings: {
    // Pan/Skillet Techniques
    'frying_pan': ['sauté', 'sautéed', 'sautéing', 'fry', 'fried', 'frying', 'pan-fry', 'pan fry',
      'brown', 'browned', 'browning', 'sear', 'seared', 'searing', 'caramelize',
      'scramble', 'scrambled', 'crisp up', 'render fat'],
    'wok': ['stir-fry', 'stir fry', 'stir-fried', 'toss', 'char', 'wok hei', 'high heat cooking'],
    'grill_pan': ['grill', 'grilled', 'grilling', 'char marks', 'grill marks'],

    // Pot Techniques
    'saucepan': ['simmer', 'simmered', 'simmering', 'reduce', 'reducing', 'boil', 'boiled', 'boiling'],
    'stockpot': ['blanch', 'blanched', 'blanching', 'parboil', 'cook pasta', 'boil water'],
    'pressure_cooker': ['pressure cook', 'pressure cooked', 'quick cook', 'steam under pressure'],
    'slow_cooker': ['slow cook', 'slow cooked', 'cook on low', 'cook on high', 'set and forget'],

    // Baking Techniques
    'baking_sheet': ['bake', 'baked', 'baking', 'roast', 'roasted', 'roasting', 'sheet pan'],
    'cake_pan': ['bake a cake', 'layer cake', 'round cake'],
    'muffin_tin': ['bake muffins', 'bake cupcakes', 'portion batter'],
    'casserole_dish': ['casserole', 'baked dish', 'covered dish'],

    // Cutting Techniques
    'chef_knife': ['chop', 'chopped', 'chopping', 'dice', 'diced', 'dicing', 'mince', 'minced',
      'mincing', 'slice', 'sliced', 'slicing', 'julienne'],
    'cleaver': ['hack', 'hacked', 'hacking', 'split', 'crush garlic', 'smash'],
    'paring_knife': ['peel', 'peeled', 'peeling', 'trim', 'trimmed', 'core', 'cored'],

    // Prep Techniques
    'box_grater': ['grate', 'grated', 'grating', 'shred', 'shredded', 'shredding'],
    'microplane': ['zest', 'zested', 'zesting', 'finely grate', 'grate fine'],
    'mortar_pestle': ['grind', 'ground', 'grinding', 'pound', 'pounded', 'pounding', 'crush', 'paste'],
    'food_processor': ['process', 'processed', 'processing', 'pulse', 'pulsed', 'blend coarsely'],

    // Mixing Techniques
    'whisk': ['whisk', 'whisked', 'whisking', 'whip', 'whipped', 'whipping', 'beat', 'beaten'],
    'stand_mixer': ['mix', 'mixed', 'mixing', 'cream butter', 'knead dough', 'beat until fluffy'],

    // Straining Techniques
    'colander': ['drain', 'drained', 'draining', 'strain pasta', 'rinse'],
    'fine_mesh_strainer': ['strain', 'strained', 'straining', 'sift', 'sifted', 'sifting'],

    // Asian Techniques
    'bamboo_steamer': ['steam', 'steamed', 'steaming', 'steam dumplings', 'steam buns'],
    'wok_spatula': ['toss ingredients', 'stir constantly', 'flip in wok']
  },

  // INGREDIENT PREPARATION PATTERNS - What ingredients need which tools
  ingredient_prep_patterns: {
    // Cutting/Chopping Requirements
    'chef_knife': ['onions', 'garlic', 'shallots', 'vegetables', 'herbs', 'meat', 'chicken', 'beef', 'pork'],
    'paring_knife': ['tomatoes', 'strawberries', 'apples', 'potatoes', 'citrus fruits'],
    'cutting_board': ['any chopped ingredient', 'diced', 'sliced', 'minced'],

    // Grating Requirements
    'box_grater': ['cheese', 'carrots', 'zucchini', 'potatoes', 'cabbage'],
    'microplane': ['lemon zest', 'lime zest', 'orange zest', 'nutmeg', 'ginger', 'garlic'],
    'vegetable_peeler': ['carrots', 'potatoes', 'asparagus', 'cucumbers', 'apples'],

    // Mixing Requirements
    'mixing_bowl': ['batter', 'dough', 'marinade', 'dressing', 'salad'],
    'whisk': ['eggs', 'cream', 'vinaigrette', 'batter', 'sauce'],
    'stand_mixer': ['cake batter', 'cookie dough', 'bread dough', 'frosting', 'whipped cream'],

    // Cooking Medium Requirements
    'frying_pan': ['oil', 'butter', 'cooking spray'],
    'wok': ['high heat oil', 'peanut oil', 'vegetable oil'],
    'baking_sheet': ['parchment paper', 'cooking spray', 'oil'],

    // Processing Requirements
    'food_processor': ['nuts', 'breadcrumbs', 'pesto', 'hummus', 'nut butter'],
    'blender': ['smoothies', 'soups', 'sauces', 'purees'],
    'mortar_pestle': ['spices', 'curry paste', 'pesto', 'guacamole', 'garlic paste']
  },

  // CULTURAL/CUISINE INDICATORS - Recipe type suggests equipment
  cultural_indicators: {
    'wok': ['chinese', 'thai', 'vietnamese', 'asian', 'stir-fry', 'pad thai', 'fried rice'],
    'mortar_pestle': ['thai', 'mexican', 'indian', 'curry', 'paste', 'guacamole', 'salsa'],
    'bamboo_steamer': ['dim sum', 'dumplings', 'bao', 'chinese', 'steamed fish'],
    'tagine': ['moroccan', 'north african', 'slow cooked', 'tagine'],
    'molcajete': ['mexican', 'salsa', 'guacamole', 'spice grinding'],
    'comal': ['tortillas', 'mexican', 'flatbread', 'quesadillas'],
    'pasta_pot': ['italian', 'pasta', 'spaghetti', 'linguine', 'penne'],
    'rice_cooker': ['asian', 'japanese', 'rice dishes', 'steamed rice'],
    'dutch_oven': ['french', 'braising', 'coq au vin', 'beef bourguignon'],
    'cast_iron_pan': ['southern', 'cornbread', 'skillet dishes', 'american']
  },

  // QUANTITY/SIZE INDICATORS - Words that suggest multiple equipment or sizes
  quantity_indicators: {
    explicit_numbers: ['two pans', 'three bowls', '2 skillets', 'a pair of', 'multiple'],
    size_descriptors: ['large', 'medium', 'small', 'mini', 'jumbo', '8-inch', '9-inch', '10-inch'],
    separating_words: ['another', 'second', 'third', 'different', 'separate', 'additional', 'extra'],
    concurrent_cooking: ['meanwhile', 'at the same time', 'while', 'simultaneously', 'in parallel']
  },

  // COMPLEXITY MODIFIERS - Factors that increase cleaning difficulty
  complexity_modifiers: {
    // High-mess cooking methods
    'sticky_sauce': ['caramelize', 'caramelized', 'reduce until thick', 'sticky', 'glaze', 'glazed',
      'brown sugar', 'honey', 'maple syrup', 'molasses', 'corn syrup'],
    'oil_heavy': ['deep fry', 'deep-fry', 'deep fried', 'lots of oil', 'oil for frying', 'render fat',
      'crispy skin', 'golden brown', 'oil until hot'],
    'burnt_potential': ['high heat', 'sear', 'char', 'blackened', 'crispy', 'caramelize', 'fond'],
    'dairy_burning': ['cream sauce', 'cheese sauce', 'milk', 'cream', 'butter sauce', 'bechamel'],
    'tomato_staining': ['tomato sauce', 'marinara', 'tomato paste', 'crushed tomatoes', 'tomato puree'],
    'raw_meat': ['raw chicken', 'raw beef', 'raw pork', 'raw fish', 'ground meat', 'handle raw'],
    'flour_batter': ['batter', 'breading', 'flour coating', 'dredge in flour', 'dusty'],
    'egg_coating': ['egg wash', 'beaten eggs', 'scrambled', 'frittata', 'quiche'],
    'spice_grinding': ['grind spices', 'whole spices', 'toast spices', 'spice paste'],
    'acidic_foods': ['vinegar', 'citrus', 'wine reduction', 'tomatoes', 'pickled'],
    'sugar_work': ['candy', 'caramel', 'sugar syrup', 'melted sugar', 'praline'],
    'chocolate_melting': ['melted chocolate', 'chocolate sauce', 'tempering chocolate'],
    'dough_work': ['knead', 'bread dough', 'pizza dough', 'sticky dough', 'flour everywhere'],
    'fermentation': ['sourdough', 'kimchi', 'fermented', 'cultured', 'pickled'],
    'marinating': ['marinate', 'marinade', 'overnight', 'wine marinade']
  }
};

/**
 * Escape special regex characters in a string
 */
export function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create regex pattern from text with word boundaries
 */
export function createPattern(text) {
  return new RegExp(`\\b${escapeRegex(text)}\\b`, 'gi');
}
