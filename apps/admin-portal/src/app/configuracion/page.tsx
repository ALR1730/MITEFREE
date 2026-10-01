'use client';

import { useState } from 'react';
import {
  Sliders,
  DollarSign,
  Layers,
  Sparkles,
  Save,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [depositRate, setDepositRate] = useState<number>(30);
  const [cashbackRate, setCashbackRate] = useState<number>(5);
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Matriz de Tarifas & Reglas de Negocio
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configuración global de precios canónicos, multiplicadores de tejidos y fidelización.
          </p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs admin-glow-indigo active:scale-95 transition-all shadow-md"
        >
          {saved ? (
            <CheckCircle className="w-4 h-4 text-emerald-300" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saved ? '¡Configuración Guardada!' : 'Guardar Cambios'}</span>
        </button>
      </div>

      {/* Core Rules Section */}
      <div className="admin-card rounded-2xl p-6 border border-admin-border space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Reglas Canónicas del Negocio (DDD)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border space-y-2">
            <label className="text-xs font-semibold text-gray-400 block">Anticipo Requerido</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={depositRate}
                onChange={(e) => setDepositRate(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg bg-admin-card border border-admin-border text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs font-bold text-indigo-400">%</span>
            </div>
            <span className="text-[10px] text-gray-500 block">Canónico: 30%</span>
          </div>

          <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border space-y-2">
            <label className="text-xs font-semibold text-gray-400 block">Cashback Billetera</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={cashbackRate}
                onChange={(e) => setCashbackRate(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg bg-admin-card border border-admin-border text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs font-bold text-emerald-400">%</span>
            </div>
            <span className="text-[10px] text-gray-500 block">Canónico: 5%</span>
          </div>

          <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border space-y-2">
            <label className="text-xs font-semibold text-gray-400 block">
              Expiración Cotización
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={expirationDays}
                onChange={(e) => setExpirationDays(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg bg-admin-card border border-admin-border text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs font-bold text-cyan-400">Días</span>
            </div>
            <span className="text-[10px] text-gray-500 block">Canónico: 7 días</span>
          </div>

          <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border space-y-2">
            <label className="text-xs font-semibold text-gray-400 block">Comisión Cuadrilla</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg bg-admin-card border border-admin-border text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs font-bold text-amber-400">%</span>
            </div>
            <span className="text-[10px] text-gray-500 block">Canónico: 15%</span>
          </div>
        </div>
      </div>

      {/* Fabric Multipliers Table */}
      <div className="admin-card rounded-2xl p-6 border border-admin-border space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Matriz de Multiplicadores por Tejido</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border text-gray-400 font-mono uppercase text-[10px]">
                <th className="pb-3">Tipo de Tejido</th>
                <th className="pb-3">Multiplicador Canónico</th>
                <th className="pb-3">Recargo Porcentual</th>
                <th className="pb-3">Protocolo de Limpieza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/40 font-mono">
              {[
                {
                  name: 'Sintética / Poliéster',
                  mult: '1.00x',
                  surcharge: '0%',
                  note: 'Extracción estándar neutra',
                },
                {
                  name: 'Microfibra / Gamuzina',
                  mult: '1.10x',
                  surcharge: '+10%',
                  note: 'Doble pasada de succión',
                },
                {
                  name: 'Lino Natural',
                  mult: '1.25x',
                  surcharge: '+25%',
                  note: 'pH 6.5 balanceado',
                },
                {
                  name: 'Terciopelo / Chenille',
                  mult: '1.40x',
                  surcharge: '+40%',
                  note: 'Protector anti-aplastamiento',
                },
                {
                  name: 'Cuero / Piel Genuina',
                  mult: '1.60x',
                  surcharge: '+60%',
                  note: 'Bálsamo hidratante UV',
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-admin-hover/40">
                  <td className="py-3 font-sans font-bold text-white">{row.name}</td>
                  <td className="py-3 text-cyan-400 font-bold">{row.mult}</td>
                  <td className="py-3 text-emerald-400">{row.surcharge}</td>
                  <td className="py-3 font-sans text-gray-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
}
