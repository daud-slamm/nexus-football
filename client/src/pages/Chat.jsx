import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = [
  { icon: '🥇', text: '¿Quién ha ganado más Balones de Oro y cuántos?', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 hover:border-amber-400/60' },
  { icon: '⚽', text: '¿Quién es el máximo goleador de la Champions League?', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 hover:border-blue-400/60' },
  { icon: '🌍', text: '¿Qué selecciones han ganado más Copas del Mundo?', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 hover:border-emerald-400/60' },
  { icon: '🏆', text: '¿Cuáles son los mejores jugadores de la historia?', color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 hover:border-violet-400/60' },
  { icon: '📊', text: '¿Cuáles son los récords de Messi y Cristiano?', color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 hover:border-rose-400/60' },
  { icon: '🏟️', text: '¿Qué club ha ganado más Champions League?', color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/30 hover:border-cyan-400/60' },
];

function NexusLogo({ size = 'md' }) {
  const s = { sm: ['w-8 h-8', 'w-4 h-4'], md: ['w-10 h-10', 'w-5 h-5'], lg: ['w-14 h-14', 'w-8 h-8'] }[size];
  return (
    <div className="relative flex-shrink-0">
      <div className={`absolute inset-0 rounded-xl blur-md opacity-70`} style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }} />
      <div className={`relative ${s[0]} rounded-xl flex items-center justify-center`} style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
        <svg className={`${s[1]} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
    </div>
  );
}

function UserAvatar({ username }) {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg"
      style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
      {username?.[0] || 'U'}
    </div>
  );
}

function MessageBubble({ msg, username }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 items-end animate-fade-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {isUser
        ? <UserAvatar username={username} />
        : <div className="mb-1"><NexusLogo size="sm" /></div>
      }
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xl
        ${isUser ? 'rounded-br-sm text-white' : 'rounded-bl-sm'}`}
        style={isUser
          ? { background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', boxShadow: '0 4px 20px rgba(109,40,217,0.35)' }
          : { background: '#1e2640', border: '1px solid rgba(124,58,237,0.2)', color: '#dde3f0', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }
        }>
        {isUser
          ? <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
          : <div className="prose-chat"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown></div>
        }
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end animate-fade-in">
      <div className="mb-1"><NexusLogo size="sm" /></div>
      <div className="rounded-2xl rounded-bl-sm px-5 py-4 shadow-xl"
        style={{ background: '#1e2640', border: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="flex gap-1.5 items-center">
          {[0, 150, 300].map(d => (
            <span key={d} className="w-2 h-2 rounded-full"
              style={{ background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', animation: `bounceDot 1.2s ease-in-out ${d}ms infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try { const { data } = await axios.get('/api/chat/conversations'); setConversations(data); } catch {}
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  const loadHistory = async (convId) => {
    try {
      const { data } = await axios.get(`/api/chat/history/${convId}`);
      setMessages(data); setActiveConvId(convId); setError('');
    } catch {}
  };

  const newChat = () => { setActiveConvId(null); setMessages([]); setError(''); setTimeout(() => inputRef.current?.focus(), 50); };

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || sending) return;
    setInput(''); setError('');
    setMessages(prev => [...prev, { role: 'user', content }]);
    setSending(true);
    try {
      const { data } = await axios.post('/api/chat/message', { message: content, conversationId: activeConvId });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setActiveConvId(data.conversationId);
      loadConversations();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el mensaje');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    await axios.delete(`/api/chat/conversation/${convId}`);
    if (activeConvId === convId) newChat();
    loadConversations();
  };

  const formatDate = (dt) => {
    const diff = Date.now() - new Date(dt);
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `Hace ${Math.floor(diff/60000)}m`;
    if (diff < 86400000) return `Hace ${Math.floor(diff/3600000)}h`;
    return new Date(dt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="h-full flex overflow-hidden" style={{ background: '#0a0d16' }}>

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden flex flex-col`}
        style={{ background: '#0f1220', borderRight: '1px solid rgba(124,58,237,0.12)' }}>

        {/* Logo + nuevo chat */}
        <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2.5 mb-4 px-1">
            <NexusLogo size="sm" />
            <span className="font-bold text-lg tracking-tight gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NEXUS <span className="text-green-400">FOOTBALL</span></span>
          </div>
          <button onClick={newChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo chat
          </button>
        </div>

        {/* Lista conversaciones */}
        <div className="flex-1 overflow-y-auto p-3">
          {conversations.length > 0 && (
            <p className="text-xs font-semibold px-3 mb-3 uppercase tracking-widest" style={{ color: '#4a5580' }}>Historial</p>
          )}
          {conversations.length === 0 && (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm" style={{ color: '#4a5580' }}>Sin conversaciones aún</p>
            </div>
          )}
          {conversations.map(conv => (
            <button key={conv.conversation_id}
              onClick={() => loadHistory(conv.conversation_id)}
              className="group w-full text-left px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 flex items-start gap-2"
              style={activeConvId === conv.conversation_id
                ? { background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd' }
                : { border: '1px solid transparent', color: '#64748b' }
              }
              onMouseEnter={e => { if (activeConvId !== conv.conversation_id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (activeConvId !== conv.conversation_id) e.currentTarget.style.background = 'transparent'; }}
            >
              <svg className="w-3.5 h-3.5 mt-1 flex-shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate leading-snug">{conv.first_message || 'Nueva conversación'}</p>
                <p className="text-xs mt-0.5" style={{ color: '#3a4460' }}>{formatDate(conv.started_at)}</p>
              </div>
              <button onClick={(e) => deleteConversation(conv.conversation_id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all flex-shrink-0 hover:text-red-400"
                style={{ color: '#4a5580' }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </button>
          ))}
        </div>

        {/* Usuario */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl group"
            style={{ transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <UserAvatar username={user?.username} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#c8d0e8' }}>{user?.username}</p>
              <p className="text-xs truncate" style={{ color: '#4a5580' }}>{user?.email}</p>
            </div>
            <button onClick={logout} title="Cerrar sesión"
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all hover:text-red-400 hover:bg-red-500/10"
              style={{ color: '#4a5580' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Orbs de fondo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb w-96 h-96 top-0 right-0" style={{ background: '#7c3aed', opacity: 0.05 }} />
          <div className="orb w-72 h-72 bottom-20 left-10" style={{ background: '#06b6d4', opacity: 0.04 }} />
        </div>

        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 relative z-10"
          style={{ borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(15,18,32,0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#64748b' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#c4b5fd'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {activeConvId
                ? <><span className="text-sm font-semibold" style={{ color: '#c8d0e8' }}>Conversación activa</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#10b981' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} /> En línea
                    </span></>
                : <span className="font-bold text-base gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NEXUS AI</span>
              }
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/players"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
              ⭐ Jugadores
            </Link>
            <Link to="/live"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              🔴 En Vivo
            </Link>
            <Link to="/records"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
              🏆 Récords
            </Link>
            <span className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              LLaMA 3.3 70B
            </span>
            {activeConvId && (
              <button onClick={newChat}
                className="text-xs px-3 py-1 rounded-full transition-all font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = '#c4b5fd'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}>
                + Nuevo chat
              </button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto relative z-10">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6" style={{ animation: 'float 5s ease-in-out infinite' }}>
                <NexusLogo size="lg" />
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0f4ff' }}>
                ¡Hola, <span className="gradient-text">{user?.username}</span>! ⚽
              </h2>
              <p className="mb-2 max-w-md text-sm leading-relaxed" style={{ color: '#64748b' }}>
                Soy <strong style={{ color: '#a78bfa' }}>NEXUS FOOTBALL</strong>, tu enciclopedia de fútbol con IA. Pregúntame sobre jugadores, records, competiciones, estadísticas y todo sobre el deporte rey.
              </p>
              <Link to="/records" className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-8 transition-all"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                🏆 Ver récords imbatibles del fútbol →
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.text)}
                    className={`text-left px-4 py-3.5 rounded-xl border bg-gradient-to-br ${s.color} transition-all duration-200 group`}
                    style={{ color: '#c8d0e8' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = '#f0f4ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.color = '#c8d0e8'; }}>
                    <span className="text-xl block mb-1">{s.icon}</span>
                    <span className="text-sm leading-snug">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} username={user?.username} />)}
              {sending && <TypingIndicator />}
              <div ref={bottomRef} className="h-2" />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mb-2 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm animate-fade-in relative z-10"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
            <button onClick={() => setError('')} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0 px-4 pb-5 pt-2 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end rounded-2xl px-4 py-3 transition-all duration-200"
              style={{
                background: '#161b2e',
                border: input ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: input ? '0 0 0 3px rgba(124,58,237,0.12), 0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.3)',
              }}>
              <textarea
                ref={inputRef}
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed max-h-40"
                placeholder="Pregunta sobre fútbol... jugadores, récords, competiciones (Enter para enviar)"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                style={{ fieldSizing: 'content', color: '#e8eaf0', caretColor: '#a78bfa' }}
                autoFocus
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || sending}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: input.trim() ? 'linear-gradient(135deg,#7c3aed,#06b6d4)' : 'rgba(255,255,255,0.05)',
                  boxShadow: input.trim() ? '0 4px 16px rgba(124,58,237,0.5)' : 'none',
                  opacity: (!input.trim() || sending) ? 0.4 : 1,
                  transform: input.trim() ? 'scale(1)' : 'scale(0.95)',
                }}>
                {sending
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                }
              </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: '#2a3450' }}>
              NEXUS puede cometer errores · Verifica información importante · Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
}
