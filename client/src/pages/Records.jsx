import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const BALLON_DOR = [
  { pos: 1, player: 'Lionel Messi', country: '🇦🇷', wins: 8, years: '2009,2010,2011,2012,2019,2021,2023,2024', club: 'Barcelona / PSG / Inter Miami' },
  { pos: 2, player: 'Cristiano Ronaldo', country: '🇵🇹', wins: 5, years: '2008,2013,2014,2016,2017', club: 'Man Utd / Real Madrid / Juventus / Al-Nassr' },
  { pos: 3, player: 'Michel Platini', country: '🇫🇷', wins: 3, years: '1983,1984,1985', club: 'Juventus' },
  { pos: 3, player: 'Johan Cruyff', country: '🇳🇱', wins: 3, years: '1971,1973,1974', club: 'Ajax / Barcelona' },
  { pos: 3, player: 'Marco van Basten', country: '🇳🇱', wins: 3, years: '1988,1989,1992', club: 'AC Milan' },
  { pos: 6, player: 'Ronaldo Nazário', country: '🇧🇷', wins: 2, years: '1997,2002', club: 'Barcelona / Real Madrid / Inter' },
];

const TOP_SCORERS = [
  { competition: '⚽ Champions League (Histórico)', player: 'Cristiano Ronaldo', goals: 140, flag: '🇵🇹', note: 'Récord imbatible' },
  { competition: '🌍 Copa del Mundo (Histórico)', player: 'Miroslav Klose', goals: 16, flag: '🇩🇪', note: 'En 4 ediciones (2002-2014)' },
  { competition: '🏆 La Liga (Histórico)', player: 'Lionel Messi', goals: 474, flag: '🇦🇷', note: 'Solo con el FC Barcelona' },
  { competition: '🌍 Selecciones (Goles internacionales)', player: 'Cristiano Ronaldo', goals: 135, flag: '🇵🇹', note: 'Récord mundial activo (2025)' },
  { competition: '📅 Goles en un año natural', player: 'Lionel Messi', goals: 91, flag: '🇦🇷', note: '2012 con FC Barcelona' },
  { competition: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League (Histórico)', player: 'Alan Shearer', goals: 260, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', note: 'Newcastle & Blackburn' },
  { competition: '🇩🇪 Bundesliga (Histórico)', player: 'Gerd Müller', goals: 365, flag: '🇩🇪', note: 'FC Bayern München' },
  { competition: '🇮🇹 Serie A (Histórico)', player: 'Silvio Piola', goals: 274, flag: '🇮🇹', note: 'Récord histórico' },
  { competition: '🌍 Mundial — 1 edición', player: 'Just Fontaine', goals: 13, flag: '🇫🇷', note: 'Francia 1958 — Imbatible desde hace 67 años' },
];

const PLAYER_RECORDS = [
  { emoji: '🏆', title: 'Más Balones de Oro', value: '8', holder: 'Lionel Messi', detail: 'Un récord que parece eterno', color: '#f59e0b' },
  { emoji: '⚽', title: 'Más goles en Champions League', value: '140', holder: 'Cristiano Ronaldo', detail: 'Con Man Utd, Real Madrid y Juventus', color: '#8b5cf6' },
  { emoji: '🌍', title: 'Más goles internacionales', value: '135', holder: 'Cristiano Ronaldo', detail: 'Con la selección de Portugal (activo)', color: '#06b6d4' },
  { emoji: '📅', title: 'Más goles en un año natural', value: '91', holder: 'Lionel Messi', detail: '2012 — 79 con Barça + 12 con Argentina', color: '#10b981' },
  { emoji: '🌍', title: 'Más Copas del Mundo ganadas', value: '3', holder: 'Pelé', detail: '1958, 1962 y 1970 con Brasil', color: '#f59e0b' },
  { emoji: '🏅', title: 'Más goles en una sola Copa del Mundo', value: '13', holder: 'Just Fontaine', detail: 'Francia 1958 — Récord desde hace 67 años', color: '#ef4444' },
  { emoji: '⚡', title: 'Gol más rápido en la historia', value: '2.4"', holder: 'Nawaf Al-Abed', detail: 'Al-Hilal vs Al-Shoalah (2009)', color: '#f97316' },
  { emoji: '🎯', title: 'Más hat-tricks en Champions League', value: '8', holder: 'Cristiano Ronaldo', detail: 'Récord histórico en la competición', color: '#a78bfa' },
  { emoji: '👟', title: 'Transferencia más cara de la historia', value: '222M€', holder: 'Neymar Jr.', detail: 'Barcelona → PSG (2017)', color: '#ec4899' },
  { emoji: '📋', title: 'Más apariciones en Champions League', value: '183', holder: 'Iker Casillas', detail: 'Real Madrid & Porto', color: '#64748b' },
];

