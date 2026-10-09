'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import {
  DEFAULT_DISCOUNT_POLICY,
  DEFAULT_CATALOG_ITEMS,
  type DiscountPolicyConfig,
  type CatalogItem,
} from '@mitefree/shared-types';
import { adminApiClient } from '@/lib/api-client';
import {
  FinancialRulesCard,
  ZoneDiscountPolicyCard,
  CatalogManager,
  LiveSimulatorCard,
} from '@/components/configuracion/index';

export default function ConfiguracionPage() {
  const [depositRate, setDepositRate] = useState<number>(0);
  const [cashbackRate, setCashbackRate] = useState<number>(5);
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [saved, setSaved] = useState<boolean>(false);

  const [discountPolicy, setDiscountPolicy] =
    useState<DiscountPolicyConfig>(DEFAULT_DISCOUNT_POLICY);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(DEFAULT_CATALOG_ITEMS);

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

    async function loadCatalog() {
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
        // Fallback to localStorage
      }

      if (typeof window !== 'undefined') {
        const savedLocal = localStorage.getItem('mitefree_catalog_items');
        if (savedLocal) {
          try {
            setCatalogItems(JSON.parse(savedLocal));
            return;
          } catch {
            // Ignore parse errors
          }
        }
      }
      setCatalogItems(DEFAULT_CATALOG_ITEMS);
    }

    loadDiscounts();
    loadCatalog();
  }, []);

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

      <FinancialRulesCard
        depositRate={depositRate}
        setDepositRate={setDepositRate}
        cashbackRate={cashbackRate}
        setCashbackRate={setCashbackRate}
        expirationDays={expirationDays}
        setExpirationDays={setExpirationDays}
        commissionRate={commissionRate}
        setCommissionRate={setCommissionRate}
      />

      <CatalogManager
        catalogItems={catalogItems}
        setCatalogItems={setCatalogItems}
      />

      <ZoneDiscountPolicyCard
        discountPolicy={discountPolicy}
        onToggleZone={handleToggleZone}
        onChangeZoneDiscount={handleChangeZoneDiscount}
        onToggleSlot={handleToggleSlot}
        onChangeSlotDiscount={handleChangeSlotDiscount}
        onResetDiscounts={handleResetDiscounts}
      />

      <LiveSimulatorCard
        discountPolicy={discountPolicy}
        depositRate={depositRate}
      />
    </form>
  );
}
