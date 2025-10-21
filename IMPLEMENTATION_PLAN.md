# Recipe Cleanup Time Estimator - Implementation Plan

## Project Overview
A web application that analyzes recipe URLs and estimates cleanup time based on equipment usage, cooking techniques, and user preferences.

## Tech Stack
- **Backend**: Node.js with Express
- **Frontend**: React with Tailwind CSS
- **Database**: SQLite (development) / PostgreSQL (production)
- **Recipe Parsing**: `recipe-scraper` npm package
- **Deployment**: Vercel/Netlify (frontend) + Railway/Render (backend)

## Implementation Timeline: 18 Days

### Phase 1: Backend Foundation (Days 1-3)

#### 1. Project Setup
- Initialize Node.js/Express backend with proper folder structure
- Set up SQLite database with schema for equipment types, feedback, and cache
- Configure development environment (ESM modules, nodemon, etc.)

#### 2. Core Data & Patterns
- Create `utils/constants.js` with comprehensive EQUIPMENT_TYPES database (185 equipment items)
  - Cookware (pots, pans, skillets, woks)
  - Baking equipment (sheets, pans, molds)
  - Prep tools (knives, graters, cutting boards)
  - Utensils (whisks, spatulas, tongs)
  - Appliances (food processor, blender, mixer)
  - Cultural tools (mortar & pestle, bamboo steamer, wok spatula)
  - Serving & storage items

- Create `utils/patterns.js` with DETECTION_PATTERNS including:
  - Direct equipment mentions (explicit references)
  - Technique mappings (verbs → equipment: sauté → pan, whisk → whisk)
  - Ingredient preparation patterns (chopped onions → knife + board)
  - Cultural/cuisine indicators (Thai → mortar & pestle)
  - Quantity indicators (two pans, meanwhile, another bowl)
  - Complexity modifiers:
    - Sticky sauce (+120s cookware, +90s baking)
    - Oil heavy (+90s cookware)
    - Burnt potential (+150s cookware)
    - Dairy burning (+100s cookware)
    - Raw meat (+90s prep for sanitization)
    - Sugar work (+140s extremely sticky)
    - And 7 more modifiers...

#### 3. Recipe Scraping Service
- Integrate `recipe-scraper` npm package
- Build `services/recipeScraper.js` to extract:
  - Recipe title, ingredients, instructions
  - Cooking time and servings
  - Handle errors for unsupported sites

### Phase 2: Equipment Detection Engine (Days 4-6)

#### 4. Equipment Detector Service
Build `services/equipmentDetector.js` with sophisticated multi-phase detection:

**Phase 1: Scan for all equipment mentions**
- Direct mentions (highest confidence: 0.95)
  - "frying pan", "skillet", "saucepan" etc.
- Technique-based detection (medium confidence: 0.75)
  - "sauté" → frying_pan
  - "whisk" → whisk
  - "grate" → box_grater
- Ingredient-based detection (lower confidence: 0.5)
  - "grated cheese" → grater
  - "chopped onions" → knife + cutting board
- Cultural indicators (medium confidence: 0.7)
  - "stir-fry" → wok
  - "thai curry" → mortar & pestle

**Phase 2: Group mentions by type and detect quantities**
- Parse explicit quantities ("two pans", "3 bowls", "a pair of")
- Detect separating words ("another", "second", "separate", "different")
- Identify concurrent cooking ("meanwhile", "at the same time", "while")
- Recognize size variations ("large bowl", "small bowl" → 2 bowls)

**Phase 3: Analyze usage patterns and complexity**
- Identify complexity modifiers from recipe text
- Calculate confidence scores per equipment
- Generate reasoning explanations

**Phase 4: Add implied equipment**
- Cutting board if knives detected
- Measuring cups/spoons if measurements present

**Phase 5: Resolve conflicts and deduplicate**
- Keep highest confidence when duplicates found
- Cross-validate equipment combinations

### Phase 3: Cleanup Calculation (Days 7-8)

#### 5. Cleanup Calculator Service
Build `services/cleanupCalculator.js` with:

