import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data.token, data.user);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-surface-950 relative">
      {/* Animated background orbs */}
      <div className="orb w-[600px] h-[600px] bg-violet-700 opacity-10 -top-48 -left-48 animate-float" />
      <div className="orb w-[400px] h-[400px] bg-cyan-500 opacity-10 bottom-0 right-0 animate-float-delay" />
      <div className="orb w-[300px] h-[300px] bg-violet-500 opacity-8 top-1/2 left-1/3 animate-float-delay2" />

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16 relative z-10">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-xl bg-gradient-brand opacity-80 blur-sm" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="gradient-text">NEXUS</span>
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            La IA que<br /><span className="gradient-text">transforma</span><br />tu forma de pensar.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Chatea con inteligencia artificial de última generación. Respuestas instantáneas, conocimiento sin límites.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {['⚡ Ultra rápido', '🧠 IA avanzada', '💬 Multi-idioma', '🔒 Privado'].map(f => (
              <span key={f} className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 bg-surface-700 border border-surface-500">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NEXUS</span>
          </div>

          <div className="glass-card p-8 shadow-card">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Bienvenido de nuevo
              </h2>
              <p className="text-gray-500 text-sm">Inicia sesión para continuar</p>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm animate-fade-in">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contraseña</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Iniciar sesión
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-surface-500" />
              <span className="text-xs text-gray-600">¿Primera vez?</span>
              <div className="flex-1 h-px bg-surface-500" />
            </div>

            <Link to="/register" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
              Crear cuenta gratis
            </Link>
          </div>

          <p className="text-center text-xs text-gray-700 mt-6">
            Powered by Groq · LLaMA 3.3 70B
          </p>
        </div>
      </div>
    </div>
  );
}
