# Recipe Cleanup Time Estimator

A web application that analyzes cooking recipe URLs and estimates cleanup time based on equipment usage, cooking techniques, and user preferences.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+ (currently working with 22.11.0 despite warnings)
- npm

### Running the Application

**1. Start the Backend (Terminal 1)**
```bash
cd backend
npm install  # First time only
node server.js
```
Backend will run on http://localhost:3000

**2. Start the Frontend (Terminal 2)**
```bash
cd frontend
npm install  # First time only
npm run dev
```
Frontend will run on http://localhost:5175 (or next available port)

**3. Open your browser**
Navigate to http://localhost:5175

## 📁 Project Structure

```
recipe-cleanup-estimator/
├── backend/
│   ├── server.js                    # Express server
│   ├── package.json                 # Backend dependencies
│   ├── recipe_cleanup.db            # SQLite database (auto-generated)
│   ├── routes/
│   │   ├── analyze.js               # POST /api/analyze-recipe
│   │   └── feedback.js              # POST /api/feedback
│   ├── services/
│   │   ├── recipeScraper.js         # Recipe scraping service
│   │   ├── equipmentDetector.js     # 5-phase detection algorithm
│   │   └── cleanupCalculator.js     # Time calculation with modifiers
│   ├── models/
│   │   └── database.js              # Database operations & caching
│   └── utils/
│       ├── patterns.js              # Detection patterns (techniques, ingredients, etc.)
│       └── constants.js             # Equipment types database (115 items)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main application component
│   │   ├── components/
│   │   │   ├── RecipeForm.jsx       # URL input + preferences
│   │   │   ├── ResultsDisplay.jsx   # Total time + recipe info
│   │   │   ├── BreakdownTable.jsx   # Detailed equipment breakdown
│   │   │   └── FeedbackWidget.jsx   # User feedback form
│   │   └── utils/
│   │       └── api.js               # API client functions
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration with proxy
│   └── tailwind.config.js           # Tailwind CSS configuration
├── IMPLEMENTATION_PLAN.md           # Detailed implementation plan
├── recipe_cleanup_tech_spec.md      # Original technical specification
└── README.md                        # This file
```

## ✨ Features

### Equipment Detection (5-Phase Algorithm)
1. **Direct Mentions** (95% confidence) - Explicit equipment references
2. **Technique Mappings** (75% confidence) - Cooking verbs → equipment
3. **Ingredient Patterns** (50% confidence) - Ingredients → required tools
4. **Cultural Indicators** (70% confidence) - Cuisine type → traditional equipment
5. **Implied Equipment** (80-90% confidence) - Auto-detect based on other equipment

### Cleanup Calculation
- **Base Time**: Equipment-specific base cleanup time × quantity
- **Complexity Modifiers**: 15 different cooking patterns that affect cleanup
  - Sticky sauce, oil heavy, burnt potential, raw meat handling, etc.
- **Material Modifiers**: Special handling for specific materials
  - Cast iron maintenance, non-stick ease, fine mesh difficulty
- **User Preferences**:
  - Dishwasher availability (60% time reduction for safe items)
  - Cleaning style (Quick: -30%, Normal: baseline, Thorough: +40%)
  - Soaking preference (+2 minutes for cookware)
- **General Cleanup**: Counter, stovetop, sink, floor (when needed)

### Equipment Database
- **115 equipment types** across 8 categories:
  - Cookware (15 items): Pans, pots, woks, etc.
  - Baking (15 items): Sheets, pans, molds, etc.
  - Prep Tools (20 items): Knives, graters, cutting boards, etc.
  - Utensils (20 items): Whisks, spatulas, tongs, etc.
  - Straining (5 items): Colanders, strainers, salad spinners
  - Appliances (9 items): Food processors, blenders, mixers, etc.
  - Cultural Tools (12 items): Mortar & pestle, woks, bamboo steamers, etc.
  - Serving & Storage (7 items): Bowls, platters, containers, etc.

## 🎯 Usage

1. **Enter Recipe URL**: Paste a URL from popular recipe sites (AllRecipes, Food Network, etc.)
2. **Set Preferences** (optional):
   - Enable dishwasher to reduce time estimates
   - Choose cleaning style (quick, normal, thorough)
   - Enable soaking time for cookware
3. **Analyze**: Click "Analyze Recipe"
4. **View Results**:
   - Total cleanup time estimate
   - Confidence score
   - Time range (min-max)
   - Category breakdown
   - Detailed equipment list with reasoning
5. **Provide Feedback**: Help improve estimates by submitting actual cleanup times

## 🧪 Example Results

**Recipe**: Easy Meatloaf from AllRecipes
- **Estimated Cleanup Time**: 32 minutes
- **Confidence**: 84%
- **Equipment Detected**: 13 items
  - Frying Pan (2x) - 234s
  - Loaf Pan (2x) - 129s
  - Mixing Bowl (2x) - 97s
  - Baking Sheet (2x) - 143s
  - Chef Knife (2x) - 221s
  - Stand Mixer (2x) - 441s
  - Plus measuring tools, cutting board, general cleanup

## 🔧 API Endpoints

### POST /api/analyze-recipe
Analyze a recipe URL and return cleanup time estimate.

**Request:**
```json
{
  "url": "https://www.allrecipes.com/recipe/...",
  "userPreferences": {
    "hasDishwasher": true,
    "cleaningStyle": "normal",
    "soakingPreference": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recipe": {
      "title": "Recipe Name",
      "totalTime": "30 minutes",
      "servings": 4,
      "image": "https://...",
      "url": "https://..."
    },
    "cleanup": {
      "totalTime": 1944,
      "breakdown": [...],
      "confidence": 0.84,
      "categories": {...},
      "estimateRange": { "min": 1625, "max": 2263 }
    }
  }
}
```

### POST /api/feedback
Submit user feedback on cleanup time estimates.

**Request:**
```json
{
  "recipeUrl": "https://...",
  "estimatedTime": 1944,
  "actualTime": 1800,
  "comments": "Estimate was close!"
}
```

## 🗄️ Database

SQLite database with 3 tables:
- **equipment_types**: 115 equipment items with base times
- **user_feedback**: User-submitted actual times and corrections
- **recipe_analysis_cache**: 7-day cache of analyzed recipes

## 🚧 Future Enhancements

- Machine learning to improve estimates based on user feedback
- Recipe comparison tool
- Meal planning with multiple recipes
- Equipment inventory tracking
- Difficulty rating (cooking + cleanup)
- Mobile app
- Browser extension
- Social features and sharing

## 📝 Tech Stack

- **Backend**: Node.js, Express, SQLite
- **Frontend**: React, Vite, Tailwind CSS
- **Recipe Scraping**: @brandonrjguth/recipe-scraper
- **Deployment**: Vercel/Netlify (frontend) + Railway/Render (backend)

## 🎨 Design Principles

- **Transparency**: Show detailed reasoning for all estimates
- **User Control**: Customizable preferences
- **Feedback Loop**: Continuous improvement through user input
- **Performance**: <3 second response time goal
- **Confidence Scoring**: Honest about detection certainty

## 📊 Success Metrics

- Equipment detection accuracy: >85%
- Time estimation accuracy: Within ±3 minutes for 80% of recipes
- User feedback submission rate: >10%
- Response time: <3 seconds

## 🤝 Contributing

Feedback and contributions welcome! To improve detection patterns:
1. Use the feedback widget after analyzing recipes
2. Report missed equipment or incorrect quantities
3. Suggest new equipment types or cooking patterns

## 📄 License

MIT

---

**Built with ❤️ using React, Tailwind CSS, and Express**
