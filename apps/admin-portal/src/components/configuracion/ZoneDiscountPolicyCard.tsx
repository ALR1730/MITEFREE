'use client';

import React from 'react';
import { Tag, Trash2, MapPin, Clock } from 'lucide-react';
import type { DiscountPolicyConfig } from '@mitefree/shared-types';

interface ZoneDiscountPolicyCardProps {
  discountPolicy: DiscountPolicyConfig;
  onToggleZone: (zoneCode: string) => void;
  onChangeZoneDiscount: (zoneCode: string, percentage: number) => void;
  onToggleSlot: (slotCode: string) => void;
  onChangeSlotDiscount: (slotCode: string, percentage: number) => void;
  onResetDiscounts: () => void;
}

export function ZoneDiscountPolicyCard({
  discountPolicy,
  onToggleZone,
  onChangeZoneDiscount,
  onToggleSlot,
  onChangeSlotDiscount,
  onResetDiscounts,
}: ZoneDiscountPolicyCardProps) {
  return (
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
          onClick={onResetDiscounts}
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
                    onChange={() => onToggleZone(zone.zoneCode)}
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
                      onChangeZoneDiscount(zone.zoneCode, Number(e.target.value))
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
                    onChange={() => onToggleSlot(slot.slotCode)}
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
                      onChangeSlotDiscount(slot.slotCode, Number(e.target.value))
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
  );
}
