import { Link, useLocation } from 'react-router-dom';
import { getSavedRecipesCount } from '../services/recipeStorage';
import { useState, useEffect } from 'react';

/**
 * Navigation Component
 * Top navigation bar with links to main sections
 */
export default function Navigation() {
  const location = useLocation();
  const [savedCount, setSavedCount] = useState(0);

  // Update saved count when location changes
  useEffect(() => {
    setSavedCount(getSavedRecipesCount());
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">Messeer</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Home
            </Link>

            <Link
              to="/saved"
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isActive('/saved')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>Saved Recipes</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">
                  {savedCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
