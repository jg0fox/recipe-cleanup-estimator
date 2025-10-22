import { useState } from 'react';
import RecipeForm from './components/RecipeForm';
import ResultsDisplay from './components/ResultsDisplay';
import BreakdownTable from './components/BreakdownTable';
import FeedbackWidget from './components/FeedbackWidget';
import PhotoUpload from './components/PhotoUpload';
import PhotoResults from './components/PhotoResults';
import { analyzeRecipe, analyzeKitchenPhoto } from './utils/api';

function App() {
  const [mode, setMode] = useState('recipe'); // 'recipe' or 'photo'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle recipe analysis
  const handleRecipeAnalyze = async (url, preferences) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeRecipe(url, preferences);
      if (response.success) {
        setResult({ type: 'recipe', data: response.data });
      } else {
        setError(response.error || 'Failed to analyze recipe');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle photo analysis
  const handlePhotoAnalyze = async (photoFile, preferences) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeKitchenPhoto(photoFile, preferences);
      if (response.success) {
        setResult({ type: 'photo', data: response.data });
      } else {
        setError(response.error || 'Failed to analyze photo');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset when switching modes
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Kitchen Cleanup Time Estimator
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Analyze recipes or kitchen photos to estimate cleanup time
          </p>
        </div>
      </header>

      {/* Mode Switcher */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-2 inline-flex gap-2">
          <button
            onClick={() => handleModeSwitch('recipe')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              mode === 'recipe'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Recipe URL
            </div>
          </button>
          <button
            onClick={() => handleModeSwitch('photo')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              mode === 'photo'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Kitchen Photo
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        {/* Recipe Mode */}
        {mode === 'recipe' && (
          <RecipeForm onAnalyze={handleRecipeAnalyze} loading={loading} />
        )}

        {/* Photo Mode */}
        {mode === 'photo' && (
          <PhotoUpload onAnalyze={handlePhotoAnalyze} loading={loading} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">
              {mode === 'recipe' ? 'Analyzing recipe...' : 'Analyzing kitchen photo with AI...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-900">Error</h3>
                  <p className="text-sm text-red-800 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recipe Results */}
        {result && result.type === 'recipe' && !loading && (
          <>
            <ResultsDisplay result={result.data} />
            <BreakdownTable
              breakdown={result.data.cleanup.breakdown}
              categories={result.data.cleanup.categories}
            />
            <FeedbackWidget
              recipeUrl={result.data.recipe.url}
              estimatedTime={result.data.cleanup.totalTime}
            />
          </>
        )}

        {/* Photo Results */}
        {result && result.type === 'photo' && !loading && (
          <PhotoResults analysis={result.data} />
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mode === 'recipe' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </>
              )}
            </svg>
            <p className="mt-4 text-lg">
              {mode === 'recipe'
                ? 'Enter a recipe URL above to get started'
                : 'Take or upload a kitchen photo to get started'}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Built with React, Tailwind CSS, Express, and Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
