import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import type { User } from '../../interfaces/interfaces';


const LoginForm: React.FC = () => {
  const { login, loading: authLoading } = useContext(AuthContext)!;

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  // Si el usuario ya está autenticado a través del contexto, podrías redirigir aquí
  // useEffect(() => {
  //   if (authUser) {
  //     // Aquí podrías usar useNavigate de react-router-dom para redirigir
  //     console.log("Usuario ya autenticado, redirigiendo...");
  //   }
  // }, [authUser]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setLocalLoading(true);

    try {
      const response = await new Promise<{ success: boolean; user: User; token: string }>((resolve, reject) => {
        setTimeout(() => {
          if (username === 'testuser' && password === 'password123') {
            const simulatedUser: User = { id: '1', username: 'testuser', role: 'admin' }; // Simula un objeto User
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
    <div style={{ /* ... tus estilos ... */ }}>
      <h2 style={{ /* ... tus estilos ... */ }}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ /* ... tus estilos ... */ }}>Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ /* ... tus estilos ... */ }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ /* ... tus estilos ... */ }}>Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ /* ... tus estilos ... */ }}
          />
        </div>
        {error && (
          <p style={{ color: '#e74c3c', marginBottom: '15px', textAlign: 'center' }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#95a5a6' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '18px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;