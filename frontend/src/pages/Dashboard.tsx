import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, List, Activity } from 'lucide-react';
import Leaderboard from './Leaderboard';
import Predictions from './Predictions';
import AdminPanel from './AdminPanel';
import HowToPlay from './HowToPlay';
import { Settings, Info } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'predictions' | 'admin' | 'how-to-play'>('leaderboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return <Leaderboard />;
      case 'predictions':
        return <Predictions />;
      case 'admin':
        return <AdminPanel />;
      case 'how-to-play':
        return <HowToPlay />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Trophy size={32} color="var(--primary)" />
          <h1>Quiniela Mundial 2026</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Hola, <strong style={{ color: 'var(--text-main)' }}>{user?.username}</strong>
          </span>
          <button onClick={logout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tab-list">
          <button
            className={`tab-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <List size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }} />
            Tabla de Posiciones
          </button>
          <button
            className={`tab-item ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictions')}
          >
            <Activity size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }} />
            Predicciones
          </button>
          
          {user?.role === 'ADMIN' && (
            <button
              className={`tab-item ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <Settings size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }} />
              Administración
            </button>
          )}

          <button
            className={`tab-item ${activeTab === 'how-to-play' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-to-play')}
          >
            <Info size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }} />
            Cómo jugar
          </button>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
