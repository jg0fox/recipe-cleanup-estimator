import { useState, useRef } from 'react';

export default function PhotoUpload({ onAnalyze, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [preferences, setPreferences] = useState({
    hasDishwasher: false,
    cleaningStyle: 'normal',
    prefersSoaking: false
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, or WebP)');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Trigger file input with camera capture
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, preferences);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze Kitchen Photo</h2>
        <p className="text-gray-600 mb-6">
          Take or upload a photo of your dirty kitchen to get a cleanup time estimate
        </p>

        {!preview ? (
          <div className="space-y-4">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Camera Button */}
            <button
              onClick={handleCameraCapture}
              className="w-full py-4 px-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="text-left">
                <div className="text-lg font-semibold text-gray-900">Take Photo</div>
                <div className="text-sm text-gray-500">Use your camera</div>
              </div>
            </button>

            {/* Upload Button */}
            <button
              onClick={handleFileInputClick}
              className="w-full py-4 px-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-left">
                <div className="text-lg font-semibold text-gray-900">Upload Photo</div>
                <div className="text-sm text-gray-500">Choose from library</div>
              </div>
            </button>

            <p className="text-xs text-gray-500 text-center">
              Supported formats: JPG, PNG, WebP • Max size: 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative">
              <img
                src={preview}
                alt="Kitchen preview"
                className="w-full h-96 object-cover rounded-lg"
              />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preferences Toggle */}
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center justify-between w-full px-4 py-2 text-left text-sm text-blue-600 hover:text-blue-800"
            >
              <span>{showPreferences ? 'Hide' : 'Show'} Preferences</span>
              <svg
                className={`w-5 h-5 transition-transform ${showPreferences ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Preferences Panel */}
            {showPreferences && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h4 className="font-semibold text-gray-900">Cleaning Preferences</h4>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.hasDishwasher}
                    onChange={(e) => setPreferences({...preferences, hasDishwasher: e.target.checked})}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">I have a dishwasher</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cleaning Style</label>
                  <div className="space-y-2">
                    {['quick', 'normal', 'thorough'].map(style => (
                      <label key={style} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cleaningStyle"
                          value={style}
                          checked={preferences.cleaningStyle === style}
                          onChange={(e) => setPreferences({...preferences, cleaningStyle: e.target.value})}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 capitalize">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Kitchen'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
