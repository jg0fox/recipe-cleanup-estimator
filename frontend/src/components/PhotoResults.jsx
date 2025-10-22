import { formatTime } from '../utils/api';

export default function PhotoResults({ analysis }) {
  const { totalTime, equipment, areas, assessment, confidence, estimateRange } = analysis;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Total Time Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-xl p-8 text-white text-center">
        <p className="text-sm font-medium opacity-90 uppercase tracking-wide mb-2">
          Estimated Cleanup Time
        </p>
        <p className="text-6xl font-bold mb-2">
          {Math.floor(totalTime / 60)} <span className="text-3xl">min</span>
        </p>
        <div className="flex items-center justify-center gap-2 text-sm opacity-90">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{Math.round(confidence * 100)}% confidence</span>
        </div>
        <p className="text-sm mt-3 opacity-75">
          Range: {formatTime(estimateRange.min)} - {formatTime(estimateRange.max)}
        </p>
      </div>

      {/* Assessment Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Assessment</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{assessment.totalItems}</div>
            <div className="text-sm text-gray-600">Items Detected</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 capitalize">{assessment.messLevel}</div>
            <div className="text-sm text-gray-600">Mess Level</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 capitalize">{assessment.complexity}</div>
            <div className="text-sm text-gray-600">Complexity</div>
          </div>
        </div>

        {assessment.recommendations && assessment.recommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
            <ul className="space-y-2">
              {assessment.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Equipment Breakdown */}
      {equipment && equipment.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Detected Items</h3>
          <div className="space-y-3">
            {equipment.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-gray-900">
                      {item.item} {item.quantity > 1 && `× ${item.quantity}`}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.messLevel === 'heavy' ? 'bg-red-100 text-red-700' :
                      item.messLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.messLevel}
                    </span>
                  </div>
                  <div className="font-bold text-blue-600">
                    {formatTime(item.estimatedTime * item.quantity)}
                  </div>
                </div>
                {item.notes && (
                  <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas Breakdown */}
      {areas && areas.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Areas to Clean</h3>
          <div className="space-y-3">
            {areas.map((area, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-gray-900 capitalize">
                      {area.name.replace(/_/g, ' ')}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      area.condition.includes('heavy') ? 'bg-red-100 text-red-700' :
                      area.condition.includes('moderate') ? 'bg-yellow-100 text-yellow-700' :
                      area.condition.includes('light') ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {area.condition.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="font-bold text-blue-600">
                    {formatTime(area.estimatedTime)}
                  </div>
                </div>
                {area.notes && (
                  <p className="text-sm text-gray-600 mt-1">{area.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
