'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

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
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center tech-glow transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 text-dark-bg" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">
                MITE<span className="text-brand-500">FREE</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Pro
              </span>
            </div>
            <p className="text-[10px] text-gray-400 -mt-1 font-mono tracking-tight">
              ALR COMPANY TECH
            </p>
          </div>
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

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/cotizar"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg tech-glow hover:opacity-95 transition-all shadow-md active:scale-95"
          >
            <span>Cotizar en 60s</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
