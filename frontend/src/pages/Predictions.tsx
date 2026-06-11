import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Save, Lock, CheckCircle2 } from 'lucide-react';
import { predictionService, type MatchPredictionDTO } from '../services/predictionService';
import { FLAGS, SHORT_NAME, getMatchOrderIndex } from '../countries';

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

interface TeamStats {
  name: string;
  flag: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

const Predictions: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const data = await predictionService.getMyPredictions();

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
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError('No se pudieron cargar los pronósticos.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (matchId: string, type: 'home' | 'away', value: string) => {
    const group = groups.find(g => g.id === selectedGroup);
    const match = group?.matches.find(m => m.matchId === matchId);
    if (match?.finished) {
      alert('No es posible editar la predicción.');
      return;
    }

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
          updatedMatch.isPredicted = updatedMatch.predictedHomeGoals !== null && updatedMatch.predictedAwayGoals !== null;
          return updatedMatch;
        })
      };
    }));
  };

  const handleSaveGroup = async () => {
    const group = groups.find(g => g.id === selectedGroup);
    if (!group) return;

    setSaving(true);
    try {
      const predictionsToSave = group.matches.filter(m => m.predictedHomeGoals !== null && m.predictedAwayGoals !== null);
      await predictionService.savePredictions(predictionsToSave);
      setSuccessMsg('¡Predicciones guardadas correctamente!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al guardar predicciones.');
    } finally {
      setSaving(false);
    }
  };

  const calculateStandings = (group: Group): TeamStats[] => {
    const statsMap = new Map<string, TeamStats>();

    group.teams.forEach(t => {
      statsMap.set(t.name, { name: t.name, flag: t.flag, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 });
    });

    group.matches.forEach(m => {
      if (m.predictedHomeGoals !== null && m.predictedAwayGoals !== null) {
        const hStats = statsMap.get(m.homeTeamName)!;
        const aStats = statsMap.get(m.awayTeamName)!;
        const hg = m.predictedHomeGoals;
        const ag = m.predictedAwayGoals;

        hStats.p += 1;
        aStats.p += 1;
        hStats.gf += hg;
        hStats.ga += ag;
        aStats.gf += ag;
        aStats.ga += hg;

        if (hg > ag) {
          hStats.w += 1;
          aStats.l += 1;
          hStats.pts += 3;
        } else if (hg < ag) {
          aStats.w += 1;
          hStats.l += 1;
          aStats.pts += 3;
        } else {
          hStats.d += 1;
          aStats.d += 1;
          hStats.pts += 1;
          aStats.pts += 1;
        }
      }
    });

    const standings = Array.from(statsMap.values());
    standings.forEach(s => s.gd = s.gf - s.ga);

    standings.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.name.localeCompare(b.name);
    });

    return standings;
  };

  if (loading) {
    return (
      <div className="tab-content glass-card" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return <div className="tab-content glass-card"><div className="error-message">{error}</div></div>;
  }

  if (selectedGroup) {
    const group = groups.find(g => g.id === selectedGroup)!;
    const standings = calculateStandings(group);

    return (
      <div className="tab-content glass-card">
        <div className="detail-header" onClick={() => setSelectedGroup(null)}>
          <button className="back-btn"><ChevronLeft size={20} /></button>
          <div className="group-letter" style={{ width: 40, height: 40, fontSize: '1.2rem' }}>{group.id}</div>
          <div className="detail-header-info">
            <h2>{group.name}</h2>
            <p>Fase de Grupos</p>
          </div>
        </div>

        <h4 className="section-title">Partidos</h4>
        <div className="matches-list">
          {group.matches.map((match) => (
            <div key={match.matchId} className="match-row" style={{ position: 'relative' }}>
              <div className="match-team">
                <span className="team-flag">{FLAGS[match.homeTeamName] || '🏳️'}</span>
                <span>{SHORT_NAME[match.homeTeamName] || match.homeTeamName}</span>
              </div>
              <div className="match-inputs">
                <input
                  type="text"
                  className="match-input"
                  maxLength={1}
                  value={match.predictedHomeGoals ?? ''}
                  onChange={(e) => handleGoalChange(match.matchId, 'home', e.target.value)}
                  disabled={match.finished}
                  style={match.finished ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                />
                <span className="match-separator">-</span>
                <input
                  type="text"
                  className="match-input"
                  maxLength={1}
                  value={match.predictedAwayGoals ?? ''}
                  onChange={(e) => handleGoalChange(match.matchId, 'away', e.target.value)}
                  disabled={match.finished}
                  style={match.finished ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                />
              </div>
              <div className="match-team right">
                <span className="team-flag">{FLAGS[match.awayTeamName] || '🏳️'}</span>
                <span>{SHORT_NAME[match.awayTeamName] || match.awayTeamName}</span>
              </div>
              {match.finished && (
                <div className="closed-badge">
                  <Lock size={14} /> <span className="closed-text">Cerrado</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={20} />
            {successMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '2rem' }}>
          <button className="btn-primary" onClick={handleSaveGroup} disabled={saving} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {saving ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={20} />}
            Guardar Predicciones
          </button>
        </div>

        <h4 className="section-title">Predicción del grupo</h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Equipo</th>
                <th style={{ textAlign: 'center' }}>PJ</th>
                <th style={{ textAlign: 'center' }}>G</th>
                <th style={{ textAlign: 'center' }}>E</th>
                <th style={{ textAlign: 'center' }}>P</th>
                <th style={{ textAlign: 'center' }}>DG</th>
                <th className="points-col">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, idx) => (
                <tr key={team.name}>
                  <td className={idx < 2 ? 'rank-1' : ''} style={{ color: idx < 2 ? '#FFD700' : 'var(--text-muted)' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: idx < 2 ? 'var(--wc-red)' : 'var(--surface-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', color: '#fff'
                    }}>
                      {idx + 1}
                    </div>
                  </td>
                  <td style={{ fontWeight: idx < 2 ? 'bold' : 'normal', color: idx < 2 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="team-flag">{team.flag}</span>
                      <span>{team.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{team.p}</td>
                  <td style={{ textAlign: 'center' }}>{team.w}</td>
                  <td style={{ textAlign: 'center' }}>{team.d}</td>
                  <td style={{ textAlign: 'center' }}>{team.l}</td>
                  <td style={{ textAlign: 'center' }}>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                  <td className="points-col">{team.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const totalPredictions = groups.reduce((acc, g) => acc + g.matches.filter(m => m.isPredicted).length, 0);
  const totalMatches = groups.reduce((acc, g) => acc + g.matches.length, 0);

  return (
    <div className="tab-content glass-card">
      <div className="predictions-header">
        {totalPredictions}/{totalMatches} pronósticos cargados
      </div>
      <div className="groups-grid">
        {groups.map((group) => {
          const predictedInGroup = group.matches.filter(m => m.isPredicted).length;
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
              <div className="group-footer">
                {predictedInGroup}/{group.matches.length} PARTIDOS
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Predictions;
