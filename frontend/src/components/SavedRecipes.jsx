import { Link, useNavigate } from 'react-router-dom';
import { getSavedRecipes, deleteRecipe } from '../services/recipeStorage';
import { useState, useEffect } from 'react';

/**
 * SavedRecipes Component
 * Displays a grid of all saved recipes
 * Allows users to open recipes in cook mode or delete them
 */
export default function SavedRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'shortest', 'longest'
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Recipe ID to confirm deletion

  useEffect(() => {
    loadRecipes();
  }, [sortBy]);

  const loadRecipes = () => {
    let loadedRecipes = getSavedRecipes();

    // Sort recipes based on selected option
    if (sortBy === 'shortest') {
      loadedRecipes.sort((a, b) => (a.metadata?.cleanupTime || 999) - (b.metadata?.cleanupTime || 999));
    } else if (sortBy === 'longest') {
      loadedRecipes.sort((a, b) => (b.metadata?.cleanupTime || 0) - (a.metadata?.cleanupTime || 0));
    } else {
      // 'recent' - already sorted by savedAt descending in service
    }

    setRecipes(loadedRecipes);
  };

  const handleDelete = (recipeId) => {
    deleteRecipe(recipeId);
    loadRecipes();
    setDeleteConfirm(null);
  };

  const handleOpenCookMode = (recipeId) => {
    navigate(`/cook/${recipeId}`);
  };

  // Empty state
  if (recipes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🍳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Saved Recipes Yet</h2>
            <p className="text-gray-600 mb-6">
              Save recipes from the home page to access them here for cooking.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Find Recipes to Save
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Recipes</h1>
          <p className="text-gray-600">
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        </div>

        {/* Sort Controls */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('recent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'recent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Recently Saved
            </button>
            <button
              onClick={() => setSortBy('shortest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'shortest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Shortest Cleanup
            </button>
            <button
              onClick={() => setSortBy('longest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'longest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Longest Cleanup
            </button>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Recipe Image */}
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => handleOpenCookMode(recipe.id)}
                />
              ) : (
                <div
                  className="w-full h-48 bg-gray-200 flex items-center justify-center cursor-pointer"
                  onClick={() => handleOpenCookMode(recipe.id)}
                >
                  <span className="text-6xl">🍽️</span>
                </div>
              )}

              {/* Recipe Info */}
              <div className="p-4">
                <h3
                  className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleOpenCookMode(recipe.id)}
                >
                  {recipe.title}
                </h3>

                {recipe.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                  {recipe.metadata?.cleanupTimeFormatted && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-blue-700">
                        {recipe.metadata.cleanupTimeFormatted}
                      </span>
                      <span className="text-gray-500">cleanup</span>
                    </div>
                  )}
                </div>

                {/* Saved Date */}
                <p className="text-xs text-gray-500 mb-4">
                  Saved {new Date(recipe.savedAt).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenCookMode(recipe.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Cook
                  </button>

                  {deleteConfirm === recipe.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(recipe.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
