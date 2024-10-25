import React from 'react';

const GlassmorphicCard = ({ children }) => {
  return (
    <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6">
      {children}
    </div>
  );
};

export default GlassmorphicCard;