**Base Time Calculation**
- Equipment type base time × quantity
- Example: frying_pan (180s) × 2 = 360s

**Complexity Modifiers (add time)**
```
sticky_sauce:
  - cookware: +120s
  - baking: +90s
  - utensils: +45s

burnt_potential:
  - cookware: +150s
  - baking: +120s

raw_meat:
  - prep: +90s (sanitization required)

sugar_work:
  - cookware: +140s (extremely sticky)
```

**Material Modifiers**
- Non-stick: -30s (easier cleaning)
- Cast iron: +45s (special maintenance required)
- Wooden/bamboo: +15s (hand wash only)
- Fine mesh: +30s (particles trap in mesh)

**User Preference Application**
```
Dishwasher:
  - If dishwasher safe: -60% time
  - If partially safe: -30% time
  - If not safe: no change

Cleaning Style:
  - Quick: ×0.7 multiplier
  - Normal: ×1.0 (baseline)
  - Thorough: ×1.4 multiplier

Soaking:
  - If enabled for cookware: +120s
```

**General Cleanup Tasks (always included)**
- Counter wiping: 30s (always)
- Stovetop cleaning: 45s (if cookware used)
- Sink cleanup: 25s (always)
- Floor sweeping: 60s (if flour/spice/dough work detected)

**Confidence & Range Calculation**
- Overall confidence = average of equipment confidences
- Estimate range: ±10-50% based on confidence level
  - High confidence (0.9+): ±10%
  - Medium confidence (0.7-0.9): ±25%
  - Low confidence (<0.7): ±50%

### Phase 4: API Layer (Days 9-10)

#### 6. API Routes

**POST /api/analyze-recipe**
```javascript
// Request
{
  "url": "https://example.com/recipe",
  "userPreferences": {
    "hasDishwasher": true,
    "cleaningStyle": "normal",  // "quick" | "normal" | "thorough"
    "soakingPreference": false
  }
}

// Response
{
  "success": true,
  "data": {
    "recipe": {
      "title": "Chicken Stir-Fry",
      "totalTime": "30 minutes",
      "servings": 4
    },
    "cleanup": {
      "totalTime": 720,  // seconds
      "breakdown": [
        {
          "item": "Wok",
          "quantity": 1,
          "baseTime": 150,
          "modifiers": [
            {"name": "High heat cooking", "time": 90, "type": "complexity"},
            {"name": "Dishwasher safe", "time": -90, "type": "preference"}
          ],
          "subtotal": 150,
          "reasoning": ["Direct mention: 'wok'", "High heat detected"],
          "category": "cookware",
          "confidence": 0.95
        },
        // ... more items
      ],
      "confidence": 0.87,
      "estimateRange": {
        "min": 600,
        "max": 840
      },
      "categories": {
        "cookware": { items: [...], totalTime: 300 },
        "prep": { items: [...], totalTime: 180 },
        "utensils": { items: [...], totalTime: 120 },
        "general": { items: [...], totalTime: 120 }
      }
    }
  }
}
```

**POST /api/feedback**
```javascript
{
  "recipeUrl": "string",
  "estimatedTime": 720,
  "actualTime": 780,
  "equipmentFeedback": {
    "wok": { estimated: 1, actual: 1 },
    "cutting_board": { estimated: 1, actual: 2 }
  },
  "comments": "Forgot to account for the serving platter"
}
```

#### 7. Database Integration
- Implement caching layer for analyzed recipes (7-day expiry)
- Store user feedback for future improvements
- Seed equipment_types table with base data

