import React, { useState } from 'react';
import { FaFont, FaAdjust, FaUniversalAccess } from 'react-icons/fa';

const AccessibilitySettings = () => {
  const [fontSize, setFontSize] = useState('medium');
  const [contrast, setContrast] = useState('normal');

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center text-gray-300 mb-2">
          <FaFont className="mr-2" /> Font Size
        </label>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-full bg-gray-700 text-white rounded p-2"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label className="flex items-center text-gray-300 mb-2">
          <FaAdjust className="mr-2" /> Contrast
        </label>
        <select
          value={contrast}
          onChange={(e) => setContrast(e.target.value)}
          className="w-full bg-gray-700 text-white rounded p-2"
        >
          <option value="normal">Normal</option>
          <option value="high">High Contrast</option>
        </select>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center">
        <FaUniversalAccess className="mr-2" /> Apply Settings
      </button>
    </div>
  );
};

export default AccessibilitySettings;