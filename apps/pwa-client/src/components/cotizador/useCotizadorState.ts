'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';
import {
  type CatalogItem,
  type FabricType,
  type StainSeverity,
  type CreateQuotationRequestDto,
  DEFAULT_CATALOG_ITEMS,
} from '@mitefree/shared-types';
import type {
  SelectedQuoteItem,
  MainCategoryId,
  FabricOption,
  StainOption,
  UploadedPhoto,
} from './cotizador.types';
import {
  FABRIC_OPTIONS,
  STAIN_OPTIONS,
  MAIN_CATEGORIES,
  MIN_DOMICILE_ORDER_RD,
} from './cotizador.constants';

export function useCotizadorState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmittingQuotation, setIsSubmittingQuotation] = useState<boolean>(false);
  const [persistedQuotationId, setPersistedQuotationId] = useState<string | null>(null);

  const initialCat = searchParams.get('category') as MainCategoryId | null;
  const validInitialCat: MainCategoryId =
    initialCat &&
    ['Colchones', 'Muebles de Sala', 'Sillas de Comedor', 'Alfombras'].includes(initialCat)
      ? initialCat
      : 'Colchones';

  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategoryId>(validInitialCat);

  // Catálogo dinámico reactivo sincronizado con Admin Portal y API
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(DEFAULT_CATALOG_ITEMS);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await apiClient.catalog.getAll();
        if (res.success && res.data && res.data.length > 0) {
          setCatalogItems(res.data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mitefree_catalog_items', JSON.stringify(res.data));
          }
          return;
        }
      } catch {
        // Fallback a almacenamiento local
      }

      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('mitefree_catalog_items');
        if (cached) {
          try {
            setCatalogItems(JSON.parse(cached));
          } catch {
            // Ignorar
          }
        }
      }
    }
    loadCatalog();
  }, []);

  const getCategoryStartingPrice = (catId: MainCategoryId) => {
    const items = catalogItems.filter((i) => i.category === catId);
    if (items.length === 0) return 'Tarifa personalizada';
    const min = Math.min(...items.map((i) => i.basePrice));
    if (catId === 'Sillas de Comedor') return `RD$ ${min.toLocaleString('es-DO')} por silla`;
    return `Desde RD$ ${min.toLocaleString('es-DO')}`;
  };

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
      const available = catalogItems.filter((c) => c.category === cat);
      const def =
        available[0]?.id ||
        MAIN_CATEGORIES.find((c) => c.id === cat)?.defaultItemId ||
        'mat-full';
      setSelectedItemId(def);
    }
  }, [searchParams, catalogItems]);

  const scrollToSection = (sectionId: string, offset = 80) => {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }, 80);
  };

  const handleSelectCategory = (catId: MainCategoryId) => {
    setSelectedMainCategory(catId);
    const available = catalogItems.filter((c) => c.category === catId);
    if (available.length > 0 && !available.some((i) => i.id === selectedItemId)) {
      setSelectedItemId(available[0]!.id);
    }
    scrollToSection('customizer-section', 70);
  };

  const handleSelectModel = (itemId: string) => {
    setSelectedItemId(itemId);
    const item = catalogItems.find((it) => it.id === itemId);
    if (item?.isMattress || item?.category === 'Colchones') {
      scrollToSection('mattress-sides-section', 80);
    } else if (item?.isSofaModular || itemId === 'sofa-5') {
      scrollToSection('sofa-modular-section', 80);
    } else if (item?.isCustomRug || itemId === 'rug-custom') {
      scrollToSection('rug-custom-section', 80);
    } else {
      scrollToSection('active-quantity-section', 80);
    }
  };

  const handleSelectBothSides = (both: boolean) => {
    setTempBothSides((prev) => ({ ...prev, [selectedItemId]: both }));
    scrollToSection('active-quantity-section', 80);
  };

  const handleSelectChairPreset = (count: number) => {
    setTempQuantity((prev) => ({
      ...prev,
      [selectedItemId]: count,
    }));
    scrollToSection('active-quantity-section', 80);
  };

  // Carrito multi-item de artículos seleccionados
  const [selectedItems, setSelectedItems] = useState<SelectedQuoteItem[]>([]);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  const getCategoryCount = (catName: string) => {
    return selectedItems
      .filter((it) => it.category === catName)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  // Estados locales temporales para configurar artículos
  const [tempBothSides, setTempBothSides] = useState<Record<string, boolean>>({});
  const [tempExtraSeats, setTempExtraSeats] = useState<Record<string, number>>({});
  const [tempQuantity, setTempQuantity] = useState<Record<string, number>>({});

  // Medidas dinámicas para alfombra personalizada
  const [customLength, setCustomLength] = useState<number>(2.5);
  const [customWidth, setCustomWidth] = useState<number>(2.0);

  // Paso 2: Tejido, manchas y fotos
  const [selectedFabric, setSelectedFabric] = useState<FabricOption>(FABRIC_OPTIONS[0]!);
  const [selectedStain, setSelectedStain] = useState<StainOption>(STAIN_OPTIONS[0]!);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);

  // Paso 3: Promociones y Billetera
  const [promoCode, setPromoCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [useWalletCashback, setUseWalletCashback] = useState<boolean>(false);

  const walletBalanceAvailable = user?.walletBalance ?? 500.0;

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const handleSelectFabric = (fab: FabricOption) => {
    setSelectedFabric(fab);
    scrollToSection('stains-section', 70);
  };

  const handleSelectStain = (stain: StainOption) => {
    setSelectedStain(stain);
    scrollToSection('step2-actions-section', 70);
  };

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
    setTempQuantity((prev) => ({ ...prev, [item.id]: item.isChair ? 4 : 1 }));
    setAddedFeedback(`¡${displayName} agregada a tu orden!`);
    setTimeout(() => {
      setAddedFeedback(null);
    }, 3500);
  };

  const currentCatalogItem =
    catalogItems.find((it) => it.id === selectedItemId) ||
    catalogItems.find((it) => it.category === selectedMainCategory) ||
    catalogItems[0] ||
    DEFAULT_CATALOG_ITEMS[0]!;

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

  const handleAddAndSelectAnother = () => {
    handleAddItem(currentCatalogItem);
    scrollToSection('categories-section', 80);
  };

  const handleProceedAndAddCurrent = () => {
    const bothSides = tempBothSides[currentCatalogItem.id] ?? false;
    const extraSeats = tempExtraSeats[currentCatalogItem.id] ?? 0;
    const qty = tempQuantity[currentCatalogItem.id] ?? (currentCatalogItem.isChair ? 4 : 1);
    const unitPrice = calculateCatalogUnitPrice(
      currentCatalogItem,
      bothSides,
      extraSeats,
      customLength,
      customWidth,
    );
    const itemTotal = unitPrice * qty;

    let rugDimStr: string | undefined = currentCatalogItem.dimensions;
    let displayName = currentCatalogItem.name;

    if (currentCatalogItem.isCustomRug) {
      const area = (customLength * customWidth).toFixed(1);
      rugDimStr = `${customLength.toFixed(1)}m × ${customWidth.toFixed(1)}m (~${area} m²)`;
      displayName = `Alfombra Personalizada (${rugDimStr})`;
    }

    const newItem: SelectedQuoteItem = {
      cartId: `${currentCatalogItem.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      catalogId: currentCatalogItem.id,
      name: displayName,
      category: currentCatalogItem.category,
      iconText: currentCatalogItem.iconText,
      bothSides,
      extraSeats,
      rugDimensions: rugDimStr,
      quantity: qty,
      unitPrice,
      itemTotal,
    };

    const updatedList = [...selectedItems, newItem];
    const updatedSubtotal = updatedList.reduce((acc, curr) => acc + curr.itemTotal, 0);

    if (updatedSubtotal < MIN_DOMICILE_ORDER_RD) {
      alert(
        `El servicio a domicilio requiere un consumo mínimo de RD$ 1,500. Te faltan RD$ ${(MIN_DOMICILE_ORDER_RD - updatedSubtotal).toLocaleString('es-DO')}.`,
      );
      return;
    }

    setSelectedItems(updatedList);
    goToStep(2);
  };

  const handleProceedWithExistingItems = () => {
    if (!isMinimumOrderMet) {
      alert(
        `El servicio a domicilio requiere un consumo mínimo de RD$ 1,500. Te faltan RD$ ${amountMissingForMinimum.toLocaleString('es-DO')}.`,
      );
      return;
    }
    goToStep(2);
  };

  const handleProceedFromCustomizer = () => {
    let currentList = [...selectedItems];
    if (currentList.length === 0) {
      const bothSides = tempBothSides[currentCatalogItem.id] ?? false;
      const extraSeats = tempExtraSeats[currentCatalogItem.id] ?? 0;
      const qty = tempQuantity[currentCatalogItem.id] ?? (currentCatalogItem.isChair ? 4 : 1);
      const unitPrice = calculateCatalogUnitPrice(
        currentCatalogItem,
        bothSides,
        extraSeats,
        customLength,
        customWidth,
      );
      const itemTotal = unitPrice * qty;

      let rugDimStr: string | undefined = currentCatalogItem.dimensions;
      let displayName = currentCatalogItem.name;

      if (currentCatalogItem.isCustomRug) {
        const area = (customLength * customWidth).toFixed(1);
        rugDimStr = `${customLength.toFixed(1)}m × ${customWidth.toFixed(1)}m (~${area} m²)`;
        displayName = `Alfombra Personalizada (${rugDimStr})`;
      }

      const newItem: SelectedQuoteItem = {
        cartId: `${currentCatalogItem.id}-${Date.now()}`,
        catalogId: currentCatalogItem.id,
        name: displayName,
        category: currentCatalogItem.category,
        iconText: currentCatalogItem.iconText,
        bothSides,
        extraSeats,
        rugDimensions: rugDimStr,
        quantity: qty,
        unitPrice,
        itemTotal,
      };
      currentList = [newItem];
      setSelectedItems(currentList);
    }

    const currentSubtotal = currentList.reduce((acc, curr) => acc + curr.itemTotal, 0);
    if (currentSubtotal < MIN_DOMICILE_ORDER_RD) {
      alert(
        `El servicio a domicilio requiere un consumo mínimo de RD$ 1,500. Te faltan RD$ ${(MIN_DOMICILE_ORDER_RD - currentSubtotal).toLocaleString('es-DO')}. Puedes agregar otra pieza o aumentar la cantidad.`,
      );
      return;
    }

    goToStep(2);
  };

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

  const handleRemoveItem = (cartId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const itemsSubtotal = selectedItems.reduce((acc, curr) => acc + curr.itemTotal, 0);
  const activeSubtotal = selectedItems.length > 0 ? itemsSubtotal : currentItemTotal;
  const totalItemsCount =
    selectedItems.length > 0
      ? selectedItems.reduce((acc, curr) => acc + curr.quantity, 0)
      : currentQty;

  const isMinimumOrderMet = activeSubtotal >= MIN_DOMICILE_ORDER_RD;
  const amountMissingForMinimum = Math.max(0, MIN_DOMICILE_ORDER_RD - activeSubtotal);
  const minProgressPercentage = Math.min(
    100,
    Math.round((activeSubtotal / MIN_DOMICILE_ORDER_RD) * 100),
  );

  const fabricMultiplier = selectedFabric.multiplier;
  const stainSurcharge = selectedStain.surcharge;

  const subtotalWithFabric = Math.round(
    activeSubtotal * fabricMultiplier + (activeSubtotal > 0 ? stainSurcharge : 0),
  );

  const discountApplied = couponDiscount;
  const subtotalAfterDiscount = Math.max(0, subtotalWithFabric - discountApplied);

  const maxRedeemableCap = Math.round(subtotalAfterDiscount * 0.5);
  const walletCreditApplied = useWalletCashback
    ? Math.min(walletBalanceAvailable, maxRedeemableCap)
    : 0;

  const total =
    activeSubtotal > 0
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
    const newPhoto: UploadedPhoto = {
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
    const itemsList = selectedItems
      .map(
        (it) =>
          `• ${it.quantity}x ${it.name}${it.bothSides ? ' (Ambos Lados)' : ''}${it.extraSeats > 0 ? ` (+${it.extraSeats} plazas)` : ''}${it.rugDimensions ? ` [${it.rugDimensions}]` : ''} -> RD$ ${Math.round(it.itemTotal).toLocaleString('es-DO')}`,
      )
      .join('\n');

    const msg = `¡Hola Mite Free Clean! 👋 Deseo solicitar el servicio de limpieza y desinfección a domicilio para las siguientes piezas:

${itemsList || `• ${currentCatalogItem.name} -> RD$ ${Math.round(currentItemTotal).toLocaleString('es-DO')}`}

📌 Tipo de Tela: ${selectedFabric.name}
💧 Nivel de Manchas: ${selectedStain.name}
💰 Inversión Total Estimada: RD$ ${Math.round(total).toLocaleString('es-DO')} (0% de anticipo)

¿Podrían confirmarme la disponibilidad de cuadrilla técnica? ¡Gracias!`;

    return encodeURIComponent(msg);
  };

  const handleProceedToSchedule = async () => {
    setIsSubmittingQuotation(true);
    try {
      const quotationPayload: CreateQuotationRequestDto = {
        clientId:
          user?.id && user.id.length === 36
            ? user.id
            : '00000000-0000-0000-0000-000000000000',
        items: (selectedItems.length > 0
          ? selectedItems
          : [
              {
                cartId: `${currentCatalogItem.id}-default`,
                catalogId: currentCatalogItem.id,
                name: currentCatalogItem.name,
                category: currentCatalogItem.category,
                iconText: currentCatalogItem.iconText,
                bothSides: currentBothSides,
                extraSeats: currentExtraSeats,
                quantity: currentQty,
                unitPrice: currentUnitPrice,
                itemTotal: currentItemTotal,
              },
            ]
        ).flatMap((item) =>
          Array.from({ length: item.quantity }).map(() => ({
            furnitureType: item.name,
            fabricType: selectedFabric.id as FabricType,
            stainSeverity: selectedStain.id as StainSeverity,
            basePriceAmount: item.unitPrice,
            photoUrls: [],
          })),
        ),
        discountCode: couponApplied ? promoCode : undefined,
      };

      const res = await apiClient.quotations.create(quotationPayload);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'mitefree_quote_summary',
          JSON.stringify({
            items: selectedItems,
            total,
            deposit: Math.round(total * 0.3),
            fabric: selectedFabric.name,
            stain: selectedStain.name,
          }),
        );
      }
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

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'mitefree_quote_summary',
        JSON.stringify({
          items: selectedItems,
          total,
          deposit: Math.round(total * 0.3),
          fabric: selectedFabric.name,
          stain: selectedStain.name,
        }),
      );
    }
    router.push(`/agenda?total=${total}&deposit=${Math.round(total * 0.3)}`);
  };

  const filteredCatalog = catalogItems.filter((item) => {
    return item.category === selectedMainCategory;
  });

  return {
    currentStep,
    goToStep,
    scrollToSection,
    catalogItems,
    selectedMainCategory,
    handleSelectCategory,
    getCategoryStartingPrice,
    getCategoryCount,
    selectedItemId,
    handleSelectModel,
    filteredCatalog,
    currentCatalogItem,
    tempBothSides,
    tempExtraSeats,
    tempQuantity,
    setTempQuantity,
    setTempExtraSeats,
    customLength,
    setCustomLength,
    customWidth,
    setCustomWidth,
    currentBothSides,
    currentExtraSeats,
    currentQty,
    currentUnitPrice,
    currentItemTotal,
    handleSelectBothSides,
    handleSelectChairPreset,
    selectedItems,
    addedFeedback,
    handleAddItem,
    handleUpdateItemQuantity,
    handleRemoveItem,
    handleAddAndSelectAnother,
    handleProceedAndAddCurrent,
    handleProceedWithExistingItems,
    handleProceedFromCustomizer,
    itemsSubtotal,
    activeSubtotal,
    totalItemsCount,
    isMinimumOrderMet,
    amountMissingForMinimum,
    minProgressPercentage,
    selectedFabric,
    selectedStain,
    handleSelectFabric,
    handleSelectStain,
    uploadedPhotos,
    handleFileUpload,
    handleRemovePhoto,
    fabricMultiplier,
    stainSurcharge,
    subtotalWithFabric,
    promoCode,
    setPromoCode,
    couponApplied,
    couponDiscount,
    handleApplyCoupon,
    useWalletCashback,
    setUseWalletCashback,
    walletBalanceAvailable,
    walletCreditApplied,
    total,
    isSubmittingQuotation,
    handleProceedToSchedule,
    generateWhatsAppMessage,
  };
}
