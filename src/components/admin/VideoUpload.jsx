import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../../contexts/VideoContext';
import { useAudit } from '../../contexts/AuditContext';
import { FaCloudUploadAlt, FaSpinner, FaTimes, FaCheck, FaPlay } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { toast } from 'react-toastify';

const VideoUpload = () => {
  const navigate = useNavigate();
  const { addVideo, getCategories } = useVideos();
  const { addAuditLog } = useAudit();
  const [uploading, setUploading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    quality: '1080p',
    duration: '',
    previewUrl: '',
    downloadUrl: ''
  });

  const previewVideoRef = useRef(null);
  const categories = getCategories();

  const validateVideoData = () => {
    const errors = {};
    
    // Validar campos requeridos
    const requiredFields = {
      title: 'El título es obligatorio',
      description: 'La descripción es obligatoria',
      category: 'La categoría es obligatoria',
      duration: 'La duración es obligatoria',
      previewUrl: 'La URL de preview es obligatoria',
      downloadUrl: 'La URL de descarga es obligatoria'
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!videoData[field]?.trim()) {
        errors[field] = message;
      }
    });

    // Validar formato de duración (MM:SS)
    if (videoData.duration && !/^\d{1,2}:\d{2}$/.test(videoData.duration)) {
      errors.duration = 'Formato inválido. Use MM:SS (ej: 2:30)';
    }

    // Validar URLs
    const urlPattern = /^https?:\/\/.+/i;
    if (videoData.previewUrl && !urlPattern.test(videoData.previewUrl)) {
      errors.previewUrl = 'URL de preview inválida';
    }
    if (videoData.downloadUrl && !urlPattern.test(videoData.downloadUrl)) {
      errors.downloadUrl = 'URL de descarga inválida';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al editar
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateVideoData()) {
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }

    setUploading(true);
    try {
      const tags = videoData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      const newVideo = await addVideo({
        ...videoData,
        tags,
        createdAt: new Date().toISOString()
      });

      await addAuditLog('Video Upload', {
        videoId: newVideo.id,
        title: newVideo.title,
        status: 'success'
      });

      toast.success('Video añadido correctamente');
      navigate('/admin/videos');
    } catch (error) {
      console.error('Error al subir video:', error);
      await addAuditLog('Video Upload Failed', {
        error: error.message,
        status: 'error'
      });
      toast.error('Error al subir el video: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePreviewTest = async () => {
    if (!videoData.previewUrl) {
      toast.error('Ingrese una URL de preview primero');
      return;
    }

    setPreviewLoading(true);
    try {
      if (previewVideoRef.current) {
        previewVideoRef.current.src = videoData.previewUrl;
        await previewVideoRef.current.load();
        toast.success('URL de preview válida');
      }
    } catch (error) {
      toast.error('Error al cargar el video de preview');
      setValidationErrors(prev => ({
        ...prev,
        previewUrl: 'Error al cargar el video'
      }));
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Subir Nuevo Video</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/videos')}
          >
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="title"
            label="Título"
            name="title"
            value={videoData.title}
            onChange={handleInputChange}
            error={validationErrors.title}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={videoData.category}
              onChange={handleInputChange}
              className={`w-full bg-gray-700 text-white rounded-lg p-2 border ${
                validationErrors.category ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.name}>{cat.name}</option>
              ))}
              <option value="new">Nueva categoría</option>
            </select>
            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.category}</p>
            )}
          </div>
        </div>

        <Input
          id="description"
          label="Descripción"
          name="description"
          value={videoData.description}
          onChange={handleInputChange}
          error={validationErrors.description}
          textarea
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              id="previewUrl"
              label="URL de Preview"
              name="previewUrl"
              value={videoData.previewUrl}
              onChange={handleInputChange}
              error={validationErrors.previewUrl}
              required
            />
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={handlePreviewTest}
              disabled={previewLoading}
              className="mt-2"
            >
              {previewLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Probando...
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" />
                  Probar Preview
                </>
              )}
            </Button>
          </div>

          <Input
            id="downloadUrl"
            label="URL de Descarga"
            name="downloadUrl"
            value={videoData.downloadUrl}
            onChange={handleInputChange}
            error={validationErrors.downloadUrl}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="duration"
            label="Duración (MM:SS)"
            name="duration"
            value={videoData.duration}
            onChange={handleInputChange}
            error={validationErrors.duration}
            placeholder="2:30"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Calidad
            </label>
            <select
              id="quality"
              name="quality"
              value={videoData.quality}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
              required
            >
              <option value="1080p">1080p</option>
              <option value="2k">2K</option>
              <option value="4k">4K</option>
            </select>
          </div>
        </div>

        <Input
          id="tags"
          label="Tags (separados por coma)"
          name="tags"
          value={videoData.tags}
          onChange={handleInputChange}
          placeholder="naturaleza, paisaje, 4k"
        />

        {videoData.previewUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preview
            </label>
            <video
              ref={previewVideoRef}
              className="w-full max-h-[300px] object-cover rounded"
              controls
            >
              <source src={videoData.previewUrl} type="video/mp4" />
              Tu navegador no soporta el elemento video.
            </video>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/videos')}
          >
            <FaTimes className="mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Subiendo...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Guardar Video
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default VideoUpload;