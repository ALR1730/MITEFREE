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
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Trash2,
  Lock,
  Wallet,
  Clock,
  Download,
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
  {
    id: 'sofa-2',
    name: 'Sofá 2 Puestos (Loveseat)',
    basePrice: 75,
    iconText: '🛋️',
    category: 'Sala',
  },
  {
    id: 'sofa-3',
    name: 'Sofá 3 Puestos Estándar',
    basePrice: 100,
    iconText: '🛋️',
    category: 'Sala',
  },
  {
    id: 'sofa-l',
    name: 'Sofá Modular en L (4-5 puestos)',
    basePrice: 160,
    iconText: '🛋️',
    category: 'Sala',
  },
  {
    id: 'bed-queen',
    name: 'Colchón Queen Size',
    basePrice: 80,
    iconText: '🛏️',
    category: 'Dormitorio',
  },
  {
    id: 'bed-king',
    name: 'Colchón King Size',
    basePrice: 95,
    iconText: '🛏️',
    category: 'Dormitorio',
  },
  {
    id: 'dining-chair',
    name: 'Silla de Comedor Acolchada',
    basePrice: 18,
    iconText: '🪑',
    category: 'Comedor',
  },
];

const FABRIC_OPTIONS = [
  {
    id: 'SYNTHETIC',
    name: 'Sintética / Poliéster',
    multiplier: 1.0,
    desc: 'Fácil extracción, secado estándar',
  },
  {
    id: 'MICROFIBER',
    name: 'Microfibra / Gamuzina',
    multiplier: 1.15,
    desc: 'Tejido denso, retención moderada',
  },
  {
    id: 'LINEN',
    name: 'Lino Natural',
    multiplier: 1.2,
    desc: 'Fibra delicada, requiere pH neutro balanceado',
  },
  {
    id: 'VELVET',
    name: 'Terciopelo / Chenille',
    multiplier: 1.4,
    desc: 'Tratamiento especial anti-aplastamiento',
  },
  {
    id: 'LEATHER',
    name: 'Cuero / Piel Genuina',
    multiplier: 1.5,
    desc: 'Nutrición con bálsamo hidratante UV',
  },
];

const STAIN_OPTIONS = [
  { id: 'LIGHT', name: 'Leve / Mantenimiento', surcharge: 0, desc: 'Polvo habitual, uso diario' },
  {
    id: 'MODERATE',
    name: 'Moderada / Grasa o Comida',
    surcharge: 15,
    desc: 'Manchas visibles, marcas de sudor',
  },
  {
    id: 'CRITICAL',
    name: 'Crítica / Orina o Vómito',
    surcharge: 35,
    desc: 'Desinfección biológica enzimática especializada',
  },
];

