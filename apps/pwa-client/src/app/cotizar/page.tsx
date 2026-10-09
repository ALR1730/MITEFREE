'use client';

import { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  Lock,
  Wallet,
  Clock,
  Download,
  Plus,
  Minus,
  MessageCircle,
  Check,
  MapPin,
  ShieldCheck,
  Maximize2,
  Calendar,
  Droplets,
  HeartHandshake,
  ChevronDown,
} from 'lucide-react';

export interface CatalogItem {
  id: string;
  name: string;
  category: 'Colchones' | 'Muebles de Sala' | 'Sillas de Comedor' | 'Alfombras';
  basePrice: number;
  bothSidesPrice?: number;
  iconText: string;
  image: string;
  subtitle: string;
  isMattress?: boolean;
  isSofaModular?: boolean;
  isChair?: boolean;
  isRug?: boolean;
  dimensions?: string;
  isCustomRug?: boolean;
}

const CATALOG_ITEMS: CatalogItem[] = [
  // 1. Lavado de Colchones
  {
    id: 'mat-full',
    name: 'Colchón Matrimonial (Full)',
    category: 'Colchones',
    basePrice: 2500,
    bothSidesPrice: 3000,
    iconText: '🛏️',
    image: '/cat-mattress.jpg',
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
    image: '/cat-mattress.jpg',
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
    image: '/cat-mattress.jpg',
    isMattress: true,
    subtitle: '1 lado RD$ 3,500 · Ambos lados RD$ 4,000',
  },

  // 2. Muebles de Sala
  {
    id: 'sofa-1',
    name: 'Mueble 1 Plaza (Sillón Individual)',
    category: 'Muebles de Sala',
    basePrice: 1500,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    subtitle: 'Tarifa estándar RD$ 1,500',
  },
  {
    id: 'sofa-2',
    name: 'Mueble 2 Plazas (Love Seat)',
    category: 'Muebles de Sala',
    basePrice: 2000,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    subtitle: 'Tarifa estándar RD$ 2,000',
  },
  {
    id: 'sofa-3',
    name: 'Mueble 3 Plazas',
    category: 'Muebles de Sala',
    basePrice: 2500,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    subtitle: 'Tarifa estándar RD$ 2,500',
  },
  {
    id: 'sofa-4',
    name: 'Mueble 4 Plazas',
    category: 'Muebles de Sala',
    basePrice: 3000,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    subtitle: 'Tarifa estándar RD$ 3,000',
  },
  {
    id: 'sofa-5',
    name: 'Mueble 5 Plazas (Modular en L)',
    category: 'Muebles de Sala',
    basePrice: 3500,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    isSofaModular: true,
    subtitle: 'Base 5 plazas RD$ 3,500 (+RD$ 500 c/u extra)',
  },

  // 3. Sillas de Comedor
  {
    id: 'dining-chair',
    name: 'Sillas de Comedor',
    category: 'Sillas de Comedor',
    basePrice: 300,
    iconText: '🪑',
    image: '/cat-chair.jpg',
    isChair: true,
    subtitle: 'RD$ 300 cada una (juegos de 4 o más)',
  },

  // 4. Lavado y Desinfección de Alfombras
  {
    id: 'rug-small',
    name: 'Alfombra Pequeña / Pie de Cama',
    category: 'Alfombras',
    basePrice: 600,
    iconText: '🧶',
    image: '/cat-rug.jpg',
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
    image: '/cat-rug.jpg',
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
    image: '/cat-rug.jpg',
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
    image: '/cat-rug.jpg',
    isRug: true,
    dimensions: '3.00m × 2.50m (~7.5 m²)',
    subtitle: 'Salones amplios o áreas ejecutivas (RD$ 2,500)',
  },
  {
    id: 'rug-custom',
    name: 'Alfombra por Medida Personalizada',
    category: 'Alfombras',
    basePrice: 300, // RD$ 300 por m²
    iconText: '📏',
    image: '/cat-rug.jpg',
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
    desc: 'Secado acelerado en 2-3 horas, uso cotidiano.',
  },
  {
    id: 'MICROFIBER',
    name: 'Microfibra / Gamuzina',
    multiplier: 1.0,
    desc: 'Tejido suave de alta densidad, cepillado profundo.',
  },
  {
    id: 'LINEN',
    name: 'Lino Natural',
    multiplier: 1.15,
    desc: 'Fibra natural delicada, tratamiento con pH neutro.',
  },
  {
    id: 'VELVET',
    name: 'Terciopelo / Chenille / Lana',
    multiplier: 1.25,
    desc: 'Protección especial contra aplastamiento de hebras.',
  },
  {
    id: 'LEATHER',
    name: 'Cuero / Piel Genuina',
    multiplier: 1.35,
    desc: 'Nutrición con bálsamo hidratante anti-grietas.',
  },
];

