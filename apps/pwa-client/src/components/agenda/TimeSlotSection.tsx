'use client';

import React from 'react';
import { Clock, Tag, ChevronDown } from 'lucide-react';
import type { DiscountPolicyConfig } from '@mitefree/shared-types';

export interface SlotItem {
  id: string;
  label: string;
  time: string;
  available: boolean;
}

interface TimeSlotSectionProps {
  selectedSlot: string;
  currentSlotObj: SlotItem;
  totalPromoDiscountPct: number;
  dynamicSlots: SlotItem[];
  discountPolicy: DiscountPolicyConfig;
  onSelectSlot: (slotId: string) => void;
  onScrollToSection: (sectionId: string, offset?: number) => void;
}

export function TimeSlotSection({
  selectedSlot,
  currentSlotObj,
  totalPromoDiscountPct,
  dynamicSlots,
  discountPolicy,
  onSelectSlot,
  onScrollToSection,
}: TimeSlotSectionProps) {
  return (
    <div
      id="agenda-slot-section"
      className="glass-card rounded-2xl p-6 border border-dark-border scroll-mt-24 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>3. Elige tu Turno Preferido</span>
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            ✓ {currentSlotObj.label}
          </span>
        </div>
        {totalPromoDiscountPct > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 self-start sm:self-auto">
            <Tag className="w-3.5 h-3.5" />
            <span>{totalPromoDiscountPct}% Descuento Promocional Activo</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {dynamicSlots.map((slot) => {
          const sPolicy = discountPolicy.slots.find((s) => s.slotCode === slot.id);
          const hasSlotDiscount =
            (sPolicy?.enabled ?? false) && (sPolicy?.discountPercentage ?? 0) > 0;

          return (
            <button
              type="button"
              key={slot.id}
              onClick={() => onSelectSlot(slot.id)}
              className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                selectedSlot === slot.id
                  ? 'border-indigo-500 bg-indigo-500/15 tech-glow text-white scale-[1.01]'
                  : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-300'
              }`}
            >
              <div className="font-bold text-sm text-white mb-1">{slot.label}</div>
              <p className="text-xs text-gray-400 font-mono mb-2">{slot.time}</p>
              {hasSlotDiscount ? (
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {sPolicy!.discountPercentage}% Descuento Horario
                </span>
              ) : (
                <span className="inline-block text-[10px] text-gray-500">Tarifa Estándar</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2 text-right">
        <button
          type="button"
          onClick={() => onScrollToSection('agenda-address-section', 80)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors"
        >
          <span>Siguiente: ¿Dónde realizaremos el servicio? ⬇️</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
