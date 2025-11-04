import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipeById } from '../services/recipeStorage';
import { useState, useEffect } from 'react';

/**
 * CookMode Component
 * Clean, distraction-free view for cooking with a recipe
 * Displays: title, description, metadata (with emphasized cleanup time),
 * ingredients list, and step-by-step instructions
 */
export default function CookMode() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  useEffect(() => {
    const loadedRecipe = getRecipeById(recipeId);
    if (!loadedRecipe) {
      // Recipe not found, redirect to saved recipes
      navigate('/saved');
    } else {
      setRecipe(loadedRecipe);
    }
  }, [recipeId, navigate]);

  const toggleIngredient = (index) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/saved')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Saved Recipes</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Recipe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-4">
        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6 print:shadow-none">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 print:text-2xl">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="text-lg text-gray-600 mb-6 print:text-base">
              {recipe.description}
            </p>
          )}

          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg mb-6 print:hidden"
            />
          )}

          {/* Metadata Bar - Cleanup Time Emphasized */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-200 pt-6">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Prep Time</div>
              <div className="text-gray-900 font-semibold">{recipe.metadata?.prepTime || 'N/A'}</div>
            </div>

            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Cook Time</div>
              <div className="text-gray-900 font-semibold">{recipe.metadata?.cookTime || 'N/A'}</div>
            </div>

            {/* Cleanup Time - Emphasized */}
            <div className="text-center bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
              <div className="flex items-center justify-center gap-1 text-blue-700 text-sm mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Cleanup Time</span>
              </div>
              <div className="text-blue-900 font-bold text-lg">{recipe.metadata?.cleanupTimeFormatted || 'Unknown'}</div>
            </div>

            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Servings</div>
              <div className="text-gray-900 font-semibold">{recipe.metadata?.servings || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6 print:shadow-none print:break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ingredients
          </h2>

          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <button
                  onClick={() => toggleIngredient(index)}
                  className="flex-shrink-0 w-5 h-5 mt-0.5 border-2 border-gray-300 rounded hover:border-green-500 transition-colors print:hidden"
                  aria-label={`Mark ${ingredient} as used`}
                >
                  {checkedIngredients.has(index) && (
                    <svg className="w-full h-full text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <span className={`text-lg leading-relaxed ${checkedIngredients.has(index) ? 'line-through text-gray-400' : 'text-gray-700'} print:text-base`}>
                  {ingredient}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6 print:shadow-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Instructions
          </h2>

          <ol className="space-y-6">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4 print:break-inside-avoid">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <p className="flex-1 text-lg leading-relaxed text-gray-700 pt-0.5 print:text-base">
                  {instruction}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Original Recipe Link */}
        {recipe.url && (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6 print:shadow-none print:break-inside-avoid">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Original Recipe</h3>
            <Link
              to={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline break-all"
            >
              {recipe.url}
            </Link>
          </div>
        )}

        {/* Done Button */}
        <div className="flex justify-center print:hidden">
          <button
            onClick={() => navigate('/saved')}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            Done Cooking
          </button>
        </div>
      </div>
    </div>
  );
}
