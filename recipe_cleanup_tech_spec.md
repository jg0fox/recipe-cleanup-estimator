# Recipe Cleanup Time Estimator - Tech Spec & Project Brief

## Project Overview

### Purpose
A web application that analyzes cooking recipe URLs and estimates cleanup time based on equipment usage, cooking techniques, and user preferences. Provides transparent breakdowns showing how estimates are calculated.

### Core Value Proposition
- Quickly estimate cleanup time for any recipe
- See detailed breakdown of equipment and cleaning tasks
- Customize based on personal preferences (dishwasher, cleaning style)
- Improve planning for home cooking decisions

## Technical Architecture

### Stack Recommendation
- **Backend**: Node.js with Express
- **Frontend**: React with Tailwind CSS
- **Database**: SQLite (for development) / PostgreSQL (production)
- **Recipe Parsing**: `recipe-scraper` npm package
- **Deployment**: Vercel/Netlify (frontend) + Railway/Render (backend)

### System Architecture
```
User Input (URL) → Recipe Scraper → Equipment Detector → Cleanup Calculator → Results Display
                                        ↓
                                  User Feedback Loop
```

## Core Features & Implementation

### 1. Recipe URL Processing

**Endpoint**: `POST /api/analyze-recipe`

**Input**:
```json
{
  "url": "https://example.com/recipe",
  "userPreferences": {
    "hasDishwasher": true,
    "cleaningStyle": "thorough", // "quick" | "normal" | "thorough"
    "soakingPreference": true
  }
}
```

**Process**:
1. Validate URL format
2. Use `recipe-scraper` to extract structured data
3. Apply equipment detection algorithms
4. Calculate cleanup times with user preferences
5. Return detailed breakdown

### 2. Equipment Detection Engine

**Comprehensive Equipment Types Database**:
```javascript
const EQUIPMENT_TYPES = {
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
```

**Comprehensive Detection Patterns**:
```javascript
const DETECTION_PATTERNS = {
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
```

### 3. Equipment Quantity Logic

**Enhanced Equipment Detection Algorithm**:
```javascript
function detectEquipmentInstances(recipe) {
  const instances = [];
  const recipeText = `${recipe.ingredients.join(' ')} ${recipe.instructions.join(' ')}`.toLowerCase();
  
  // Phase 1: Scan for all equipment mentions using comprehensive patterns
  const allMentions = findAllEquipmentMentions(recipeText);
  
  // Phase 2: Group mentions by equipment type and detect quantities
  const groupedMentions = groupAndQuantifyMentions(allMentions, recipeText);
  
  // Phase 3: Analyze usage patterns and complexity
  Object.entries(groupedMentions).forEach(([equipmentType, mentionData]) => {
    const usageAnalysis = analyzeUsagePatterns(mentionData, recipeText);
    
    instances.push({
      type: equipmentType,
      quantity: mentionData.quantity,
      usagePatterns: usageAnalysis.patterns,
      complexity: usageAnalysis.complexity,
      confidence: mentionData.confidence,
      reasoning: mentionData.reasoning
    });
  });
  
  // Phase 4: Add implied equipment (equipment suggested by techniques/ingredients)
  const impliedEquipment = detectImpliedEquipment(recipeText, instances);
  instances.push(...impliedEquipment);
  
  // Phase 5: Cross-validate and remove conflicts
  return resolveEquipmentConflicts(instances);
}

function findAllEquipmentMentions(recipeText) {
  const mentions = [];
  
  // Direct mentions (highest confidence)
  Object.entries(DETECTION_PATTERNS.direct_mentions).forEach(([equipmentType, terms]) => {
    terms.forEach(term => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\**Deduplication Algorithm**:
```javascript
function detectEquipmentInstances(recipe) {
  const instances = [];
  
  // Phase 1: Find all equipment mentions
  const mentions = findEquipmentMentions(recipe.instructions);
  
  // Phase 2: Group by type and detect quantities
  const grouped = groupMentionsByType(mentions);
  
  // Phase 3: Apply quantity detection rules
  Object.entries(grouped).forEach(([type, typeMentions]) => {
    const quantity = detectQuantity(typeMentions, recipe.instructions);
    const usagePatterns = extractUsagePatterns(typeMentions);
    
    instances.push({
      type,
      quantity,
      usagePatterns,
      complexity: calculateComplexity(usagePatterns)
    });
  });
  
  return instances;
}

