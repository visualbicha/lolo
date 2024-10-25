import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ 
  label, 
  id = Math.random().toString(36).substr(2, 9), 
  error, 
  textarea, 
  className = '', 
  ...props 
}) => {
  const InputComponent = textarea ? 'textarea' : 'input';
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <InputComponent
        id={id}
        className={`w-full px-3 py-2 bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-600'
        } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  textarea: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;