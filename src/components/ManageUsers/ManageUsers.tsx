import React, { useState } from 'react';
import styles from './ManageUsers.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 'user-001', name: 'Juan Pérez', email: 'juan.perez@example.com', role: 'Administrador' },
    { id: 'user-002', name: 'María García', email: 'maria.garcia@example.com', role: 'Vendedor' },
    { id: 'user-003', name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', role: 'Invitado' },
  ]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Invitado');

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setShowUserForm(true);
  };

  const handleSaveUser = () => {
    if (!userName || !userEmail || !userRole) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (editingUser) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id
            ? { ...user, name: userName, email: userEmail, role: userRole }
            : user
        )
      );
      alert(`Usuario "${userName}" actualizado con éxito.`);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userName,
        email: userEmail,
        role: userRole,
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
      alert(`Usuario "${userName}" agregado con éxito.`);
    }

    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserRole('Invitado');
    setShowUserForm(false);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a "${userName}"?`)) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      alert(`Usuario "${userName}" eliminado.`);
    }
  };

  const handleCancelForm = () => {
    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserRole('Invitado');
    setShowUserForm(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Administrador de Usuarios</h2>
      <p className={styles.paragraph}>Gestiona los usuarios de tu aplicación.</p>

      {!showUserForm && (
        <button
          onClick={() => setShowUserForm(true)}
          className={styles.addButton}
        >
          Agregar Nuevo Usuario
        </button>
      )}

      {showUserForm && (
        <div className={styles.userForm}>
          <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <div className={styles.formGroup}>
            <label htmlFor="userName" className={styles.formLabel}>Nombre:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={styles.formInput}
              placeholder="Nombre del usuario"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="userEmail" className={styles.formLabel}>Email:</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className={styles.formInput}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="userRole" className={styles.formLabel}>Rol:</label>
            <select
              id="userRole"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className={styles.formSelect}
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Invitado">Invitado</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button
              onClick={handleSaveUser}
              className={styles.saveButton}
            >
              Guardar Usuario
            </button>
            <button
              onClick={handleCancelForm}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {users.length === 0 && !showUserForm ? (
        <p className={styles.noUsersMessage}>No hay usuarios registrados. Agrega uno nuevo.</p>
      ) : (
        <ul className={styles.userList}>
          {users.map(user => (
            <li
              key={user.id}
              className={styles.userListItem}
            >
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <p className={styles.userEmail}>{user.email}</p>
                <span className={styles.userRole}>
                  {user.role}
                </span>
              </div>
              <div className={styles.userActions}>
                <button
                  onClick={() => handleEditUser(user)}
                  className={styles.editButton}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id, user.name)}
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageUsers;