'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Tag,
  ShieldAlert,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface FurnitureOption {
  id: string;
  name: string;
  basePrice: number;
  iconText: string;
  category: string;
}

const FURNITURE_OPTIONS: FurnitureOption[] = [
  { id: 'sofa-1', name: 'Sillón Individual', basePrice: 45, iconText: '🛋️', category: 'Sala' },
  { id: 'sofa-2', name: 'Sofá 2 Puestos (Loveseat)', basePrice: 75, iconText: '🛋️', category: 'Sala' },
  { id: 'sofa-3', name: 'Sofá 3 Puestos Estándar', basePrice: 100, iconText: '🛋️', category: 'Sala' },
  { id: 'sofa-l', name: 'Sofá Modular en L (4-5 puestos)', basePrice: 160, iconText: '🛋️', category: 'Sala' },
  { id: 'bed-queen', name: 'Colchón Queen Size', basePrice: 80, iconText: '🛏️', category: 'Dormitorio' },
  { id: 'bed-king', name: 'Colchón King Size', basePrice: 95, iconText: '🛏️', category: 'Dormitorio' },
  { id: 'dining-chair', name: 'Silla de Comedor Acolchada', basePrice: 18, iconText: '🪑', category: 'Comedor' },
];

const FABRIC_OPTIONS = [
  { id: 'SYNTHETIC', name: 'Sintética / Poliéster', multiplier: 1.0, desc: 'Fácil extracción, secado estándar' },
  { id: 'MICROFIBER', name: 'Microfibra / Gamuzina', multiplier: 1.1, desc: 'Tejido denso, retención moderada' },
  { id: 'LINEN', name: 'Lino Natural', multiplier: 1.25, desc: 'Fibra delicada, requiere pH neutro' },
  { id: 'VELVET', name: 'Terciopelo / Chenille', multiplier: 1.4, desc: 'Tratamiento especial anti-aplastamiento' },
  { id: 'LEATHER', name: 'Cuero / Piel Genuina', multiplier: 1.6, desc: 'Nutrición con bálsamo e hidratación' },
];

const STAIN_OPTIONS = [
  { id: 'LIGHT', name: 'Leve / Mantenimiento', surcharge: 0, desc: 'Polvo habitual, uso diario' },
  { id: 'MODERATE', name: 'Moderada / Grasa o Comida', surcharge: 15, desc: 'Manchas visibles, marcas de sudor' },
  { id: 'CRITICAL', name: 'Crítica / Orina o Vómito', surcharge: 35, desc: 'Desinfección biológica enzimática' },
];

export default function CotizadorPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureOption>(FURNITURE_OPTIONS[2]!);
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[0]!);
  const [selectedStain, setSelectedStain] = useState(STAIN_OPTIONS[0]!);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);

  // Canonical Pricing Formula (from domain-core)
  const basePrice = selectedFurniture.basePrice;
  const fabricMultiplier = selectedFabric.multiplier;
  const stainSurcharge = selectedStain.surcharge;
  const subtotal = Math.round((basePrice * fabricMultiplier + stainSurcharge) * 100) / 100;
  const total = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
  const depositRequired = Math.round(total * 0.3 * 100) / 100;

  const handleApplyCoupon = () => {
    if (promoCode.trim().toUpperCase() === 'ALRPROMO') {
      setDiscountAmount(15);
      setCouponApplied(true);
    } else {
      alert('Cupón no válido. Prueba usando ALRPROMO para $15 de descuento.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Motor Algorítmico Canónico DDD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cotizador Inteligente en 3 Pasos
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Transparencia absoluta. Sin sorpresas al momento del servicio.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        {[
          { num: 1, label: 'Mueble' },
          { num: 2, label: 'Tejido y Manchas' },
          { num: 3, label: 'Presupuesto' },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentStep >= s.num
                  ? 'bg-gradient-to-tr from-brand-600 to-cyan-500 text-dark-bg tech-glow'
                  : 'bg-dark-surface border border-dark-border text-gray-500'
              }`}
            >
              {s.num}
            </div>
            <span
              className={`text-[11px] font-medium mt-1.5 ${
                currentStep >= s.num ? 'text-brand-400' : 'text-gray-500'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Furniture Selection */}
      {currentStep === 1 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-dark-border animate-fadeIn">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-brand-400">1.</span> Selecciona el mueble a desinfectar:
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Elige el tipo y tamaño de la pieza principal. Podrás añadir piezas secundarias más adelante.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {FURNITURE_OPTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFurniture(f)}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                  selectedFurniture.id === f.id
                    ? 'border-brand-500 bg-brand-500/10 tech-glow text-white'
                    : 'border-dark-border bg-dark-surface/60 hover:border-dark-border hover:bg-dark-hover text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{f.iconText}</span>
                  <div>
                    <div className="font-semibold text-sm text-white">{f.name}</div>
                    <span className="text-xs text-gray-400">{f.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-brand-400">${f.basePrice}</span>
                  <span className="block text-[10px] text-gray-400">base USD</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-sm tech-glow active:scale-95 transition-transform"
            >
              <span>Continuar al Paso 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Fabric & Stain Condition */}
      {currentStep === 2 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-dark-border animate-fadeIn space-y-8">
          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-brand-400">2A.</span> Tipo de Tela / Tapicería:
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Cada fibra reacciona a diferentes temperaturas y tensioactivos biodegradables.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FABRIC_OPTIONS.map((fab) => (
                <button
                  key={fab.id}
                  onClick={() => setSelectedFabric(fab)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedFabric.id === fab.id
                      ? 'border-brand-500 bg-brand-500/10 tech-glow text-white'
                      : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-white">{fab.name}</span>
                    <span className="text-xs font-mono text-brand-400">+{Math.round((fab.multiplier - 1) * 100)}%</span>
                  </div>
                  <p className="text-xs text-gray-400">{fab.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-brand-400">2B.</span> Nivel de Suciedad o Manchas:
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Determina si se requiere formulación de enzimas bio-activas o tratamiento UV-C extendido.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {STAIN_OPTIONS.map((stain) => (
                <button
                  key={stain.id}
                  onClick={() => setSelectedStain(stain)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedStain.id === stain.id
                      ? 'border-brand-500 bg-brand-500/10 tech-glow text-white'
                      : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm text-white mb-1">{stain.name}</div>
                  <p className="text-xs text-gray-400 mb-2">{stain.desc}</p>
                  <span className="text-xs font-bold text-brand-400">
                    {stain.surcharge === 0 ? 'Sin recargo' : `+$${stain.surcharge} USD`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-dark-border/40">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-sm tech-glow active:scale-95 transition-transform"
            >
              <span>Ver Presupuesto Formal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Formal Breakdown & Booking Direct */}
      {currentStep === 3 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-dark-border animate-fadeIn space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border/60">
            <div>
              <h2 className="text-xl font-bold text-white">Tu Presupuesto Canónico</h2>
              <p className="text-xs text-gray-400">Válido durante los próximos 7 días naturales</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-brand-500/15 text-brand-400 text-xs font-semibold border border-brand-500/30">
              Cotización Formal
            </span>
          </div>

          {/* Item details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-dark-border/30">
              <span className="text-gray-300">Pieza: {selectedFurniture.name}</span>
              <span className="font-mono text-white">${basePrice.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-border/30">
              <span className="text-gray-300">Tela ({selectedFabric.name})</span>
              <span className="font-mono text-brand-400">×{fabricMultiplier.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-border/30">
              <span className="text-gray-300">Tratamiento Manchas ({selectedStain.name})</span>
              <span className="font-mono text-white">+${stainSurcharge.toFixed(2)} USD</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between py-2 border-b border-dark-border/30 text-emerald-400">
                <span>Cupón Promocional (ALRPROMO)</span>
                <span className="font-mono">-${discountAmount.toFixed(2)} USD</span>
              </div>
            )}
          </div>

          {/* Coupon Input */}
          {!couponApplied && (
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Código de cupón (ej: ALRPROMO)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-lg glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2.5 rounded-lg bg-dark-hover hover:bg-dark-border text-xs font-semibold text-brand-400 border border-dark-border"
              >
                Aplicar
              </button>
            </div>
          )}

          {/* Total & Deposit Box */}
          <div className="p-5 rounded-xl bg-dark-surface/90 border border-brand-500/30 tech-glow space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-300">Total del Servicio:</span>
              <span className="text-2xl font-extrabold text-white font-mono">${total.toFixed(2)} <span className="text-xs font-normal text-gray-400">USD</span></span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-dark-border/60">
              <div>
                <span className="text-xs font-bold text-brand-400">Anticipo Requerido (30%):</span>
                <p className="text-[11px] text-gray-400">El restante 70% se abona contra servicio aprobado</p>
              </div>
              <span className="text-lg font-bold text-brand-400 font-mono">${depositRequired.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl glass-panel text-sm text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modificar Configuración</span>
            </button>
            <Link
              href="/agenda"
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-sm tech-glow shadow-lg active:scale-95 transition-transform"
            >
              <span>Continuar a Selección de Horario</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
