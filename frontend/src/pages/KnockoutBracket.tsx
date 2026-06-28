import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Loader2, Save, CheckCircle2, Lock, ChevronRight, ChevronLeft } from 'lucide-react';
import { predictionService, type MatchPredictionDTO } from '../services/predictionService';
import { FLAGS, SHORT_NAME } from '../countries';
import './KnockoutBracket.css';

interface KnockoutBracketProps { }

const KnockoutBracket: React.FC<KnockoutBracketProps> = () => {
  const [matches, setMatches] = useState<MatchPredictionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [revealedRound, setRevealedRound] = useState(0);

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    if (!containerRef.current || !scrollWrapperRef.current || !centerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (scrollWrapperRef.current && centerRef.current) {
        const wrapper = scrollWrapperRef.current;
        const centerEl = centerRef.current;
        
        const wrapperRect = wrapper.getBoundingClientRect();
        const centerRect = centerEl.getBoundingClientRect();
        
        const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
        const centerElCenter = centerRect.left + centerRect.width / 2;
        
        const diff = centerElCenter - wrapperCenter;
        
        if (Math.abs(diff) > 1) {
          wrapper.scrollLeft += diff;
        }
      }
    });

    observer.observe(containerRef.current);
    const leftSide = containerRef.current.querySelector('.bracket-side.left');
    if (leftSide) observer.observe(leftSide);
    
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const data = await predictionService.getMyPredictions();
      const knockoutMatches = data.filter(m => m.stage && m.stage !== 'Fase de Grupos' && m.stage !== 'Group Stage');
      setMatches(knockoutMatches);
    } catch (err) {
      console.error('Error fetching knockout predictions:', err);
      setError('No se pudieron cargar los pronósticos de la fase eliminatoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (matchId: string, type: 'home' | 'away', value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    if (value !== '' && (isNaN(numValue as number) || (numValue as number) < 0)) return;

    setMatches(prev => prev.map(m => {
      if (m.matchId !== matchId) return m;
      if (m.finished) return m;

      const updated = { ...m };
      if (type === 'home') updated.predictedHomeGoals = numValue;
      if (type === 'away') updated.predictedAwayGoals = numValue;

      // If no longer tied, remove the tie breaker
      if (updated.predictedHomeGoals != null && updated.predictedAwayGoals != null && updated.predictedHomeGoals !== updated.predictedAwayGoals) {
        updated.homeTeamAdvances = null;
      }

      updated.isPredicted = updated.predictedHomeGoals != null && updated.predictedAwayGoals != null;
      return updated;
    }));
  };

  const handleAdvanceChange = (matchId: string, advances: boolean) => {
    setMatches(prev => prev.map(m => {
      if (m.matchId !== matchId) return m;
      if (m.finished) return m;
      return { ...m, homeTeamAdvances: advances };
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const predictionsToSave = matches.filter(m => m.predictedHomeGoals != null && m.predictedAwayGoals != null);
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

  // Compute the bracket with propagated winners
  const computedMatches = useMemo(() => {
    const matchMap = new Map<number, MatchPredictionDTO>();
    matches.forEach(m => {
      if (m.matchOrder != null) {
        matchMap.set(m.matchOrder, { ...m });
      }
    });

    const getWinner = (order: number): string | null => {
      const m = matchMap.get(order);
      if (!m || m.predictedHomeGoals == null || m.predictedAwayGoals == null) return null;
      if (m.predictedHomeGoals > m.predictedAwayGoals) return m.homeTeamName;
      if (m.predictedAwayGoals > m.predictedHomeGoals) return m.awayTeamName;
      if (m.homeTeamAdvances === true) return m.homeTeamName;
      if (m.homeTeamAdvances === false) return m.awayTeamName;
      return null;
    };

    const getLoser = (order: number): string | null => {
      const m = matchMap.get(order);
      if (!m || m.predictedHomeGoals == null || m.predictedAwayGoals == null) return null;
      if (m.predictedHomeGoals < m.predictedAwayGoals) return m.homeTeamName;
      if (m.predictedAwayGoals < m.predictedHomeGoals) return m.awayTeamName;
      if (m.homeTeamAdvances === true) return m.awayTeamName;
      if (m.homeTeamAdvances === false) return m.homeTeamName;
      return null;
    };

    // Propagate Round of 16 (Octavos 17-24)
    for (let i = 0; i < 8; i++) {
      const homeWinner = getWinner(i * 2 + 1);
      const awayWinner = getWinner(i * 2 + 2);
      const targetMatch = matchMap.get(17 + i);
      if (targetMatch) {
        if (!targetMatch.homeTeamName && homeWinner) targetMatch.homeTeamName = homeWinner;
        if (!targetMatch.awayTeamName && awayWinner) targetMatch.awayTeamName = awayWinner;
      }
    }

    // Propagate Quarterfinals (Cuartos 25-28)
    for (let i = 0; i < 4; i++) {
      const homeWinner = getWinner(17 + i * 2);
      const awayWinner = getWinner(18 + i * 2);
      const targetMatch = matchMap.get(25 + i);
      if (targetMatch) {
        if (!targetMatch.homeTeamName && homeWinner) targetMatch.homeTeamName = homeWinner;
        if (!targetMatch.awayTeamName && awayWinner) targetMatch.awayTeamName = awayWinner;
      }
    }

    // Propagate Semifinals (Semis 29-30)
    for (let i = 0; i < 2; i++) {
      const homeWinner = getWinner(25 + i * 2);
      const awayWinner = getWinner(26 + i * 2);
      const targetMatch = matchMap.get(29 + i);
      if (targetMatch) {
        if (!targetMatch.homeTeamName && homeWinner) targetMatch.homeTeamName = homeWinner;
        if (!targetMatch.awayTeamName && awayWinner) targetMatch.awayTeamName = awayWinner;
      }
    }

    // Propagate Tercer lugar (31)
    const thirdPlaceHomeWinner = getLoser(29);
    const thirdPlaceAwayWinner = getLoser(30);
    const thirdPlaceMatch = matchMap.get(31);
    if (thirdPlaceMatch) {
      if (!thirdPlaceMatch.homeTeamName && thirdPlaceHomeWinner) thirdPlaceMatch.homeTeamName = thirdPlaceHomeWinner;
      if (!thirdPlaceMatch.awayTeamName && thirdPlaceAwayWinner) thirdPlaceMatch.awayTeamName = thirdPlaceAwayWinner;
    }

    // Propagate Final (Final 32)
    const finalHomeWinner = getWinner(29);
    const finalAwayWinner = getWinner(30);
    const finalMatch = matchMap.get(32);
    if (finalMatch) {
      if (!finalMatch.homeTeamName && finalHomeWinner) finalMatch.homeTeamName = finalHomeWinner;
      if (!finalMatch.awayTeamName && finalAwayWinner) finalMatch.awayTeamName = finalAwayWinner;
    }

    return matchMap;
  }, [matches]);

  const renderMatch = (order: number, isFinal: boolean = false) => {
    const match = computedMatches.get(order);
    if (!match) return <div className="match-card" style={{ opacity: 0.5 }}>TBD</div>;

    const isTied = match.predictedHomeGoals != null && match.predictedAwayGoals != null && match.predictedHomeGoals === match.predictedAwayGoals;

    return (
      <div className="match-node-wrapper" key={order}>
        <div 
          className={`match-card ${isFinal ? 'is-final' : ''}`}
          style={match.finished ? { boxShadow: '0 4px 12px rgba(228, 0, 43, 0.2)', border: '1px solid rgba(228, 0, 43, 0.3)', backgroundColor: 'rgba(228, 0, 43, 0.08)' } : {}}
        >
          <div className="match-team-row">
            <div className="match-team-info">
              <span className="team-flag">{match.homeTeamName ? FLAGS[match.homeTeamName] || '🏳️' : ''}</span>
              <span className={`match-team-name ${!match.homeTeamName ? 'placeholder' : ''}`}>
                {match.homeTeamName ? (SHORT_NAME[match.homeTeamName] || match.homeTeamName) : 'Por definir'}
              </span>
            </div>
            <input
              type="text"
              className="goal-input"
              maxLength={2}
              value={match.predictedHomeGoals ?? ''}
              onChange={(e) => handleGoalChange(match.matchId, 'home', e.target.value)}
              disabled={match.finished || !match.homeTeamName || !match.awayTeamName}
              style={match.finished ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            />
          </div>
          <div className="match-team-row">
            <div className="match-team-info">
              <span className="team-flag">{match.awayTeamName ? FLAGS[match.awayTeamName] || '🏳️' : ''}</span>
              <span className={`match-team-name ${!match.awayTeamName ? 'placeholder' : ''}`}>
                {match.awayTeamName ? (SHORT_NAME[match.awayTeamName] || match.awayTeamName) : 'Por definir'}
              </span>
            </div>
            <input
              type="text"
              className="goal-input"
              maxLength={2}
              value={match.predictedAwayGoals ?? ''}
              onChange={(e) => handleGoalChange(match.matchId, 'away', e.target.value)}
              disabled={match.finished || !match.homeTeamName || !match.awayTeamName}
              style={match.finished ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            />
          </div>

          {isTied && (
            <div className="tie-breaker">
              <span>Avanza:</span>
              <label>
                <input type="radio" name={`adv-${match.matchId}`} checked={match.homeTeamAdvances === true} onChange={() => handleAdvanceChange(match.matchId, true)} disabled={match.finished} />
                {match.homeTeamName ? SHORT_NAME[match.homeTeamName] || match.homeTeamName.substring(0, 3) : 'L'}
              </label>
              <label>
                <input type="radio" name={`adv-${match.matchId}`} checked={match.homeTeamAdvances === false} onChange={() => handleAdvanceChange(match.matchId, false)} disabled={match.finished} />
                {match.awayTeamName ? SHORT_NAME[match.awayTeamName] || match.awayTeamName.substring(0, 3) : 'V'}
              </label>
            </div>
          )}
          {match.finished && (
            <div className="closed-badge" style={{ position: 'absolute', top: -12, right: -10, transform: 'none', padding: '2px 6px', fontSize: '0.7rem' }}>
              <Lock size={12} />
              <span className="closed-text">Cerrado</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getRoundClass = (roundLevel: number) => {
    return roundLevel > revealedRound ? 'bracket-round collapsed' : 'bracket-round';
  };

  const getCenterClass = () => {
    return 4 > revealedRound ? 'bracket-center collapsed' : 'bracket-center';
  };

  const nextPhaseName = () => {
    if (revealedRound === 0) return 'Octavos de Final';
    if (revealedRound === 1) return 'Cuartos de Final';
    if (revealedRound === 2) return 'Semifinales';
    if (revealedRound === 3) return 'Gran Final';
    return '';
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

  return (
    <div className="tab-content glass-card" style={{ padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Ronda Eliminatoria</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {revealedRound < 4 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => setRevealedRound(r => r + 1)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.4)' }}
            >
              <span>Abrir {nextPhaseName()}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
        {revealedRound > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn-secondary"
              onClick={() => setRevealedRound(r => r - 1)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '30px', fontSize: '0.9rem' }}
            >
              <ChevronLeft size={16} />
              <span>Cerrar fase anterior</span>
            </button>
          </div>
        )}
      </div>

      <div className="knockout-bracket-wrapper" ref={scrollWrapperRef}>

        <div className="knockout-bracket-container" ref={containerRef}>
          {/* Left Side */}
          <div className="bracket-side left">
            <div className={getRoundClass(0)}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(o => renderMatch(o))}
            </div>
            <div className={getRoundClass(1)}>
              {[17, 18, 19, 20].map(o => renderMatch(o))}
            </div>
            <div className={getRoundClass(2)}>
              {[25, 26].map(o => renderMatch(o))}
            </div>
            <div className={getRoundClass(3)}>
              {[29].map(o => renderMatch(o))}
            </div>
          </div>

          {/* Center - Final and Tercer Lugar */}
          <div className={getCenterClass()} ref={centerRef}>
            <h3 style={{ color: '#FFD700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)', marginBottom: '1rem', textAlign: 'center' }}>FINAL</h3>
            {renderMatch(32, true)}

            <h3 style={{ color: '#C0C0C0', textShadow: '0 0 10px rgba(192, 192, 192, 0.5)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1em', textAlign: 'center' }}>Tercer Lugar</h3>
            {renderMatch(31, false)}
          </div>

          {/* Right Side */}
          <div className="bracket-side right">
            <div className={getRoundClass(3)}>
              {[30].map(o => renderMatch(o))}
            </div>
            <div className={getRoundClass(2)}>
              {[27, 28].map(o => renderMatch(o))}
            </div>
            <div className={getRoundClass(1)}>
              {[21, 22, 23, 24].map(o => renderMatch(o))}
            </div>
            <div className={getRoundClass(0)}>
              {[9, 10, 11, 12, 13, 14, 15, 16].map(o => renderMatch(o))}
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', marginTop: '1.5rem' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
          {saving ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={24} />}
          <span>Guardar Predicciones</span>
        </button>
      </div>
    </div>
  );
};

export default KnockoutBracket;
