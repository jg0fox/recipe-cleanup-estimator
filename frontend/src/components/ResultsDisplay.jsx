import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/api';
import { saveRecipe, isRecipeSaved, formatRecipeForSaving } from '../services/recipeStorage';
import Toast from './Toast';

export default function ResultsDisplay({ result }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!result) return null;

  const { recipe, cleanup } = result;
  const totalMinutes = Math.round(cleanup.totalTime / 60);

  // Check if recipe is already saved
  useEffect(() => {
    if (recipe.url) {
      setIsSaved(isRecipeSaved(recipe.url));
    }
  }, [recipe.url]);

  const handleSaveRecipe = () => {
    try {
      const formattedRecipe = formatRecipeForSaving(recipe, cleanup);
      saveRecipe(formattedRecipe);
      setIsSaved(true);
      setToast({ message: 'Recipe saved successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to save recipe', type: 'error' });
    }
  };

  const handleCookRecipe = () => {
    try {
      const formattedRecipe = formatRecipeForSaving(recipe, cleanup);
      const savedRecipe = saveRecipe(formattedRecipe);
      setIsSaved(true);
      navigate(`/cook/${savedRecipe.id}`);
    } catch (error) {
      setToast({ message: 'Failed to open cook mode', type: 'error' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Recipe Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
            <div className="flex gap-4 text-sm text-gray-600">
              {recipe.servings !== 'Unknown' && (
                <span>Servings: {recipe.servings}</span>
              )}
              {recipe.totalTime !== 'Unknown' && (
                <span>Cook Time: {recipe.totalTime}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cleanup Time Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-6">
        <div className="text-center">
          <p className="text-blue-100 text-sm uppercase tracking-wide mb-2">
            Estimated Cleanup Time
          </p>
          <div className="text-6xl font-bold mb-4">
            {totalMinutes} <span className="text-3xl">min</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-blue-100">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{Math.round(cleanup.confidence * 100)}% confidence</span>
            </div>
          </div>
          {cleanup.estimateRange && (
            <p className="mt-4 text-blue-100 text-sm">
              Range: {formatTime(cleanup.estimateRange.min)} - {formatTime(cleanup.estimateRange.max)}
            </p>
          )}
        </div>
      </div>

      {/* Category Summary */}
      {cleanup.categories && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(cleanup.categories).map(([category, data]) => (
            <div key={category} className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {category}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(data.totalTime / 60)}m
              </p>
              <p className="text-xs text-gray-600">{data.items.length} items</p>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleCookRecipe}
          className="flex-1 px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Cook This Recipe
        </button>

        <button
          onClick={handleSaveRecipe}
          disabled={isSaved}
          className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSaved ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Saved
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save Recipe
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
