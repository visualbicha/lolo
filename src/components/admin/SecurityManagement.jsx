import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaBan, FaUnlock, FaExclamationTriangle, FaSync, FaSpinner } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAudit } from '../../contexts/AuditContext';
import { toast } from 'react-toastify';

const SecurityManagement = () => {
  const { auditLogs, getLogsByIp } = useAudit();
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [ipToBlock, setIpToBlock] = useState('');
  const [thresholds, setThresholds] = useState({
    loginAttempts: 5,
    timeWindow: 15, // minutos
    suspiciousRequests: 100 // requests por minuto
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Detectar actividad sospechosa
      const suspicious = detectSuspiciousActivity();
      setSuspiciousActivity(suspicious);

      setLoading(false);
    } catch (error) {
      console.error('Error loading security data:', error);
      toast.error('Error al cargar datos de seguridad');
      setLoading(false);
    }
  };

  const detectSuspiciousActivity = () => {
    const suspicious = [];
    const ipMap = new Map();

    // Agrupar logs por IP
    auditLogs.forEach(log => {
      if (!log.ipAddress) return;
      
      if (!ipMap.has(log.ipAddress)) {
        ipMap.set(log.ipAddress, {
          failedLogins: 0,
          requests: 0,
          lastActivity: new Date(log.timestamp)
        });
      }

      const ipData = ipMap.get(log.ipAddress);
      
      // Contar intentos fallidos de login
      if (log.action === 'Login Failed') {
        ipData.failedLogins++;
      }

      // Contar requests totales
      ipData.requests++;
    });

    // Analizar datos por IP
    ipMap.forEach((data, ip) => {
      const timeWindow = thresholds.timeWindow * 60 * 1000; // convertir a ms
      const now = new Date();
      const timeDiff = now - new Date(data.lastActivity);

      if (timeDiff <= timeWindow) {
        // Verificar intentos fallidos de login
        if (data.failedLogins >= thresholds.loginAttempts) {
          suspicious.push({
            ip,
            type: 'login_attempts',
            count: data.failedLogins,
            lastActivity: data.lastActivity
          });
        }

        // Verificar cantidad de requests
        if (data.requests >= thresholds.suspiciousRequests) {
          suspicious.push({
            ip,
            type: 'high_requests',
            count: data.requests,
            lastActivity: data.lastActivity
          });
        }
      }
    });

    return suspicious;
  };

  const handleBlockIP = async (ip) => {
    try {
      // En un entorno real, esto se comunicaría con el backend
      setBlockedIPs(prev => [...prev, {
        ip,
        blockedAt: new Date().toISOString(),
        reason: 'Manual block'
      }]);
      toast.success(`IP ${ip} bloqueada correctamente`);
    } catch (error) {
      toast.error(`Error al bloquear IP: ${error.message}`);
    }
  };

  const handleUnblockIP = async (ip) => {
    try {
      setBlockedIPs(prev => prev.filter(item => item.ip !== ip));
      toast.success(`IP ${ip} desbloqueada correctamente`);
    } catch (error) {
      toast.error(`Error al desbloquear IP: ${error.message}`);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadSecurityData();
      toast.success('Datos de seguridad actualizados');
    } catch (error) {
      toast.error('Error al actualizar datos de seguridad');
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateThresholds = async (e) => {
    e.preventDefault();
    try {
      // En un entorno real, esto se comunicaría con el backend
      setThresholds(prev => ({...prev}));
      toast.success('Umbrales actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar umbrales');
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="ml-2 text-white">Cargando datos de seguridad...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Panel de Seguridad</h2>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="secondary"
        >
          {refreshing ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Actualizando...
            </>
          ) : (
            <>
              <FaSync className="mr-2" />
              Actualizar
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de Actividad Sospechosa */}
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            Actividad Sospechosa
          </h3>
          {suspiciousActivity.length === 0 ? (
            <p className="text-gray-400">No se ha detectado actividad sospechosa</p>
          ) : (
            <div className="space-y-4">
              {suspiciousActivity.map((activity, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{activity.ip}</p>
                      <p className="text-sm text-gray-400">
                        {activity.type === 'login_attempts' 
                          ? `${activity.count} intentos fallidos de login`
                          : `${activity.count} requests en ${thresholds.timeWindow} minutos`}
                      </p>
                      <p className="text-sm text-gray-400">
                        Última actividad: {new Date(activity.lastActivity).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleBlockIP(activity.ip)}
                    >
                      <FaBan className="mr-2" />
                      Bloquear IP
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Panel de IPs Bloqueadas */}
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FaBan className="text-red-500 mr-2" />
            IPs Bloqueadas
          </h3>
          <div className="mb-4">
            <div className="flex gap-2">
              <Input
                id="ip-block"
                placeholder="Introducir IP para bloquear"
                value={ipToBlock}
                onChange={(e) => setIpToBlock(e.target.value)}
              />
              <Button
                onClick={() => {
                  handleBlockIP(ipToBlock);
                  setIpToBlock('');
                }}
                disabled={!ipToBlock}
              >
                Bloquear
              </Button>
            </div>
          </div>
          {blockedIPs.length === 0 ? (
            <p className="text-gray-400">No hay IPs bloqueadas</p>
          ) : (
            <div className="space-y-4">
              {blockedIPs.map((blocked, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{blocked.ip}</p>
                      <p className="text-sm text-gray-400">
                        Bloqueada: {new Date(blocked.blockedAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleUnblockIP(blocked.ip)}
                    >
                      <FaUnlock className="mr-2" />
                      Desbloquear
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Configuración de Seguridad */}
      <Card>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FaShieldAlt className="text-green-500 mr-2" />
          Configuración de Seguridad
        </h3>
        <form onSubmit={handleUpdateThresholds} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Intentos de Login Máximos
              </label>
              <Input
                type="number"
                value={thresholds.loginAttempts}
                onChange={(e) => setThresholds(prev => ({
                  ...prev,
                  loginAttempts: parseInt(e.target.value)
                }))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ventana de Tiempo (minutos)
              </label>
              <Input
                type="number"
                value={thresholds.timeWindow}
                onChange={(e) => setThresholds(prev => ({
                  ...prev,
                  timeWindow: parseInt(e.target.value)
                }))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requests Sospechosos/min
              </label>
              <Input
                type="number"
                value={thresholds.suspiciousRequests}
                onChange={(e) => setThresholds(prev => ({
                  ...prev,
                  suspiciousRequests: parseInt(e.target.value)
                }))}
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              Guardar Configuración
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SecurityManagement;