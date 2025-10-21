import { useState } from 'react';

export default function RecipeForm({ onAnalyze, loading }) {
  const [url, setUrl] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    hasDishwasher: false,
    cleaningStyle: 'normal',
    soakingPreference: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url, preferences);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div>
          <label htmlFor="recipe-url" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe URL
          </label>
          <input
            type="url"
            id="recipe-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.allrecipes.com/recipe/..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
          <p className="mt-2 text-sm text-gray-500">
            Paste a URL from popular recipe sites like AllRecipes, Food Network, etc.
          </p>
        </div>

        {/* Analyze Button */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze Recipe'}
        </button>

        {/* Preferences Toggle */}
        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showPreferences ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showPreferences ? 'Hide' : 'Show'} Preferences
        </button>

        {/* Preferences Panel */}
        {showPreferences && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Cleaning Preferences</h3>

            {/* Dishwasher */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dishwasher"
                checked={preferences.hasDishwasher}
                onChange={(e) =>
                  setPreferences({ ...preferences, hasDishwasher: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="dishwasher" className="ml-3 text-sm text-gray-700">
                I have a dishwasher
              </label>
            </div>

            {/* Cleaning Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cleaning Style
              </label>
              <div className="space-y-2">
                {['quick', 'normal', 'thorough'].map((style) => (
                  <div key={style} className="flex items-center">
                    <input
                      type="radio"
                      id={`style-${style}`}
                      name="cleaningStyle"
                      value={style}
                      checked={preferences.cleaningStyle === style}
                      onChange={(e) =>
                        setPreferences({ ...preferences, cleaningStyle: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`style-${style}`} className="ml-3 text-sm text-gray-700">
                      <span className="capitalize">{style}</span>
                      {style === 'quick' && ' (fast rinse)'}
                      {style === 'normal' && ' (standard clean)'}
                      {style === 'thorough' && ' (deep clean)'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Soaking Preference */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="soaking"
                checked={preferences.soakingPreference}
                onChange={(e) =>
                  setPreferences({ ...preferences, soakingPreference: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="soaking" className="ml-3 text-sm text-gray-700">
                Include soaking time for cookware
              </label>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
