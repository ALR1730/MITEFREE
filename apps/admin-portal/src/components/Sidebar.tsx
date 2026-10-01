'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  Sliders,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard Ejecutivo', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tablero de Citas', href: '/citas', icon: CalendarDays },
    { name: 'Cuadrillas Técnicas', href: '/tecnicos', icon: Users },
    { name: 'Conciliación de Pagos', href: '/pagos', icon: CreditCard },
    { name: 'Matriz de Tarifas', href: '/configuracion', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-admin-sidebar border-r border-admin-border flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40">
      <div>
        {/* Brand */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-admin-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-dark-bg font-extrabold shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">MITE<span className="text-cyan-400">FREE</span></span>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Ops</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono tracking-tight">ALR COMPANY EXECUTIVE</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 px-3 mb-2 font-semibold">
            Módulos Operativos
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-admin-hover'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Founder note */}
      <div className="p-4 border-t border-admin-border space-y-3">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-admin-card border border-admin-border text-xs text-gray-300 hover:text-cyan-400 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Ver PWA Cliente</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-xs text-dark-bg">
            AR
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">Angel Luis Rosario</div>
            <div className="text-[10px] text-gray-500 truncate font-mono">Founder · ALR COMPANY</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
