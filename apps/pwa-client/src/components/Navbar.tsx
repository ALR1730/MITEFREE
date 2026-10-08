'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  Wallet,
  ArrowRight,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/cotizar', label: 'Cotizador Inteligente' },
    { href: '/agenda', label: 'Agendar Cita' },
    { href: '/mis-citas', label: 'Mis Citas' },
    { href: '/wallet', label: 'Billetera Cashback' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-dark-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-32 sm:w-36 flex items-center justify-center transition-transform group-hover:scale-105 drop-shadow-[0_0_14px_rgba(0,196,255,0.4)]">
            <Image
              src="/logo-mitefree.png"
              alt="Mitefree"
              fill
              priority
              sizes="144px"
              className="object-contain object-left"
            />
          </div>
          <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded bg-brand-500/10 text-brand-400 border border-brand-500/25">
            Pro
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-brand-400 bg-brand-500/10 border border-brand-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-dark-hover'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Session & CTA Buttons */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            /* Logged In User Pill */
            <div className="flex items-center gap-2 pl-2">
              <Link
                href="/wallet"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/20 transition-all"
                title="Ver tu saldo de Cashback"
              >
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                <span>RD$ {user.walletBalance.toLocaleString('es-DO')}</span>
              </Link>

              <div className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-dark-surface/90 border border-dark-border">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-cyan-400 flex items-center justify-center text-dark-bg font-extrabold text-xs shadow-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white hidden md:inline truncate max-w-[100px]">
                  {user.fullName.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Guest Auth Buttons */
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-300 hover:text-white hover:bg-dark-hover transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ingresar</span>
              </Link>
              <Link
                href="/registro"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse</span>
              </Link>
            </div>
          )}

          <Link
            href="/cotizar"
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg tech-glow hover:opacity-95 transition-all shadow-md active:scale-95 ml-1"
          >
            <span>Cotizar 60s</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
