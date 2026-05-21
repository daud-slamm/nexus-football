import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const COMPETITIONS = [
  { code: 'CL',  name: 'Champions League', flag: '🏆' },
  { code: 'PL',  name: 'Premier League',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'PD',  name: 'La Liga',          flag: '🇪🇸' },
  { code: 'BL1', name: 'Bundesliga',       flag: '🇩🇪' },
  { code: 'SA',  name: 'Serie A',          flag: '🇮🇹' },
  { code: 'FL1', name: 'Ligue 1',          flag: '🇫🇷' },
];
const TABS = ['standings','scorers','matches','results'];
const TAB_LABELS = { standings:'📊 Clasificación', scorers:'👟 Goleadores', matches:'📅 Próximos', results:'⚽ Resultados' };

const FAV_KEY = 'nexus_fav_team';

function Spinner() {
  return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
}
function ErrorBox({ msg, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="text-4xl">⚠️</div>
      <p className="text-sm" style={{ color:'#94a3b8' }}>{msg}</p>
      <button onClick={onRetry} className="text-xs px-4 py-2 rounded-xl font-medium" style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa' }}>Reintentar</button>
    </div>
  );
}

function StandingsTable({ data }) {
  if (!data?.table?.length) return <p className="text-center py-8" style={{ color:'#64748b' }}>Sin datos</p>;
  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border:'1px solid rgba(255,255,255,0.06)' }}>
      <table className="w-full text-sm min-w-[580px]">
        <thead>
          <tr style={{ background:'rgba(124,58,237,0.12)', borderBottom:'1px solid rgba(124,58,237,0.2)' }}>
            {['#','Equipo','PJ','G','E','P','GF','GC','DG','Pts','Forma'].map(h=>(
              <th key={h} className="px-3 py-3 text-xs uppercase tracking-wider font-semibold text-center first:text-left" style={{ color:'#a78bfa' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.table.map((row,i)=>(
            <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background .15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <td className="px-3 py-3">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: i<4?'rgba(124,58,237,0.2)':i<6?'rgba(59,130,246,0.15)':i>=data.table.length-3?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.05)',
                           color: i<4?'#c4b5fd':i<6?'#93c5fd':i>=data.table.length-3?'#f87171':'#64748b' }}>
                  {row.position}
                </span>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  {row.crest && <img src={row.crest} alt="" className="w-5 h-5 object-contain" onError={e=>e.target.style.display='none'} />}
                  <span className="font-medium" style={{ color:'#e2e8f0' }}>{row.team}</span>
                </div>
              </td>
              {[row.played,row.won,row.draw,row.lost,row.gf,row.ga].map((v,j)=>(
                <td key={j} className="px-3 py-3 text-center text-xs" style={{ color:'#94a3b8' }}>{v}</td>
              ))}
              <td className="px-3 py-3 text-center text-xs" style={{ color:row.gd>0?'#10b981':row.gd<0?'#ef4444':'#94a3b8' }}>
                {row.gd>0?'+':''}{row.gd}
              </td>
              <td className="px-3 py-3 text-center">
                <span className="font-bold" style={{ color:'#f0f4ff' }}>{row.points}</span>
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-0.5 justify-center">
                  {(row.form||'').split(',').filter(Boolean).slice(-5).map((r,j)=>(
                    <span key={j} className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold"
                      style={{ background:r==='W'?'rgba(16,185,129,0.25)':r==='D'?'rgba(245,158,11,0.2)':'rgba(239,68,68,0.2)',
                               color:r==='W'?'#10b981':r==='D'?'#f59e0b':'#ef4444' }}>
                      {r}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScorersTable({ data }) {
  if (!data?.scorers?.length) return <p className="text-center py-8" style={{ color:'#64748b' }}>Sin datos</p>;
  return (
    <div className="space-y-2">
      {data.scorers.map((s,i)=>(
        <div key={i} className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all"
          style={{ background:i===0?'rgba(245,158,11,0.08)':'#161b2e', border:`1px solid ${i===0?'rgba(245,158,11,0.25)':'rgba(255,255,255,0.06)'}` }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(124,58,237,0.3)'}
          onMouseLeave={e=>e.currentTarget.style.borderColor=i===0?'rgba(245,158,11,0.25)':'rgba(255,255,255,0.06)'}>
          <span className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background:i===0?'rgba(245,158,11,0.2)':i===1?'rgba(148,163,184,0.15)':i===2?'rgba(180,120,60,0.15)':'rgba(255,255,255,0.05)',
                     color:i===0?'#f59e0b':i===1?'#cbd5e1':i===2?'#b4783c':'#64748b' }}>{i+1}</span>
          {s.crest && <img src={s.crest} alt="" className="w-6 h-6 object-contain flex-shrink-0" onError={e=>e.target.style.display='none'} />}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color:'#e2e8f0' }}>{s.player}</p>
            <p className="text-xs" style={{ color:'#64748b' }}>{s.team}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color:'#a78bfa', fontFamily:'Space Grotesk,sans-serif' }}>{s.goals}</p>
              <p className="text-xs" style={{ color:'#4a5580' }}>goles</p>
            </div>
            {s.assists>0 && <div className="text-center">
              <p className="text-xl font-bold" style={{ color:'#22d3ee' }}>{s.assists}</p>
              <p className="text-xs" style={{ color:'#4a5580' }}>asist.</p>
            </div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchCard({ m, finished=false }) {
  const fmt = d => new Date(d).toLocaleDateString('es-ES',{ weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
  const homeWon = finished && m.score?.home > m.score?.away;
  const awayWon = finished && m.score?.away > m.score?.home;
  return (
    <div className="rounded-xl px-4 py-3 transition-all"
      style={{ background:'#161b2e', border:'1px solid rgba(255,255,255,0.06)' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(124,58,237,0.3)'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}>
      <p className="text-xs mb-2 text-center" style={{ color:'#4a5580' }}>Jornada {m.matchday} · {fmt(m.date)}</p>
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 flex-1 justify-end">
          {m.home.crest && <img src={m.home.crest} alt="" className="w-6 h-6 object-contain" onError={e=>e.target.style.display='none'} />}
          <span className="font-semibold text-sm text-right" style={{ color: homeWon?'#f0f4ff':'#94a3b8' }}>{m.home.name}</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg flex-shrink-0 min-w-[56px] text-center"
          style={{ background: finished?'rgba(16,185,129,0.12)':'rgba(124,58,237,0.15)', border:`1px solid ${finished?'rgba(16,185,129,0.25)':'rgba(124,58,237,0.25)'}` }}>
          {finished
            ? <span className="text-sm font-bold" style={{ color:'#10b981' }}>{m.score.home} - {m.score.away}</span>
            : <span className="text-xs font-bold" style={{ color:'#a78bfa' }}>VS</span>}
        </div>
        <div className="flex items-center gap-2 flex-1 justify-start">
          <span className="font-semibold text-sm" style={{ color: awayWon?'#f0f4ff':'#94a3b8' }}>{m.away.name}</span>
          {m.away.crest && <img src={m.away.crest} alt="" className="w-6 h-6 object-contain" onError={e=>e.target.style.display='none'} />}
        </div>
      </div>
    </div>
  );
}

function MatchesSection({ data, finished=false }) {
  if (!data?.matches?.length) return (
    <div className="text-center py-12">
      <div className="text-4xl mb-3">{finished?'📋':'📅'}</div>
      <p style={{ color:'#64748b' }}>No hay partidos disponibles</p>
    </div>
  );
  return <div className="space-y-2">{data.matches.map((m,i)=><MatchCard key={i} m={m} finished={finished} />)}</div>;
}

export default function Live() {
  const { logout } = useAuth();
  const [selectedComp, setSelectedComp] = useState(() => localStorage.getItem(FAV_KEY) || 'CL');
  const [activeTab, setActiveTab] = useState('standings');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fav, setFav] = useState(() => localStorage.getItem(FAV_KEY) || '');

  const loadData = useCallback(async (comp=selectedComp, tab=activeTab) => {
    setLoading(true); setError(''); setData(null);
    try {
      const endpoint = tab==='results' ? 'results' : tab==='standings' ? 'standings' : tab==='scorers' ? 'scorers' : 'matches';
      const { data: res } = await api.get(`/api/football/${endpoint}/${comp}`);
      setData(res);
    } catch(err) {
      setError(err.response?.data?.error || 'Error al cargar. Inténtalo de nuevo.');
    } finally { setLoading(false); }
  }, [selectedComp, activeTab]);

  useEffect(() => { loadData(selectedComp, activeTab); }, [selectedComp, activeTab]);

  const toggleFav = (code) => {
    if (fav === code) { setFav(''); localStorage.removeItem(FAV_KEY); }
    else { setFav(code); localStorage.setItem(FAV_KEY, code); }
  };

  const sortedComps = [...COMPETITIONS].sort((a,b) => {
    if (a.code === fav) return -1;
    if (b.code === fav) return 1;
    return 0;
  });

  const currentComp = COMPETITIONS.find(c=>c.code===selectedComp);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background:'#0a0d16' }}>
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-4"
        style={{ borderBottom:'1px solid rgba(124,58,237,0.15)', background:'rgba(15,18,32,0.97)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>⚽</div>
          <div>
            <span className="font-bold text-lg" style={{ fontFamily:'Space Grotesk,sans-serif', background:'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              NEXUS FOOTBALL
            </span>
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' }}>🔴 EN VIVO</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/players" className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)', color:'#fbbf24' }}>⭐ Jugadores</Link>
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

          {/* Competition selector + favoritos */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color:'#4a5580' }}>
              Competiciones {fav && <span style={{ color:'#f59e0b' }}>· ⭐ Favorito marcado</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {sortedComps.map(c=>(
                <div key={c.code} className="relative group">
                  <button onClick={()=>setSelectedComp(c.code)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 pr-8"
                    style={selectedComp===c.code
                      ? { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', boxShadow:'0 4px 14px rgba(124,58,237,0.4)' }
                      : { background: fav===c.code?'rgba(245,158,11,0.1)':'#161b2e',
                          border:`1px solid ${fav===c.code?'rgba(245,158,11,0.4)':'rgba(255,255,255,0.07)'}`,
                          color: fav===c.code?'#fbbf24':'#94a3b8' }}>
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    {fav===c.code && <span className="text-xs">⭐</span>}
                  </button>
                  <button onClick={()=>toggleFav(c.code)}
                    title={fav===c.code?'Quitar favorito':'Marcar como favorito'}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all text-xs p-0.5 rounded"
                    style={{ color: fav===c.code?'#f59e0b':'#4a5580' }}>
                    {fav===c.code?'★':'☆'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background:'#161b2e', border:'1px solid rgba(255,255,255,0.06)' }}>
            {TABS.map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={activeTab===tab
                  ? { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', boxShadow:'0 2px 10px rgba(124,58,237,0.3)' }
                  : { color:'#64748b' }}>
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          {/* Title + refresh */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color:'#f0f4ff', fontFamily:'Space Grotesk,sans-serif' }}>
              {currentComp?.flag} {currentComp?.name} — {TAB_LABELS[activeTab]}
            </h2>
            <button onClick={()=>loadData()}
              className="text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#64748b' }}
              onMouseEnter={e=>{ e.currentTarget.style.color='#a78bfa'; e.currentTarget.style.borderColor='rgba(124,58,237,0.3)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.color='#64748b'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}>
              🔄 Actualizar
            </button>
          </div>

          {loading && <Spinner />}
          {error && <ErrorBox msg={error} onRetry={()=>loadData()} />}
          {!loading && !error && data && (
            <>
              {activeTab==='standings' && <StandingsTable data={data} />}
              {activeTab==='scorers'   && <ScorersTable   data={data} />}
              {activeTab==='matches'   && <MatchesSection data={data} finished={false} />}
              {activeTab==='results'   && <MatchesSection data={data} finished={true} />}
            </>
          )}

          {activeTab==='standings' && !loading && !error && (
            <div className="flex flex-wrap gap-3 text-xs pb-2" style={{ color:'#4a5580' }}>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background:'rgba(124,58,237,0.3)' }} /> Champions League</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background:'rgba(59,130,246,0.25)' }} /> Europa League</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background:'rgba(239,68,68,0.2)' }} /> Descenso</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