function detectQuantity(mentions, fullText) {
  // Check for explicit quantity words
  const explicitQuantity = extractExplicitQuantity(fullText);
  if (explicitQuantity) return explicitQuantity;
  
  // Check for separating indicators
  const separators = ['another', 'second', 'different', 'separate'];
  const hasSeparator = separators.some(sep => 
    fullText.toLowerCase().includes(sep)
  );
  
  if (hasSeparator) return 2;
  
  // Check for concurrent usage indicators
  const concurrentWords = ['meanwhile', 'at the same time', 'while'];
  const hasConcurrent = concurrentWords.some(word => 
    fullText.toLowerCase().includes(word)
  );
  
  if (hasConcurrent) return 2;
  
  return 1; // Default to single item
}
```')}\\b`, 'gi');
      const matches = [...recipeText.matchAll(regex)];
      
      matches.forEach(match => {
        mentions.push({
          type: equipmentType,
          term: match[0],
          position: match.index,
          confidence: 0.95,
          source: 'direct_mention'
        });
      });
    });
  });
  
  // Technique-based detection (medium confidence)
  Object.entries(DETECTION_PATTERNS.technique_mappings).forEach(([equipmentType, techniques]) => {
    techniques.forEach(technique => {
      const regex = new RegExp(`\\b${technique.replace(/[.*+?^${}()|[\]\\]/g, '\\**Deduplication Algorithm**:
```javascript
function detectEquipmentInstances(recipe) {
  const instances = [];
  
  // Phase 1: Find all equipment mentions
  const mentions = findEquipmentMentions(recipe.instructions);
  
  // Phase 2: Group by type and detect quantities
  const grouped = groupMentionsByType(mentions);
  
  // Phase 3: Apply quantity detection rules
  Object.entries(grouped).forEach(([type, typeMentions]) => {
    const quantity = detectQuantity(typeMentions, recipe.instructions);
    const usagePatterns = extractUsagePatterns(typeMentions);
    
    instances.push({
      type,
      quantity,
      usagePatterns,
      complexity: calculateComplexity(usagePatterns)
    });
  });
  
  return instances;
}

function detectQuantity(mentions, fullText) {
  // Check for explicit quantity words
  const explicitQuantity = extractExplicitQuantity(fullText);
  if (explicitQuantity) return explicitQuantity;
  
  // Check for separating indicators
  const separators = ['another', 'second', 'different', 'separate'];
  const hasSeparator = separators.some(sep => 
    fullText.toLowerCase().includes(sep)
  );
  
  if (hasSeparator) return 2;
  
  // Check for concurrent usage indicators
  const concurrentWords = ['meanwhile', 'at the same time', 'while'];
  const hasConcurrent = concurrentWords.some(word => 
    fullText.toLowerCase().includes(word)
  );
  
  if (hasConcurrent) return 2;
  
  return 1; // Default to single item
}
```')}\\b`, 'gi');
      const matches = [...recipeText.matchAll(regex)];
      
      matches.forEach(match => {
        mentions.push({
          type: equipmentType,
          term: match[0],
          position: match.index,
          confidence: 0.75,
          source: 'technique_mapping'
        });
      });
    });
  });
  
  // Ingredient-based detection (lower confidence)
  Object.entries(DETECTION_PATTERNS.ingredient_prep_patterns).forEach(([equipmentType, ingredients]) => {
    ingredients.forEach(ingredient => {
      const regex = new RegExp(`\\b${ingredient.replace(/[.*+?^${}()|[\]\\]/g, '\\**Deduplication Algorithm**:
```javascript
function detectEquipmentInstances(recipe) {
  const instances = [];
  
  // Phase 1: Find all equipment mentions
  const mentions = findEquipmentMentions(recipe.instructions);
  
  // Phase 2: Group by type and detect quantities
  const grouped = groupMentionsByType(mentions);
  
  // Phase 3: Apply quantity detection rules
  Object.entries(grouped).forEach(([type, typeMentions]) => {
    const quantity = detectQuantity(typeMentions, recipe.instructions);
    const usagePatterns = extractUsagePatterns(typeMentions);
    
    instances.push({
      type,
      quantity,
      usagePatterns,
      complexity: calculateComplexity(usagePatterns)
    });
  });
  
  return instances;
}

function detectQuantity(mentions, fullText) {
  // Check for explicit quantity words
  const explicitQuantity = extractExplicitQuantity(fullText);
  if (explicitQuantity) return explicitQuantity;
  
  // Check for separating indicators
  const separators = ['another', 'second', 'different', 'separate'];
  const hasSeparator = separators.some(sep => 
    fullText.toLowerCase().includes(sep)
  );
  
  if (hasSeparator) return 2;
  
  // Check for concurrent usage indicators
  const concurrentWords = ['meanwhile', 'at the same time', 'while'];
  const hasConcurrent = concurrentWords.some(word => 
    fullText.toLowerCase().includes(word)
  );
  
  if (hasConcurrent) return 2;
  
  return 1; // Default to single item
}
```')}\\b`, 'gi');
      if (regex.test(recipeText)) {
        mentions.push({
          type: equipmentType,
          term: ingredient,
          position: -1,
          confidence: 0.5,
          source: 'ingredient_pattern'
        });
      }
    });
  });
  
  // Cultural indicators (medium confidence)
  Object.entries(DETECTION_PATTERNS.cultural_indicators).forEach(([equipmentType, indicators]) => {
    indicators.forEach(indicator => {
      const regex = new RegExp(`\\b${indicator.replace(/[.*+?^${}()|[\]\\]/g, '\\**Deduplication Algorithm**:
```javascript
function detectEquipmentInstances(recipe) {
  const instances = [];
  
  // Phase 1: Find all equipment mentions
  const mentions = findEquipmentMentions(recipe.instructions);
  
  // Phase 2: Group by type and detect quantities
  const grouped = groupMentionsByType(mentions);
  
  // Phase 3: Apply quantity detection rules
  Object.entries(grouped).forEach(([type, typeMentions]) => {
    const quantity = detectQuantity(typeMentions, recipe.instructions);
    const usagePatterns = extractUsagePatterns(typeMentions);
    
    instances.push({
      type,
      quantity,
      usagePatterns,
      complexity: calculateComplexity(usagePatterns)
    });
  });
  
  return instances;
}

function detectQuantity(mentions, fullText) {
  // Check for explicit quantity words
  const explicitQuantity = extractExplicitQuantity(fullText);
  if (explicitQuantity) return explicitQuantity;
  
  // Check for separating indicators
  const separators = ['another', 'second', 'different', 'separate'];
  const hasSeparator = separators.some(sep => 
    fullText.toLowerCase().includes(sep)
  );
  
  if (hasSeparator) return 2;
  
  // Check for concurrent usage indicators
  const concurrentWords = ['meanwhile', 'at the same time', 'while'];
  const hasConcurrent = concurrentWords.some(word => 
    fullText.toLowerCase().includes(word)
  );
  
  if (hasConcurrent) return 2;
  
  return 1; // Default to single item
}
```')}\\b`, 'gi');
      if (regex.test(recipeText)) {
        mentions.push({
          type: equipmentType,
          term: indicator,
          position: -1,
          confidence: 0.7,
          source: 'cultural_indicator'
        });
      }
    });
  });
  
  return mentions;
}

