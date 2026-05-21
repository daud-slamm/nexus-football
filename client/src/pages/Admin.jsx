import { useState } from 'react';
import api from '../api';

export default function Admin() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const load = async (k) => {
    setError('');
    try {
      const { data } = await api.get('/api/admin/users', { headers: { 'x-admin-key': k } });
      setUsers(data);
      setAuthed(true);
    } catch {
      setError('Clave incorrecta');
    }
  };

  const deleteUser = async (id, username) => {
    if (!confirm(`¿Borrar usuario "${username}"?`)) return;
    await api.delete(`/api/admin/users/${id}`, { headers: { 'x-admin-key': key } });
    setMsg(`Usuario "${username}" eliminado`);
    setUsers(u => u.filter(x => x.id !== id));
    setTimeout(() => setMsg(''), 3000);
  };

  const deleteAll = async () => {
    if (!confirm('¿Borrar TODOS los usuarios? Esta acción no se puede deshacer.')) return;
    await api.delete('/api/admin/users', { headers: { 'x-admin-key': key } });
    setUsers([]);
    setMsg('Todos los usuarios eliminados');
    setTimeout(() => setMsg(''), 3000);
  };

  if (!authed) return (
    <div className="h-full flex items-center justify-center bg-surface-950">
      <div className="glass-card p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-6 text-center">🔐 Panel de Admin</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <input
          type="password"
          className="input-field mb-4"
          placeholder="Clave de administrador"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(key)}
        />
        <button className="btn-primary w-full" onClick={() => load(key)}>Entrar</button>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-auto bg-surface-950 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">👥 Usuarios ({users.length})</h1>
          <button onClick={deleteAll} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-xl font-semibold transition-colors">
            🗑️ Borrar todos
          </button>
        </div>

        {msg && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-400 rounded-xl px-4 py-3 mb-4 text-sm">
            ✅ {msg}
          </div>
        )}

        {users.length === 0 ? (
          <div className="glass-card p-8 text-center text-gray-500">No hay usuarios registrados</div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="glass-card p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{u.username}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {u.verified ? '✓ Verificado' : '⏳ Sin verificar'}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm mt-0.5">{u.email}</div>
                  <div className="text-gray-600 text-xs mt-0.5">{new Date(u.created_at).toLocaleString()}</div>
                </div>
                <button
                  onClick={() => deleteUser(u.id, u.username)}
                  className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 text-sm rounded-lg transition-colors flex-shrink-0"
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
