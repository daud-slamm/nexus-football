import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const QUICK_PLAYERS = ['Lionel Messi','Cristiano Ronaldo','Mbappé','Vinicius Jr','Erling Haaland','Pedri','Bellingham','Neymar','Lewandowski','Modric'];
const QUICK_COMPARISONS = [
  ['Messi','Cristiano Ronaldo'],['Mbappé','Vinicius Jr'],
  ['Haaland','Lewandowski'],['Pedri','Bellingham'],
];

function StatBar({ label, value, max=100, color='#a78bfa' }) {
  const pct = Math.min((value/max)*100, 100);
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color:'#94a3b8' }}>{label}</span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${color}99,${color})` }} />
      </div>
    </div>
  );
}

function PlayerCard({ player, side='center' }) {
  const isLeft = side==='left', isRight = side==='right';
  return (
    <div className="rounded-2xl p-5 h-full" style={{ background:'#161b2e', border:'1px solid rgba(255,255,255,0.07)' }}>
      {/* Header */}
      <div className={`flex items-start gap-3 mb-4 ${isRight?'flex-row-reverse':''}`}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: isLeft?'rgba(124,58,237,0.2)':isRight?'rgba(6,182,212,0.2)':'rgba(124,58,237,0.15)', border:`1px solid ${isLeft?'rgba(124,58,237,0.3)':isRight?'rgba(6,182,212,0.3)':'rgba(124,58,237,0.2)'}` }}>
          {player.flag||'⚽'}
        </div>
        <div className={isRight?'text-right':''}>
          <h3 className="font-bold text-lg" style={{ color:'#f0f4ff', fontFamily:'Space Grotesk,sans-serif' }}>{player.name}</h3>
          <p className="text-xs" style={{ color:'#64748b' }}>{player.position} · {player.nationality}</p>
          <p className="text-xs mt-0.5" style={{ color:'#a78bfa' }}>{player.current_club}</p>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label:'Goles', val: player.stats?.goals ?? player.goals ?? 0, color:'#a78bfa' },
          { label:'Asist.', val: player.stats?.assists ?? player.assists ?? 0, color:'#22d3ee' },
          { label:'Trofeos', val: player.stats?.trophies ?? player.trophies ?? 0, color:'#f59e0b' },
        ].map(s=>(
          <div key={s.label} className="text-center rounded-xl py-2 px-1" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xl font-bold" style={{ color:s.color, fontFamily:'Space Grotesk,sans-serif' }}>{s.val}</p>
            <p className="text-xs" style={{ color:'#4a5580' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {player.ballon_dor > 0 && (
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3" style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)' }}>
          <span className="text-lg">🥇</span>
          <span className="text-sm font-semibold" style={{ color:'#f59e0b' }}>{player.ballon_dor}x Balón de Oro</span>
        </div>
      )}

      {/* Description */}
      {player.description && (
        <p className="text-xs leading-relaxed mb-3" style={{ color:'#94a3b8' }}>{player.description}</p>
      )}

      {/* Known for */}
      {player.known_for?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {player.known_for.map((k,i)=>(
            <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.2)', color:'#c4b5fd' }}>{k}</span>
          ))}
        </div>
      )}

      {/* Strengths (compare mode) */}
      {player.strengths?.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color:'#4a5580' }}>Fortalezas</p>
          <div className="space-y-1">
            {player.strengths.map((s,i)=>(
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color:'#94a3b8' }}>
                <span style={{ color: isRight?'#22d3ee':'#a78bfa' }}>▸</span> {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career */}
      {player.career?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color:'#4a5580' }}>Carrera</p>
          <div className="space-y-1.5">
            {player.career.slice(0,5).map((c,i)=>(
              <div key={i} className="flex justify-between text-xs rounded-lg px-3 py-1.5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color:'#e2e8f0' }}>{c.club}</span>
                <div className="flex gap-3">
                  <span style={{ color:'#64748b' }}>{c.years}</span>
                  {c.goals>0 && <span style={{ color:'#a78bfa' }}>{c.goals}⚽</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Players() {
  const { logout } = useAuth();
  const [mode, setMode] = useState('search'); // 'search' | 'compare'

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Compare state
  const [p1, setP1] = useState(''); const [p2, setP2] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState('');

  const searchPlayer = async (name=searchQuery) => {
    if (!name.trim()) return;
    setSearchQuery(name); setSearchLoading(true); setSearchError(''); setSearchResult(null);
    try {
      const { data } = await axios.post('/api/player/search', { name });
      if (data.error) setSearchError(data.error);
      else setSearchResult(data);
    } catch { setSearchError('Error al buscar el jugador.'); }
    finally { setSearchLoading(false); }
  };

  const comparePlayers = async (a=p1, b=p2) => {
    if (!a.trim()||!b.trim()) return;
    setP1(a); setP2(b); setCompareLoading(true); setCompareError(''); setCompareResult(null);
    try {
      const { data } = await axios.post('/api/player/compare', { player1:a, player2:b });
      if (data.error) setCompareError(data.error);
      else setCompareResult(data);
    } catch { setCompareError('Error al comparar jugadores.'); }
    finally { setCompareLoading(false); }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background:'#0a0d16' }}>
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-4"
        style={{ borderBottom:'1px solid rgba(124,58,237,0.15)', background:'rgba(15,18,32,0.97)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>⭐</div>
          <span className="font-bold text-lg" style={{ fontFamily:'Space Grotesk,sans-serif', background:'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            NEXUS FOOTBALL
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(245,158,11,0.15)', color:'#fbbf24', border:'1px solid rgba(245,158,11,0.3)' }}>JUGADORES</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/live" className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171' }}>🔴 En Vivo</Link>
          <Link to="/chat" className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa' }}>💬 IA</Link>
          <Link to="/records" className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981' }}>🏆 Récords</Link>
          <button onClick={logout} className="p-2 rounded-lg" style={{ color:'#4a5580' }}
            onMouseEnter={e=>{ e.currentTarget.style.color='#ef4444'; e.currentTarget.style.background='rgba(239,68,68,0.08)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.color='#4a5580'; e.currentTarget.style.background='transparent'; }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background:'#161b2e', border:'1px solid rgba(255,255,255,0.06)' }}>
            {[['search','🔍 Buscar jugador'],['compare','⚔️ Comparar jugadores']].map(([m,label])=>(
              <button key={m} onClick={()=>{ setMode(m); setSearchResult(null); setCompareResult(null); }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={mode===m ? { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', boxShadow:'0 2px 10px rgba(124,58,237,0.3)' } : { color:'#64748b' }}>
                {label}
              </button>
            ))}
          </div>

          {/* SEARCH MODE */}
          {mode==='search' && (
            <div className="space-y-5">
              <div className="flex gap-2">
                <input className="flex-1 text-sm rounded-xl px-4 py-3 outline-none transition-all"
                  style={{ background:'#161b2e', border:'1px solid rgba(124,58,237,0.3)', color:'#e8eaf0', caretColor:'#a78bfa' }}
                  placeholder="Escribe el nombre de un jugador... ej: Messi, Ronaldo, Mbappé"
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter') searchPlayer(); }}
                  onFocus={e=>e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,0.18)'}
                  onBlur={e=>e.target.style.boxShadow='none'}
                />
                <button onClick={()=>searchPlayer()} disabled={!searchQuery.trim()||searchLoading}
                  className="px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)', boxShadow:'0 4px 14px rgba(124,58,237,0.35)' }}>
                  {searchLoading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" /> : 'Buscar'}
                </button>
              </div>

              {/* Quick players */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:'#4a5580' }}>Búsquedas rápidas</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PLAYERS.map(p=>(
                    <button key={p} onClick={()=>searchPlayer(p)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
                      style={{ background:'#1e2640', border:'1px solid rgba(255,255,255,0.07)', color:'#94a3b8' }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; e.currentTarget.style.color='#c4b5fd'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#94a3b8'; }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {searchLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm" style={{ color:'#64748b' }}>Buscando información del jugador...</p>
                </div>
              )}
              {searchError && <div className="rounded-xl px-4 py-3 text-sm" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#fca5a5' }}>⚠️ {searchError}</div>}
              {searchResult && !searchError && <PlayerCard player={searchResult} />}
            </div>
          )}

          {/* COMPARE MODE */}
          {mode==='compare' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[[p1,setP1,'Jugador 1','#7c3aed'],[p2,setP2,'Jugador 2','#06b6d4']].map(([val,setter,label,color],idx)=>(
                  <input key={idx} value={val} onChange={e=>setter(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter'&&p1&&p2) comparePlayers(); }}
                    className="text-sm rounded-xl px-4 py-3 outline-none transition-all"
                    style={{ background:'#161b2e', border:`1px solid ${color}55`, color:'#e8eaf0', caretColor:color }}
                    placeholder={label}
                    onFocus={e=>e.target.style.boxShadow=`0 0 0 3px ${color}22`}
                    onBlur={e=>e.target.style.boxShadow='none'}
                  />
                ))}
              </div>
              <button onClick={()=>comparePlayers()} disabled={!p1.trim()||!p2.trim()||compareLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40"
                style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)', boxShadow:'0 4px 14px rgba(124,58,237,0.35)' }}>
                {compareLoading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Comparando...</span> : '⚔️ Comparar ahora'}
              </button>

              {/* Quick comparisons */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:'#4a5580' }}>Comparaciones populares</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_COMPARISONS.map(([a,b],i)=>(
                    <button key={i} onClick={()=>comparePlayers(a,b)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
                      style={{ background:'#1e2640', border:'1px solid rgba(255,255,255,0.07)', color:'#94a3b8' }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; e.currentTarget.style.color='#c4b5fd'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#94a3b8'; }}>
                      {a} vs {b}
                    </button>
                  ))}
                </div>
              </div>

              {compareLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm" style={{ color:'#64748b' }}>Analizando a los dos jugadores...</p>
                </div>
              )}
              {compareError && <div className="rounded-xl px-4 py-3 text-sm" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#fca5a5' }}>⚠️ {compareError}</div>}

              {compareResult && !compareError && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PlayerCard player={compareResult.player1} side="left" />
                    <PlayerCard player={compareResult.player2} side="right" />
                  </div>
                  {compareResult.verdict && (
                    <div className="rounded-2xl px-5 py-4" style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.25)' }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:'#a78bfa' }}>⚖️ Veredicto</p>
                      <p className="text-sm leading-relaxed" style={{ color:'#c8d0e8' }}>{compareResult.verdict}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
