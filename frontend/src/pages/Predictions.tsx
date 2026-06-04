import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { predictionService, type MatchPredictionDTO } from '../services/predictionService';
import { FLAGS, SHORT_NAME } from '../countries';

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

const Predictions: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await predictionService.getMyPredictions();

        // Transform the flat matches list into groups
        const groupsMap = new Map<string, Group>();

        data.forEach(match => {
          const groupId = match.groupName.replace('Grupo ', '').trim();

          if (!groupsMap.has(groupId)) {
            groupsMap.set(groupId, {
              id: groupId,
              name: match.groupName,
              teams: [],
              matches: []
            });
          }

          const group = groupsMap.get(groupId)!;
          group.matches.push(match);

          // Add unique teams
          if (!group.teams.find(t => t.name === match.homeTeamName)) {
            group.teams.push({ name: match.homeTeamName, flag: FLAGS[match.homeTeamName] || '🏳️' });
          }
          if (!group.teams.find(t => t.name === match.awayTeamName)) {
            group.teams.push({ name: match.awayTeamName, flag: FLAGS[match.awayTeamName] || '🏳️' });
          }
        });

        // Convert map to sorted array
        const sortedGroups = Array.from(groupsMap.values()).sort((a, b) => a.id.localeCompare(b.id));
        setGroups(sortedGroups);

      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError('No se pudieron cargar los pronósticos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="tab-content glass-card" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content glass-card">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (selectedGroup) {
    const group = groups.find(g => g.id === selectedGroup)!;

    return (
      <div className="tab-content glass-card">
        <div className="detail-header" onClick={() => setSelectedGroup(null)}>
          <button className="back-btn">
            <ChevronLeft size={20} />
          </button>
          <div className="group-letter" style={{ width: 40, height: 40, fontSize: '1.2rem' }}>
            {group.id}
          </div>
          <div className="detail-header-info">
            <h2>{group.name}</h2>
            <p>Fase de Grupos</p>
          </div>
        </div>

        <h4 className="section-title">Partidos</h4>
        <div className="matches-list">
          {group.matches.map((match) => (
            <div key={match.matchId} className="match-row">
              <div className="match-team">
                <span className="team-flag">{FLAGS[match.homeTeamName] || '🏳️'}</span>
                <span>{SHORT_NAME[match.homeTeamName] || match.homeTeamName}</span>
              </div>

              <div className="match-inputs">
                <input
                  type="text"
                  className="match-input"
                  maxLength={1}
                  defaultValue={match.predictedHomeGoals ?? ''}
                />
                <span className="match-separator">-</span>
                <input
                  type="text"
                  className="match-input"
                  maxLength={1}
                  defaultValue={match.predictedAwayGoals ?? ''}
                />
              </div>

              <div className="match-team right">
                <span className="team-flag">{FLAGS[match.awayTeamName] || '🏳️'}</span>
                <span>{SHORT_NAME[match.awayTeamName] || match.awayTeamName}</span>
              </div>
            </div>
          ))}
        </div>

        <h4 className="section-title">Tabla de Posiciones</h4>
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
              {group.teams.map((team, idx) => (
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
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="team-flag">{team.flag}</span>
                      <span>{team.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td className="points-col">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--wc-red)' }}></div>
            Clasifica a 16avos
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d4af37' }}></div>
            Mejor tercero (posible)
          </div>
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
