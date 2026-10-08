'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithOtp } = useAuth();

  const [activeTab, setActiveTab] = useState<'password' | 'whatsapp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // WhatsApp OTP state
  const [waPhone, setWaPhone] = useState('+18095550101');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login({ identifier, password });
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('¡Bienvenido de vuelta! Redirigiendo...');
      setTimeout(() => router.push('/'), 1000);
    } else {
      setError(res.error || 'Credenciales inválidas');
    }
  };

  const handleSendOtp = () => {
    if (!waPhone || waPhone.length < 10) {
      setError('Por favor ingresa un número de WhatsApp válido (+1 809/829/849).');
      return;
    }
    setError(null);
    setOtpSent(true);
    setOtpCode('123456'); // Prellenar código demo de verificación
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await loginWithOtp({ phone: waPhone, otpCode });
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('¡Autenticado vía WhatsApp! Redirigiendo...');
      setTimeout(() => router.push('/'), 1000);
    } else {
      setError(res.error || 'Código incorrecto o expirado');
    }
  };

  const fillDemoClient = (email: string) => {
    setActiveTab('password');
    setIdentifier(email);
    setPassword('Mitefree2026*');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16 animate-fadeIn">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3 border border-cyan-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Acceso Seguro a Clientes MITEFREE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Accede a tu billetera de cashback, historial de citas y cotizaciones instantáneas.
        </p>
      </div>

      {/* Auth Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-dark-border space-y-6">
        {/* Method Selector Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-dark-bg/80 border border-dark-border text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              activeTab === 'password'
                ? 'bg-gradient-to-r from-brand-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Email o Teléfono</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('whatsapp');
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Vía WhatsApp OTP</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Tab 1: Email / Phone + Password */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Correo Electrónico o Teléfono
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="ej: laura.mercedes@gmail.com o +1809..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Tu contraseña secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-xs tech-glow shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Iniciando sesión...' : 'Ingresar a mi Cuenta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Form Tab 2: WhatsApp OTP */}
        {activeTab === 'whatsapp' && (
          <form onSubmit={handleOtpLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Número de WhatsApp (República Dominicana)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="ej: +1 809 555 0101"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-600/40 active:scale-95 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Solicitar Código de 6 Dígitos</span>
              </button>
            ) : (
              <div className="space-y-3 pt-1 animate-fadeIn">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>
                    Código de verificación demo: <b>123456</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpCode('123456')}
                    className="text-xs underline font-bold"
                  >
                    Auto-rellenar
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Código de 6 Dígitos
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-center text-sm tracking-widest text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-dark-bg font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  <span>{isLoading ? 'Verificando...' : 'Confirmar & Acceder'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        )}

        {/* Demo Fast Access Pill */}
        <div className="pt-3 border-t border-dark-border text-[11px] text-gray-400">
          <span className="block font-semibold text-gray-300 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Cuentas Demo Rápidas:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoClient('laura.mercedes@gmail.com')}
              className="px-2 py-1 rounded bg-dark-bg/80 border border-dark-border text-cyan-300 hover:border-cyan-500/40 transition-all font-mono"
            >
              Laura Mercedes (SPM)
            </button>
            <button
              type="button"
              onClick={() => fillDemoClient('carlos.mendez@hotmail.com')}
              className="px-2 py-1 rounded bg-dark-bg/80 border border-dark-border text-indigo-300 hover:border-indigo-500/40 transition-all font-mono"
            >
              Carlos Méndez (La Romana)
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div className="pt-1 text-center text-xs text-gray-400">
          <span>¿Aún no tienes cuenta? </span>
          <Link
            href="/registro"
            className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors"
          >
            Regístrate aquí y recibe RD$ 250 de bienvenida
          </Link>
        </div>
      </div>
    </div>
  );
}
