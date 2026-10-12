'use client';

import React from 'react';
import { Clock, Tag, ChevronDown, AlertTriangle, ArrowRight } from 'lucide-react';
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
  onSelectNextDay?: () => void;
  nextDayLabel?: string;
}

export function TimeSlotSection({
  selectedSlot,
  currentSlotObj,
  totalPromoDiscountPct,
  dynamicSlots,
  discountPolicy,
  onSelectSlot,
  onScrollToSection,
  onSelectNextDay,
  nextDayLabel,
}: TimeSlotSectionProps) {
  const allSlotsFull = dynamicSlots.length > 0 && dynamicSlots.every((s) => !s.available);

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
          {currentSlotObj.available ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              ✓ {currentSlotObj.label}
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              ⚠️ {currentSlotObj.label} (Agotado)
            </span>
          )}
        </div>
        {totalPromoDiscountPct > 0 && currentSlotObj.available && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 self-start sm:self-auto">
            <Tag className="w-3.5 h-3.5" />
            <span>{totalPromoDiscountPct}% Descuento Promocional Activo</span>
          </span>
        )}
      </div>

      {/* Banner de recomendación cuando todas las cuadrillas del día están ocupadas */}
      {allSlotsFull && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="block text-white font-semibold text-xs sm:text-sm">
                Todas nuestras cuadrillas están reservadas para este día
              </strong>
              <span className="text-gray-300 text-[11px]">
                No quedan turnos disponibles en esta zona para la fecha seleccionada.
              </span>
            </div>
          </div>
          {onSelectNextDay && (
            <button
              type="button"
              onClick={onSelectNextDay}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-500/25 hover:bg-brand-500/35 text-brand-300 border border-brand-500/50 text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center shadow-sm"
            >
              <span>{nextDayLabel ? `Ver turnos: ${nextDayLabel}` : 'Ver siguiente día disponible'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {dynamicSlots.map((slot) => {
          const sPolicy = discountPolicy.slots.find((s) => s.slotCode === slot.id);
          const hasSlotDiscount =
            (sPolicy?.enabled ?? false) && (sPolicy?.discountPercentage ?? 0) > 0;
          const isSlotAvailable = slot.available;
          const isSelected = selectedSlot === slot.id;

          return (
            <button
              type="button"
              key={slot.id}
              disabled={!isSlotAvailable}
              onClick={() => isSlotAvailable && onSelectSlot(slot.id)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                !isSlotAvailable
                  ? 'border-rose-500/20 bg-dark-surface/30 opacity-45 grayscale cursor-not-allowed select-none text-gray-500'
                  : isSelected
                  ? 'border-indigo-500 bg-indigo-500/15 tech-glow text-white scale-[1.01] cursor-pointer'
                  : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-300 cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className={`font-bold text-sm ${isSlotAvailable ? 'text-white' : 'text-gray-400'}`}>
                  {slot.label}
                </span>
                {!isSlotAvailable && (
                  <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
                    Cupo Lleno
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 font-mono mb-2">{slot.time}</p>

              {!isSlotAvailable ? (
                <span className="inline-block text-[10px] text-rose-400/80 font-medium">
                  Sin cuadrillas disponibles
                </span>
              ) : hasSlotDiscount ? (
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
