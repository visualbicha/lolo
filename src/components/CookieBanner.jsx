import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="mb-4 md:mb-0 text-sm">
          Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Al continuar navegando, usted acepta nuestro uso de cookies.
        </p>
        <div className="flex space-x-4">
          <Link to="/cookies" className="text-blue-400 hover:underline text-sm">
            Más información
          </Link>
          <button
            onClick={handleAccept}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition duration-300"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;