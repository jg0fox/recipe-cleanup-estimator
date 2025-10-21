import { useState } from 'react';
import { formatTime } from '../utils/api';

export default function BreakdownTable({ breakdown, categories }) {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Breakdown</h3>
          <p className="text-sm text-gray-600 mt-1">
            Click on any item to see calculation details
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {breakdown.map((item, index) => (
            <div key={index} className="hover:bg-gray-50 transition-colors">
              {/* Item Row */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{item.item}</span>
                      {item.quantity > 1 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          × {item.quantity}
                        </span>
                      )}
                      {item.category && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      )}
                    </div>
                    {item.confidence && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatTime(item.subtotal)}
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedItems.has(index) ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedItems.has(index) && (
                <div className="px-6 pb-4 bg-gray-50">
                  <div className="space-y-3">
                    {/* Base Time */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base time:</span>
                      <span className="font-medium text-gray-900">
                        {formatTime(item.baseTime * item.quantity)}
                      </span>
                    </div>

                    {/* Modifiers */}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Adjustments:</p>
                        {item.modifiers.map((modifier, mIndex) => (
                          <div
                            key={mIndex}
                            className="flex justify-between text-sm pl-4 border-l-2 border-gray-300"
                          >
                            <div className="flex-1">
                              <span className="text-gray-600">{modifier.name}</span>
                              <span className="ml-2 text-xs text-gray-500">
                                ({modifier.type})
                              </span>
                            </div>
                            <span
                              className={`font-medium ${
                                modifier.time >= 0 ? 'text-red-600' : 'text-green-600'
                              }`}
                            >
                              {modifier.time >= 0 ? '+' : ''}
                              {formatTime(Math.abs(modifier.time))}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reasoning */}
                    {item.reasoning && item.reasoning.length > 0 && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-1">Detection reasoning:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {item.reasoning.map((reason, rIndex) => (
                            <li key={rIndex} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
