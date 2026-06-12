import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Key, Eye, EyeOff } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.resetPassword({
        username,
        newPassword,
      });

      setSuccess('Contraseña restablecida exitosamente. Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="auth-top-header">
          <div className="auth-top-subtitle" style={{ color: 'var(--primary)' }}>
            <Key size={16} color="var(--primary)" />
            FIFA WORLD CUP 2026
          </div>
          <div className="auth-header">
            <h1>Recuperar contraseña</h1>
          </div>
        </div>

        <div className="glass-card" style={{ borderColor: 'rgba(42, 57, 141, 0.4)', boxShadow: '0 8px 32px rgba(42, 57, 141, 0.15)' }}>
          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
          {success && <div className="success-message" style={{ marginBottom: '1rem', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>{success}</div>}

          <form onSubmit={handleSubmit} className="form-group" style={{ gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Ingresa tu usuario"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Restableciendo...' : 'Cambiar contraseña'}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login">Volver al inicio de sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
