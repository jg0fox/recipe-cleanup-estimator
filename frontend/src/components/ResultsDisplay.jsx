import { formatTime } from '../utils/api';

export default function ResultsDisplay({ result }) {
  if (!result) return null;

  const { recipe, cleanup } = result;
  const totalMinutes = Math.round(cleanup.totalTime / 60);

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
    </div>
  );
}
