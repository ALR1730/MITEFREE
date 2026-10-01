'use client';

import { Search, Bell, Activity, ShieldCheck, HelpCircle } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-16 bg-admin-sidebar/80 backdrop-blur-md border-b border-admin-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-72">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar orden, cliente o placa..."
          className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-admin-card border border-admin-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Operational Indicators */}
      <div className="flex items-center gap-4">
        {/* API Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Core WebAPI: 100% OK</span>
        </div>

        {/* Active Squads */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>4 Cuadrillas en Ruta</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => alert('Centro de alertas operativas: 0 incidencias críticas registradas.')}
          className="relative p-2 rounded-lg bg-admin-card border border-admin-border text-gray-400 hover:text-white hover:bg-admin-hover transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5 ring-2 ring-admin-bg" />
        </button>
      </div>
    </header>
  );
}
