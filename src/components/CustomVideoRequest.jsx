import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaVideo, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { toast } from 'react-toastify';

const CustomVideoRequest = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState({
    title: '',
    description: '',
    duration: '30',
    style: 'realistic',
    priority: user?.subscription?.type === 'proUltra' ? 'high' : 'normal'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí iría la llamada a la API para enviar la solicitud
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      toast.success('Solicitud enviada correctamente');
      setRequest({
        title: '',
        description: '',
        duration: '30',
        style: 'realistic',
        priority: user?.subscription?.type === 'proUltra' ? 'high' : 'normal'
      });
    } catch (error) {
      toast.error('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <FaVideo className="mr-2" />
        Solicitar Video Personalizado
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="title"
          label="Título del Video"
          value={request.title}
          onChange={(e) => setRequest(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ej: Atardecer en la playa"
          required
        />

        <Input
          id="description"
          label="Descripción Detallada"
          value={request.description}
          onChange={(e) => setRequest(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe el video que deseas generar..."
          textarea
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duración (segundos)
            </label>
            <select
              value={request.duration}
              onChange={(e) => setRequest(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
            >
              <option value="15">15 segundos</option>
              <option value="30">30 segundos</option>
              <option value="60">1 minuto</option>
              {user?.subscription?.type === 'proUltra' && (
                <option value="120">2 minutos</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estilo Visual
            </label>
            <select
              value={request.style}
              onChange={(e) => setRequest(prev => ({ ...prev, style: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
            >
              <option value="realistic">Realista</option>
              <option value="artistic">Artístico</option>
              <option value="cinematic">Cinematográfico</option>
              <option value="abstract">Abstracto</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Enviando solicitud...
            </>
          ) : (
            <>
              <FaPaperPlane className="mr-2" />
              Enviar Solicitud
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default CustomVideoRequest;