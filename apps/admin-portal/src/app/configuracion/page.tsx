'use client';

import { useState, useEffect } from 'react';
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
  Tag,
  Clock,
  MapPin,
  Percent,
  Trash2,
} from 'lucide-react';
import { DEFAULT_DISCOUNT_POLICY, type DiscountPolicyConfig } from '@mitefree/shared-types';
import { adminApiClient } from '@/lib/api-client';

export default function ConfiguracionPage() {
  const [depositRate, setDepositRate] = useState<number>(0);
  const [cashbackRate, setCashbackRate] = useState<number>(5);
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [saved, setSaved] = useState<boolean>(false);

  // Política de Descuentos Personalizados por Zona y Horario (Admin Customizable)
  const [discountPolicy, setDiscountPolicy] =
    useState<DiscountPolicyConfig>(DEFAULT_DISCOUNT_POLICY);

  // Carga inicial desde API / localStorage
  useEffect(() => {
    async function loadDiscounts() {
      try {
        const res = await adminApiClient.config.getDiscounts();
        if (res.success && res.data) {
          setDiscountPolicy(res.data);
          return;
        }
      } catch {
        // Fallback to localStorage
      }

      if (typeof window !== 'undefined') {
        const savedLocal = localStorage.getItem('mitefree_discount_policy');
        if (savedLocal) {
          try {
            setDiscountPolicy(JSON.parse(savedLocal));
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
    loadDiscounts();
  }, []);

  // Handlers para Zonas
  const handleToggleZone = (zoneCode: string) => {
    setDiscountPolicy((prev) => ({
      ...prev,
      zones: prev.zones.map((z) => (z.zoneCode === zoneCode ? { ...z, enabled: !z.enabled } : z)),
    }));
  };

  const handleChangeZoneDiscount = (zoneCode: string, percentage: number) => {
    const validRate = Math.max(0, Math.min(100, isNaN(percentage) ? 0 : percentage));
    setDiscountPolicy((prev) => ({
      ...prev,
      zones: prev.zones.map((z) =>
        z.zoneCode === zoneCode ? { ...z, discountPercentage: validRate } : z,
      ),
    }));
  };

  // Handlers para Horarios
  const handleToggleSlot = (slotCode: string) => {
    setDiscountPolicy((prev) => ({
      ...prev,
      slots: prev.slots.map((s) => (s.slotCode === slotCode ? { ...s, enabled: !s.enabled } : s)),
    }));
  };

  const handleChangeSlotDiscount = (slotCode: string, percentage: number) => {
    const validRate = Math.max(0, Math.min(100, isNaN(percentage) ? 0 : percentage));
    setDiscountPolicy((prev) => ({
      ...prev,
      slots: prev.slots.map((s) =>
        s.slotCode === slotCode ? { ...s, discountPercentage: validRate } : s,
      ),
    }));
  };

  // Restablecer / Eliminar todos los descuentos (0% para todos)
  const handleResetDiscounts = () => {
    const resetPolicy: DiscountPolicyConfig = {
      zones: discountPolicy.zones.map((z) => ({ ...z, enabled: false, discountPercentage: 0 })),
      slots: discountPolicy.slots.map((s) => ({ ...s, enabled: false, discountPercentage: 0 })),
    };
    setDiscountPolicy(resetPolicy);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mitefree_discount_policy', JSON.stringify(resetPolicy));
    }
  };

  // Simulador de Cotización en Vivo (Admin Testing Tool - Valores Canónicos en RD$)
  const [simBasePrice, setSimBasePrice] = useState<number>(2500); // Matrimonial 1 lado / Mueble 3 plazas
  const [simMultiplier, setSimMultiplier] = useState<number>(1.0); // Sintética estándar
  const [simSurcharge, setSimSurcharge] = useState<number>(500); // Ambos lados o Mancha
  const [simCouponDiscount, setSimCouponDiscount] = useState<number>(0);
  const [simWallet, setSimWallet] = useState<number>(0);
  const [simSelectedZone, setSimSelectedZone] = useState<string>('ZONE-SPM');
  const [simSelectedSlot, setSimSelectedSlot] = useState<string>('MORNING');

  // Cálculo de descuento activo de Zona y Horario en el simulador
  const activeZoneObj = discountPolicy.zones.find((z) => z.zoneCode === simSelectedZone);
  const activeSlotObj = discountPolicy.slots.find((s) => s.slotCode === simSelectedSlot);

  const zoneDiscountPct = activeZoneObj?.enabled ? activeZoneObj.discountPercentage : 0;
  const slotDiscountPct = activeSlotObj?.enabled ? activeSlotObj.discountPercentage : 0;
  const totalCustomDiscountPct = zoneDiscountPct + slotDiscountPct;

  const simSubtotal = Math.round((simBasePrice * simMultiplier + simSurcharge) * 100) / 100;
  const simPromoDiscountAmount =
    Math.round(simSubtotal * (totalCustomDiscountPct / 100) * 100) / 100;
  const simTotalDiscounts = simPromoDiscountAmount + simCouponDiscount;
  const simAfterDiscount = Math.max(0, simSubtotal - simTotalDiscounts);
  const simTotal = Math.max(0, Math.round((simAfterDiscount - simWallet) * 100) / 100);
  const simDeposit = Math.round(simTotal * (depositRate / 100) * 100) / 100;
  const simRemaining = Math.round((simTotal - simDeposit) * 100) / 100;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApiClient.config.updateDiscounts(discountPolicy);
    } catch {
      // Ignorar si API offline
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('mitefree_discount_policy', JSON.stringify(discountPolicy));
    }
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

      {/* Interactive Zone & Slot Discount Customization Matrix */}
      <div className="admin-card rounded-2xl p-6 border border-brand-500/30 admin-glow-indigo space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-admin-border">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Personalización de Descuentos Dinámicos (Zonas y Horarios)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Controla y personaliza las promociones por territorio y bloque horario. Por defecto
              están en 0% (sin descuento).
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDiscounts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-semibold transition-all active:scale-95"
            title="Eliminar todos los descuentos y volver a 0%"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Todos los Descuentos (0%)</span>
          </button>
        </div>

        {/* 1. Descuentos por Zona Territorial */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Promociones por Zona Territorial</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {discountPolicy.zones.map((zone) => (
              <div
                key={zone.zoneCode}
                className={`p-4 rounded-xl border transition-all ${
                  zone.enabled && zone.discountPercentage > 0
                    ? 'bg-admin-card border-emerald-500/50 shadow-sm'
                    : 'bg-admin-sidebar border-admin-border opacity-90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">{zone.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-admin-sidebar text-gray-400 border border-admin-border">
                    {zone.zoneCode}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-admin-border/50">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={zone.enabled}
                      onChange={() => handleToggleZone(zone.zoneCode)}
                      className="w-4 h-4 rounded text-emerald-500 bg-admin-sidebar border-admin-border focus:ring-emerald-500"
                    />
                    <span className="text-xs text-gray-300">
                      {zone.enabled ? 'Activo' : 'Desactivado'}
                    </span>
                  </label>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      disabled={!zone.enabled}
                      value={zone.discountPercentage}
                      onChange={(e) =>
                        handleChangeZoneDiscount(zone.zoneCode, Number(e.target.value))
                      }
                      className={`w-14 px-2 py-1 rounded text-right font-mono text-xs font-bold ${
                        zone.enabled
                          ? 'bg-admin-sidebar border border-emerald-500/50 text-emerald-300'
                          : 'bg-admin-card border border-admin-border text-gray-500 cursor-not-allowed'
                      }`}
                    />
                    <span className="text-xs font-bold text-gray-400">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Descuentos por Bloque Horario */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>2. Promociones por Bloque Horario</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {discountPolicy.slots.map((slot) => (
              <div
                key={slot.slotCode}
                className={`p-4 rounded-xl border transition-all ${
                  slot.enabled && slot.discountPercentage > 0
                    ? 'bg-admin-card border-indigo-500/50 shadow-sm'
                    : 'bg-admin-sidebar border-admin-border opacity-90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">{slot.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-admin-sidebar text-gray-400 border border-admin-border">
                    {slot.slotCode}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-admin-border/50">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={slot.enabled}
                      onChange={() => handleToggleSlot(slot.slotCode)}
                      className="w-4 h-4 rounded text-indigo-500 bg-admin-sidebar border-admin-border focus:ring-indigo-500"
                    />
                    <span className="text-xs text-gray-300">
                      {slot.enabled ? 'Activo' : 'Desactivado'}
                    </span>
                  </label>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      disabled={!slot.enabled}
                      value={slot.discountPercentage}
                      onChange={(e) =>
                        handleChangeSlotDiscount(slot.slotCode, Number(e.target.value))
                      }
                      className={`w-14 px-2 py-1 rounded text-right font-mono text-xs font-bold ${
                        slot.enabled
                          ? 'bg-admin-sidebar border border-indigo-500/50 text-indigo-300'
                          : 'bg-admin-card border border-admin-border text-gray-500 cursor-not-allowed'
                      }`}
                    />
                    <span className="text-xs font-bold text-gray-400">%</span>
                  </div>
                </div>
              </div>
            ))}
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

        {/* Live Quotation Engine Simulator with Dynamic Custom Discounts */}
        <div className="admin-card rounded-2xl p-6 border border-indigo-500/30 admin-glow-indigo space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span>Simulador Algorítmico en Vivo (DDD — RD$)</span>
          </h3>

          <div className="space-y-2 text-xs">
            {/* Simulator Zone & Slot Selection */}
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-admin-border">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Zona a Evaluar:</label>
                <select
                  value={simSelectedZone}
                  onChange={(e) => setSimSelectedZone(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-admin-sidebar border border-admin-border text-white text-xs"
                >
                  {discountPolicy.zones.map((z) => (
                    <option key={z.zoneCode} value={z.zoneCode}>
                      {z.name} ({z.enabled ? `${z.discountPercentage}%` : '0%'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Horario a Evaluar:</label>
                <select
                  value={simSelectedSlot}
                  onChange={(e) => setSimSelectedSlot(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-admin-sidebar border border-admin-border text-white text-xs"
                >
                  {discountPolicy.slots.map((s) => (
                    <option key={s.slotCode} value={s.slotCode}>
                      {s.label} ({s.enabled ? `${s.discountPercentage}%` : '0%'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

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

            {/* Dynamic Zone/Slot Promo Discount Line */}
            <div className="flex justify-between items-center text-emerald-400">
              <span className="flex items-center gap-1">
                <span>Descuento Promocional:</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  {totalCustomDiscountPct}% OFF
                </span>
              </span>
              <span className="font-mono">
                {simPromoDiscountAmount > 0
                  ? `-RD$ ${simPromoDiscountAmount.toLocaleString('es-DO')}`
                  : 'RD$ 0'}
              </span>
            </div>

            {simCouponDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-400">
                <span>Descuento Cupón:</span>
                <span className="font-mono">-RD$ {simCouponDiscount.toLocaleString('es-DO')}</span>
              </div>
            )}

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
