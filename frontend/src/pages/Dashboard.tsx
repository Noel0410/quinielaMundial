import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Trophy size={32} color="var(--primary)" />
          <h1>Quiniela Mundial 2026</h1>
        </div>
        <button onClick={logout} className="btn-secondary">
          Sign Out
        </button>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2>Welcome back, {user?.username}!</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          You have successfully authenticated using JWT.
          Your protected dashboard content will go here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
