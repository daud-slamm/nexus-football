import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | invalid | expired | error

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus) {
      setStatus(urlStatus);
      return;
    }
    setStatus('idle');
  }, [searchParams]);

  const configs = {
    loading: {
      icon: <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />,
      title: 'Verificando...',
      text: 'Un momento por favor',
      color: 'text-gray-400',
    },
    idle: {
      icon: <span className="text-6xl">📧</span>,
      title: 'Revisa tu email',
      text: 'Te hemos enviado un link de verificación. Haz clic en él para activar tu cuenta.',
      color: 'text-gray-400',
    },
    invalid: {
      icon: <span className="text-6xl">❌</span>,
      title: 'Enlace inválido',
      text: 'Este enlace de verificación no es válido. Puede que ya lo hayas usado.',
      color: 'text-red-400',
    },
    expired: {
      icon: <span className="text-6xl">⏰</span>,
      title: 'Enlace expirado',
      text: 'El enlace de verificación ha caducado. Solicita uno nuevo desde el login.',
      color: 'text-yellow-400',
    },
    error: {
      icon: <span className="text-6xl">⚠️</span>,
      title: 'Algo salió mal',
      text: 'Hubo un error al verificar tu cuenta. Inténtalo de nuevo.',
      color: 'text-red-400',
    },
  };

  const cfg = configs[status] || configs.idle;

  return (
    <div className="h-full flex items-center justify-center bg-surface-950 relative overflow-hidden">
      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-700 opacity-10 -top-32 -left-32 animate-float" />
      <div className="orb w-[400px] h-[400px] bg-cyan-500 opacity-10 bottom-0 right-0 animate-float-delay" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NEXUS</span>
        </div>

        <div className="glass-card p-10 text-center shadow-card">
          <div className="mb-6">{cfg.icon}</div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {cfg.title}
          </h2>
          <p className={`text-sm leading-relaxed mb-8 ${cfg.color}`}>{cfg.text}</p>

          <div className="flex flex-col gap-3">
            <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
              Ir al login
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link to="/register" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
              Crear nueva cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
