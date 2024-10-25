import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Términos de Servicio</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6 text-gray-300">
        <p className="mb-4">Última actualización: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mb-4 text-white">1. Aceptación de los Términos</h2>
        <p className="mb-4">Al acceder y utilizar iVisionary, usted acepta estar legalmente vinculado por estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, no utilice nuestro servicio.</p>
        
        <h2 className="text-2xl font-semibold mb-4 text-white">2. Descripción del Servicio</h2>
        <p className="mb-4">iVisionary es una plataforma de videos de stock generados con inteligencia artificial (IA). Ofrecemos una biblioteca de videos para uso comercial y personal, sujeto a las licencias correspondientes.</p>
        
        <h2 className="text-2xl font-semibold mb-4 text-white">3. Propiedad Intelectual</h2>
        <p className="mb-4">Todos los videos disponibles en iVisionary son generados por IA y están protegidos por derechos de autor. Al descargar un video, se le otorga una licencia para su uso de acuerdo con los términos especificados en la licencia correspondiente.</p>
        
        {/* Añade más secciones según sea necesario */}
        
        <h2 className="text-2xl font-semibold mb-4 text-white">10. Contacto</h2>
        <p className="mb-4">Si tiene alguna pregunta sobre estos Términos de Servicio, por favor contáctenos en: <a href="mailto:legal@ivisionary.com" className="text-blue-400 hover:underline">legal@ivisionary.com</a></p>
      </div>
    </div>
  );
};

export default TermsOfService;