const CLUB_RECORDS = [
  { emoji: '🏆', title: 'Más Champions League / Copa de Europa', value: '15', club: 'Real Madrid', detail: 'La Copa de Europa es su casa', color: '#f59e0b' },
  { emoji: '🇪🇸', title: 'Más títulos de La Liga', value: '27', club: 'Real Madrid', detail: '2024 — El club más ganador de España', color: '#ef4444' },
  { emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', title: 'Más títulos de Premier League', value: '20', club: 'Manchester United', detail: 'El más ganador de la era moderna', color: '#dc2626' },
  { emoji: '🇩🇪', title: 'Más títulos de Bundesliga', value: '33', club: 'Bayern München', detail: '11 títulos consecutivos (2013–2023)', color: '#f59e0b' },
  { emoji: '🇮🇹', title: 'Más títulos de Serie A', value: '38', club: 'Juventus', detail: '9 scudetti consecutivos (2012–2020)', color: '#1e3a5f' },
  { emoji: '🌍', title: 'Más Copas del Mundo de Clubes', value: '8', club: 'Real Madrid', detail: 'El club con más títulos mundiales', color: '#8b5cf6' },
  { emoji: '💰', title: 'Club más valioso del mundo', value: '~6.000M€', club: 'Real Madrid', detail: 'Valoración estimada 2024', color: '#10b981' },
  { emoji: '🏟️', title: 'Estadio más grande del mundo', value: '132.000', club: 'Rungrado (Corea del Norte)', detail: 'El estadio de mayor aforo del planeta', color: '#06b6d4' },
  { emoji: '📊', title: 'Mayor victoria en Champions League', value: '8-0', club: 'Real Madrid vs Malmö', detail: 'Temporada 2015/16 — Y también Liverpool 8-0 Besiktas', color: '#f97316' },
  { emoji: '⚡', title: 'Racha invicta más larga (liga)', value: '49 partidos', club: 'Arsenal FC', detail: '"Los Invencibles" 2003–2004 en Premier League', color: '#ef4444' },
];

const WORLD_CUPS = [
  { year: '2022', winner: 'Argentina 🇦🇷', runner: 'Francia 🇫🇷', score: '3-3 (4-2 pen)', top: 'Kylian Mbappé (8 goles)', mvp: 'Lionel Messi', venue: 'Qatar' },
  { year: '2018', winner: 'Francia 🇫🇷', runner: 'Croacia 🇭🇷', score: '4-2', top: 'Harry Kane (6 goles)', mvp: 'Luka Modrić', venue: 'Rusia' },
  { year: '2014', winner: 'Alemania 🇩🇪', runner: 'Argentina 🇦🇷', score: '1-0', top: 'James Rodríguez (6 goles)', mvp: 'Lionel Messi', venue: 'Brasil' },
  { year: '2010', winner: 'España 🇪🇸', runner: 'Países Bajos 🇳🇱', score: '1-0', top: 'Thomas Müller (5 goles)', mvp: 'Diego Forlán', venue: 'Sudáfrica' },
  { year: '2006', winner: 'Italia 🇮🇹', runner: 'Francia 🇫🇷', score: '1-1 (5-3 pen)', top: 'Miroslav Klose (5 goles)', mvp: 'Zinedine Zidane', venue: 'Alemania' },
];

function StatCard({ emoji, title, value, holder, detail, color }) {
  return (
    <div className="group relative rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] cursor-default"
      style={{ background: '#161b2e', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${color}55`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{title}</p>
          <p className="text-3xl font-bold mb-0.5" style={{ color, fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
          <p className="text-sm font-semibold" style={{ color: '#c8d0e8' }}>{holder}</p>
          <p className="text-xs mt-1" style={{ color: '#4a5580' }}>{detail}</p>
        </div>
      </div>
    </div>
  );
}

export default function Records() {
  const { user, logout } = useAuth();

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#0a0d16' }}>

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 relative z-10"
        style={{ borderBottom: '1px solid rgba(124,58,237,0.15)', background: 'rgba(15,18,32,0.97)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>⚽</div>
          <div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif', background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NEXUS FOOTBALL
            </span>
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
              RÉCORDS
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/live"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            🔴 En Vivo
          </Link>
          <Link to="/chat"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            Hablar con IA
          </Link>
          <button onClick={logout} title="Cerrar sesión" className="p-2 rounded-lg transition-colors"
            style={{ color: '#4a5580' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4a5580'; e.currentTarget.style.background = 'transparent'; }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">

          {/* Hero */}
          <div className="text-center relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="orb w-96 h-48 left-1/2 -translate-x-1/2 top-0" style={{ background: '#7c3aed', opacity: 0.08 }} />
            </div>
            <div className="relative">
              <div className="text-5xl mb-4">🏆</div>
              <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0f4ff' }}>
                Récords <span style={{ background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Imbatibles</span>
              </h1>
              <p style={{ color: '#64748b' }} className="max-w-xl mx-auto">Los números que definieron la historia del fútbol mundial. Marcas que resistirán el paso del tiempo.</p>
            </div>
          </div>

          {/* Ballon d'Or */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="text-3xl">🥇</div>
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0f4ff' }}>Balón de Oro — Máximos Ganadores</h2>
                <p className="text-xs" style={{ color: '#4a5580' }}>El premio más prestigioso del fútbol individual</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#161b2e', border: '1px solid rgba(255,255,255,0.07)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(124,58,237,0.15)', borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider font-semibold" style={{ color: '#a78bfa' }}>#</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider font-semibold" style={{ color: '#a78bfa' }}>Jugador</th>
                    <th className="px-5 py-3 text-center text-xs uppercase tracking-wider font-semibold" style={{ color: '#a78bfa' }}>Victorias</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider font-semibold hidden md:table-cell" style={{ color: '#a78bfa' }}>Años</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider font-semibold hidden lg:table-cell" style={{ color: '#a78bfa' }}>Clubes</th>
                  </tr>
                </thead>
                <tbody>
                  {BALLON_DOR.map((row, i) => (
                    <tr key={i} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-5 py-3.5">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: i === 0 ? 'rgba(245,158,11,0.2)' : i === 1 ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                                   color: i === 0 ? '#f59e0b' : i === 1 ? '#a78bfa' : '#64748b' }}>
                          {row.pos}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{row.country}</span>
                          <span className="font-semibold" style={{ color: '#e2e8f0' }}>{row.player}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold text-lg"
                          style={{ background: row.wins >= 5 ? 'rgba(245,158,11,0.2)' : 'rgba(124,58,237,0.15)', color: row.wins >= 5 ? '#f59e0b' : '#a78bfa' }}>
                          {row.wins}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-xs" style={{ color: '#64748b' }}>{row.years}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-xs" style={{ color: '#64748b' }}>{row.club}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Player Records */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="text-3xl">⭐</div>
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0f4ff' }}>Récords de Jugadores</h2>
                <p className="text-xs" style={{ color: '#4a5580' }}>Marcas individuales que han escrito la historia</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {PLAYER_RECORDS.map((r, i) => <StatCard key={i} {...r} />)}
            </div>
          </section>

          {/* Top Scorers */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="text-3xl">👟</div>
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0f4ff' }}>Máximos Goleadores por Competición</h2>
                <p className="text-xs" style={{ color: '#4a5580' }}>Los artilleros más letales de cada torneo</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {TOP_SCORERS.map((s, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-150"
                  style={{ background: '#161b2e', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl font-bold"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {s.goals}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5" style={{ color: '#7c3aed' }}>{s.competition}</p>
                    <p className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>{s.flag} {s.player}</p>
                    <p className="text-xs" style={{ color: '#4a5580' }}>{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Club Records */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="text-3xl">🏟️</div>
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0f4ff' }}>Récords de Clubes</h2>
                <p className="text-xs" style={{ color: '#4a5580' }}>Los equipos que dominaron el fútbol mundial</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {CLUB_RECORDS.map((r, i) => (
                <StatCard key={i} emoji={r.emoji} title={r.title} value={r.value} holder={r.club} detail={r.detail} color={r.color} />
              ))}
            </div>
          </section>

          {/* World Cups */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="text-3xl">🌍</div>
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0f4ff' }}>Últimas Copas del Mundo</h2>
                <p className="text-xs" style={{ color: '#4a5580' }}>El torneo más visto del planeta</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#161b2e', border: '1px solid rgba(255,255,255,0.07)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(16,185,129,0.2)' }}>
                    {['Año', 'Campeón', 'Finalista', 'Resultado', 'Máx. Goleador', 'MVP', 'Sede'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold hidden sm:table-cell first:table-cell" style={{ color: '#10b981' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WORLD_CUPS.map((wc, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-4 py-3.5 font-bold" style={{ color: '#10b981', fontFamily: 'Space Grotesk, sans-serif' }}>{wc.year}</td>
                      <td className="px-4 py-3.5 font-semibold hidden sm:table-cell" style={{ color: '#f0f4ff' }}>{wc.winner}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell" style={{ color: '#94a3b8' }}>{wc.runner}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>{wc.score}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs hidden sm:table-cell" style={{ color: '#94a3b8' }}>{wc.top}</td>
                      <td className="px-4 py-3.5 text-xs hidden sm:table-cell" style={{ color: '#a78bfa' }}>{wc.mvp}</td>
                      <td className="px-4 py-3.5 text-xs hidden sm:table-cell" style={{ color: '#64748b' }}>{wc.venue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center pb-4">
            <div className="inline-block rounded-2xl px-8 py-6" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.1))', border: '1px solid rgba(124,58,237,0.25)' }}>
              <p className="text-lg font-bold mb-2" style={{ color: '#f0f4ff' }}>¿Tienes alguna duda sobre fútbol?</p>
              <p className="text-sm mb-4" style={{ color: '#64748b' }}>Pregúntale a NEXUS — conoce cada estadística, cada récord, cada jugador.</p>
              <Link to="/chat"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
                ⚽ Hablar con NEXUS
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
