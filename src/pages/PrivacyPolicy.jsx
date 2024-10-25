import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Política de Privacidad</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6 text-gray-300">
        <p className="mb-4">Última actualización: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mb-4 text-white">1. Introducción</h2>
        <p className="mb-4">En iVisionary, nos comprometemos a proteger su privacidad y a cumplir con el Reglamento General de Protección de Datos (RGPD) de la UE. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos sus datos personales.</p>
        
        <h2 className="text-2xl font-semibold mb-4 text-white">2. Datos que Recopilamos</h2>
        <p className="mb-4">Recopilamos los siguientes datos personales:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Nombre y apellidos</li>
          <li>Dirección de correo electrónico</li>
          <li>Información de facturación</li>
          <li>Historial de uso del servicio</li>
        </ul>
        
        {/* Añade más secciones según sea necesario */}
        
        <h2 className="text-2xl font-semibold mb-4 text-white">10. Contacto</h2>
        <p className="mb-4">Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, por favor contáctenos en: <a href="mailto:privacy@ivisionary.com" className="text-blue-400 hover:underline">privacy@ivisionary.com</a></p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;