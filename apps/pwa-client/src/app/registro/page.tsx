'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Home,
  ArrowRight,
  ShieldCheck,
  Gift,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ZONES = [
  { id: 'ZONE-SPM', name: 'San Pedro de Macorís (SPM)' },
  { id: 'ZONE-LR', name: 'La Romana (LR)' },
  { id: 'ZONE-SDE', name: 'Santo Domingo Este (SDE)' },
  { id: 'ZONE-DN', name: 'Distrito Nacional (DN)' },
];

export default function RegistroPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [zoneCode, setZoneCode] = useState('ZONE-SPM');
  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      fullName,
      email,
      phone,
      password,
      zoneCode,
      address,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('¡Cuenta creada exitosamente! Bienvenido a MITEFREE.');
      setTimeout(() => router.push('/'), 1200);
    } else {
      setError(res.error || 'No se pudo completar el registro.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-14 animate-fadeIn">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3 border border-cyan-500/20">
          <Gift className="w-3.5 h-3.5 text-brand-400" />
          <span>Bono de Bienvenida: 5% Cashback en tu Billetera</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Registro de Cliente
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Únete a la plataforma líder de desinfección hospitalaria y lavado de muebles en RD.
        </p>
      </div>

      {/* Register Form Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-dark-border space-y-6">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="ej: María Mercedes Guzmán"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="ej: maria@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                WhatsApp de Contacto
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+1 809 555 0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Contraseña Segura (Mínimo 6 caracteres)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Crea tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Zone Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Zona de Residencia / Cobertura
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <select
                value={zoneCode}
                onChange={(e) => setZoneCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-surface/90 border border-dark-border text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Dirección o Sector (Opcional)
            </label>
            <div className="relative">
              <Home className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="ej: Calle Duarte #45, Ensanche Miramar"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-xs tech-glow shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            <span>
              {isLoading ? 'Registrando cuenta...' : 'Crear Mi Cuenta & Activar Billetera'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Benefits bullets */}
        <div className="pt-4 border-t border-dark-border grid grid-cols-2 gap-2 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Datos 100% protegidos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>5% Cashback en cada cita</span>
          </div>
        </div>

        {/* Link to Login */}
        <div className="pt-1 text-center text-xs text-gray-400">
          <span>¿Ya tienes una cuenta registrada? </span>
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
