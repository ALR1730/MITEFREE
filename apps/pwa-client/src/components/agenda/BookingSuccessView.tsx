'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface BookingSuccessViewProps {
  bookedAppointmentId: string | null;
  fullName: string;
  selectedDateObj: { dayNum: number; month: string };
  displaySlotLabel: string;
  currentZoneObj: { name: string };
  address: string;
  effectiveTotal: number;
  totalPromoDiscountPct: number;
}

export function BookingSuccessView({
  bookedAppointmentId,
  fullName,
  selectedDateObj,
  displaySlotLabel,
  currentZoneObj,
  address,
  effectiveTotal,
  totalPromoDiscountPct,
}: BookingSuccessViewProps) {
  return (
    <div className="glass-card rounded-2xl p-8 border border-emerald-500/40 animate-fadeIn text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center tech-glow">
        <CheckCircle className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          ¡Cita Reservada con Éxito!
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Hemos asignado la ventana horaria en el sistema de despacho y cuadrilla técnica de MITEFREE.
        </p>
        {bookedAppointmentId && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs border border-emerald-500/30">
            <span>Cita ID: #{bookedAppointmentId.substring(0, 8).toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="p-5 rounded-xl bg-dark-surface/80 border border-dark-border text-left space-y-3 max-w-md mx-auto text-xs">
        <div className="flex justify-between border-b border-dark-border/40 pb-2">
          <span className="text-gray-400">Cliente:</span>
          <span className="font-bold text-white">{fullName}</span>
        </div>
        <div className="flex justify-between border-b border-dark-border/40 pb-2">
          <span className="text-gray-400">Fecha y Bloque:</span>
          <span className="font-bold text-cyan-400">
            {selectedDateObj.dayNum} de {selectedDateObj.month} ({displaySlotLabel})
          </span>
        </div>
        <div className="flex justify-between border-b border-dark-border/40 pb-2">
          <span className="text-gray-400">Zona / Sector:</span>
          <span className="font-bold text-white">{currentZoneObj.name}</span>
        </div>
        <div className="flex justify-between border-b border-dark-border/40 pb-2">
          <span className="text-gray-400">Dirección:</span>
          <span className="font-mono text-gray-300">{address}</span>
        </div>
        <div className="flex justify-between border-b border-dark-border/40 pb-2">
          <span className="text-gray-400">Total a Pagar:</span>
          <span className="font-mono font-bold text-brand-300">
            RD$ {effectiveTotal.toLocaleString('es-DO')} (0% anticipo)
          </span>
        </div>
        {totalPromoDiscountPct > 0 && (
          <div className="flex justify-between pt-1 text-emerald-400 font-bold">
            <span>Bonificación Aplicada:</span>
            <span>
              {totalPromoDiscountPct}% Descuento Promocional ({currentZoneObj.name})
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
        <Link
          href="/mis-citas"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-xs tech-glow"
        >
          <span>Ver en Mis Citas (Live Tracking)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
