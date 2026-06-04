import React from 'react';

const Predictions: React.FC = () => {
  return (
    <div className="tab-content glass-card">
      <h3>Mis Predicciones</h3>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        Aquí podrás ver y hacer tus predicciones para los partidos de la fase de grupos y eliminatorias.
      </p>
    </div>
  );
};

export default Predictions;