function groupAndQuantifyMentions(mentions, recipeText) {
  const grouped = {};
  
  // Group by equipment type and combine confidence scores
  mentions.forEach(mention => {
    if (!grouped[mention.type]) {
      grouped[mention.type] = {
        mentions: [],
        quantity: 1,
        confidence: 0,
        reasoning: []
      };
    }
    
    grouped[mention.type].mentions.push(mention);
    grouped[mention.type].confidence = Math.max(grouped[mention.type].confidence, mention.confidence);
  });
  
  // Detect quantities for each equipment type
  Object.keys(grouped).forEach(equipmentType => {
    const quantityAnalysis = detectQuantityForEquipment(equipmentType, recipeText, grouped[equipmentType].mentions);
    grouped[equipmentType].quantity = quantityAnalysis.quantity;
    grouped[equipmentType].reasoning.push(...quantityAnalysis.reasoning);
  });
  
  return grouped;
}

function detectQuantityForEquipment(equipmentType, recipeText, mentions) {
  let quantity = 1;
  const reasoning = [];
  
  // Check for explicit quantity mentions
  const explicitQuantityPatterns = [
    /(\d+)\s*(large |medium |small |)?(${equipmentType.replace('_', ' ')}|pan|pot|bowl)/gi,
    /(two|three|four|five)\s*(${equipmentType.replace('_', ' ')})/gi,
    /a pair of\s*(${equipmentType.replace('_', ' ')})/gi
  ];
  
  explicitQuantityPatterns.forEach(pattern => {
    const matches = [...recipeText.matchAll(pattern)];
    if (matches.length > 0) {
      const numberText = matches[0][1];
      const parsedQuantity = parseQuantityText(numberText);
      if (parsedQuantity > quantity) {
        quantity = parsedQuantity;
        reasoning.push(`Explicit quantity mentioned: "${matches[0][0]}"`);
      }
    }
  });
  
  // Check for separating indicators
  const separatingIndicators = DETECTION_PATTERNS.quantity_indicators.separating_words;
  separatingIndicators.forEach(indicator => {
    const regex = new RegExp(`${indicator}\\s*(pan|pot|bowl|${equipmentType.replace('_', ' ')})`, 'gi');
    if (regex.test(recipeText)) {
      quantity = Math.max(quantity, 2);
      reasoning.push(`Separating word detected: "${indicator}"`);
    }
  });
  
  // Check for concurrent cooking indicators
  const concurrentIndicators = DETECTION_PATTERNS.quantity_indicators.concurrent_cooking;
  concurrentIndicators.forEach(indicator => {
    if (recipeText.includes(indicator)) {
      quantity = Math.max(quantity, 2);
      reasoning.push(`Concurrent cooking detected: "${indicator}"`);
    }
  });
  
  // Check for size variations (might indicate multiple equipment)
  const sizeVariations = DETECTION_PATTERNS.quantity_indicators.size_descriptors;
  const uniqueSizes = new Set();
  sizeVariations.forEach(size => {
    const regex = new RegExp(`${size}\\s*(pan|pot|bowl|${equipmentType.replace('_', ' ')})`, 'gi');
    const matches = [...recipeText.matchAll(regex)];
    matches.forEach(match => uniqueSizes.add(match[1]));
  });
  
  if (uniqueSizes.size > 1) {
    quantity = Math.max(quantity, uniqueSizes.size);
    reasoning.push(`Multiple sizes detected: ${Array.from(uniqueSizes).join(', ')}`);
  }
  
  return { quantity, reasoning };
}

