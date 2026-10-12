'use client';

import React from 'react';
import {
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  Lock,
} from 'lucide-react';

interface BookingConfirmSectionProps {
  selectedDateObj: { dayName: string; dayNum: number; month: string };
  displaySlotLabel: string;
  currentZoneObj: { name: string };
  address: string;
  effectiveTotal: number;
  fullName: string;
  phone: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  isSlotAvailable?: boolean;
}

export function BookingConfirmSection({
  selectedDateObj,
  displaySlotLabel,
  currentZoneObj,
  address,
  effectiveTotal,
  fullName,
  phone,
  isSubmitting,
  errorMessage,
  isSlotAvailable = true,
}: BookingConfirmSectionProps) {
  return (
    <div
      id="agenda-summary-section"
      className="p-6 rounded-2xl bg-dark-surface/95 border border-brand-500/40 tech-glow scroll-mt-24 space-y-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-dark-border/60 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-extrabold text-white text-base">
            5. Resumen del Servicio & Confirmación
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Garantía de Satisfacción 100%
        </span>
      </div>

      {/* Tarjeta con los datos consolidados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-dark-bg/70 p-4 rounded-xl border border-dark-border/60">
        <div className="space-y-1">
          <span className="text-gray-400 block text-[11px]">Día y Horario:</span>
          <strong className="text-white block">
            {selectedDateObj.dayName} {selectedDateObj.dayNum} de {selectedDateObj.month}
          </strong>
          <span className={isSlotAvailable ? "text-cyan-300 font-mono text-[11px]" : "text-rose-400 font-mono text-[11px] font-bold"}>
            {displaySlotLabel} {!isSlotAvailable && "(Cupo Lleno)"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-gray-400 block text-[11px]">Zona de Servicio:</span>
          <strong className="text-white block">{currentZoneObj.name}</strong>
          <span className="text-gray-300 text-[11px] truncate block">
            {address || '(Indicar dirección en el paso 4)'}
          </span>
        </div>

        <div className="space-y-1 sm:col-span-2 pt-2 border-t border-dark-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-gray-400 text-[11px]">Inversión Total Estimada:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-brand-300">
                RD$ {effectiveTotal.toLocaleString('es-DO')}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                (0% anticipo · Pagas tras inspeccionar)
              </span>
            </div>
          </div>
          <div className="text-[11px] text-gray-400">
            Cliente: <strong className="text-white">{fullName || 'Por definir'}</strong> · Tel:{' '}
            <strong className="text-white">{phone || 'Por definir'}</strong>
          </div>
        </div>
      </div>

      {!isSlotAvailable && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>
            El turno seleccionado actualmente no tiene cuadrillas disponibles. Por favor selecciona otro turno con cupo en la sección 3.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Botón de Confirmación Principal */}
      <button
        type="submit"
        disabled={isSubmitting || !isSlotAvailable}
        className={`w-full flex items-center justify-center gap-2 py-4 px-8 rounded-full font-extrabold text-base transition-all shadow-xl ${
          !isSlotAvailable
            ? 'bg-dark-surface border border-rose-500/30 text-rose-300/80 cursor-not-allowed opacity-60'
            : isSubmitting
            ? 'bg-dark-surface border border-brand-500/30 text-gray-400 cursor-wait opacity-60'
            : 'bg-gradient-to-r from-brand-500 via-cyan-500 to-brand-400 text-dark-bg tech-glow active:scale-95 hover:opacity-95 cursor-pointer'
        }`}
      >
        {isSubmitting ? (
          <span>Registrando cita en el despachador...</span>
        ) : !isSlotAvailable ? (
          <span>🚫 Turno Sin Cuadrilla — Selecciona Otro Horario</span>
        ) : (
          <>
            <CalendarCheck className="w-5 h-5 stroke-[2.5]" />
            <span>Confirmar Cita a Domicilio (RD$ {effectiveTotal.toLocaleString('es-DO')})</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-center text-[11px] text-gray-400">
        <Lock className="w-3.5 h-3.5 text-gray-500" />
        <span>Reserva sin compromiso · Cancelación o reprogramación gratuita vía WhatsApp</span>
      </div>
    </div>
  );
}
