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
  Plus,
  Edit3,
  RotateCcw,
  Search,
  X,
  Check,
  Package,
  AlertCircle,
} from 'lucide-react';
import {
  DEFAULT_DISCOUNT_POLICY,
  type DiscountPolicyConfig,
  type CatalogItem,
  type CreateCatalogItemDto,
  type UpdateCatalogItemDto,
  type MainCategory,
  DEFAULT_CATALOG_ITEMS,
} from '@mitefree/shared-types';
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

  // Catálogo Dinámico de Artículos & Tarifas (CRUD Completo)
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(DEFAULT_CATALOG_ITEMS);
  const [catalogFilter, setCatalogFilter] = useState<string>('ALL');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [catalogFeedback, setCatalogFeedback] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const initialFormState: {
    id?: string;
    name: string;
    category: MainCategory;
    basePrice: number;
    bothSidesPrice: number | undefined;
    subtitle: string;
    dimensions: string;
    iconText: string;
    image: string;
    isMattress: boolean;
    isSofaModular: boolean;
    isChair: boolean;
    isRug: boolean;
    isCustomRug: boolean;
  } = {
    name: '',
    category: 'Colchones',
    basePrice: 2500,
    bothSidesPrice: 3000,
    subtitle: '',
    dimensions: '',
    iconText: '🛏️',
    image: '/cat-mattress.jpg',
    isMattress: true,
    isSofaModular: false,
    isChair: false,
    isRug: false,
    isCustomRug: false,
  };
  const [formItem, setFormItem] = useState(initialFormState);

  // Carga inicial desde API / localStorage
  const loadCatalog = async () => {
    try {
      const res = await adminApiClient.catalog.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setCatalogItems(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mitefree_catalog_items', JSON.stringify(res.data));
        }
        return;
      }
    } catch {
      // Fallback a localStorage
    }

    if (typeof window !== 'undefined') {
      const savedLocal = localStorage.getItem('mitefree_catalog_items');
      if (savedLocal) {
        try {
          setCatalogItems(JSON.parse(savedLocal));
          return;
        } catch {
          // Ignorar parse error
        }
      }
    }
    setCatalogItems(DEFAULT_CATALOG_ITEMS);
  };

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
    loadCatalog();
  }, []);

  // Handlers para CRUD de Catálogo de Artículos
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormItem(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CatalogItem) => {
    setIsEditing(true);
    setFormItem({
      id: item.id,
      name: item.name,
      category: item.category,
      basePrice: item.basePrice,
      bothSidesPrice: item.bothSidesPrice,
      subtitle: item.subtitle || '',
      dimensions: item.dimensions || '',
      iconText: item.iconText || '🪑',
      image: item.image || '/cat-chair.jpg',
      isMattress: Boolean(item.isMattress),
      isSofaModular: Boolean(item.isSofaModular),
      isChair: Boolean(item.isChair),
      isRug: Boolean(item.isRug),
      isCustomRug: Boolean(item.isCustomRug),
    });
    setIsModalOpen(true);
  };

  const handleFormCategoryChange = (newCat: MainCategory) => {
    let icon = '🪑';
    let img = '/cat-chair.jpg';
    let isMat = false;
    let isMod = false;
    let isCh = false;
    let isR = false;
    let isCustR = false;
    let bothSides = formItem.bothSidesPrice;

    if (newCat === 'Colchones') {
      icon = '🛏️';
      img = '/cat-mattress.jpg';
      isMat = true;
      bothSides = bothSides || formItem.basePrice + 500;
    } else if (newCat === 'Muebles de Sala') {
      icon = '🛋️';
      img = '/cat-sofa.jpg';
      bothSides = undefined;
    } else if (newCat === 'Sillas de Comedor') {
      icon = '🪑';
      img = '/cat-chair.jpg';
      isCh = true;
      bothSides = undefined;
    } else if (newCat === 'Alfombras') {
      icon = '🧶';
      img = '/cat-rug.jpg';
      isR = true;
      bothSides = undefined;
    }

    setFormItem((prev) => ({
      ...prev,
      category: newCat,
      iconText: icon,
      image: img,
      isMattress: isMat,
      isSofaModular: isMod,
      isChair: isCh,
      isRug: isR,
      isCustomRug: isCustR,
      bothSidesPrice: bothSides,
    }));
  };

  const handleSaveItem = async () => {
    if (!formItem.name.trim()) {
      alert('Por favor indica el nombre del artículo.');
      return;
    }
    if (formItem.basePrice <= 0 || isNaN(formItem.basePrice)) {
      alert('Por favor indica un precio base válido mayor a 0.');
      return;
    }

    const payload: CatalogItem = {
      id: formItem.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: formItem.name.trim(),
      category: formItem.category,
      basePrice: Number(formItem.basePrice),
      bothSidesPrice:
        formItem.category === 'Colchones' && formItem.bothSidesPrice
          ? Number(formItem.bothSidesPrice)
          : undefined,
      subtitle: formItem.subtitle.trim() || undefined,
      dimensions: formItem.dimensions.trim() || undefined,
      iconText: formItem.iconText || '🪑',
      image: formItem.image || '/cat-chair.jpg',
      isMattress: formItem.isMattress,
      isSofaModular: formItem.isSofaModular,
      isChair: formItem.isChair,
      isRug: formItem.isRug,
      isCustomRug: formItem.isCustomRug,
    };

    try {
      if (isEditing && formItem.id) {
        await adminApiClient.catalog.update(formItem.id, payload);
        const updated = catalogItems.map((it) => (it.id === formItem.id ? payload : it));
        setCatalogItems(updated);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mitefree_catalog_items', JSON.stringify(updated));
        }
        setCatalogFeedback({
          message: `Artículo "${payload.name}" actualizado correctamente (precio y valores sincronizados).`,
          type: 'success',
        });
      } else {
        await adminApiClient.catalog.create(payload);
        const updated = [...catalogItems, payload];
        setCatalogItems(updated);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mitefree_catalog_items', JSON.stringify(updated));
        }
        setCatalogFeedback({
          message: `Nuevo artículo "${payload.name}" creado con éxito en el catálogo.`,
          type: 'success',
        });
      }
    } catch {
      // Local fallback
      const updated = isEditing
        ? catalogItems.map((it) => (it.id === formItem.id ? payload : it))
        : [...catalogItems, payload];
      setCatalogItems(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mitefree_catalog_items', JSON.stringify(updated));
      }
      setCatalogFeedback({
        message: `Guardado en almacenamiento local: "${payload.name}".`,
        type: 'success',
      });
    }

    setIsModalOpen(false);
    setTimeout(() => setCatalogFeedback(null), 4000);
  };

  const handleDeleteItem = async (id: string, name: string) => {
    try {
      await adminApiClient.catalog.delete(id);
    } catch {
      // Fallback
    }

    const updated = catalogItems.filter((it) => it.id !== id);
    setCatalogItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mitefree_catalog_items', JSON.stringify(updated));
    }
    setDeleteConfirmId(null);
    setCatalogFeedback({
      message: `El artículo "${name}" ha sido ELIMINADO TOTALMENTE del catálogo.`,
      type: 'success',
    });
    setTimeout(() => setCatalogFeedback(null), 4000);
  };

  const handleResetCatalog = async () => {
    if (
      !confirm(
        '¿Deseas restaurar el catálogo completo a los 13 artículos canónicos oficiales del Flyer? Todos los precios personalizados se restablecerán a fábrica.',
      )
    ) {
      return;
    }

    try {
      const res = await adminApiClient.catalog.reset();
      if (res.success && res.data) {
        setCatalogItems(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mitefree_catalog_items', JSON.stringify(res.data));
        }
        setCatalogFeedback({
          message: 'Catálogo restaurado a sus 13 artículos canónicos oficiales de fábrica.',
          type: 'success',
        });
        setTimeout(() => setCatalogFeedback(null), 4000);
        return;
      }
    } catch {
      // Fallback
    }

    setCatalogItems(DEFAULT_CATALOG_ITEMS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mitefree_catalog_items', JSON.stringify(DEFAULT_CATALOG_ITEMS));
    }
    setCatalogFeedback({
      message: 'Catálogo restablecido localmente a los 13 artículos canónicos oficiales.',
      type: 'success',
    });
    setTimeout(() => setCatalogFeedback(null), 4000);
  };

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
              <div className="w-20 px-3 py-1.5 rounded-lg bg-admin-card border border-admin-border text-white font-mono font-bold text-sm text-center">
                1,500
              </div>
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

      {/* Dynamic Catalog CRUD Management Section */}
      <div className="admin-card rounded-2xl p-6 border border-cyan-500/30 admin-glow-cyan space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-admin-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Package className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>Catálogo Dinámico de Artículos & Tarifas</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 normal-case">
                    CRUD Completo
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Edita cualquier valor (nombre, precio base, ambos lados, descripción, dimensiones) o elimina artículos por completo del cotizador.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md admin-glow-cyan active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nuevo Artículo</span>
            </button>
            <button
              type="button"
              onClick={handleResetCatalog}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-admin-sidebar hover:bg-admin-hover text-gray-300 hover:text-white border border-admin-border text-xs font-semibold active:scale-95 transition-all"
              title="Restaurar a los 13 artículos canónicos del flyer oficial"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Restaurar Flyer</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {catalogFeedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between animate-fadeIn ${
              catalogFeedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {catalogFeedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{catalogFeedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setCatalogFeedback(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: 'Todos', count: catalogItems.length },
              {
                id: 'Colchones',
                label: 'Colchones',
                count: catalogItems.filter((i) => i.category === 'Colchones').length,
              },
              {
                id: 'Muebles de Sala',
                label: 'Muebles',
                count: catalogItems.filter((i) => i.category === 'Muebles de Sala').length,
              },
              {
                id: 'Sillas de Comedor',
                label: 'Sillas',
                count: catalogItems.filter((i) => i.category === 'Sillas de Comedor').length,
              },
              {
                id: 'Alfombras',
                label: 'Alfombras',
                count: catalogItems.filter((i) => i.category === 'Alfombras').length,
              },
            ].map((cat) => {
              const isActive = catalogFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCatalogFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-dark-bg font-extrabold shadow-sm'
                      : 'bg-admin-sidebar text-gray-400 hover:text-white border border-admin-border'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-black/20 text-black' : 'bg-admin-card text-gray-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o medida..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-cyan-500"
            />
            {catalogSearch && (
              <button
                type="button"
                onClick={() => setCatalogSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {catalogItems
            .filter((it) => {
              const matchesCat = catalogFilter === 'ALL' || it.category === catalogFilter;
              const matchesSearch =
                catalogSearch.trim() === '' ||
                it.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                (it.subtitle && it.subtitle.toLowerCase().includes(catalogSearch.toLowerCase())) ||
                (it.dimensions && it.dimensions.toLowerCase().includes(catalogSearch.toLowerCase()));
              return matchesCat && matchesSearch;
            })
            .map((item) => {
              const isDeleting = deleteConfirmId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-admin-sidebar border border-admin-border hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="space-y-2">
                    {/* Header Card: Icon, Category & Actions */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-admin-border/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xl p-1.5 rounded-lg bg-admin-card border border-admin-border">
                          {item.iconText || '🪑'}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-admin-hover text-cyan-300 border border-admin-border uppercase font-semibold">
                            {item.category}
                          </span>
                          <span className="block text-[10px] text-gray-500 font-mono mt-0.5">
                            ID: {item.id}
                          </span>
                        </div>
                      </div>

                      {/* Top Action Icons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-admin-card hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-300 border border-admin-border transition-colors"
                          title="Editar todos los valores de este artículo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 rounded-lg bg-admin-card hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-admin-border transition-colors"
                          title="Eliminar totalmente este artículo del catálogo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Article Details */}
                    <div>
                      <h4 className="font-extrabold text-white text-sm leading-snug">{item.name}</h4>
                      {item.subtitle && (
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.subtitle}</p>
                      )}
                      {item.dimensions && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-dark-bg/60 text-gray-300 font-mono text-[10px] border border-admin-border/50">
                          <span>📐 Medidas: {item.dimensions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Confirmation Section */}
                  <div className="pt-2 border-t border-admin-border/60 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-400 font-medium">Precio Base:</span>
                      <span className="font-mono text-cyan-300 font-extrabold text-sm">
                        RD$ {item.basePrice.toLocaleString('es-DO')}
                        {item.isCustomRug && (
                          <span className="text-[10px] text-gray-400 font-normal"> / m²</span>
                        )}
                      </span>
                    </div>

                    {(item.category === 'Colchones' || item.bothSidesPrice !== undefined) && (
                      <div className="flex items-baseline justify-between text-[11px]">
                        <span className="text-gray-400">Ambos Lados:</span>
                        <span className="font-mono text-indigo-300 font-bold">
                          RD${' '}
                          {(item.bothSidesPrice || item.basePrice + 500).toLocaleString('es-DO')}
                        </span>
                      </div>
                    )}

                    {/* Inline Delete Confirmation Prompt */}
                    {isDeleting && (
                      <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs space-y-2 animate-fadeIn mt-2">
                        <span className="block font-bold">
                          ¿Eliminar definitivamente este artículo del catálogo?
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            Sí, Eliminar Total
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 rounded-lg bg-admin-card hover:bg-admin-hover text-gray-300 font-semibold text-[11px] border border-admin-border transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Edit Action Button */}
                    {!isDeleting && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="w-full mt-1 py-1.5 rounded-lg bg-admin-card hover:bg-cyan-500/10 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 font-semibold border border-admin-border text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Edit3 className="w-3 h-3 text-cyan-400" />
                        <span>Editar Valores & Precio</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Empty State */}
        {catalogItems.filter((it) => {
          const matchesCat = catalogFilter === 'ALL' || it.category === catalogFilter;
          const matchesSearch =
            catalogSearch.trim() === '' ||
            it.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
            (it.subtitle && it.subtitle.toLowerCase().includes(catalogSearch.toLowerCase()));
          return matchesCat && matchesSearch;
        }).length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-admin-sidebar border border-admin-border space-y-3">
            <Package className="w-8 h-8 text-gray-500 mx-auto" />
            <span className="block text-sm font-bold text-gray-300">
              No se encontraron artículos con los filtros aplicados.
            </span>
            <button
              type="button"
              onClick={() => {
                setCatalogFilter('ALL');
                setCatalogSearch('');
              }}
              className="px-3 py-1.5 rounded-lg bg-admin-card text-cyan-300 border border-admin-border text-xs font-semibold hover:bg-admin-hover"
            >
              Limpiar Filtros
            </button>
          </div>
        )}

        {/* Zonas de Cobertura Exclusivas Informativas */}
        <div className="pt-4 border-t border-admin-border">
          <div className="flex items-center justify-between pb-2 mb-3">
            <span className="font-bold text-white text-xs flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zonas de Cobertura Exclusiva (Consumo Mínimo a Domicilio RD$ 1,500)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">100% Operativo</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-admin-sidebar border border-admin-border">
              <span className="font-bold text-cyan-300 block mb-0.5">San Pedro de Macorís</span>
              <span className="text-gray-400 text-[11px]">
                Casco Urbano, Consuelo, Quisqueya, Guayacanes, Ramón Santana, Gautier.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-admin-sidebar border border-admin-border">
              <span className="font-bold text-indigo-300 block mb-0.5">La Romana</span>
              <span className="text-gray-400 text-[11px]">
                Municipio Cabecera, Guaymate, Villa Hermosa, Caleta, Buena Vista.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-admin-sidebar border border-admin-border">
              <span className="font-bold text-emerald-300 block mb-0.5">Santo Domingo Este</span>
              <span className="text-gray-400 text-[11px]">
                Alma Rosa, Ens. Ozama, San Isidro, Lucerna, Los Frailes, Las Américas.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Crear o Editar Artículo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-admin-card border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl admin-glow-cyan max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-admin-border">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <span>
                    {isEditing ? `Editar Artículo: ${formItem.name}` : 'Crear Nuevo Artículo'}
                  </span>
                </h3>
                <span className="text-xs text-gray-400">
                  {isEditing
                    ? 'Modifica los valores comerciales y tarifas.'
                    : 'Ingresa los datos para incorporar el nuevo servicio al cotizador.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-admin-sidebar hover:bg-admin-hover text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Nombre */}
              <div>
                <label className="block text-gray-300 font-bold mb-1">Nombre del Artículo *</label>
                <input
                  type="text"
                  value={formItem.name}
                  onChange={(e) => setFormItem((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Colchón Queen Size, Sofá Reclinable 3 Plazas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Categoría & Icono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Categoría Principal *</label>
                  <select
                    value={formItem.category}
                    onChange={(e) => handleFormCategoryChange(e.target.value as MainCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Colchones">Colchones</option>
                    <option value="Muebles de Sala">Muebles de Sala</option>
                    <option value="Sillas de Comedor">Sillas de Comedor</option>
                    <option value="Alfombras">Alfombras</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Icono / Emoji *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formItem.iconText}
                      onChange={(e) =>
                        setFormItem((prev) => ({ ...prev, iconText: e.target.value }))
                      }
                      className="w-16 text-center text-lg px-2 py-2 rounded-xl bg-admin-sidebar border border-admin-border text-white focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex items-center gap-1">
                      {['🛏️', '🛋️', '🪑', '🧶', '📏', '✨'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormItem((prev) => ({ ...prev, iconText: emoji }))}
                          className="w-7 h-7 rounded-lg bg-admin-sidebar hover:bg-admin-hover text-sm flex items-center justify-center border border-admin-border"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Precios: Base y Ambos Lados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">
                    Precio Base (RD$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-cyan-400 font-bold">
                      RD$
                    </span>
                    <input
                      type="number"
                      value={formItem.basePrice}
                      onChange={(e) =>
                        setFormItem((prev) => ({ ...prev, basePrice: Number(e.target.value) }))
                      }
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white font-mono font-bold text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {formItem.category === 'Colchones' && (
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">
                      Precio Ambos Lados (RD$)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-indigo-400 font-bold">
                        RD$
                      </span>
                      <input
                        type="number"
                        value={formItem.bothSidesPrice ?? formItem.basePrice + 500}
                        onChange={(e) =>
                          setFormItem((prev) => ({
                            ...prev,
                            bothSidesPrice: Number(e.target.value),
                          }))
                        }
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white font-mono font-bold text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subtítulo / Descripción */}
              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Subtítulo / Descripción Comercial
                </label>
                <input
                  type="text"
                  value={formItem.subtitle}
                  onChange={(e) => setFormItem((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Ej: 1 lado RD$ 2,500 · Ambos lados RD$ 3,000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Dimensiones */}
              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Dimensiones / Medidas (Opcional)
                </label>
                <input
                  type="text"
                  value={formItem.dimensions}
                  onChange={(e) =>
                    setFormItem((prev) => ({ ...prev, dimensions: e.target.value }))
                  }
                  placeholder="Ej: 2.00m × 1.50m (~3.0 m²)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Flags adicionales */}
              <div className="pt-2 border-t border-admin-border/60 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Comportamiento Especial en el Cotizador
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formItem.isSofaModular}
                      onChange={(e) =>
                        setFormItem((prev) => ({ ...prev, isSofaModular: e.target.checked }))
                      }
                      className="w-4 h-4 rounded accent-cyan-400"
                    />
                    <span>Modular en L (+RD$ 500/plaza extra)</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formItem.isCustomRug}
                      onChange={(e) =>
                        setFormItem((prev) => ({ ...prev, isCustomRug: e.target.checked }))
                      }
                      className="w-4 h-4 rounded accent-cyan-400"
                    />
                    <span>Alfombra por m² personalizado</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-admin-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-admin-sidebar hover:bg-admin-hover text-gray-300 font-semibold text-xs border border-admin-border transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md admin-glow-cyan active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Guardar Cambios' : 'Crear Artículo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
