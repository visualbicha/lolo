import React, { useState } from 'react';
import { FaEdit, FaTrash, FaUserLock, FaPlus, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useAudit } from '../../contexts/AuditContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      isLocked: false,
      createdAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { addAuditLog } = useAudit();
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });

  const roles = [
    { id: 'user', name: 'Usuario', description: 'Acceso básico a la plataforma' },
    { id: 'editor', name: 'Editor', description: 'Puede gestionar contenido' },
    { id: 'admin', name: 'Administrador', description: 'Acceso completo al sistema' }
  ];

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        throw new Error('Email inválido');
      }

      // Validar contraseña
      if (newUser.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      // Verificar si el email ya existe
      if (users.some(user => user.email === newUser.email)) {
        throw new Error('Este email ya está registrado');
      }

      const createdUser = {
        id: Date.now(),
        ...newUser,
        isLocked: false,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, createdUser]);
      
      await addAuditLog('User Created', {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        status: 'success'
      });

      toast.success('Usuario creado correctamente');
      setShowAddForm(false);
      setNewUser({
        username: '',
        email: '',
        role: 'user',
        password: ''
      });
    } catch (error) {
      toast.error(error.message);
      await addAuditLog('User Creation Failed', {
        error: error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);

      await addAuditLog('Role Update', {
        userId,
        newRole,
        status: 'success'
      });

      toast.success('Rol actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el rol');
      await addAuditLog('Role Update Failed', {
        userId,
        error: error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      setLoading(true);
      setUsers(users.filter(user => user.id !== userId));
      
      await addAuditLog('User Delete', {
        userId,
        status: 'success'
      });

      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar usuario');
      await addAuditLog('User Delete Failed', {
        userId,
        error: error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLockUser = async (userId, isLocked) => {
    try {
      setLoading(true);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isLocked } : user
      ));

      await addAuditLog('User Lock Status', {
        userId,
        isLocked,
        status: 'success'
      });

      toast.success(`Usuario ${isLocked ? 'bloqueado' : 'desbloqueado'} correctamente`);
    } catch (error) {
      toast.error(`Error al ${isLocked ? 'bloquear' : 'desbloquear'} usuario`);
      await addAuditLog('User Lock Failed', {
        userId,
        error: error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <FaPlus className="mr-2" />
          Añadir Usuario
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Nuevo Usuario</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="username"
                label="Nombre de Usuario"
                name="username"
                value={newUser.username}
                onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                required
              />
              <Input
                id="email"
                label="Email"
                type="email"
                name="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                id="password"
                label="Contraseña"
                type="password"
                name="password"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  'Crear Usuario'
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-4 text-left">Usuario</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Rol</th>
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-left">Fecha Creación</th>
                <th className="p-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-gray-700 text-white rounded p-1"
                      disabled={user.email === 'admin@example.com'}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded ${user.isLocked ? 'bg-red-500' : 'bg-green-500'}`}>
                      {user.isLocked ? 'Bloqueado' : 'Activo'}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleLockUser(user.id, !user.isLocked)}
                        variant="secondary"
                        size="small"
                        disabled={user.email === 'admin@example.com'}
                      >
                        <FaUserLock className="mr-1" />
                        {user.isLocked ? 'Desbloquear' : 'Bloquear'}
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="danger"
                        size="small"
                        disabled={user.email === 'admin@example.com'}
                      >
                        <FaTrash className="mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;