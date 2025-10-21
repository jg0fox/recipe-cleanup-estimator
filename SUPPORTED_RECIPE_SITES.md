# Supported Recipe Websites

Your Recipe Cleanup Time Estimator currently supports **43 recipe websites** through the `@brandonrjguth/recipe-scraper` package.

## Full List of Supported Sites

1. **101 Cookbooks** - https://www.101cookbooks.com/
2. **AllRecipes** - https://www.allrecipes.com/
3. **Ambitious Kitchen** - https://www.ambitiouskitchen.com/
4. **Averie Cooks** - https://www.averiecooks.com/
5. **BBC** - https://www.bbc.co.uk/
6. **BBC Good Food** - https://www.bbcgoodfood.com/
7. **Bon Appétit** - https://www.bonappetit.com/
8. **Budget Bytes** - https://www.budgetbytes.com/
9. **Central Texas Food Bank** - https://www.centraltexasfoodbank.org/
10. **Closet Cooking** - https://www.closetcooking.com/
11. **Cookie and Kate** - https://cookieandkate.com/
12. **CopyKat** - https://copykat.com/
13. **Damn Delicious** - https://damndelicious.net/
14. **EatingWell** - https://www.eatingwell.com/
15. **Epicurious** - https://www.epicurious.com/
16. **Food.com** - https://www.food.com/
17. **Food & Wine** - https://www.foodandwine.com/
18. **Food Network** - https://www.foodnetwork.com/
19. **Gimme Delicious** - https://gimmedelicious.com/
20. **Gimme Some Oven** - https://www.gimmesomeoven.com/
21. **Julie Blanner** - https://julieblanner.com/
22. **Kitchen Stories** - https://www.kitchenstories.com/
23. **Mel's Kitchen Cafe** - https://www.melskitchencafe.com/
24. **Minimalist Baker** - https://minimalistbaker.com/
25. **MyRecipes** - https://www.myrecipes.com/
26. **Nom Nom Paleo** - https://nomnompaleo.com/
27. **Omnivore's Cookbook** - https://omnivorescookbook.com/
28. **Pinch of Yum** - https://pinchofyum.com/
29. **RecipeTin Eats** - https://www.recipetineats.com/
30. **Serious Eats** - https://www.seriouseats.com/
31. **Simply Recipes** - https://www.simplyrecipes.com/
32. **Smitten Kitchen** - https://smittenkitchen.com/
33. **The Pioneer Woman** - https://thepioneerwoman.com/
34. **Taste of Home** - https://www.tasteofhome.com/
35. **Tastes Better From Scratch** - https://tastesbetterfromscratch.com/
36. **That Low Carb Life** - https://thatlowcarblife.com/
37. **The Black Peppercorn** - https://theblackpeppercorn.com/
38. **The Real Food RDs** - https://therealfoodrds.com/
39. **The Spruce Eats** - https://www.thespruceeats.com/
40. **What's Gaby Cooking** - https://whatsgabycooking.com/
41. **Woolworths (Australia)** - https://www.woolworths.com.au/
42. **Yummly** - https://www.yummly.com/
43. **Jamie Oliver** - https://www.jamieoliver.com/

## Popular Sites by Category

### Home Cooking Blogs
- Pinch of Yum
- Smitten Kitchen
- Minimalist Baker
- Cookie and Kate
- Budget Bytes
- Damn Delicious

### Professional Food Media
- Bon Appétit
- Food Network
- Serious Eats
- Epicurious
- Food & Wine
- BBC Good Food

### Recipe Aggregators
- AllRecipes
- Food.com
- Yummly
- MyRecipes
- Taste of Home

### Celebrity Chefs
- Jamie Oliver
- The Pioneer Woman

### International
- BBC (UK)
- Woolworths (Australia)
- Omnivore's Cookbook (Chinese)

## How It Works

The recipe scraper uses **Schema.org markup** (JSON-LD) that most modern recipe websites include for SEO purposes. This means:

✅ **Highly Reliable**: If a site has proper recipe markup, scraping works consistently
✅ **Maintenance-Free**: No site-specific scrapers to maintain
✅ **Future-Proof**: New sites with proper markup work automatically

## What Gets Scraped

For each recipe, the scraper extracts:
- Recipe title
- Ingredients list (all items with quantities)
- Instructions (step-by-step)
- Total time (if available)
- Servings (if available)
- Recipe image (if available)

## Testing Recommendations

### Verified Working (from testing)
✅ AllRecipes - Tested with meatloaf recipe
✅ Pinch of Yum - Tested with wontons recipe

### Recommended to Test
- Food Network (very popular)
- Bon Appétit (high-quality content)
- Serious Eats (detailed recipes)
- Budget Bytes (popular with home cooks)
- Minimalist Baker (simple recipes)

## Unsupported Sites

If a recipe site is not on this list, it may still work if:
- The site uses Schema.org recipe markup
- The site has OpenGraph recipe tags

**To request a new site**, create an issue at:
https://github.com/brandonrjguth/Recipe-Scraper/issues

## Error Handling

If scraping fails, users will see:
- Friendly error message
- Suggestion to try a different recipe site
- Option to report the issue

## Future Improvements

See `FUTURE_IMPROVEMENTS.md` for plans to:
- Add systematic testing across all 43 sites
- Implement fallback scraping methods
- Add custom scrapers for popular sites if needed
- Create a site compatibility dashboard

---

**Last Updated**: 2025-10-21
**Package Version**: @brandonrjguth/recipe-scraper@2.7.1
