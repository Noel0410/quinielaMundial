import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Trophy } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({
        username,
        password,
      });

      const { token, username: resUsername } = data;
      login(token, resUsername);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales invalidas o error del servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="auth-top-header">
          <div className="auth-top-subtitle">
            <Trophy size={16} color="#d4af37" />
            FIFA WORLD CUP 2026
          </div>
          <div className="auth-header">
            <h1>Iniciar sesión</h1>
          </div>
        </div>

        <div className="glass-card">
          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="form-group" style={{ gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Nombre de usuario"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-red" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="auth-footer">
            ¿No tienes cuenta? <Link to="/signup">Crear cuenta</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
