import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Trophy, Eye, EyeOff } from 'lucide-react';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up the user
      await authService.signup({
        username,
        password,
      });

      setSuccessMsg('Cuenta creada con exito! Ingresando...');

      const data = await authService.login({
        username,
        password,
      });
      login(data.token, data.username, data.role);
      navigate('/');

    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="auth-top-header">
          <div className="auth-top-subtitle" style={{ color: '#3CAC3B' }}>
            <Trophy size={16} color="#3CAC3B" />
            FIFA WORLD CUP 2026
          </div>
          <div className="auth-header">
            <h1>Crear Cuenta</h1>
          </div>
        </div>

        <div className="glass-card">
          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
          {successMsg && <div className="error-message" style={{ marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>{successMsg}</div>}

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
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
              </div>
            </div>
            <button type="submit" className="btn-green" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#3CAC3B' }}>Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
