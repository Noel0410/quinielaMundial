import React from 'react';

const HowToPlay: React.FC = () => {
  return (
    <div className="tab-content glass-card" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        ⚽ ¿Cómo jugar a la Quiniela?
      </h2>

      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.05rem' }}>
        ¡Bienvenido a la Quiniela del Mundial 2026! Tu objetivo es acumular la mayor cantidad de puntos posibles
        pronosticando correctamente los resultados de los partidos del mundial.
      </p>

      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>¿Cómo se puntúa?</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ background: '#10B981', color: 'white', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>3</div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#10B981', fontSize: '1.1rem' }}>Puntos: Marcador Exacto</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Obtienes <strong>3 puntos</strong> si atinas exactamente la cantidad de goles que anotaron ambos equipos en el partido.
              ¡Esta es la forma de sumar más rápido y liderar la tabla!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', background: 'rgba(255, 215, 0, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
          <div style={{ background: '#FFD700', color: '#1a1a2e', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>1</div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#FFD700', fontSize: '1.1rem' }}>Punto: Ganador o Empate</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Obtienes <strong>1 punto</strong> de consolación si atinas qué equipo gana el partido o si acertaste que terminaría en empate,
              pero fallaste en el marcador exacto de los goles.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', background: 'rgba(211, 47, 47, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(211, 47, 47, 0.2)' }}>
          <div style={{ background: 'var(--wc-red)', color: 'white', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>0</div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--wc-red)', fontSize: '1.1rem' }}>Puntos: Fallo Total</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              No sumas puntos si el equipo que elegiste como ganador no gana, o si predijiste un resultado diferente al desenlace real del partido.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Reglas Adicionales</h3>
        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
          <li>Puedes modificar tus pronósticos tantas veces como quieras antes de la <strong>fecha límite</strong> justo con el inicio del primer partido del mundial.</li>
          <li>Una vez que un partido ha comenzado o la fecha límite ha pasado, tus pronósticos quedan bloqueados.</li>
          <li>Los puntos se actualizarán automáticamente en la <strong>Tabla de Posiciones</strong> una vez que el partido haya finalizado y los administradores hayan cargado el resultado real.</li>
        </ul>
      </div>
    </div>
  );
};

export default HowToPlay;
