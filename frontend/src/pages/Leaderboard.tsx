import React, { useEffect, useState } from 'react';
import { userService, type UserLeaderboardResponse } from '../services/userService';
import { Trophy, Loader2 } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<UserLeaderboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await userService.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('No se pudo cargar la tabla de posiciones. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankClass = (index: number) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return '';
  };

  return (
    <div className="tab-content glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Trophy size={24} color="#d4af37" />
        <h3 style={{ margin: 0 }}>Tabla de Posiciones</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th className="rank-col">Pos</th>
                <th>Usuario</th>
                <th className="points-col">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No hay usuarios en la tabla de posiciones aún.
                  </td>
                </tr>
              ) : (
                leaderboard.map((user, index) => (
                  <tr key={user.username}>
                    <td className={`rank-col ${getRankClass(index)}`}>
                      #{index + 1}
                    </td>
                    <td style={{ fontWeight: 500 }}>{user.username}</td>
                    <td className="points-col">{user.points} pts</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