**Database Schema**:
```sql
-- Equipment base data
CREATE TABLE equipment_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  base_time_seconds INTEGER NOT NULL,
  dishwasher_safe BOOLEAN NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User feedback for improvements
CREATE TABLE user_feedback (
  id SERIAL PRIMARY KEY,
  recipe_url TEXT NOT NULL,
  estimated_total_time INTEGER NOT NULL,
  actual_total_time INTEGER,
  equipment_feedback JSONB,
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

### Phase 5: Frontend Development (Days 11-14)

#### 8. React Project Setup
- Initialize with Vite + React + Tailwind CSS
- Configure proxy for API calls
- Set up component structure

#### 9. UI Components

**RecipeForm Component**
- Large URL input with validation
- "Analyze Recipe" button with loading state
- Collapsible preferences panel:
  - Dishwasher checkbox with icon
  - Cleaning style radio buttons (Quick/Normal/Thorough)
  - Soaking preference toggle
- Error messages for invalid URLs

**ResultsDisplay Component**
- Recipe title and metadata card (servings, cook time)
- Prominent cleanup time display (large, bold, color-coded)
- Time range indicator with confidence level
- Visual breakdown by category (pie chart or bar graph optional)

**BreakdownTable Component**
- Expandable equipment list grouped by category
- Each item shows:
  - Equipment name + quantity (with icon)
  - Base time + modifiers breakdown
  - Subtotal with reasoning tooltips/expandable
- Visual indicators for complexity factors (badges)
- Category totals and subtotals
- Collapsible sections for each category

**FeedbackWidget Component**
- "How did we do?" prompt (unobtrusive)
- Quick thumbs up/down buttons
- Expandable form for detailed feedback:
  - "Actual cleanup time" input
  - Equipment corrections interface
  - Comments textarea
  - Submit button

### Phase 6: Integration & Testing (Days 15-16)

#### 10. Frontend-Backend Integration
- Implement API client with error handling
- Add loading states and spinners
- Error messages for failed requests
- Success messages for feedback submission

#### 11. Recipe Testing Suite
Test with diverse recipes from popular sites:

**Simple Recipes (5-7 min cleanup)**
- Scrambled eggs
- Green salad
- Toast with avocado

**Medium Complexity (10-15 min cleanup)**
- Pasta with tomato sauce
- Chicken stir-fry
- Sheet pan vegetables
- Chocolate chip cookies

**High Complexity (20+ min cleanup)**
- Lasagna (multiple pans, baking)
- Stir-fry with multiple components
- Layer cake with frosting
- Deep-fried chicken

**Cultural Diversity**
- Thai curry (mortar & pestle, wok)
- Mexican tacos (comal, molcajete)
- Italian pasta (pasta pot, sauce pan)
- Japanese ramen (multiple pots, bamboo steamer)
- Indian curry (spice grinding, multiple pots)

**Edge Cases**
- No-cook recipes (minimal equipment)
- Equipment-heavy recipes (professional techniques)
- Recipes with missing instructions
- Invalid URLs
- Unsupported recipe sites

#### 12. Refinement
- Adjust time estimates based on real testing
- Fine-tune detection patterns for missed equipment
- Add missing equipment to database
- Improve UI/UX based on usability observations
- Optimize loading times

### Phase 7: Polish & Deployment (Days 17-18)

#### 13. Error Handling
- Graceful failures for unsupported recipe sites
- Clear validation messages for invalid URLs
- Fallback messages when scraping fails
- Timeout handling for slow recipe sites
- Network error handling

#### 14. Performance Optimization
- Cache analyzed recipes in database (7-day TTL)
- Optimize regex pattern matching (compile once)
- Debounce URL input validation
- Lazy load components
- Minimize bundle size

#### 15. Deployment
- **Frontend**: Deploy to Vercel or Netlify
  - Build optimized production bundle
  - Configure environment variables
  - Set up custom domain (optional)

- **Backend**: Deploy to Railway or Render
  - Configure Node.js environment
  - Set up PostgreSQL database
  - Environment variables for DB connection
  - CORS configuration for frontend

- **Database Migration**: SQLite → PostgreSQL
  - Export equipment_types seed data
  - Update connection strings
  - Test production database

## File Structure

```
recipe-cleanup-estimator/
├── backend/
│   ├── package.json
│   ├── server.js                    # Express app setup
│   ├── routes/
│   │   ├── analyze.js               # POST /api/analyze-recipe
│   │   └── feedback.js              # POST /api/feedback
│   ├── services/
│   │   ├── recipeScraper.js         # recipe-scraper integration
│   │   ├── equipmentDetector.js     # 5-phase detection engine
│   │   └── cleanupCalculator.js     # time calculation with modifiers
│   ├── models/
│   │   └── database.js              # SQLite/PostgreSQL connection & queries
│   └── utils/
│       ├── patterns.js              # DETECTION_PATTERNS (direct mentions, techniques, etc.)
│       └── constants.js             # EQUIPMENT_TYPES (185 items with base times)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── App.jsx                  # Main app component
│   │   ├── components/
│   │   │   ├── RecipeForm.jsx       # URL input + preferences
│   │   │   ├── ResultsDisplay.jsx   # Total time + summary
│   │   │   ├── BreakdownTable.jsx   # Detailed equipment breakdown
│   │   │   └── FeedbackWidget.jsx   # User feedback form
│   │   ├── utils/
│   │   │   └── api.js               # API client functions
│   │   └── index.css                # Tailwind imports
│   ├── public/
│   └── index.html
├── README.md
├── recipe_cleanup_tech_spec.md      # Original tech spec
└── IMPLEMENTATION_PLAN.md           # This file
```

## Success Metrics

### Accuracy Metrics
- **Equipment detection accuracy**: >85%
  - Measure: % of equipment correctly identified in test recipes
- **Time estimation accuracy**: Within ±3 minutes for 80% of recipes
  - Measure: User feedback on actual vs estimated times

### User Engagement
- **Feedback submission rate**: >10%
  - Measure: % of analyses that receive feedback
- **Return usage rate**: >30%
  - Measure: % of users who analyze multiple recipes

### Technical Metrics
- **Recipe analysis response time**: <3 seconds
  - Measure: API endpoint response time
- **Uptime**: 99%
  - Measure: Server availability monitoring

## Key Technical Decisions

### Why This Stack

**Express**
- Simple, flexible backend perfect for API
- Large ecosystem of middleware
- Easy integration with recipe-scraper

**React**
- Component reusability
- Rich ecosystem for UI components
- Excellent developer experience

**Tailwind CSS**
- Rapid UI development
- Consistent design system
- Small production bundle with purging

**SQLite → PostgreSQL**
- SQLite: Easy local development, no setup required
- PostgreSQL: Production-ready, scalable, JSON support
- Smooth migration path

**recipe-scraper**
- Handles major recipe sites (AllRecipes, FoodNetwork, etc.)
- Structured data extraction
- Active maintenance

### Critical Success Factors

1. **Detection Accuracy**
   - Comprehensive patterns database is crucial
   - Multi-phase detection reduces false negatives
   - Confidence scores enable transparency

2. **Transparency**
   - Show reasoning for all estimates
   - Detailed breakdown builds trust
   - Confidence ranges manage expectations

3. **User Feedback Loop**
   - Essential for improving accuracy over time
   - Equipment corrections inform pattern updates
   - Time feedback calibrates calculations

4. **Performance**
   - <3s response time target
   - Caching prevents redundant scraping
   - Optimized regex compilation

5. **UX**
   - Clear, uncluttered interface
   - Focus on core value proposition
   - Progressive disclosure (preferences collapsible)

## Development Best Practices

- **Version Control**: Git with feature branches
- **Code Style**: ESLint + Prettier for consistency
- **Testing**: Unit tests for core algorithms, integration tests for API
- **Documentation**: JSDoc comments for complex functions
- **Error Logging**: Structured logging for debugging
- **Security**: Input validation, SQL injection prevention, rate limiting

## Future Enhancements (Post-MVP)

- **Machine Learning**: Train model on user feedback to improve accuracy
- **Recipe Comparison**: Compare cleanup times for similar recipes
- **Meal Planning**: Estimate cleanup for multiple recipes
- **Equipment Profiles**: Save user's actual equipment inventory
- **Difficulty Rating**: Overall cooking + cleanup difficulty score
- **Mobile App**: Native iOS/Android apps
- **Browser Extension**: Analyze recipes directly from recipe sites
- **Social Features**: Share estimates, community feedback
- **Time Tracking**: Built-in timer to track actual cleanup time

## Next Steps

Ready to begin Phase 1: Backend Foundation
1. Set up backend project structure
2. Create equipment database and detection patterns
3. Implement recipe scraping service
