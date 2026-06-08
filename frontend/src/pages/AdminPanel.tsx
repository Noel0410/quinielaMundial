import React from 'react';
import { Lock, UploadCloud } from 'lucide-react';

const AdminPanel: React.FC = () => {
  return (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Panel de Administración</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Lock color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Bloquear Predicciones</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Bloquea las predicciones de una etapa del torneo (fase de grupos o eliminatorias) para que los usuarios no puedan modificarlas.
          </p>
          <button className="btn-red" style={{ width: '100%' }}>
            Gestionar Bloqueos
          </button>
        </div>

        <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <UploadCloud color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Subir Resultado Real</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Ingresa los resultados reales de los partidos para calcular los puntos de los usuarios de forma automática.
          </p>
          <button className="btn-green" style={{ width: '100%' }}>
            Ingresar Resultados
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