export default function CotizadorPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureOption>(
    FURNITURE_OPTIONS[2]!,
  );
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[0]!);
  const [selectedStain, setSelectedStain] = useState(STAIN_OPTIONS[0]!);
  const [uploadedPhotos, setUploadedPhotos] = useState<
    Array<{ id: string; name: string; preview: string; size: string }>
  >([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [applyRouteDiscount, setApplyRouteDiscount] = useState<boolean>(false);
  const [useWalletCashback, setUseWalletCashback] = useState<boolean>(false);

  // Available Wallet Balance
  const walletBalanceAvailable = 15.0; // Mock de usuario autenticado

  // Canonical Pricing Formula (Pure QuotationPricingEngine)
  const basePrice = selectedFurniture.basePrice;
  const fabricMultiplier = selectedFabric.multiplier;
  const stainSurcharge = selectedStain.surcharge;
  const lineTotal = Math.round((basePrice * fabricMultiplier + stainSurcharge) * 100) / 100;
  const subtotal = lineTotal;

  // Política antifraude: Descuento de ruta (10%) vs Cupón no acumulables
  const routeDiscountAmount = applyRouteDiscount ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const discountApplied = Math.max(routeDiscountAmount, couponDiscount);
  const subtotalAfterDiscount = Math.max(0, subtotal - discountApplied);

  // Billetera cashback (Tope de salvaguarda financiera del 50% según LoyaltyPolicyEngine)
  const maxRedeemableCap = Math.round(subtotalAfterDiscount * 0.5 * 100) / 100;
  const walletCreditApplied = useWalletCashback
    ? Math.min(walletBalanceAvailable, maxRedeemableCap)
    : 0;

  const total = Math.max(0, Math.round((subtotalAfterDiscount - walletCreditApplied) * 100) / 100);
  const depositRequired = Math.round(total * 0.3 * 100) / 100; // 30% anticipo canónico
  const remainingBalance = Math.round((total - depositRequired) * 100) / 100; // 70% restante

  const handleApplyCoupon = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'ALRPROMO') {
      setCouponDiscount(15);
      setCouponApplied(true);
    } else if (code.startsWith('MITE-')) {
      // Código de Embajador / Referido: 10% de bienvenida
      const referralDisc = Math.round(subtotal * 0.1 * 100) / 100;
      setCouponDiscount(referralDisc);
      setCouponApplied(true);
    } else {
      alert('Código no reconocido. Prueba ALRPROMO ($15 USD) o el código de embajador MITE-ANGEL-2026 (10% OFF).');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]!;
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo no debe exceder los 5MB de tamaño máximo.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const newPhoto = {
      id: Math.random().toString(),
      name: file.name,
      preview: previewUrl,
      size: `${(file.size / 1024).toFixed(0)} KB`,
    };

    setUploadedPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDownloadPdf = () => {
    // Generación de presupuesto descargable
    const content = `MITEFREE PRESUPUESTO OFICIAL\nCódigo: COT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}\nValidez: Congelado por 7 días naturales\nPieza: ${selectedFurniture.name} ($${basePrice})\nTela: ${selectedFabric.name} (x${fabricMultiplier})\nMancha: ${selectedStain.name} (+$${stainSurcharge})\nSubtotal: $${subtotal.toFixed(2)} USD\nDescuento Aplicado: -$${discountApplied.toFixed(2)} USD\nBilletera Cashback: -$${walletCreditApplied.toFixed(2)} USD\nTOTAL: $${total.toFixed(2)} USD\nAnticipo de Reserva (30%): $${depositRequired.toFixed(2)} USD\nSaldo contra Servicio (70%): $${remainingBalance.toFixed(2)} USD\n\nALR COMPANY - División de Ingeniería de Software`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Presupuesto-Mitefree-${selectedFurniture.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Motor Algorítmico Canónico DDD · Fase 2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cotizador Inteligente de Precisión
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Cálculo determinista centavo a centavo. Precio congelado por 7 días.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        {[
          { num: 1, label: 'Mueble' },
          { num: 2, label: 'Tejido & Evidencia' },
          { num: 3, label: 'Presupuesto Oficial' },
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
            Elige la pieza principal a tratar. Se aplicará la tarifa base canónica del catálogo.
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

      {/* Step 2: Fabric, Stain & Photo Upload */}
      {currentStep === 2 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-dark-border animate-fadeIn space-y-8">
          {/* Fabric Type */}
          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-brand-400">2A.</span> Tipo de Tejido / Tapicería:
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
                    <span className="text-xs font-mono text-brand-400">
                      +{Math.round((fab.multiplier - 1) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{fab.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Stain Severity */}
          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-brand-400">2B.</span> Severidad de Manchas:
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Determina si se requiere formulación de enzimas bio-activas o tratamiento UV-C.
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

          {/* Photo Upload Pipeline (Cloudflare R2 Direct) */}
          <div className="p-5 rounded-xl bg-dark-surface/60 border border-dark-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>2C. Evidencia Fotográfica (Opcional - R2 Zero Egress)</span>
                </h3>
                <p className="text-[11px] text-gray-400">
                  Sube fotos de manchas críticas para diagnóstico previo del técnico.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Presigned URL 15m
              </span>
            </div>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-dark-border hover:border-brand-500/50 rounded-xl cursor-pointer bg-dark-bg/40 hover:bg-brand-500/5 transition-all">
              <UploadCloud className="w-8 h-8 text-brand-400 mb-2" />
              <span className="text-xs font-semibold text-gray-300">
                Haz clic o arrastra fotos aquí
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">
                PNG, JPG o WebP (Máx. 5MB por imagen)
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {uploadedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-lg overflow-hidden border border-dark-border bg-dark-bg"
                  >
                    <img
                      src={photo.preview}
                      alt={photo.name}
                      className="w-full h-20 object-cover"
                    />
                    <div className="p-1.5 flex justify-between items-center bg-dark-surface/90 text-[10px]">
                      <span className="truncate max-w-[80px] text-gray-300">{photo.name}</span>
                      <button
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Presupuesto Canónico MITEFREE</span>
                <Lock className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Precio congelado por 7 días calendario a partir de hoy</span>
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-brand-500/15 text-brand-400 text-xs font-semibold border border-brand-500/30">
              COT-2026-OFICIAL
            </span>
          </div>

          {/* Item details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-dark-border/30">
              <span className="text-gray-300">Pieza: {selectedFurniture.name}</span>
              <span className="font-mono text-white">${basePrice.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-border/30">
              <span className="text-gray-300">Factor Tela ({selectedFabric.name})</span>
              <span className="font-mono text-brand-400">×{fabricMultiplier.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-border/30">
              <span className="text-gray-300">Tratamiento Manchas ({selectedStain.name})</span>
              <span className="font-mono text-white">+${stainSurcharge.toFixed(2)} USD</span>
            </div>
            {discountApplied > 0 && (
              <div className="flex justify-between py-2 border-b border-dark-border/30 text-emerald-400">
                <span>
                  Descuento Aplicado (
                  {couponDiscount >= routeDiscountAmount ? 'Cupón ALRPROMO' : 'Promoción de Ruta'}
                  )
                </span>
                <span className="font-mono">-${discountApplied.toFixed(2)} USD</span>
              </div>
            )}
            {walletCreditApplied > 0 && (
              <div className="flex justify-between py-2 border-b border-dark-border/30 text-cyan-400">
                <span>Crédito Billetera Cashback</span>
                <span className="font-mono">-${walletCreditApplied.toFixed(2)} USD</span>
              </div>
            )}
          </div>

          {/* Promotional options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Coupon Input */}
            <div className="p-3.5 rounded-xl bg-dark-surface/60 border border-dark-border/60">
              <span className="text-xs font-semibold text-gray-300 block mb-2">
                Cupón Promocional:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ej: ALRPROMO"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={couponApplied}
                  className="flex-1 px-3 py-1.5 rounded-lg glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                  className="px-3 py-1.5 rounded-lg bg-dark-hover hover:bg-dark-border text-xs font-semibold text-brand-400 border border-dark-border"
                >
                  {couponApplied ? 'Aplicado' : 'Aplicar'}
                </button>
              </div>
            </div>

            {/* Wallet Cashback Toggle */}
            <div className="p-3.5 rounded-xl bg-dark-surface/60 border border-dark-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Billetera Cashback</span>
                </span>
                <p className="text-[11px] text-gray-400">
                  Saldo: ${walletBalanceAvailable.toFixed(2)} | Máx redimible (50%): ${maxRedeemableCap.toFixed(2)} USD
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUseWalletCashback(!useWalletCashback)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  useWalletCashback
                    ? 'bg-emerald-500 text-dark-bg'
                    : 'bg-dark-hover text-gray-300 border border-dark-border'
                }`}
              >
                {useWalletCashback ? 'Canjeado' : 'Canjear'}
              </button>
            </div>
          </div>

          {/* Total & Deposit Box */}
          <div className="p-5 rounded-xl bg-dark-surface/90 border border-brand-500/30 tech-glow space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-300">Total Liquidado:</span>
              <span className="text-2xl font-extrabold text-white font-mono">
                ${total.toFixed(2)} <span className="text-xs font-normal text-gray-400">USD</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-dark-border/60">
              <div className="p-2.5 rounded-lg bg-dark-bg/60 border border-brand-500/20">
                <span className="text-xs font-bold text-brand-400 block">
                  Anticipo Requerido (30%):
                </span>
                <span className="text-lg font-bold text-brand-400 font-mono">
                  ${depositRequired.toFixed(2)} USD
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">Reserva cuadrilla y vehículo</p>
              </div>

              <div className="p-2.5 rounded-lg bg-dark-bg/60 border border-dark-border/40">
                <span className="text-xs font-bold text-gray-300 block">
                  Saldo Restante (70%):
                </span>
                <span className="text-lg font-bold text-gray-200 font-mono">
                  ${remainingBalance.toFixed(2)} USD
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">Contra inspección de conformidad</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass-panel text-xs text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modificar</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF Oficial</span>
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
