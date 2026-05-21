import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Las contraseñas no coinciden');
    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'tucuenta', min: 3 },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
    { key: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 6 caracteres', min: 6 },
    { key: 'confirm', label: 'Confirmar contraseña', type: 'password', placeholder: 'Repite tu contraseña' },
  ];

  if (sent) return (
    <div className="h-full flex items-center justify-center bg-surface-950 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-cyan-500 opacity-10 -top-32 -right-32 animate-float" />
      <div className="orb w-[400px] h-[400px] bg-violet-700 opacity-10 bottom-0 -left-32 animate-float-delay" />
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NEXUS</span>
        </div>
        <div className="glass-card p-10 text-center shadow-card">
          <div className="text-6xl mb-5">📧</div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>¡Revisa tu email!</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-2">
            Hemos enviado un enlace de verificación a
          </p>
          <p className="text-cyan-400 font-semibold mb-6">{form.email}</p>
          <p className="text-gray-500 text-xs mb-8">Haz clic en el enlace del email para activar tu cuenta. Expira en 24h.</p>
          <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
            Ir al login
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex overflow-hidden bg-surface-950 relative">
      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] bg-cyan-500 opacity-10 -top-32 -right-32 animate-float" />
      <div className="orb w-[400px] h-[400px] bg-violet-700 opacity-10 bottom-0 -left-32 animate-float-delay" />

      {/* Left — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
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
                Crear tu cuenta
              </h2>
              <p className="text-gray-500 text-sm">Gratis para siempre. Sin tarjeta.</p>
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
              {fields.map(({ key, label, type, placeholder, min }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                  <input
                    type={type}
                    className="input-field"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required
                    minLength={min}
                    autoFocus={key === 'username'}
                  />
                </div>
              ))}

              <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Crear cuenta
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-surface-500" />
              <span className="text-xs text-gray-600">¿Ya tienes cuenta?</span>
              <div className="flex-1 h-px bg-surface-500" />
            </div>

            <Link to="/login" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Right — branding (only desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16 relative z-10">
        <div className="max-w-md">
          <div className="text-6xl mb-8 animate-float">🧠</div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Inteligencia sin<br /><span className="gradient-text">límites</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Únete y accede a conversaciones inteligentes con el modelo LLaMA 3.3 70B de última generación.
          </p>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: '∞', label: 'Conversaciones' },
              { val: '70B', label: 'Parámetros IA' },
              { val: '100%', label: 'Gratis' },
            ].map(({ val, label }) => (
              <div key={label} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold gradient-text mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{val}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
