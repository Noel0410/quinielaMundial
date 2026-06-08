import React, { useState } from 'react';
import { Lock, UploadCloud, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AdminPanel: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState('Fase de Grupos');
  const [limitDate, setLimitDate] = useState('');
  const [loadingLimit, setLoadingLimit] = useState(false);

  const STAGES = [
    'Fase de Grupos',
    'Dieciseisavos de Final',
    'Octavos de Final',
    'Cuartos de Final',
    'Semifinales',
    'Tercer Puesto',
    'Final'
  ];

  const handleSetLimit = async () => {
    if (!limitDate) {
      alert('Por favor selecciona una fecha y hora.');
      return;
    }
    setLoadingLimit(true);
    try {
      await axios.post(API_ENDPOINTS.PREDICTIONS.LIMIT_DATE(selectedStage), { limitDate });
      alert('Fecha límite actualizada con éxito para la etapa: ' + selectedStage);
      setLimitDate('');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar la fecha límite.');
    } finally {
      setLoadingLimit(false);
    }
  };

  return (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Panel de Administración</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Lock color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Límite de Predicciones</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Establece la fecha y hora límite para las predicciones de una etapa. Esto actualizará los pronósticos existentes y las nuevas predicciones guardadas usarán este límite.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <select 
              value={selectedStage} 
              onChange={(e) => setSelectedStage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-main)'
              }}
            >
              {STAGES.map(stage => (
                <option key={stage} value={stage} style={{ background: '#1a1a2e' }}>
                  {stage}
                </option>
              ))}
            </select>

            <input 
              type="datetime-local" 
              value={limitDate}
              onChange={(e) => setLimitDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-main)',
                colorScheme: 'dark'
              }}
            />
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleSetLimit}
            disabled={loadingLimit}
          >
            {loadingLimit ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={20} />}
            Guardar Límite
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
