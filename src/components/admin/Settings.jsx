import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'iVisionary',
    siteDescription: 'Plataforma de videos de stock generados con IA',
    contactEmail: 'contact@ivisionary.com',
    maxUploadSize: 100,
    allowedFileTypes: '.mp4,.mov,.avi',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la configuración
    console.log('Configuración guardada:', settings);
    // Mostrar un mensaje de éxito al usuario
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Configuración del Sitio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-300">Nombre del Sitio</label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300">Descripción del Sitio</label>
          <textarea
            id="siteDescription"
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          ></textarea>
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300">Email de Contacto</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <label htmlFor="maxUploadSize" className="block text-sm font-medium text-gray-300">Tamaño Máximo de Subida (MB)</label>
          <input
            type="number"
            id="maxUploadSize"
            name="maxUploadSize"
            value={settings.maxUploadSize}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <label htmlFor="allowedFileTypes" className="block text-sm font-medium text-gray-300">Tipos de Archivo Permitidos</label>
          <input
            type="text"
            id="allowedFileTypes"
            name="allowedFileTypes"
            value={settings.allowedFileTypes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaSave className="mr-2" />
          Guardar Configuración
        </button>
      </form>
    </div>
  );
};

export default Settings;