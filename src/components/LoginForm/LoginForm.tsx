import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import type { User } from '../../interfaces/interfaces';
import { useNavigate } from 'react-router-dom'
import './LoginForm.css';


const LoginForm: React.FC = () => {
  const { login, loading: authLoading } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setLocalLoading(true);

    try {
      const response = await new Promise<{ success: boolean; user: User; token: string }>((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin' && password === 'admin123') {
            const simulatedUser: User = { id: '1', username: 'admin', role: 'admin' };
            const simulatedToken = 'fake-jwt-token-12345';
            resolve({ success: true, user: simulatedUser, token: simulatedToken });
          } else {
            reject(new Error('Usuario o contraseña incorrectos'));
          }
        }, 1500);
      });

      if (response.success) {
        console.log('Login exitoso para:', response.user.username);
        login(response.user, response.token);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Ocurrió un error inesperado');
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = localLoading || authLoading;

  return (
    <div className="login-form-container">
      <h2 className="login-form-title">Iniciar Sesión</h2>
      <form className='login-form-form' onSubmit={handleSubmit}>
        <div className="login-form-form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="login-form-form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="login-form-error-message">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="login-form-login-button"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;