function parseQuantityText(text) {
  const numberMap = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };
  
  const lowerText = text.toLowerCase();
  if (numberMap[lowerText]) {
    return numberMap[lowerText];
  }
  
  const parsed = parseInt(text);
  return isNaN(parsed) ? 1 : parsed;
}

function analyzeUsagePatterns(mentionData, recipeText) {
  const patterns = [];
  const complexity = { base: 'low', modifiers: [] };
  
  // Check for complexity modifiers
  Object.entries(DETECTION_PATTERNS.complexity_modifiers).forEach(([modifierType, indicators]) => {
    indicators.forEach(indicator => {
      if (recipeText.includes(indicator.toLowerCase())) {
        patterns.push(modifierType);
        complexity.modifiers.push({
          type: modifierType,
          indicator,
          description: getModifierDescription(modifierType)
        });
      }
    });
  });
  
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
    'dough_work': 'Dough preparation that can leave flour residue everywhere'
  };
  
  return descriptions[modifierType] || 'Additional cleaning complexity';
}

function detectImpliedEquipment(recipeText, existingInstances) {
  const implied = [];
  const existingTypes = new Set(existingInstances.map(i => i.type));
  
  // Add cutting board if knives are detected
  const hasKnife = existingTypes.has('chef_knife') || existingTypes.has('paring_knife') || existingTypes.has('cleaver');
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
  const hasMeasurements = /\b(\d+\/?\d*\s*(cup|tablespoon|teaspoon|tsp|tbsp|ml|oz))/gi.test(recipeText);
  if (hasMeasurements && !existingTypes.has('measuring_cups') && !existingTypes.has('measuring_spoons')) {
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
  
  return implied;
}

function resolveEquipmentConflicts(instances) {
  // Remove duplicate equipment types, keeping the one with highest confidence
  const resolved = {};
  
  instances.forEach(instance => {
    if (!resolved[instance.type] || resolved[instance.type].confidence < instance.confidence) {
      resolved[instance.type] = instance;
    }
  });
  
  return Object.values(resolved);
}
```

### 4. Cleanup Time Calculation

**Enhanced Cleanup Time Calculation**:
```javascript
function calculateCleanupTime(equipmentInstances, userPreferences) {
  let totalTime = 0;
  const breakdown = [];
  
  equipmentInstances.forEach(equipment => {
    const equipmentConfig = EQUIPMENT_TYPES[equipment.type];
    if (!equipmentConfig) return; // Skip unknown equipment
    
    let equipmentTime = equipmentConfig.baseTime * equipment.quantity;
    const modifiers = [];
    
    // Apply complexity modifiers
    equipment.complexity.modifiers.forEach(modifier => {
      const timeIncrease = calculateModifierImpact(modifier.type, equipmentConfig);
      equipmentTime += timeIncrease;
      modifiers.push({
        name: modifier.description,
        time: timeIncrease,
        type: 'complexity'
      });
    });
    
    // Apply equipment-specific material considerations
    const materialModifiers = calculateMaterialModifiers(equipment.type, equipment.complexity);
    materialModifiers.forEach(modifier => {
      equipmentTime += modifier.time;
      modifiers.push(modifier);
    });
    
    // Apply user preference modifiers
    const preferenceModifiers = applyUserPreferences(equipmentTime, equipmentConfig, userPreferences);
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
  });
  
  // Add general cleanup tasks based on cooking complexity
  const generalCleanup = calculateGeneralCleanup(equipmentInstances, userPreferences);
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

function calculateModifierImpact(modifierType, equipmentConfig) {
  const modifierImpacts = {
    'sticky_sauce': {
      'cookware': 120, // pans get very sticky
      'baking': 90,    // baking sheets with sticky glazes
      'utensils': 45,  // spatulas and spoons
      'default': 60
    },
    'oil_heavy': {
      'cookware': 90,
      'baking': 60,
      'utensils': 30,
      'default': 45
    },
    'burnt_potential': {
      'cookware': 150, // burnt-on food is very hard to clean
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
      'prep': 40,     // cutting boards stain
      'utensils': 30,
      'default': 40
    },
    'raw_meat': {
      'prep': 90,     // cutting boards need sanitization
      'cookware': 60,
      'utensils': 45,
      'default': 60
    },
    'flour_batter': {
      'prep': 45,     // flour gets everywhere
      'cookware': 30,
      'utensils': 40,
      'appliances': 90, // food processors with flour are messy
      'default': 40
    },
    'egg_coating': {
      'prep': 60,
      'cookware': 45,
      'utensils': 50,
      'default': 45
    },
    'spice_grinding': {
      'cultural': 60, // mortar & pestle stain
      'appliances': 90, // spice grinders hard to clean
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
      'cookware': 140, // caramel is extremely sticky
      'utensils': 80,
      'default': 100
    }
  };
  
  const category = equipmentConfig.category || 'default';
  const impacts = modifierImpacts[modifierType];
  
  return impacts[category] || impacts['default'] || 60;
}

function calculateMaterialModifiers(equipmentType, complexity) {
  const modifiers = [];
  
  // Non-stick surfaces are easier to clean but can be damaged
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
      name: 'Hand wash only',
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
  
  return modifiers;
}

function applyUserPreferences(baseTime, equipmentConfig, userPreferences) {
  const modifiers = [];
  let adjustedTime = baseTime;
  
  // Dishwasher preferences
  if (userPreferences.hasDishwasher) {
    if (equipmentConfig.dishwasherSafe === true) {
      const reduction = baseTime * 0.6; // 60% time reduction
      adjustedTime -= reduction;
      modifiers.push({
        name: 'Dishwasher safe',
        time: -reduction,
        type: 'preference'
      });
    } else if (equipmentConfig.dishwasherSafe === 'partial') {
      const reduction = baseTime * 0.3; // Some parts dishwasher safe
      adjustedTime -= reduction;
      modifiers.push({
        name: 'Partially dishwasher safe',
        time: -reduction,
        type: 'preference'
      });
    }
  }
  
  // Cleaning style preferences
  switch (userPreferences.cleaningStyle) {
    case 'quick':
      adjustedTime *= 0.7;
      modifiers.push({
        name: 'Quick cleaning style',
        time: -(baseTime * 0.3),
        type: 'preference'
      });
      break;
    case 'thorough':
      adjustedTime *= 1.4;
      modifiers.push({
        name: 'Thorough cleaning style',
        time: baseTime * 0.4,
        type: 'preference'
      });
      break;
    // 'normal' is baseline, no modifier
  }
  
  // Soaking preferences
  if (userPreferences.soakingPreference && equipmentConfig.category === 'cookware') {
    modifiers.push({
      name: 'Soaking time included',
      time: 120, // 2 minutes soaking prep
      type: 'preference'
    });
    adjustedTime += 120;
  }
  
  return { adjustedTime, modifiers };
}

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
    category: 'general'
  });
  totalTime += counterTime;
  
  // Stovetop cleaning (if cookware was used)
  const hasCookware = equipmentInstances.some(e => EQUIPMENT_TYPES[e.type]?.category === 'cookware');
  if (hasCookware) {
    const stovetopTime = 45;
    tasks.push({
      item: 'Stovetop cleaning',
      quantity: 1,
      baseTime: stovetopTime,
      modifiers: [],
      subtotal: stovetopTime,
      reasoning: ['Cooking on stovetop creates spills and splatters'],
      category: 'general'
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
    category: 'general'
  });
  totalTime += sinkTime;
  
  // Floor sweeping (if extensive prep work)
  const hasExtensivePrep = equipmentInstances.some(e => 
    ['flour_batter', 'spice_grinding', 'dough_work'].some(pattern => 
      e.usagePatterns.includes(pattern)
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
      category: 'general'
    });
    totalTime += floorTime;
  }
  
  return { tasks, totalTime };
}

function calculateOverallConfidence(equipmentInstances) {
  if (equipmentInstances.length === 0) return 0.5;
  
  const totalConfidence = equipmentInstances.reduce((sum, instance) => sum + instance.confidence, 0);
  return Math.round((totalConfidence / equipmentInstances.length) * 100) / 100;
}

function groupBreakdownByCategory(breakdown) {
  const categories = {};
  
  breakdown.forEach(item => {
    const category = item.category || 'other';
    if (!categories[category]) {
      categories[category] = {
        items: [],
        totalTime: 0
      };
    }
    
    categories[category].items.push(item);
    categories[category].totalTime += item.subtotal;
  });
  
  return categories;
}

function calculateEstimateRange(totalTime, confidence) {
  // Lower confidence = wider range
  const variability = (1 - confidence) * 0.4 + 0.1; // 10-50% variability
  
  return {
    min: Math.round(totalTime * (1 - variability)),
    max: Math.round(totalTime * (1 + variability)),
    confidence: confidence
  };
}

function formatEquipmentName(equipmentType) {
  return equipmentType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateDetailedReasoning(equipment) {
  const reasons = [...equipment.reasoning];
  
  if (equipment.quantity > 1) {
    reasons.push(`${equipment.quantity} items detected`);
  }
  
  if (equipment.complexity.modifiers.length > 0) {
    reasons.push(`Complexity factors: ${equipment.complexity.modifiers.map(m => m.type).join(', ')}`);
  }
  
  return reasons;
}
```

### 5. Database Schema

**Tables**:
```sql
-- Equipment base data
CREATE TABLE equipment_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  base_time_seconds INTEGER NOT NULL,
  dishwasher_safe BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User feedback for improvements
CREATE TABLE user_feedback (
  id SERIAL PRIMARY KEY,
  recipe_url TEXT NOT NULL,
  estimated_total_time INTEGER NOT NULL,
  actual_total_time INTEGER,
  equipment_feedback JSONB, -- {equipment_type: {estimated_quantity, actual_quantity}}
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analysis cache
CREATE TABLE recipe_analysis_cache (
  id SERIAL PRIMARY KEY,
  recipe_url TEXT UNIQUE NOT NULL,
  scraped_data JSONB NOT NULL,
  equipment_instances JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
);
```

### 6. API Specification

**Endpoints**:

```javascript
// Analyze recipe
POST /api/analyze-recipe
Content-Type: application/json
{
  "url": "string",
  "userPreferences": {
    "hasDishwasher": "boolean",
    "cleaningStyle": "quick|normal|thorough",
    "soakingPreference": "boolean"
  }
}

Response:
{
  "success": true,
  "data": {
    "recipe": {
      "title": "string",
      "totalTime": "string",
      "servings": "number"
    },
    "cleanup": {
      "totalTime": "number (seconds)",
      "breakdown": [
        {
          "item": "string",
          "quantity": "number",
          "baseTime": "number",
          "modifiers": [
            {"name": "string", "time": "number"}
          ],
          "subtotal": "number",
          "reasoning": "string"
        }
      ],
      "confidence": "number (0-1)"
    }
  }
}

// Submit feedback
POST /api/feedback
{
  "recipeUrl": "string",
  "estimatedTime": "number",
  "actualTime": "number",
  "equipmentFeedback": "object",
  "comments": "string"
}
```

### 7. User Interface Requirements

**Main Page Layout**:
```
Header: "Recipe Cleanup Time Estimator"
Input Section:
  - URL input field
  - "Analyze Recipe" button
  - User preferences (collapsible)
    * Dishwasher checkbox
    * Cleaning style radio buttons
    * Soaking preference checkbox

Results Section:
  - Recipe title and basic info
  - Total cleanup time (prominent display)
  - Detailed breakdown (expandable)
  - Feedback form (small, unobtrusive)
```

**Key UI Components**:
1. **URL Input**: Large, prominent input with validation
2. **Preferences Panel**: Collapsible settings with icons
3. **Results Display**: 
   - Large time display (e.g., "12 minutes")
   - Expandable breakdown with equipment icons
   - Reasoning text for each item
4. **Feedback Widget**:
   - "How did we do?" text
   - Quick thumbs up/down
   - Optional text feedback
   - Equipment correction interface

### 8. Development Phases

**Phase 1 - MVP (Week 1-2)**:
- Basic recipe scraping
- Core equipment detection (5-6 equipment types)
- Simple time calculation
- Basic UI with URL input and results display

**Phase 2 - Enhancement (Week 3-4)**:
- Expand equipment detection (15+ types)
- Add user preferences
- Implement detailed breakdown display
- Add feedback collection

**Phase 3 - Polish (Week 5-6)**:
- Improve detection accuracy using feedback data
- Add recipe caching
- Enhance UI/UX
- Error handling and edge cases

### 9. Implementation Files Structure

```
recipe-cleanup-estimator/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   ├── analyze.js
│   │   └── feedback.js
│   ├── services/
│   │   ├── recipeScraper.js
│   │   ├── equipmentDetector.js
│   │   └── cleanupCalculator.js
│   ├── models/
│   │   └── database.js
│   └── utils/
│       ├── patterns.js
│       └── constants.js
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── RecipeForm.js
│   │   │   ├── ResultsDisplay.js
│   │   │   ├── BreakdownTable.js
│   │   │   └── FeedbackWidget.js
│   │   └── utils/
│   │       └── api.js
│   └── public/
└── README.md
```

### 10. Testing Strategy

**Unit Tests**:
- Equipment detection accuracy
- Quantity detection logic
- Time calculation algorithms

**Integration Tests**:
- End-to-end recipe analysis
- API endpoint functionality

**User Testing**:
- Test with 20+ diverse recipes
- Validate time estimates against real cooking experiences
- Gather feedback on UI/UX

### 11. Success Metrics

**Accuracy Metrics**:
- Equipment detection accuracy > 85%
- Time estimation within ±3 minutes for 80% of recipes

**User Engagement**:
- User feedback submission rate > 10%
- Return usage rate > 30%

**Technical Metrics**:
- Recipe analysis response time < 3 seconds
- 99% uptime

This spec provides a comprehensive foundation for building the recipe cleanup time estimator. The modular approach allows for iterative development and easy expansion of features based on user feedback.