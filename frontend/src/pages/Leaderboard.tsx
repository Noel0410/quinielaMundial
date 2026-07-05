import React, { useEffect, useState, useMemo } from 'react';
import { userService, type UserLeaderboardResponse } from '../services/userService';
import { roomService, type RoomDTO } from '../services/roomService';
import { Trophy, Loader2, Users, Plus, LogIn, X, Settings } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<UserLeaderboardResponse[]>([]);
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>(''); // empty if no room selected
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<'total' | 'groups' | 'knockout'>('total');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [roomActionLoading, setRoomActionLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedRoom]);

  const fetchRooms = async () => {
    try {
      const data = await roomService.getMyRooms();
      setRooms(data);
      if (data.length > 0 && !selectedRoom) {
        setSelectedRoom(data[0].code);
      } else if (data.length === 0) {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const fetchLeaderboard = async () => {
    if (!selectedRoom) {
      setLeaderboard([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await userService.getLeaderboard(selectedRoom);
      setLeaderboard(data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('No se pudo cargar la tabla de posiciones. Intenta nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    setRoomActionLoading(true);
    try {
      const newRoom = await roomService.createRoom(newRoomName);
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setSelectedRoom(newRoom.code);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error creando sala');
    } finally {
      setRoomActionLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinRoomCode.trim()) return;
    setRoomActionLoading(true);
    try {
      const joinedRoom = await roomService.joinRoom(joinRoomCode);
      setRooms([...rooms, joinedRoom]);
      setJoinRoomCode('');
      setSelectedRoom(joinedRoom.code);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error uniéndose a la sala. Revisa el código.');
    } finally {
      setRoomActionLoading(false);
    }
  };

  const getRankClass = (index: number) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return '';
  };

  const currentRoom = rooms.find(r => r.code === selectedRoom);

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => {
      if (activeTable === 'groups') return b.groupStagePoints - a.groupStagePoints;
      if (activeTable === 'knockout') return b.knockoutStagePoints - a.knockoutStagePoints;
      return b.totalPoints - a.totalPoints;
    });
  }, [leaderboard, activeTable]);

  return (
    <div className="tab-content glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy size={24} color="#d4af37" />
          <h3 style={{ margin: 0 }}>Tabla de Posiciones</h3>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {rooms.length > 0 && (
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="room-select"
            >
              {rooms.map(room => (
                <option key={room.code} value={room.code}>👥 {room.name}</option>
              ))}
            </select>
          )}
          <button className="btn-secondary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}>
            <Settings size={18} /> Unirse a Sala
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Gestionar Salas</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Crear una nueva sala</h4>
                <div className="room-input-group">
                  <input
                    type="text"
                    placeholder="Nombre de nueva sala"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="room-action-input"
                  />
                  <button className="btn-room-create" onClick={handleCreateRoom} disabled={roomActionLoading}>
                    <Plus size={18} /> Crear Sala
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Unirse con código</h4>
                <div className="room-input-group">
                  <input
                    type="text"
                    placeholder="Código de sala"
                    value={joinRoomCode}
                    onChange={(e) => setJoinRoomCode(e.target.value)}
                    className="room-action-input"
                  />
                  <button className="btn-room-join" onClick={handleJoinRoom} disabled={roomActionLoading}>
                    <LogIn size={18} /> Unirse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentRoom && (
        <div style={{ padding: '1rem', background: 'var(--surface-border)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Users size={20} color="var(--primary)" />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <strong>{currentRoom.name}</strong>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              Código de invitación:
              <strong style={{ color: '#FFD700', letterSpacing: '2px', background: 'rgba(255, 215, 0, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {currentRoom.code}
              </strong>
            </div>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Table Toggle Selector */}
      <div className="leaderboard-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
        <button
          onClick={() => setActiveTable('total')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            background: activeTable === 'total' ? 'var(--primary)' : 'transparent',
            color: activeTable === 'total' ? '#fff' : 'var(--text-muted)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          General
        </button>
        <button
          onClick={() => setActiveTable('groups')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            background: activeTable === 'groups' ? 'var(--primary)' : 'transparent',
            color: activeTable === 'groups' ? '#fff' : 'var(--text-muted)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Fase de Grupos
        </button>
        <button
          onClick={() => setActiveTable('knockout')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            background: activeTable === 'knockout' ? 'var(--primary)' : 'transparent',
            color: activeTable === 'knockout' ? '#fff' : 'var(--text-muted)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Fase Eliminatoria
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : !selectedRoom ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No estás en ninguna sala. Crea o únete a una para competir con tus amigos.
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
              {sortedLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No hay usuarios en esta tabla de posiciones.
                  </td>
                </tr>
              ) : (
                sortedLeaderboard.map((user, index) => {
                  let displayPoints = user.totalPoints;
                  if (activeTable === 'groups') displayPoints = user.groupStagePoints;
                  if (activeTable === 'knockout') displayPoints = user.knockoutStagePoints;
                  
                  return (
                    <tr key={user.username}>
                      <td className={`rank-col ${getRankClass(index)}`}>
                        #{index + 1}
                      </td>
                      <td style={{ fontWeight: 500 }}>{user.username.split('@')[0]}</td>
                      <td className="points-col">{displayPoints} pts</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
