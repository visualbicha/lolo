import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AIModelManagement = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular la carga de modelos de IA
    setTimeout(() => {
      setModels([
        { id: 1, name: 'Video Generator v1', type: 'Generación', status: 'Activo' },
        { id: 2, name: 'Style Transfer v2', type: 'Estilo', status: 'En pruebas' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddModel = () => {
    // Lógica para añadir un nuevo modelo
  };

  const handleEditModel = (id) => {
    // Lógica para editar un modelo
  };

  const handleDeleteModel = (id) => {
    // Lógica para eliminar un modelo
  };

  if (loading) return <div>Cargando modelos de IA...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Gestión de Modelos de IA</h2>
      <button
        onClick={handleAddModel}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
      >
        <FaPlus className="inline-block mr-2" /> Añadir Modelo
      </button>
      <table className="w-full text-left text-gray-300">
        <thead className="text-white bg-gray-700">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.id} className="border-b border-gray-700">
              <td className="p-3">{model.name}</td>
              <td className="p-3">{model.type}</td>
              <td className="p-3">{model.status}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEditModel(model.id)}
                  className="text-blue-400 hover:text-blue-300 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteModel(model.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AIModelManagement;