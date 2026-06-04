import React from 'react';

const Leaderboard: React.FC = () => {
  return (
    <div className="tab-content glass-card">
      <h3>Tabla de Posiciones</h3>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        Aquí se mostrará la tabla de posiciones de todos los usuarios, ordenada por los puntos obtenidos.
      </p>
    </div>
  );
};

export default Leaderboard;
