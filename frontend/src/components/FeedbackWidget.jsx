import { useState } from 'react';
import { submitFeedback } from '../utils/api';

export default function FeedbackWidget({ recipeUrl, estimatedTime }) {
  const [isOpen, setIsOpen] = useState(false);
  const [actualTime, setActualTime] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickFeedback = async (helpful) => {
    try {
      setSubmitting(true);
      await submitFeedback({
        recipeUrl,
        estimatedTime,
        comments: helpful ? 'Helpful' : 'Not helpful',
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDetailedFeedback = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      await submitFeedback({
        recipeUrl,
        estimatedTime,
        actualTime: actualTime ? parseInt(actualTime) * 60 : undefined,
        comments,
      });

      setSubmitted(true);
      setActualTime('');
      setComments('');
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!recipeUrl) return null;

  if (submitted) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">Thank you for your feedback!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {!isOpen ? (
          <div className="text-center">
            <p className="text-gray-700 mb-4">How did we do?</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleQuickFeedback(true)}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Helpful
              </button>
              <button
                onClick={() => handleQuickFeedback(false)}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Not Helpful
              </button>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Provide detailed feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleDetailedFeedback} className="space-y-4">
            <h4 className="font-semibold text-gray-900">Detailed Feedback</h4>

            <div>
              <label htmlFor="actual-time" className="block text-sm font-medium text-gray-700 mb-1">
                Actual cleanup time (minutes)
              </label>
              <input
                type="number"
                id="actual-time"
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
                placeholder="e.g., 25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                Comments (optional)
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="What could we improve? Any equipment we missed?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
