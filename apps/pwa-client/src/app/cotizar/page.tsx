'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import type { FabricType, StainSeverity } from '@mitefree/shared-types';
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
  Plus,
  Minus,
  MessageCircle,
  ShoppingCart,
  Check,
  MapPin,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';

export interface CatalogItem {
  id: string;
  name: string;
  category: 'Colchones' | 'Muebles de Sala' | 'Sillas de Comedor' | 'Alfombras';
  basePrice: number;
  bothSidesPrice?: number;
  iconText: string;
  subtitle: string;
  isMattress?: boolean;
  isSofaModular?: boolean;
  isChair?: boolean;
  isRug?: boolean;
  dimensions?: string;
  isCustomRug?: boolean;
}

export interface SelectedQuoteItem {
  cartId: string;
  catalogId: string;
  name: string;
  category: 'Colchones' | 'Muebles de Sala' | 'Sillas de Comedor' | 'Alfombras';
  iconText: string;
  bothSides: boolean;
  extraSeats: number;
  rugDimensions?: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

const CATALOG_ITEMS: CatalogItem[] = [
  // 1. Lavado de Colchones (Flyer oficial Mitefree)
  {
    id: 'mat-full',
    name: 'Colchón Matrimonial (Full)',
    category: 'Colchones',
    basePrice: 2500,
    bothSidesPrice: 3000,
    iconText: '🛏️',
    isMattress: true,
    subtitle: '1 lado RD$ 2,500 · Ambos lados RD$ 3,000',
  },
  {
    id: 'mat-queen',
    name: 'Colchón Queen Size',
    category: 'Colchones',
    basePrice: 3000,
    bothSidesPrice: 3500,
    iconText: '🛏️',
    isMattress: true,
    subtitle: '1 lado RD$ 3,000 · Ambos lados RD$ 3,500',
  },
  {
    id: 'mat-king',
    name: 'Colchón King Size',
    category: 'Colchones',
    basePrice: 3500,
    bothSidesPrice: 4000,
    iconText: '🛏️',
    isMattress: true,
    subtitle: '1 lado RD$ 3,500 · Ambos lados RD$ 4,000',
  },

  // 2. Muebles de Sala (Flyer oficial Mitefree)
  {
    id: 'sofa-1',
    name: 'Mueble 1 Plaza (Sillón)',
    category: 'Muebles de Sala',
    basePrice: 1500,
    iconText: '🛋️',
    subtitle: 'Tarifa estándar RD$ 1,500',
  },
  {
    id: 'sofa-2',
    name: 'Mueble 2 Plazas (Love Seat)',
    category: 'Muebles de Sala',
    basePrice: 2000,
    iconText: '🛋️',
    subtitle: 'Tarifa estándar RD$ 2,000',
  },
  {
    id: 'sofa-3',
    name: 'Mueble 3 Plazas',
    category: 'Muebles de Sala',
    basePrice: 2500,
    iconText: '🛋️',
    subtitle: 'Tarifa estándar RD$ 2,500',
  },
  {
    id: 'sofa-4',
    name: 'Mueble 4 Plazas',
    category: 'Muebles de Sala',
    basePrice: 3000,
    iconText: '🛋️',
    subtitle: 'Tarifa estándar RD$ 3,000',
  },
  {
    id: 'sofa-5',
    name: 'Mueble 5 Plazas (Modular en L)',
    category: 'Muebles de Sala',
    basePrice: 3500,
    iconText: '🛋️',
    isSofaModular: true,
    subtitle: 'Base 5 plazas RD$ 3,500 (+RD$ 500 c/u extra)',
  },

  // 3. Sillas de Comedor (Flyer oficial Mitefree)
  {
    id: 'dining-chair',
    name: 'Sillas de Comedor',
    category: 'Sillas de Comedor',
    basePrice: 300,
    iconText: '🪑',
    isChair: true,
    subtitle: 'RD$ 300 cada una',
  },

  // 4. Lavado y Desinfección de Alfombras (Diferentes Longitudes & Medidas)
  {
    id: 'rug-small',
    name: 'Alfombra Pequeña / Pie de Cama',
    category: 'Alfombras',
    basePrice: 600,
    iconText: '🧶',
    isRug: true,
    dimensions: 'Hasta 1.50m × 0.80m (~1.2 m²)',
    subtitle: 'Ideal para pasillo o pie de cama (RD$ 600)',
  },
  {
    id: 'rug-medium',
    name: 'Alfombra Mediana (Área / Sala)',
    category: 'Alfombras',
    basePrice: 1200,
    iconText: '🧶',
    isRug: true,
    dimensions: '2.00m × 1.50m (~3.0 m²)',
    subtitle: 'Área común o sala estándar (RD$ 1,200)',
  },
  {
    id: 'rug-large',
    name: 'Alfombra Grande (Sala Principal)',
    category: 'Alfombras',
    basePrice: 1800,
    iconText: '🧶',
    isRug: true,
    dimensions: '2.50m × 2.00m (~5.0 m²)',
    subtitle: 'Sala principal o comedor formal (RD$ 1,800)',
  },
  {
    id: 'rug-xlarge',
    name: 'Alfombra Extra Grande / Salón',
    category: 'Alfombras',
    basePrice: 2500,
    iconText: '🧶',
    isRug: true,
    dimensions: '3.00m × 2.50m (~7.5 m²)',
    subtitle: 'Salones amplios o áreas ejecutivas (RD$ 2,500)',
  },
  {
    id: 'rug-custom',
    name: 'Alfombra por Longitud Personalizada',
    category: 'Alfombras',
    basePrice: 300, // RD$ 300 por m²
    iconText: '📏',
    isRug: true,
    isCustomRug: true,
    subtitle: 'Ajusta largo y ancho en metros (RD$ 300 / m²)',
  },
];

const FABRIC_OPTIONS = [
  {
    id: 'SYNTHETIC',
    name: 'Sintética / Estándar',
    multiplier: 1.0,
    desc: 'Fácil extracción, secado acelerado en pocas horas',
  },
  {
    id: 'MICROFIBER',
    name: 'Microfibra / Gamuzina',
    multiplier: 1.0,
    desc: 'Tejido denso suave, tratamiento profundo con cepillado',
  },
  {
    id: 'LINEN',
    name: 'Lino Natural',
    multiplier: 1.15,
    desc: 'Fibra delicada, pH neutro balanceado',
  },
  {
    id: 'VELVET',
    name: 'Terciopelo / Chenille / Lana',
    multiplier: 1.25,
    desc: 'Tratamiento especial anti-aplastamiento de hebras',
  },
  {
    id: 'LEATHER',
    name: 'Cuero / Piel Genuina',
    multiplier: 1.35,
    desc: 'Nutrición con bálsamo hidratante anti-grietas',
  },
];

const STAIN_OPTIONS = [
  {
    id: 'LIGHT',
    name: 'Leve / Mantenimiento',
    surcharge: 0,
    desc: 'Polvo acumulado, ácaros habituales y uso diario preventivo',
  },
  {
    id: 'MODERATE',
    name: 'Moderada / Grasa o Comida',
    surcharge: 300,
    desc: 'Manchas visibles, marcas de sudor o derrame de bebidas',
  },
  {
    id: 'CRITICAL',
    name: 'Crítica / Orina o Vómito',
    surcharge: 500,
    desc: 'Desinfección biológica profunda con enzimas bio-activas y UV-C',
  },
];

export default function CotizadorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmittingQuotation, setIsSubmittingQuotation] = useState<boolean>(false);
  const [persistedQuotationId, setPersistedQuotationId] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<
    'TODOS' | 'Colchones' | 'Muebles de Sala' | 'Sillas de Comedor' | 'Alfombras'
  >('TODOS');

  // Carrito multi-item de artículos seleccionados
  const [selectedItems, setSelectedItems] = useState<SelectedQuoteItem[]>([
    {
      cartId: 'item-initial-queen',
      catalogId: 'mat-queen',
      name: 'Colchón Queen Size',
      category: 'Colchones',
      iconText: '🛏️',
      bothSides: false,
      extraSeats: 0,
      quantity: 1,
      unitPrice: 3000,
      itemTotal: 3000,
    },
  ]);

  // Estados locales temporales para configurar artículos antes de añadirlos
  const [tempBothSides, setTempBothSides] = useState<Record<string, boolean>>({});
  const [tempExtraSeats, setTempExtraSeats] = useState<Record<string, number>>({});
  const [tempQuantity, setTempQuantity] = useState<Record<string, number>>({});

  // Medidas dinámicas para alfombra personalizada
  const [customLength, setCustomLength] = useState<number>(2.5); // metros
  const [customWidth, setCustomWidth] = useState<number>(2.0); // metros

  // Paso 2: Tejido, manchas y fotos
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[0]!);
  const [selectedStain, setSelectedStain] = useState(STAIN_OPTIONS[0]!);
  const [uploadedPhotos, setUploadedPhotos] = useState<
    Array<{ id: string; name: string; preview: string; size: string }>
  >([]);

  // Paso 3: Promociones y Billetera
  const [promoCode, setPromoCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [useWalletCashback, setUseWalletCashback] = useState<boolean>(false);

  // Saldo mock de billetera en RD$
  const walletBalanceAvailable = 500.0;

  const formatRD = (amount: number) => `RD$ ${Math.round(amount).toLocaleString('es-DO')}`;

  // Helper para calcular precio unitario de un artículo del catálogo según sus opciones
  const calculateCatalogUnitPrice = (
    item: CatalogItem,
    bothSides: boolean,
    extraSeats: number,
    cLength: number,
    cWidth: number,
  ): number => {
    if (item.isMattress) {
      return bothSides ? item.bothSidesPrice || item.basePrice + 500 : item.basePrice;
    }
    if (item.isSofaModular) {
      return item.basePrice + extraSeats * 500;
    }
    if (item.isCustomRug) {
      const area = Math.round(cLength * cWidth * 10) / 10;
      return Math.round(area * item.basePrice);
    }
    return item.basePrice;
  };

  // Agregar artículo al carrito
  const handleAddItem = (item: CatalogItem) => {
    const bothSides = tempBothSides[item.id] ?? false;
    const extraSeats = tempExtraSeats[item.id] ?? 0;
    const qty = tempQuantity[item.id] ?? (item.isChair ? 4 : 1);

    const unitPrice = calculateCatalogUnitPrice(
      item,
      bothSides,
      extraSeats,
      customLength,
      customWidth,
    );
    const itemTotal = unitPrice * qty;

    let rugDimStr: string | undefined = item.dimensions;
    let displayName = item.name;

    if (item.isCustomRug) {
      const area = (customLength * customWidth).toFixed(1);
      rugDimStr = `${customLength.toFixed(1)}m × ${customWidth.toFixed(1)}m (~${area} m²)`;
      displayName = `Alfombra Personalizada (${rugDimStr})`;
    }

    const newItem: SelectedQuoteItem = {
      cartId: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      catalogId: item.id,
      name: displayName,
      category: item.category,
      iconText: item.iconText,
      bothSides,
      extraSeats,
      rugDimensions: rugDimStr,
      quantity: qty,
      unitPrice,
      itemTotal,
    };

    setSelectedItems((prev) => [...prev, newItem]);

    // Resetear temporal del item
    setTempQuantity((prev) => ({ ...prev, [item.id]: item.isChair ? 4 : 1 }));
  };

  // Modificar cantidad de un ítem ya en el carrito
  const handleUpdateItemQuantity = (cartId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = Math.max(1, item.quantity + delta);
            return {
              ...item,
              quantity: newQty,
              itemTotal: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  // Eliminar un ítem del carrito
  const handleRemoveItem = (cartId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Regla Canónica de Negocio DDD: Consumo Mínimo para Despacho a Domicilio
  const MIN_DOMICILE_ORDER_RD = 1500;
  const itemsSubtotal = selectedItems.reduce((acc, curr) => acc + curr.itemTotal, 0);
  const totalItemsCount = selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const isMinimumOrderMet = itemsSubtotal >= MIN_DOMICILE_ORDER_RD;
  const amountMissingForMinimum = Math.max(0, MIN_DOMICILE_ORDER_RD - itemsSubtotal);
  const minProgressPercentage = Math.min(
    100,
    Math.round((itemsSubtotal / MIN_DOMICILE_ORDER_RD) * 100),
  );

  const fabricMultiplier = selectedFabric.multiplier;
  const stainSurcharge = selectedStain.surcharge;

  // Subtotal base con factor de tejido y recargo de mancha
  const subtotalWithFabric = Math.round(
    itemsSubtotal * fabricMultiplier + (selectedItems.length > 0 ? stainSurcharge : 0),
  );

  // Descuentos aplicados
  const discountApplied = couponDiscount;
  const subtotalAfterDiscount = Math.max(0, subtotalWithFabric - discountApplied);

  // Billetera cashback (tope de salvaguarda 50%)
  const maxRedeemableCap = Math.round(subtotalAfterDiscount * 0.5);
  const walletCreditApplied = useWalletCashback
    ? Math.min(walletBalanceAvailable, maxRedeemableCap)
    : 0;

  // Total definitivo sin anticipo (piso mínimo garantizado de RD$ 1,500 para visita a domicilio)
  const total =
    selectedItems.length > 0
      ? Math.max(MIN_DOMICILE_ORDER_RD, Math.max(0, subtotalAfterDiscount - walletCreditApplied))
      : 0;

  const handleApplyCoupon = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'ALRPROMO') {
      setCouponDiscount(300);
      setCouponApplied(true);
    } else if (code.startsWith('MITE-')) {
      const referralDisc = Math.round(subtotalWithFabric * 0.1);
      setCouponDiscount(referralDisc);
      setCouponApplied(true);
    } else {
      alert(
        'Código no reconocido. Prueba ALRPROMO (RD$ 300 OFF) o el código de embajador MITE-ANGEL-2026 (10% OFF).',
      );
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

  const downloadFallbackTxt = () => {
    const itemsLines = selectedItems
      .map(
        (it) =>
          `• ${it.quantity}x ${it.name} ${it.bothSides ? '(Ambos Lados)' : it.category === 'Colchones' ? '(1 Solo Lado)' : ''} ${it.extraSeats > 0 ? `(+${it.extraSeats} plazas extra)` : ''} ${it.rugDimensions ? `[Dim: ${it.rugDimensions}]` : ''}: ${formatRD(it.itemTotal)}`,
      )
      .join('\n');

    const content = `=====================================================
MITEFREE — PRESUPUESTO OFICIAL DE SERVICIO
Tel / WhatsApp: (809) 513-4773
Código: COT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}
Fecha: ${new Date().toLocaleDateString('es-DO')}
Validez: Congelado por 7 días calendario
=====================================================

ARTÍCULOS INCLUIDOS EN LA ORDEN:
${itemsLines}

-----------------------------------------------------
Subtotal de Piezas: ${formatRD(itemsSubtotal)}
Tipo de Tapicería / Fibra: ${selectedFabric.name} (x${fabricMultiplier})
Tratamiento Manchas: ${selectedStain.name} (+${formatRD(stainSurcharge)})
Descuento Aplicado: -${formatRD(discountApplied)}
Billetera Cashback: -${formatRD(walletCreditApplied)}
-----------------------------------------------------
TOTAL FINAL A PAGAR: ${formatRD(total)} DOP
CONDICIÓN DE PAGO: 100% AL FINALIZAR EL SERVICIO (SIN ANTICIPO)
-----------------------------------------------------

COBERTURA EXCLUSIVA:
- San Pedro de Macorís (y todos sus municipios)
- La Romana (y todos sus municipios)
- Santo Domingo Este

ALR COMPANY — División de Ingeniería de Software`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Presupuesto-Mitefree-MultiItem.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Construcción del presupuesto oficial en PDF vía Core WebAPI (con fallback local)
  const handleDownloadPdf = async () => {
    if (persistedQuotationId) {
      window.open(apiClient.quotations.getPdfUrl(persistedQuotationId), '_blank');
      return;
    }

    try {
      const quotationPayload = {
        clientId: 'a0000000-0000-0000-0000-000000000001',
        items: selectedItems.map((item) => ({
          furnitureType: item.name,
          fabricType: selectedFabric.id as FabricType,
          stainSeverity: selectedStain.id as StainSeverity,
          basePriceAmount: item.unitPrice,
          photoUrls: [],
          additionalServices: [],
        })),
        routeDiscountAmount: 0,
        couponCode: couponApplied ? promoCode : undefined,
        couponDiscountAmount: couponDiscount,
        walletBalanceAvailable: useWalletCashback ? walletCreditApplied : 0,
        currency: 'DOP',
      };

      const res = await apiClient.quotations.create(quotationPayload);
      if (res.success) {
        setPersistedQuotationId(res.data.id);
        window.open(apiClient.quotations.getPdfUrl(res.data.id), '_blank');
        return;
      }
    } catch {
      // Fallback a descarga de texto plano
    }

    downloadFallbackTxt();
  };

  // Enviar cotización al Core API y navegar a Agenda con quotationId
  const handleProceedToSchedule = async () => {
    setIsSubmittingQuotation(true);
    try {
      const quotationPayload = {
        clientId: 'a0000000-0000-0000-0000-000000000001',
        items: selectedItems.map((item) => ({
          furnitureType: item.name,
          fabricType: selectedFabric.id as FabricType,
          stainSeverity: selectedStain.id as StainSeverity,
          basePriceAmount: item.unitPrice,
          photoUrls: [],
          additionalServices: [],
        })),
        routeDiscountAmount: 0,
        couponCode: couponApplied ? promoCode : undefined,
        couponDiscountAmount: couponDiscount,
        walletBalanceAvailable: useWalletCashback ? walletCreditApplied : 0,
        currency: 'DOP',
      };

      const res = await apiClient.quotations.create(quotationPayload);
      if (res.success) {
        setPersistedQuotationId(res.data.id);
        router.push(
          `/agenda?quotationId=${res.data.id}&total=${res.data.total}&deposit=${res.data.depositRequired}`,
        );
        return;
      }
    } catch {
      // Fallback a navegación con parámetros query
    } finally {
      setIsSubmittingQuotation(false);
    }

    router.push(`/agenda?total=${total}&deposit=${Math.round(total * 0.3)}`);
  };

  // Generador de mensaje de WhatsApp con desglose multi-item y alfombras
  const generateWhatsAppMessage = () => {
    const itemsList = selectedItems
      .map(
        (it) =>
          `• ${it.quantity}x ${it.name}${it.bothSides ? ' (Ambos Lados)' : ''}${it.extraSeats > 0 ? ` (+${it.extraSeats} plazas)` : ''}${it.rugDimensions ? ` [${it.rugDimensions}]` : ''} -> ${formatRD(it.itemTotal)}`,
      )
      .join('\n');

    const msg = `¡Hola MITEFREE! Deseo solicitar el servicio de limpieza y desinfección para las siguientes piezas:

${itemsList}

• Tejido/Fibra: ${selectedFabric.name}
• Manchas: ${selectedStain.name}
• Total Estimado: ${formatRD(total)} DOP
• Modalidad: Pago 100% al finalizar (Sin anticipo)

Por favor confírmenme disponibilidad para mi zona (San Pedro / La Romana / Santo Domingo Este).`;

    return encodeURIComponent(msg);
  };

  const filteredCatalog = CATALOG_ITEMS.filter((item) => {
    if (activeCategoryTab === 'TODOS') return true;
    return item.category === activeCategoryTab;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Servicio a Domicilio Exclusivo · Mínimo RD$ 1,500 · Sin Anticipo</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cotizador Inteligente Multi-Pieza
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl mx-auto">
          Agrega varios colchones, muebles, sillas y alfombras de cualquier longitud en una misma
          cotización. Consumo mínimo para despacho técnico a domicilio: <strong>RD$ 1,500</strong>.
          Pagas el 100% al finalizar.
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-cyan-400">
          <MapPin className="w-3.5 h-3.5" />
          <span>Cobertura: San Pedro de Macorís, La Romana y Santo Domingo Este</span>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-8 max-w-sm mx-auto px-2">
        {[
          { num: 1, label: 'Piezas' },
          { num: 2, label: 'Tejido & Manchas' },
          { num: 3, label: 'Resumen' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                  currentStep >= s.num
                    ? 'bg-brand-500 text-dark-bg tech-glow'
                    : 'bg-dark-surface border border-dark-border text-gray-500'
                }`}
              >
                {s.num}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-medium mt-1 text-center whitespace-nowrap ${
                  currentStep >= s.num ? 'text-brand-400 font-bold' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-4 transition-colors ${
                  currentStep > s.num ? 'bg-brand-500' : 'bg-dark-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ================= STEP 1: MULTI-ITEM SELECTION ================= */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary / Cart Floating Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-dark-surface/90 border border-brand-500/40 tech-glow space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Tu Pedido Actual:</span>
                  <span className="text-base sm:text-lg font-extrabold text-white">
                    {totalItemsCount}{' '}
                    {totalItemsCount === 1 ? 'pieza seleccionada' : 'piezas seleccionadas'} ·{' '}
                    <span className="text-brand-400 font-mono">{formatRD(itemsSubtotal)}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      alert(
                        'Por favor agrega al menos un mueble, colchón o alfombra a tu cotización.',
                      );
                      return;
                    }
                    if (!isMinimumOrderMet) {
                      alert(
                        `El servicio a domicilio requiere un consumo mínimo de RD$ 1,500 para cubrir el traslado de la unidad móvil y cuadrilla técnica. Te faltan RD$ ${amountMissingForMinimum.toLocaleString('es-DO')} (puedes agregar sillas de comedor por RD$ 300 o una alfombra pequeña por RD$ 600).`,
                      );
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  disabled={!isMinimumOrderMet}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                    isMinimumOrderMet
                      ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg tech-glow shadow-md active:scale-95'
                      : 'bg-dark-surface border border-dark-border text-gray-400 cursor-not-allowed opacity-80'
                  }`}
                >
                  <span>
                    {isMinimumOrderMet
                      ? `Continuar (${totalItemsCount} piezas)`
                      : `Mínimo RD$ 1,500 (Faltan ${formatRD(amountMissingForMinimum)})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Minimum Order Threshold Status Banner */}
            {selectedItems.length > 0 && !isMinimumOrderMet && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Condición de Visita a Domicilio:</strong> El consumo mínimo para
                    despacho de unidad es de <strong>RD$ 1,500</strong>. Te faltan{' '}
                    <strong>{formatRD(amountMissingForMinimum)}</strong> en piezas.
                  </span>
                </div>
                <div className="w-full sm:w-36 bg-dark-bg h-2 rounded-full overflow-hidden border border-amber-500/30 shrink-0">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-brand-400 h-full transition-all duration-300"
                    style={{ width: `${minProgressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {isMinimumOrderMet && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs flex items-center gap-2 text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>¡Mínimo de Visita a Domicilio Alcanzado!</strong> Tu orden califica para
                  el traslado de la cuadrilla técnica sin anticipo.
                </span>
              </div>
            )}
          </div>

          {/* List of currently selected items in the cart */}
          {selectedItems.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-dark-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-dark-border/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Artículos en tu Cotización ({selectedItems.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedItems([])}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Vaciar selección</span>
                </button>
              </div>

              <div className="divide-y divide-dark-border/40">
                {selectedItems.map((item) => (
                  <div
                    key={item.cartId}
                    className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xl shrink-0">{item.iconText}</span>
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="font-bold text-white text-sm flex flex-wrap items-center gap-2">
                          <span className="truncate">{item.name}</span>
                          {item.bothSides && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/40">
                              Ambos Lados
                            </span>
                          )}
                          {item.extraSeats > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              +{item.extraSeats} Plazas
                            </span>
                          )}
                          {item.rugDimensions && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              {item.rugDimensions}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {formatRD(item.unitPrice)} c/u
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      {/* Quantity counter */}
                      <div className="flex items-center gap-2 bg-dark-bg/80 border border-dark-border rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(item.cartId, -1)}
                          className="w-6 h-6 rounded bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-white font-mono text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(item.cartId, 1)}
                          className="w-6 h-6 rounded bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Subtotal of this item */}
                      <span className="font-mono font-bold text-brand-400 text-sm min-w-[90px] text-right">
                        {formatRD(item.itemTotal)}
                      </span>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.cartId)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        title="Eliminar de la cotización"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Catalog Tabs (Mobile app swipeable pills) */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap sm:flex-wrap w-full">
            {(
              ['TODOS', 'Colchones', 'Muebles de Sala', 'Sillas de Comedor', 'Alfombras'] as const
            ).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategoryTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  activeCategoryTab === tab
                    ? 'bg-brand-500 text-dark-bg tech-glow'
                    : 'bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:bg-dark-hover'
                }`}
              >
                {tab === 'TODOS' ? 'Ver Todo el Catálogo' : tab}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCatalog.map((product) => {
              const isBothSides = tempBothSides[product.id] ?? false;
              const extraSeats = tempExtraSeats[product.id] ?? 0;
              const qty = tempQuantity[product.id] ?? (product.isChair ? 4 : 1);
              const unitPrice = calculateCatalogUnitPrice(
                product,
                isBothSides,
                extraSeats,
                customLength,
                customWidth,
              );
              const previewTotal = unitPrice * qty;

              return (
                <div
                  key={product.id}
                  className="glass-card rounded-2xl p-5 border border-dark-border hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-dark-surface border border-dark-border">
                          {product.iconText}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base">{product.name}</h4>
                            {product.category === 'Alfombras' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
                                Alfombra
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{product.subtitle}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-brand-400 shrink-0">
                        {product.isCustomRug
                          ? `${formatRD(unitPrice)}`
                          : formatRD(product.basePrice)}
                      </span>
                    </div>

                    {/* Dimension badge for standard rugs */}
                    {product.isRug && product.dimensions && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-bg/60 border border-dark-border text-[11px] text-cyan-300 font-mono">
                        <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Dimensiones: {product.dimensions}</span>
                      </div>
                    )}

                    {/* Modificador: Ambos lados para colchones */}
                    {product.isMattress && (
                      <div className="mt-3 p-2.5 rounded-xl bg-dark-bg/60 border border-dark-border/80 flex items-center justify-between text-xs">
                        <span className="text-gray-300">¿Lavar ambos lados?</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setTempBothSides((prev) => ({ ...prev, [product.id]: false }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              !isBothSides
                                ? 'bg-brand-500 text-dark-bg font-bold'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            1 Lado
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setTempBothSides((prev) => ({ ...prev, [product.id]: true }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              isBothSides
                                ? 'bg-brand-500 text-dark-bg font-bold tech-glow'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            Ambos (+RD$ 500)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Modificador: Plazas modulares en L */}
                    {product.isSofaModular && (
                      <div className="mt-3 p-2.5 rounded-xl bg-dark-bg/60 border border-dark-border/80 flex items-center justify-between text-xs">
                        <span className="text-gray-300">Plazas adicionales:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setTempExtraSeats((prev) => ({
                                ...prev,
                                [product.id]: Math.max(0, extraSeats - 1),
                              }))
                            }
                            className="w-6 h-6 rounded bg-dark-surface border border-dark-border text-white flex items-center justify-center hover:bg-dark-hover"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-brand-400">
                            {extraSeats}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setTempExtraSeats((prev) => ({
                                ...prev,
                                [product.id]: extraSeats + 1,
                              }))
                            }
                            className="w-6 h-6 rounded bg-dark-surface border border-dark-border text-white flex items-center justify-center hover:bg-dark-hover"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] text-gray-500 font-mono">
                            (+RD$ 500 c/u)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Modificador: Alfombra de Longitud Personalizada (Largo x Ancho) */}
                    {product.isCustomRug && (
                      <div className="mt-3 p-3 rounded-xl bg-dark-bg/80 border border-cyan-500/30 space-y-2.5 text-xs">
                        <span className="text-white font-bold block flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Especificar Longitudes de la Alfombra:</span>
                        </span>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Selector de Largo */}
                          <div className="p-2 rounded-lg bg-dark-surface border border-dark-border space-y-1">
                            <span className="text-[11px] text-gray-400 block">Largo (m):</span>
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomLength(
                                    Math.max(1.0, Math.round((customLength - 0.5) * 10) / 10),
                                  )
                                }
                                className="w-6 h-6 rounded bg-dark-bg hover:bg-dark-hover text-white flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono font-bold text-cyan-300 text-sm">
                                {customLength.toFixed(1)} m
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomLength(
                                    Math.min(10.0, Math.round((customLength + 0.5) * 10) / 10),
                                  )
                                }
                                className="w-6 h-6 rounded bg-dark-bg hover:bg-dark-hover text-white flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Selector de Ancho */}
                          <div className="p-2 rounded-lg bg-dark-surface border border-dark-border space-y-1">
                            <span className="text-[11px] text-gray-400 block">Ancho (m):</span>
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomWidth(
                                    Math.max(0.5, Math.round((customWidth - 0.5) * 10) / 10),
                                  )
                                }
                                className="w-6 h-6 rounded bg-dark-bg hover:bg-dark-hover text-white flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono font-bold text-cyan-300 text-sm">
                                {customWidth.toFixed(1)} m
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomWidth(
                                    Math.min(6.0, Math.round((customWidth + 0.5) * 10) / 10),
                                  )
                                }
                                className="w-6 h-6 rounded bg-dark-bg hover:bg-dark-hover text-white flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Calculo de m2 */}
                        <div className="flex justify-between items-center pt-1 border-t border-dark-border/40 text-[11px]">
                          <span className="text-gray-400">
                            Superficie calculada:{' '}
                            <b className="text-white font-mono">
                              {(customLength * customWidth).toFixed(1)} m²
                            </b>
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {formatRD(unitPrice)} unitario
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selector de cantidad y Botón de Añadir */}
                  <div className="pt-3 border-t border-dark-border/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Cantidad:</span>
                      <div className="flex items-center gap-1.5 bg-dark-surface border border-dark-border rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() =>
                            setTempQuantity((prev) => ({
                              ...prev,
                              [product.id]: Math.max(1, qty - 1),
                            }))
                          }
                          className="w-6 h-6 rounded hover:bg-dark-hover text-white flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-white text-xs">{qty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setTempQuantity((prev) => ({
                              ...prev,
                              [product.id]: qty + 1,
                            }))
                          }
                          className="w-6 h-6 rounded hover:bg-dark-hover text-white flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddItem(product)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500/15 hover:bg-brand-500 text-brand-300 hover:text-dark-bg font-bold text-xs border border-brand-500/30 hover:tech-glow transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar ({formatRD(previewTotal)})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                if (selectedItems.length === 0) {
                  alert('Por favor agrega al menos un mueble, colchón o alfombra a tu cotización.');
                  return;
                }
                if (!isMinimumOrderMet) {
                  alert(
                    `El servicio a domicilio requiere un consumo mínimo de RD$ 1,500 para cubrir el traslado de la unidad móvil y cuadrilla técnica. Te faltan RD$ ${amountMissingForMinimum.toLocaleString('es-DO')} (puedes agregar sillas de comedor por RD$ 300 o una alfombra pequeña por RD$ 600).`,
                  );
                  return;
                }
                setCurrentStep(2);
              }}
              disabled={!isMinimumOrderMet}
              className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm transition-all ${
                isMinimumOrderMet
                  ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg tech-glow shadow-lg active:scale-95'
                  : 'bg-dark-surface border border-dark-border text-gray-400 cursor-not-allowed opacity-80'
              }`}
            >
              <span>
                {isMinimumOrderMet
                  ? `Continuar con ${totalItemsCount} Piezas (${formatRD(itemsSubtotal)})`
                  : `Mínimo RD$ 1,500 a Domicilio (Faltan ${formatRD(amountMissingForMinimum)})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: FABRIC & STAINS ================= */}
      {currentStep === 2 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-dark-border animate-fadeIn space-y-8">
          {/* Summary of items in step 2 */}
          <div className="p-4 rounded-xl bg-dark-surface/60 border border-dark-border/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-400 block">Artículos seleccionados:</span>
              <span className="font-bold text-white text-sm">
                {totalItemsCount} piezas (
                {selectedItems
                  .map(
                    (i) =>
                      `${i.quantity}x ${i.name}${i.rugDimensions ? ` [${i.rugDimensions}]` : ''}`,
                  )
                  .join(', ')}
                )
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-brand-400 hover:underline font-semibold"
            >
              Editar piezas
            </button>
          </div>

          {/* Fabric Type */}
          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-brand-400">2A.</span> Tipo de Tejido / Tapicería Predominante:
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Cada fibra reacciona a diferentes temperaturas y tensioactivos biodegradables
              específicos.
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
              Determina si se requiere formulación de enzimas bio-activas o tratamiento UV-C médico.
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
                    {stain.surcharge === 0 ? 'Sin recargo' : `+${formatRD(stain.surcharge)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload Pipeline */}
          <div className="p-5 rounded-xl bg-dark-surface/60 border border-dark-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>2C. Evidencia Fotográfica (Opcional)</span>
                </h3>
                <p className="text-[11px] text-gray-400">
                  Sube fotos de manchas críticas para diagnóstico previo del técnico.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-500/10 text-brand-400 border border-brand-500/30">
                Presigned URL
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

      {/* ================= STEP 3: FORMAL BUDGET (NO ANTICIPO) ================= */}
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

          {/* Itemized Breakdown List */}
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="pb-2 border-b border-dark-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Desglose de Artículos ({totalItemsCount} piezas):
              </span>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-dark-surface/50 border border-dark-border/40 gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                      <span className="text-base shrink-0">{item.iconText}</span>
                      <span className="text-white font-medium truncate">
                        {item.quantity}x {item.name}
                        {item.bothSides && ' (Ambos Lados)'}
                        {item.extraSeats > 0 && ` (+${item.extraSeats} plazas extra)`}
                        {item.rugDimensions && ` [${item.rugDimensions}]`}
                      </span>
                    </div>
                    <span className="font-mono text-cyan-300 font-bold shrink-0">
                      {formatRD(item.itemTotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between py-2 border-b border-dark-border/30">
              <span className="text-gray-300">
                Factor Tapicería / Fibra ({selectedFabric.name})
              </span>
              <span className="font-mono text-brand-400">×{fabricMultiplier.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-dark-border/30">
              <span className="text-gray-300">Tratamiento Manchas ({selectedStain.name})</span>
              <span className="font-mono text-white font-semibold">
                +{formatRD(stainSurcharge)}
              </span>
            </div>

            {discountApplied > 0 && (
              <div className="flex justify-between py-2 border-b border-dark-border/30 text-emerald-400">
                <span>Descuento Cupón Aplicado</span>
                <span className="font-mono">-{formatRD(discountApplied)}</span>
              </div>
            )}

            {walletCreditApplied > 0 && (
              <div className="flex justify-between py-2 border-b border-dark-border/30 text-cyan-400">
                <span>Crédito Billetera Cashback</span>
                <span className="font-mono">-{formatRD(walletCreditApplied)}</span>
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
                  Saldo: {formatRD(walletBalanceAvailable)} | Máx: {formatRD(maxRedeemableCap)}
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

          {/* Total Box (SIN ANTICIPO - 100% AL FINALIZAR) */}
          <div className="p-6 rounded-2xl bg-dark-surface/90 border border-brand-500/40 tech-glow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 block">
                  Total Estimado del Servicio:
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {formatRD(total)}{' '}
                  <span className="text-xs font-sans text-brand-400 font-normal">DOP</span>
                </span>
              </div>

              {/* Badge Sin Anticipo */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>0% Anticipo · Pagas al Finalizar</span>
              </div>
            </div>

            {/* Banner de Garantía y Pago al Finalizar */}
            <div className="p-3.5 rounded-xl bg-dark-bg/80 border border-emerald-500/30 flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block">
                  Servicio a Domicilio Especializado · Sin Anticipo
                </span>
                <p className="text-gray-300 mt-0.5 leading-relaxed">
                  Condición de visita técnica hospitalaria (mínimo{' '}
                  <strong className="text-white">RD$ 1,500</strong>) cumplida con éxito. No cobramos
                  ningún adelanto; el pago total de{' '}
                  <strong className="text-emerald-400 font-mono">{formatRD(total)}</strong> se
                  realiza cuando el técnico concluya el servicio y tú verifiques el resultado y la
                  desinfección.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass-panel text-xs text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modificar Piezas</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Presupuesto</span>
            </button>

            <a
              href={`https://wa.me/18095134773?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pedir por WhatsApp (809-513-4773)</span>
            </a>

            <button
              type="button"
              onClick={handleProceedToSchedule}
              disabled={isSubmittingQuotation}
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-sm tech-glow shadow-lg active:scale-95 transition-transform text-center disabled:opacity-50"
            >
              <span>
                {isSubmittingQuotation ? 'Guardando Cotización...' : 'Agendar Cuadrilla Online'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
