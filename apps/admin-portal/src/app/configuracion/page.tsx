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
  Calculator,
  RefreshCw,
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [depositRate, setDepositRate] = useState<number>(0);
  const [cashbackRate, setCashbackRate] = useState<number>(5);
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [saved, setSaved] = useState<boolean>(false);

  // Simulador de Cotización en Vivo (Admin Testing Tool - Valores Canónicos en RD$)
  const [simBasePrice, setSimBasePrice] = useState<number>(2500); // Matrimonial 1 lado / Mueble 3 plazas
  const [simMultiplier, setSimMultiplier] = useState<number>(1.0); // Sintética estándar
  const [simSurcharge, setSimSurcharge] = useState<number>(500); // Ambos lados o Mancha
  const [simDiscount, setSimDiscount] = useState<number>(300);
  const [simWallet, setSimWallet] = useState<number>(200);

  const simSubtotal = Math.round((simBasePrice * simMultiplier + simSurcharge) * 100) / 100;
  const simAfterDiscount = Math.max(0, simSubtotal - simDiscount);
  const simTotal = Math.max(0, Math.round((simAfterDiscount - simWallet) * 100) / 100);
  const simDeposit = Math.round(simTotal * (depositRate / 100) * 100) / 100;
  const simRemaining = Math.round((simTotal - simDeposit) * 100) / 100;

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
            Matriz de Tarifas & Reglas de Negocio (Fase 2)
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configuración global de precios canónicos, multiplicadores de tejidos y motor
            algorítmico.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-admin-sidebar border border-cyan-500/30 space-y-2">
            <label className="text-xs font-semibold text-cyan-300 block">
              Consumo Mínimo Domicilio
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">RD$</span>
              <input
                type="number"
                value={1500}
                readOnly
                className="w-20 px-3 py-1.5 rounded-lg bg-admin-card border border-admin-border text-white font-mono font-bold text-sm focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-emerald-400 block font-medium">
              Rentabilidad Van & UV-C
            </span>
          </div>

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
            <span className="text-[10px] text-gray-500 block">
              Canónico: 0% (Pago al finalizar)
            </span>
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
            <span className="text-[10px] text-gray-500 block">Canónico: 7 días congelado</span>
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
          <span>Matriz Canónica de Multiplicadores por Tejido</span>
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
                  mult: '1.15x',
                  surcharge: '+15%',
                  note: 'Doble pasada de succión y cepillado',
                },
                {
                  name: 'Lino Natural',
                  mult: '1.20x',
                  surcharge: '+20%',
                  note: 'pH 6.5 balanceado con secado controlado',
                },
                {
                  name: 'Terciopelo / Chenille',
                  mult: '1.40x',
                  surcharge: '+40%',
                  note: 'Protector anti-aplastamiento de fibra',
                },
                {
                  name: 'Cuero / Piel Genuina',
                  mult: '1.50x',
                  surcharge: '+50%',
                  note: 'Bálsamo hidratante UV y sellado de poro',
                },
                {
                  name: 'Seda / Fibras Nobles',
                  mult: '1.80x',
                  surcharge: '+80%',
                  note: 'Limpieza en seco artesanal especializada',
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

      {/* Canonical Service Catalog from Flyer */}
      <div className="admin-card rounded-2xl p-6 border border-cyan-500/30 admin-glow-cyan space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Tarifario Oficial Canónico (Flyer MITEFREE 2025/2026)</span>
          </h3>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
            Moneda Base: RD$ (DOP) · WhatsApp: (809) 513-4773
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Colchones */}
          <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-admin-border">
              <span className="font-bold text-white">Lavado de Colchones</span>
              <span className="text-[10px] text-cyan-400 font-mono">+RD$ 500 Ambos Lados</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Matrimonial:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  RD$ 2,500{' '}
                  <span className="text-[10px] text-gray-500 font-normal">/ RD$ 3,000</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Queen:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  RD$ 3,000{' '}
                  <span className="text-[10px] text-gray-500 font-normal">/ RD$ 3,500</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">King:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  RD$ 3,500{' '}
                  <span className="text-[10px] text-gray-500 font-normal">/ RD$ 4,000</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sillas y Muebles */}
          <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-admin-border">
              <span className="font-bold text-white">Muebles y Asientos</span>
              <span className="text-[10px] text-indigo-400 font-mono">Sala, Sofá, Love Seat</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Sillas de Comedor:</span>
                <span className="font-mono text-amber-300 font-bold">
                  RD$ 300 <span className="text-[10px] text-gray-500 font-normal">c/u</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mueble 1 Plaza:</span>
                <span className="font-mono text-indigo-300 font-bold">RD$ 1,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mueble 3 Plazas:</span>
                <span className="font-mono text-indigo-300 font-bold">RD$ 2,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mueble 5 Plazas (L):</span>
                <span className="font-mono text-indigo-300 font-bold">RD$ 3,500</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1 border-t border-admin-border/40">
                <span>Plaza Extra:</span>
                <span className="font-mono text-emerald-400 font-bold">+RD$ 500 c/u</span>
              </div>
            </div>
          </div>

          {/* Alfombras por Longitud */}
          <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-admin-border">
              <span className="font-bold text-white">Alfombras (Longitudes)</span>
              <span className="text-[10px] text-cyan-400 font-mono">Extracción Profunda</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Pequeña (1.5×0.8m):</span>
                <span className="font-mono text-cyan-300 font-bold">RD$ 600</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mediana (2.0×1.5m):</span>
                <span className="font-mono text-cyan-300 font-bold">RD$ 1,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Grande (2.5×2.0m):</span>
                <span className="font-mono text-cyan-300 font-bold">RD$ 1,800</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Extra Grande (3.0×2.5m):</span>
                <span className="font-mono text-cyan-300 font-bold">RD$ 2,500</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1 border-t border-admin-border/40">
                <span>Por Medida / M²:</span>
                <span className="font-mono text-emerald-400 font-bold">RD$ 300 / m²</span>
              </div>
            </div>
          </div>

          {/* Zonas de Cobertura Exclusivas */}
          <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-admin-border">
              <span className="font-bold text-white">Zonas de Cobertura Exclusiva</span>
              <span className="text-[10px] text-emerald-400 font-bold">100% Activo</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded-lg bg-admin-card border border-admin-border">
                <span className="font-bold text-cyan-300 block">San Pedro de Macorís</span>
                <span className="text-gray-400">
                  Casco Urbano, Consuelo, Quisqueya, Guayacanes, Ramón Santana, Gautier.
                </span>
              </div>
              <div className="p-2 rounded-lg bg-admin-card border border-admin-border">
                <span className="font-bold text-indigo-300 block">La Romana</span>
                <span className="text-gray-400">
                  Municipio Cabecera, Guaymate, Villa Hermosa, Caleta, Buena Vista.
                </span>
              </div>
              <div className="p-2 rounded-lg bg-admin-card border border-admin-border">
                <span className="font-bold text-emerald-300 block">Santo Domingo Este</span>
                <span className="text-gray-400">
                  Alma Rosa, Ens. Ozama, San Isidro, Lucerna, Los Frailes, Las Américas.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stain Surcharge Table & Live Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="admin-card rounded-2xl p-6 border border-admin-border space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Recargos por Severidad de Manchas</span>
          </h3>

          <div className="space-y-3">
            {[
              {
                level: 'LIGHT (Leve)',
                fee: 'RD$ 0',
                desc: 'Mantenimiento preventivo general e higienización',
              },
              {
                level: 'MODERATE (Moderada)',
                fee: '+RD$ 300',
                desc: 'Grasa, café, derrame superficial de alimentos',
              },
              {
                level: 'CRITICAL (Crítica)',
                fee: '+RD$ 500',
                desc: 'Orina, sangre, fluidos orgánicos (Tratamiento Enzimático)',
              },
            ].map((stain, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-admin-sidebar border border-admin-border flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{stain.level}</span>
                  <span className="text-[11px] text-gray-400">{stain.desc}</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-400">{stain.fee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Quotation Engine Simulator */}
        <div className="admin-card rounded-2xl p-6 border border-indigo-500/30 admin-glow-indigo space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span>Simulador Algorítmico en Vivo (DDD — RD$)</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Precio Base (RD$):</span>
              <input
                type="number"
                value={simBasePrice}
                onChange={(e) => setSimBasePrice(Number(e.target.value))}
                className="w-24 px-2 py-1 rounded bg-admin-sidebar border border-admin-border text-white text-right font-mono"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Multiplicador Tela:</span>
              <span className="font-mono text-cyan-400">x{simMultiplier.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Recargo / Extra (RD$):</span>
              <span className="font-mono text-amber-400">
                +RD$ {simSurcharge.toLocaleString('es-DO')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-admin-border">
              <span className="text-gray-300 font-bold">Subtotal Calculado:</span>
              <span className="font-mono text-white font-bold">
                RD$ {simSubtotal.toLocaleString('es-DO')}
              </span>
            </div>
            <div className="flex justify-between items-center text-emerald-400">
              <span>Descuento Cupón:</span>
              <span className="font-mono">-RD$ {simDiscount.toLocaleString('es-DO')}</span>
            </div>
            <div className="flex justify-between items-center text-cyan-400">
              <span>Canje Cashback Billetera:</span>
              <span className="font-mono">-RD$ {simWallet.toLocaleString('es-DO')}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-admin-border text-sm">
              <span className="text-white font-extrabold">Total Final:</span>
              <span className="font-mono text-indigo-400 font-extrabold">
                RD$ {simTotal.toLocaleString('es-DO')} DOP
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 pt-1 text-[11px] text-gray-400">
              <span className="text-emerald-400 font-bold">
                ✓ 0% Anticipo (Pago 100% al finalizar)
              </span>
              <span>
                Cobro total:{' '}
                <b className="text-white font-mono">RD$ {simTotal.toLocaleString('es-DO')}</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