const STAIN_OPTIONS = [
  {
    id: 'LIGHT',
    name: 'Leve / Mantenimiento',
    surcharge: 0,
    desc: 'Polvo diario, ácaros habituales y uso preventivo (+RD$ 0)',
  },
  {
    id: 'MODERATE',
    name: 'Moderada / Comida o Bebidas',
    surcharge: 300,
    desc: 'Manchas visibles, marcas de café o derrames (+RD$ 300)',
  },
  {
    id: 'CRITICAL',
    name: 'Crítica / Mascotas o Manchas Difíciles',
    surcharge: 500,
    desc: 'Desinfección biológica profunda con enzimas y UV-C (+RD$ 500)',
  },
];

const MAIN_CATEGORIES = [
  {
    id: 'Colchones' as const,
    name: 'Colchones',
    priceStarting: 'Desde RD$ 2,500',
    image: '/cat-mattress.jpg',
    defaultItemId: 'mat-full',
  },
  {
    id: 'Muebles de Sala' as const,
    name: 'Muebles',
    priceStarting: 'Desde RD$ 1,500',
    image: '/cat-sofa.jpg',
    defaultItemId: 'sofa-2',
  },
  {
    id: 'Alfombras' as const,
    name: 'Alfombras',
    priceStarting: 'Desde RD$ 500',
    image: '/cat-rug.jpg',
    defaultItemId: 'rug-small',
  },
  {
    id: 'Sillas de Comedor' as const,
    name: 'Sillas de comedor',
    priceStarting: 'RD$ 300 por silla',
    image: '/cat-chair.jpg',
    defaultItemId: 'dining-chair',
  },
];

type MainCategoryId = (typeof MAIN_CATEGORIES)[number]['id'];

function CotizadorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmittingQuotation, setIsSubmittingQuotation] = useState<boolean>(false);
  const [persistedQuotationId, setPersistedQuotationId] = useState<string | null>(null);

  const initialCat = searchParams.get('category') as any;
  const validInitialCat: MainCategoryId =
    initialCat &&
    ['Colchones', 'Muebles de Sala', 'Sillas de Comedor', 'Alfombras'].includes(initialCat)
      ? initialCat
      : 'Colchones';

  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategoryId>(validInitialCat);

  const [selectedItemId, setSelectedItemId] = useState<string>(
    validInitialCat === 'Colchones'
      ? 'mat-full'
      : validInitialCat === 'Muebles de Sala'
        ? 'sofa-2'
        : validInitialCat === 'Alfombras'
          ? 'rug-small'
          : 'dining-chair',
  );

  useEffect(() => {
    const cat = searchParams.get('category');
    if (
      cat &&
      ['Colchones', 'Muebles de Sala', 'Sillas de Comedor', 'Alfombras'].includes(cat)
    ) {
      setSelectedMainCategory(cat as MainCategoryId);
      const def = MAIN_CATEGORIES.find((c) => c.id === cat)?.defaultItemId || 'mat-full';
      setSelectedItemId(def);
    }
  }, [searchParams]);

  const handleSelectCategory = (catId: MainCategoryId) => {
    setSelectedMainCategory(catId);
    const def = MAIN_CATEGORIES.find((c) => c.id === catId)?.defaultItemId || 'mat-full';
    setSelectedItemId(def);
  };

  // Estados locales para configurar el artículo seleccionado
  const [tempBothSides, setTempBothSides] = useState<Record<string, boolean>>({});
  const [tempExtraSeats, setTempExtraSeats] = useState<Record<string, number>>({});
  const [tempQuantity, setTempQuantity] = useState<Record<string, number>>({});

  // Medidas dinámicas para alfombra personalizada
  const [customLength, setCustomLength] = useState<number>(2.5);
  const [customWidth, setCustomWidth] = useState<number>(2.0);

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

  const walletBalanceAvailable = user?.walletBalance ?? 500.0;

  const formatRD = (amount: number) => `RD$ ${Math.round(amount).toLocaleString('es-DO')}`;

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

  // Ítem actualmente seleccionado para personalización
  const currentCatalogItem =
    CATALOG_ITEMS.find((it) => it.id === selectedItemId) || CATALOG_ITEMS[0]!;
  const currentBothSides = tempBothSides[currentCatalogItem.id] ?? false;
  const currentExtraSeats = tempExtraSeats[currentCatalogItem.id] ?? 0;
  const currentQty = tempQuantity[currentCatalogItem.id] ?? (currentCatalogItem.isChair ? 4 : 1);
  const currentUnitPrice = calculateCatalogUnitPrice(
    currentCatalogItem,
    currentBothSides,
    currentExtraSeats,
    customLength,
    customWidth,
  );
  const currentItemTotal = currentUnitPrice * currentQty;

  let currentRugDimStr: string | undefined = currentCatalogItem.dimensions;
  let currentDisplayName = currentCatalogItem.name;

  if (currentCatalogItem.isCustomRug) {
    const area = (customLength * customWidth).toFixed(1);
    currentRugDimStr = `${customLength.toFixed(1)}m × ${customWidth.toFixed(1)}m (~${area} m²)`;
    currentDisplayName = `Alfombra Personalizada (${currentRugDimStr})`;
  }

  const MIN_DOMICILE_ORDER_RD = 1500;
  const isMinimumOrderMet = currentItemTotal >= MIN_DOMICILE_ORDER_RD;
  const amountMissingForMinimum = Math.max(0, MIN_DOMICILE_ORDER_RD - currentItemTotal);
  const minProgressPercentage = Math.min(
    100,
    Math.round((currentItemTotal / MIN_DOMICILE_ORDER_RD) * 100),
  );

  const handleProceedFromStep1 = () => {
    if (!isMinimumOrderMet) {
      alert(
        `El servicio a domicilio requiere un consumo mínimo de RD$ 1,500. Te faltan RD$ ${amountMissingForMinimum.toLocaleString('es-DO')} para completar tu visita. Puedes aumentar la cantidad o elegir un servicio mayor.`,
      );
      return;
    }
    setCurrentStep(2);
  };

  const fabricMultiplier = selectedFabric.multiplier;
  const stainSurcharge = selectedStain.surcharge;

  const subtotalWithFabric = Math.round(
    currentItemTotal * fabricMultiplier + (currentItemTotal > 0 ? stainSurcharge : 0),
  );

  const discountApplied = couponDiscount;
  const subtotalAfterDiscount = Math.max(0, subtotalWithFabric - discountApplied);

  const maxRedeemableCap = Math.round(subtotalAfterDiscount * 0.5);
  const walletCreditApplied = useWalletCashback
    ? Math.min(walletBalanceAvailable, maxRedeemableCap)
    : 0;

  const total =
    currentItemTotal > 0
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

  const generateWhatsAppMessage = () => {
    const itemDetail = `• ${currentQty}x ${currentDisplayName}${currentBothSides ? ' (Ambos Lados)' : ''}${currentExtraSeats > 0 ? ` (+${currentExtraSeats} plazas)` : ''}${currentRugDimStr ? ` [${currentRugDimStr}]` : ''} -> ${formatRD(currentItemTotal)}`;

    const msg = `¡Hola Mite Free Clean! 👋 Deseo solicitar el servicio de limpieza y desinfección a domicilio:

${itemDetail}

• Tejido/Fibra: ${selectedFabric.name}
• Manchas: ${selectedStain.name}
• Total Estimado: ${formatRD(total)} DOP
• Modalidad: 0% Anticipo (Pagas al finalizar)

Por favor confírmenme disponibilidad para mi zona (San Pedro / La Romana / Santo Domingo). ¡Gracias!`;

    return encodeURIComponent(msg);
  };

  const handleProceedToSchedule = async () => {
    setIsSubmittingQuotation(true);
    try {
      const quotationPayload = {
        clientId: user?.id || 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        items: [
          {
            furnitureType: `${currentQty}x ${currentDisplayName}${currentBothSides ? ' (Ambos Lados)' : ''}${currentExtraSeats > 0 ? ` (+${currentExtraSeats} plazas)` : ''}`,
            fabricType: selectedFabric.id as FabricType,
            stainSeverity: selectedStain.id as StainSeverity,
            basePriceAmount: currentItemTotal,
            photoUrls: [],
            additionalServices: [],
          },
        ],
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
      // Fallback a navegación con query params
    } finally {
      setIsSubmittingQuotation(false);
    }

    router.push(`/agenda?total=${total}&deposit=${Math.round(total * 0.3)}`);
  };

  const filteredCatalog = CATALOG_ITEMS.filter((item) => {
    return item.category === selectedMainCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-32">
      {/* Top Clean Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mite Free Clean · Cotización Inmediata</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cotizador Inteligente de Servicios
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg mx-auto">
          Selecciona tamaños y cantidades para ver tu precio al instante. Visita a domicilio desde <strong>RD$ 1,500</strong> (0% anticipo).
        </p>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="flex items-center justify-between mb-8 max-w-sm mx-auto px-2">
        {[
          { num: 1, label: '1. Piezas' },
          { num: 2, label: '2. Tela & Manchas' },
          { num: 3, label: '3. Resumen' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  if (s.num === 1) setCurrentStep(1);
                  if (s.num === 2 && isMinimumOrderMet) setCurrentStep(2);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                  currentStep >= s.num
                    ? 'bg-gradient-to-tr from-brand-600 to-cyan-400 text-dark-bg tech-glow shadow-md'
                    : 'bg-dark-surface border border-dark-border text-gray-500'
                }`}
              >
                {s.num}
              </button>
              <span
                className={`text-[11px] font-medium mt-1 text-center whitespace-nowrap ${
                  currentStep >= s.num ? 'text-brand-300 font-bold' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-4 transition-colors ${
                  currentStep > s.num ? 'bg-cyan-400' : 'bg-dark-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ================= STEP 1: DYNAMIC CATEGORIES & IN-PLACE CUSTOMIZER ================= */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. ¿Qué deseas limpiar? (Cuadrícula 2x2 interactiva - Foto 2) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                1. ¿Qué deseas limpiar?
              </h2>
              <span className="text-xs text-brand-400 font-semibold font-mono">Paso 1 de 3</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {MAIN_CATEGORIES.map((cat) => {
                const isSelected = selectedMainCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`relative rounded-3xl p-3 text-left transition-all duration-200 flex flex-col justify-between overflow-hidden border ${
                      isSelected
                        ? 'border-brand-400 bg-brand-500/15 tech-glow shadow-xl scale-[1.01]'
                        : 'border-dark-border bg-dark-surface/85 hover:border-brand-500/30 hover:bg-dark-surface'
                    }`}
                  >
                    <div className="relative w-full h-28 sm:h-36 rounded-2xl overflow-hidden bg-dark-bg mb-2.5">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 300px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <div>
                        <span className="block text-sm sm:text-base font-extrabold text-white leading-tight">
                          {cat.name}
                        </span>
                        <span className="block text-xs text-gray-400 mt-0.5">
                          {cat.priceStarting}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-brand-500 text-dark-bg flex items-center justify-center shrink-0 shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conector Visual (Flecha hacia abajo) */}
          <div className="flex justify-center my-1">
            <div className="w-8 h-8 rounded-full bg-dark-surface border border-dark-border text-brand-400 flex items-center justify-center shadow-md">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* 2. Personaliza tu servicio (Customizador Dinámico en Línea - Foto 3) */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-brand-500/30 tech-glow space-y-5">
            <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                2. Personaliza tu{' '}
                {selectedMainCategory === 'Colchones'
                  ? 'colchón'
                  : selectedMainCategory === 'Muebles de Sala'
                    ? 'mueble'
                    : selectedMainCategory === 'Alfombras'
                      ? 'alfombra'
                      : 'juego de sillas'}
              </h3>
              <span className="text-xs text-brand-300 font-semibold font-mono">
                {currentCatalogItem.name}
              </span>
            </div>

            {/* OPCIONES DINÁMICAS SEGÚN CATEGORÍA SELECCIONADA */}
            {selectedMainCategory === 'Colchones' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Tamaño del colchón
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'mat-full', label: 'Matrimonial (Full) — RD$ 2,500' },
                      { id: 'mat-queen', label: 'Queen Size — RD$ 3,000' },
                      { id: 'mat-king', label: 'King Size — RD$ 3,500' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                          selectedItemId === opt.id
                            ? 'bg-brand-500/15 border-brand-400 text-white font-bold'
                            : 'bg-dark-surface/70 border-dark-border text-gray-300 hover:bg-dark-surface'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedMattressModel"
                          checked={selectedItemId === opt.id}
                          onChange={() => setSelectedItemId(opt.id)}
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    ¿Qué lados deseas limpiar?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setTempBothSides((prev) => ({ ...prev, [currentCatalogItem.id]: false }))
                      }
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                        !currentBothSides
                          ? 'bg-brand-500 text-dark-bg border-brand-400 tech-glow shadow-md'
                          : 'bg-dark-surface border-dark-border text-gray-400 hover:text-white'
                      }`}
                    >
                      Un lado
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setTempBothSides((prev) => ({ ...prev, [currentCatalogItem.id]: true }))
                      }
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                        currentBothSides
                          ? 'bg-brand-500 text-dark-bg border-brand-400 tech-glow shadow-md'
                          : 'bg-dark-surface border-dark-border text-gray-400 hover:text-white'
                      }`}
                    >
                      Ambos lados (+RD$ 500)
                    </button>
                  </div>
                </div>

                {/* Stepper Cantidad */}
                <div className="flex items-center justify-between pt-3 border-t border-dark-border/60">
                  <div>
                    <span className="block text-sm font-bold text-white">Cantidad</span>
                    <span className="block text-xs text-gray-400">Unidades que deseas limpiar</span>
                  </div>
                  <div className="flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-1.5 shadow-md">
                    <button
                      type="button"
                      onClick={() =>
                        setTempQuantity((prev) => ({
                          ...prev,
                          [currentCatalogItem.id]: Math.max(1, currentQty - 1),
                        }))
                      }
                      className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-cyan-300 font-mono text-sm">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTempQuantity((prev) => ({
                          ...prev,
                          [currentCatalogItem.id]: currentQty + 1,
                        }))
                      }
                      className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedMainCategory === 'Muebles de Sala' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Tamaño y tipo de mueble
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'sofa-1', label: '1 Plaza (Sillón Individual) — RD$ 1,500' },
                      { id: 'sofa-2', label: '2 Plazas (Love Seat) — RD$ 2,000' },
                      { id: 'sofa-3', label: '3 Plazas — RD$ 2,500' },
                      { id: 'sofa-4', label: '4 Plazas — RD$ 3,000' },
                      { id: 'sofa-5', label: '5 Plazas (Modular en L) — RD$ 3,500' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                          selectedItemId === opt.id
                            ? 'bg-brand-500/15 border-brand-400 text-white font-bold'
                            : 'bg-dark-surface/70 border-dark-border text-gray-300 hover:bg-dark-surface'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedSofaModel"
                          checked={selectedItemId === opt.id}
                          onChange={() => setSelectedItemId(opt.id)}
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedItemId === 'sofa-5' && (
                  <div className="p-3 rounded-2xl bg-dark-surface/90 border border-dark-border flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium">Plazas adicionales en L:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setTempExtraSeats((prev) => ({
                            ...prev,
                            ['sofa-5']: Math.max(0, currentExtraSeats - 1),
                          }))
                        }
                        className="w-7 h-7 rounded-lg bg-dark-bg border border-dark-border text-white flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-bold text-cyan-400 font-mono">
                        {currentExtraSeats}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setTempExtraSeats((prev) => ({
                            ...prev,
                            ['sofa-5']: currentExtraSeats + 1,
                          }))
                        }
                        className="w-7 h-7 rounded-lg bg-dark-bg border border-dark-border text-white flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-gray-500 font-mono">(+RD$ 500 c/u)</span>
                    </div>
                  </div>
                )}

                {/* Stepper Cantidad */}
                <div className="flex items-center justify-between pt-3 border-t border-dark-border/60">
                  <div>
                    <span className="block text-sm font-bold text-white">Cantidad</span>
                    <span className="block text-xs text-gray-400">Unidades que deseas limpiar</span>
                  </div>
                  <div className="flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-1.5 shadow-md">
                    <button
                      type="button"
                      onClick={() =>
                        setTempQuantity((prev) => ({
                          ...prev,
                          [currentCatalogItem.id]: Math.max(1, currentQty - 1),
                        }))
                      }
                      className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-cyan-300 font-mono text-sm">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTempQuantity((prev) => ({
                          ...prev,
                          [currentCatalogItem.id]: currentQty + 1,
                        }))
                      }
                      className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedMainCategory === 'Alfombras' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Tamaño de la alfombra
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'rug-small', label: 'Pequeña (Pie de cama) — RD$ 600' },
                      { id: 'rug-medium', label: 'Mediana (Área de sala) — RD$ 1,200' },
                      { id: 'rug-large', label: 'Grande (Sala principal/comedor) — RD$ 1,800' },
                      { id: 'rug-xlarge', label: 'Extra Grande (Salón) — RD$ 2,500' },
                      { id: 'rug-custom', label: 'Medida Personalizada (RD$ 300 / m²)' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                          selectedItemId === opt.id
                            ? 'bg-brand-500/15 border-brand-400 text-white font-bold'
                            : 'bg-dark-surface/70 border-dark-border text-gray-300 hover:bg-dark-surface'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedRugModel"
                          checked={selectedItemId === opt.id}
                          onChange={() => setSelectedItemId(opt.id)}
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedItemId === 'rug-custom' && (
                  <div className="p-3.5 rounded-2xl bg-dark-surface/90 border border-cyan-500/30 space-y-3 text-xs">
                    <span className="text-white font-bold block flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-cyan-400" />
                      <span>Medidas en metros:</span>
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
                        <span className="text-[11px] text-gray-400 block">Largo (m):</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              setCustomLength(
                                Math.max(1.0, Math.round((customLength - 0.5) * 10) / 10),
                              )
                            }
                            className="w-7 h-7 rounded-lg bg-dark-surface text-white flex items-center justify-center"
                          >
                            <Minus className="w-3.5 h-3.5" />
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
                            className="w-7 h-7 rounded-lg bg-dark-surface text-white flex items-center justify-center"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
                        <span className="text-[11px] text-gray-400 block">Ancho (m):</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              setCustomWidth(
                                Math.max(0.5, Math.round((customWidth - 0.5) * 10) / 10),
                              )
                            }
                            className="w-7 h-7 rounded-lg bg-dark-surface text-white flex items-center justify-center"
                          >
                            <Minus className="w-3.5 h-3.5" />
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
                            className="w-7 h-7 rounded-lg bg-dark-surface text-white flex items-center justify-center"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-gray-300 pt-1">
                      <span>
                        Área: <strong className="text-white">{(customLength * customWidth).toFixed(1)} m²</strong>
                      </span>
                      <span className="text-brand-400 font-mono font-bold">
                        {formatRD(currentUnitPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Stepper Cantidad */}
                <div className="flex items-center justify-between pt-3 border-t border-dark-border/60">
                  <div>
                    <span className="block text-sm font-bold text-white">Cantidad</span>
                    <span className="block text-xs text-gray-400">Unidades que deseas limpiar</span>
                  </div>
                  <div className="flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-1.5 shadow-md">
                    <button
                      type="button"
                      onClick={() =>
                        setTempQuantity((prev) => ({
                          ...prev,
                          [currentCatalogItem.id]: Math.max(1, currentQty - 1),
                        }))
                      }
                      className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-cyan-300 font-mono text-sm">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTempQuantity((prev) => ({
                          ...prev,
                          [currentCatalogItem.id]: currentQty + 1,
                        }))
                      }
                      className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedMainCategory === 'Sillas de Comedor' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Juego de sillas de comedor
                  </label>
                  <div className="space-y-2">
                    {[
                      { count: 4, label: 'Juego de 4 Sillas — RD$ 1,200' },
                      { count: 6, label: 'Juego de 6 Sillas — RD$ 1,800' },
                      { count: 8, label: 'Juego de 8 Sillas — RD$ 2,400' },
                    ].map((opt) => (
                      <label
                        key={opt.count}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                          currentQty === opt.count
                            ? 'bg-brand-500/15 border-brand-400 text-white font-bold'
                            : 'bg-dark-surface/70 border-dark-border text-gray-300 hover:bg-dark-surface'
                        }`}
                      >
                        <input
                          type="radio"
                          name="chairPreset"
                          checked={currentQty === opt.count}
                          onChange={() =>
                            setTempQuantity((prev) => ({
                              ...prev,
                              ['dining-chair']: opt.count,
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stepper Cantidad */}
                <div className="flex items-center justify-between pt-3 border-t border-dark-border/60">
                  <div>
                    <span className="block text-sm font-bold text-white">Total de Sillas</span>
                    <span className="block text-xs text-gray-400">RD$ 300 cada silla</span>
                  </div>
                  <div className="flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-1.5 shadow-md">
                    <button
                      type="button"
                      onClick={() =>
                        setTempQuantity((prev) => ({
                          ...prev,
                          ['dining-chair']: Math.max(2, currentQty - 1),
                        }))
                      }
                      className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-cyan-300 font-mono text-sm">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTempQuantity((prev) => ({
                          ...prev,
                          ['dining-chair']: currentQty + 1,
                        }))
                      }
                      className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PRECIO ESTIMADO DEL SERVICIO (Card de Tarifa Dinámica - Foto 1) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-left space-y-1">
              <span className="block text-xs font-semibold text-emerald-400">
                Precio estimado del servicio
              </span>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono my-1">
                {formatRD(currentItemTotal)}
              </span>
              <p className="text-[11px] text-gray-400 leading-tight">
                El total final se confirma según la dirección, las condiciones y el servicio requerido.
              </p>
            </div>

            {/* Aviso de Pedido Mínimo a Domicilio (RD$ 1,500) */}
            {!isMinimumOrderMet ? (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    El servicio a domicilio inicia en <strong>RD$ 1,500</strong>. Te faltan{' '}
                    <strong className="text-white font-mono">
                      {formatRD(amountMissingForMinimum)}
                    </strong>{' '}
                    (puedes aumentar las unidades o elegir un servicio mayor).
                  </span>
                </div>
                <div className="w-full sm:w-28 bg-dark-bg h-2 rounded-full overflow-hidden border border-amber-500/30 shrink-0">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-brand-400 h-full transition-all duration-300"
                    style={{ width: `${minProgressPercentage}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs flex items-center gap-2 text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>¡Mínimo alcanzado!</strong> Incluye visita técnica a domicilio con cuadrilla certificada.
                </span>
              </div>
            )}

            {/* Botón de Acción Principal (Foto 1) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleProceedFromStep1}
                disabled={!isMinimumOrderMet}
                className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full font-extrabold text-sm sm:text-base transition-all ${
                  isMinimumOrderMet
                    ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg tech-glow shadow-xl active:scale-95 hover:opacity-95 cursor-pointer'
                    : 'bg-dark-surface border border-dark-border text-gray-500 cursor-not-allowed opacity-75'
                }`}
              >
                <span>
                  {isMinimumOrderMet
                    ? 'Continuar a fecha y dirección'
                    : `Mínimo RD$ 1,500 (Faltan ${formatRD(amountMissingForMinimum)})`}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Footer de Mite Free Clean (Foto 1) */}
            <div className="text-center pt-3 border-t border-dark-border/40">
              <span className="block text-xs font-bold text-emerald-400">Mite Free Clean</span>
              <span className="block text-[11px] text-gray-400">Tu hogar merece una limpieza profunda.</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: TEJIDO, MANCHAS & FOTOS ================= */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Fabric Type Selector */}
          <div className="glass-card rounded-3xl p-6 border border-dark-border space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                <span>Tipo de Tapicería / Tela</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Selecciona el material de tus piezas para ajustar el producto químico y la técnica de
                secado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FABRIC_OPTIONS.map((fab) => {
                const isSelected = selectedFabric.id === fab.id;
                return (
                  <button
                    key={fab.id}
                    type="button"
                    onClick={() => setSelectedFabric(fab)}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 tech-glow-blue'
                        : 'bg-dark-surface/80 border-dark-border hover:border-brand-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-white text-sm">{fab.name}</span>
                      {fab.multiplier > 1.0 && (
                        <span className="text-[11px] font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20">
                          +{Math.round((fab.multiplier - 1) * 100)}% cuidado
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{fab.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stain Severity Selector */}
          <div className="glass-card rounded-3xl p-6 border border-dark-border space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Nivel de Suciedad o Manchas</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Garantizamos tratamiento con desmanchador biodegradable y luz ultravioleta UV-C.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {STAIN_OPTIONS.map((stain) => {
                const isSelected = selectedStain.id === stain.id;
                return (
                  <button
                    key={stain.id}
                    type="button"
                    onClick={() => setSelectedStain(stain)}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-400 tech-glow'
                        : 'bg-dark-surface/80 border-dark-border hover:border-brand-500/30'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white text-sm block">{stain.name}</span>
                      <p className="text-xs text-gray-400 mt-1">{stain.desc}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-400 mt-3 block">
                      {stain.surcharge === 0 ? 'Sin recargo' : `+${formatRD(stain.surcharge)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Upload (Opcional) */}
          <div className="glass-card rounded-3xl p-6 border border-dark-border space-y-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Foto de tus Muebles (Opcional)</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Si deseas que el especialista prepare productos específicos antes de la visita, sube
                una foto.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-xs font-bold text-white transition-all">
                <ImageIcon className="w-4 h-4 text-brand-400" />
                <span>Seleccionar Imagen (Máx 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedPhotos.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {uploadedPhotos.map((p) => (
                    <div
                      key={p.id}
                      className="relative w-14 h-14 rounded-xl overflow-hidden border border-brand-500/40 shrink-0"
                    >
                      <Image src={p.preview} alt={p.name} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(p.id)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step 2 Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-panel text-xs text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Piezas</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-xs tech-glow active:scale-95 transition-all shadow-lg"
            >
              <span>Ver Resumen Final</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: RESUMEN & CONFIRMACIÓN ================= */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Big Summary Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-dark-border space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border/60">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-brand-400 font-bold block">
                  Resumen de tu Cotización
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  Desinfección & Lavado a Domicilio
                </h3>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>0% Anticipo</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider block">
                Servicio a tratar:
              </span>
              <div className="p-3.5 rounded-2xl bg-dark-surface/60 border border-dark-border flex justify-between items-center">
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0 p-1.5 rounded-lg bg-dark-surface border border-dark-border">
                      {currentCatalogItem.iconText}
                    </span>
                    <div>
                      <span className="text-white font-bold text-sm block">
                        {currentQty}x {currentDisplayName}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        {currentBothSides && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                            Ambos Lados
                          </span>
                        )}
                        {currentExtraSeats > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                            +{currentExtraSeats} plazas extra
                          </span>
                        )}
                        {currentRugDimStr && (
                          <span className="text-[11px] text-gray-400">
                            {currentRugDimStr}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <span className="font-mono font-bold text-brand-400 text-sm sm:text-base shrink-0">
                  {formatRD(currentItemTotal)}
                </span>
              </div>
            </div>

            {/* Treatment Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-dark-border/60 text-xs">
              <div className="p-3 rounded-xl bg-dark-surface/60 border border-dark-border">
                <span className="text-gray-400 block">Tipo de Tapicería:</span>
                <span className="font-bold text-white">{selectedFabric.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-surface/60 border border-dark-border">
                <span className="text-gray-400 block">Tratamiento de Manchas:</span>
                <span className="font-bold text-white">{selectedStain.name}</span>
              </div>
            </div>

            {/* Coupon & Cashback */}
            <div className="p-4 rounded-2xl bg-dark-surface/80 border border-dark-border space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Tag className="w-4 h-4 text-brand-400" />
                  <span className="text-gray-300 font-semibold">¿Tienes cupón de descuento?</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Ej. ALRPROMO"
                    className="px-3 py-1.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs font-mono uppercase focus:border-brand-500 outline-none w-full sm:w-36"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-1.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-300 font-bold hover:bg-brand-500/25 transition-colors whitespace-nowrap"
                  >
                    {couponApplied ? 'Aplicado' : 'Aplicar'}
                  </button>
                </div>
              </div>

              {couponApplied && (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Descuento de {formatRD(couponDiscount)} aplicado exitosamente.</span>
                </div>
              )}
            </div>

            {/* Final Total Box */}
            <div className="p-6 rounded-3xl bg-dark-surface/90 border border-brand-500/40 tech-glow space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400 block">
                    Total Final a Pagar:
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                    {formatRD(total)}{' '}
                    <span className="text-xs font-sans text-brand-400 font-normal">DOP</span>
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pagas 100% al finalizar tu servicio</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed pt-2 border-t border-dark-border/40">
                Cobertura en <strong>San Pedro de Macorís</strong>, <strong>La Romana</strong> y{' '}
                <strong>Santo Domingo Este</strong>. No cobramos adelanto; pagas cuando veas tus
                muebles limpios y desinfectados.
              </p>
            </div>

            {/* Actions: Agendar Online / Pedir por WhatsApp */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl glass-panel text-xs text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <a
                href={`https://wa.me/18095134773?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp (809-513-4773)</span>
              </a>

              <button
                type="button"
                onClick={handleProceedToSchedule}
                disabled={isSubmittingQuotation}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-xs sm:text-sm tech-glow shadow-lg active:scale-95 transition-all text-center disabled:opacity-50"
              >
                <span>
                  {isSubmittingQuotation
                    ? 'Preparando Agenda...'
                    : 'Agendar Fecha y Hora en Línea'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sticky Bottom Bar for Mobile */}
      {currentStep === 1 && (
        <div className="md:hidden fixed bottom-16 left-3 right-3 z-40 p-3 rounded-2xl glass-panel border border-brand-500/40 tech-glow flex items-center justify-between shadow-2xl backdrop-blur-xl">
          <div>
            <span className="text-[10px] text-gray-400 block font-mono">
              {currentQty}x {currentDisplayName}
            </span>
            <span className="text-base font-extrabold text-brand-300 font-mono">
              {formatRD(currentItemTotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleProceedFromStep1}
            disabled={!isMinimumOrderMet}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              isMinimumOrderMet
                ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg tech-glow shadow-md active:scale-95'
                : 'bg-dark-surface border border-dark-border text-gray-500 opacity-75'
            }`}
          >
            <span>{isMinimumOrderMet ? 'Continuar' : `Faltan ${formatRD(amountMissingForMinimum)}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CotizadorPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
          Cargando catálogo de servicios Mite Free Clean...
        </div>
      }
    >
      <CotizadorContent />
    </Suspense>
  );
}
