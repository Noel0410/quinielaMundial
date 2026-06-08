import React, { useState } from 'react';
import { Lock, UploadCloud, Save, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { FLAGS, SHORT_NAME, getMatchOrderIndex } from '../countries';
import type { MatchPredictionDTO } from '../services/predictionService';

interface Team {
  name: string;
  flag: string;
}

interface Group {
  id: string;
  name: string;
  teams: Team[];
  matches: MatchPredictionDTO[];
}

const AdminPanel: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState('Fase de Grupos');
  const [limitDate, setLimitDate] = useState('');
  const [loadingLimit, setLoadingLimit] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [savingMatches, setSavingMatches] = useState<Record<string, boolean>>({});

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

  const fetchMatches = async () => {
    setLoadingResults(true);
    try {
      const response = await axios.get(API_ENDPOINTS.MATCHES.LIST);
      const data: MatchPredictionDTO[] = response.data;

      const groupsMap = new Map<string, Group>();
      data.forEach(match => {
        const groupId = match.groupName.replace('Grupo ', '').trim();
        if (!groupsMap.has(groupId)) {
          groupsMap.set(groupId, { id: groupId, name: match.groupName, teams: [], matches: [] });
        }
        const group = groupsMap.get(groupId)!;
        group.matches.push({ ...match });

        if (!group.teams.find(t => t.name === match.homeTeamName)) {
          group.teams.push({ name: match.homeTeamName, flag: FLAGS[match.homeTeamName] || '🏳️' });
        }
        if (!group.teams.find(t => t.name === match.awayTeamName)) {
          group.teams.push({ name: match.awayTeamName, flag: FLAGS[match.awayTeamName] || '🏳️' });
        }
      });

      const sortedGroups = Array.from(groupsMap.values()).map(g => {
        g.matches.sort((a, b) => getMatchOrderIndex(a.homeTeamName, a.awayTeamName) - getMatchOrderIndex(b.homeTeamName, b.awayTeamName));
        return g;
      }).sort((a, b) => a.id.localeCompare(b.id));
      setGroups(sortedGroups);
    } catch (error) {
      console.error(error);
      alert('Error al cargar los partidos.');
    } finally {
      setLoadingResults(false);
    }
  };

  const handleGoalChange = (matchId: string, type: 'home' | 'away', value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    if (value !== '' && (isNaN(numValue as number) || (numValue as number) < 0)) return;

    setGroups(prevGroups => prevGroups.map(g => {
      if (g.id !== selectedGroup) return g;
      return {
        ...g,
        matches: g.matches.map(m => {
          if (m.matchId !== matchId) return m;
          const updatedMatch = { ...m };
          if (type === 'home') updatedMatch.predictedHomeGoals = numValue;
          if (type === 'away') updatedMatch.predictedAwayGoals = numValue;
          return updatedMatch;
        })
      };
    }));
  };

  const handleSaveResult = async (match: MatchPredictionDTO) => {
    if (match.predictedHomeGoals === null || match.predictedAwayGoals === null) {
      alert("Por favor ingresa ambos goles.");
      return;
    }
    setSavingMatches(prev => ({ ...prev, [match.matchId]: true }));
    try {
      await axios.post(API_ENDPOINTS.MATCHES.UPDATE_RESULT(match.matchId), {
        homeGoals: match.predictedHomeGoals,
        awayGoals: match.predictedAwayGoals
      });
      alert('Resultado guardado y puntos recalculados correctamente.');
    } catch (error) {
      console.error(error);
      alert('Error al guardar el resultado.');
    } finally {
      setSavingMatches(prev => ({ ...prev, [match.matchId]: false }));
    }
  };

  if (showResults) {
    if (loadingResults) {
      return (
        <div className="tab-content glass-card" style={{ display: 'flex', justifyContent: 'center', padding: '4rem', marginTop: '2rem' }}>
          <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      );
    }

    if (selectedGroup) {
      const group = groups.find(g => g.id === selectedGroup)!;
      return (
        <div className="tab-content glass-card" style={{ marginTop: '2rem' }}>
          <div className="detail-header" onClick={() => setSelectedGroup(null)} style={{ cursor: 'pointer' }}>
            <button className="back-btn"><ChevronLeft size={20} /></button>
            <div className="group-letter" style={{ width: 40, height: 40, fontSize: '1.2rem' }}>{group.id}</div>
            <div className="detail-header-info">
              <h2>{group.name}</h2>
              <p>Subir Resultados Reales</p>
            </div>
          </div>

          <h4 className="section-title">Partidos</h4>
          <div className="matches-list">
            {group.matches.map((match) => (
              <div key={match.matchId} className="match-row" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="match-team">
                  <span className="team-flag">{FLAGS[match.homeTeamName] || '🏳️'}</span>
                  <span>{SHORT_NAME[match.homeTeamName] || match.homeTeamName}</span>
                </div>
                <div className="match-inputs">
                  <input
                    type="text"
                    className="match-input"
                    maxLength={2}
                    value={match.predictedHomeGoals ?? ''}
                    onChange={(e) => handleGoalChange(match.matchId, 'home', e.target.value)}
                  />
                  <span className="match-separator">-</span>
                  <input
                    type="text"
                    className="match-input"
                    maxLength={2}
                    value={match.predictedAwayGoals ?? ''}
                    onChange={(e) => handleGoalChange(match.matchId, 'away', e.target.value)}
                  />
                </div>
                <div className="match-team right">
                  <span className="team-flag">{FLAGS[match.awayTeamName] || '🏳️'}</span>
                  <span>{SHORT_NAME[match.awayTeamName] || match.awayTeamName}</span>
                </div>
                <div style={{ marginLeft: '1rem' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleSaveResult(match)}
                    disabled={savingMatches[match.matchId]}
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {savingMatches[match.matchId] ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                    Guardar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="tab-content glass-card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <button className="back-btn" onClick={() => setShowResults(false)} style={{ marginRight: '1rem' }}><ChevronLeft size={20} /></button>
          <h2 style={{ margin: 0 }}>Selecciona un Grupo/Fase</h2>
        </div>
        <div className="groups-grid">
          {groups.map((group) => {
            return (
              <div key={group.id} className="group-card" onClick={() => setSelectedGroup(group.id)}>
                <div className="group-card-top">
                  <div className="group-letter">{group.id}</div>
                  <ChevronRight className="group-arrow" size={20} />
                </div>
                <div className="group-teams">
                  {group.teams.map(team => (
                    <div key={team.name} className="team-row">
                      <span className="team-flag">{team.flag}</span>
                      <span>{team.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

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
          <button
            className="btn-green"
            style={{ width: '100%' }}
            onClick={() => {
              setShowResults(true);
              fetchMatches();
            }}
          >
            Ingresar Resultados
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
