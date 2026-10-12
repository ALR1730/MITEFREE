'use client';

import React from 'react';
import { User, ChevronDown } from 'lucide-react';
import { LocationMapPicker } from './LocationMapPicker';

interface ContactDetailsSectionProps {
  fullName: string;
  phone: string;
  address: string;
  selectedZoneCode?: string;
  onChangeFullName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onChangeAddress: (val: string) => void;
  onGoToSummary: () => void;
}

export function ContactDetailsSection({
  fullName,
  phone,
  address,
  selectedZoneCode,
  onChangeFullName,
  onChangePhone,
  onChangeAddress,
  onGoToSummary,
}: ContactDetailsSectionProps) {
  const isComplete = fullName.trim() && phone.trim() && address.trim();

  return (
    <div
      id="agenda-address-section"
      className="glass-card rounded-2xl p-6 border border-dark-border scroll-mt-24 space-y-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-400" />
          <span>4. ¿Dónde realizaremos el servicio?</span>
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          {isComplete ? '✓ Datos Listos' : 'Paso 4 de 5'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1">
            Nombre Completo
          </label>
          <input
            type="text"
            required
            placeholder="ej: María Mercedes Guzmán"
            value={fullName}
            onChange={(e) => onChangeFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1">
            Teléfono / WhatsApp de Notificaciones
          </label>
          <input
            type="tel"
            required
            placeholder="ej: +1 809-555-0199"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Selector de Ubicación con Mapa Google Maps e Interactivo */}
      <div className="pt-2 border-t border-dark-border/60">
        <div className="mb-3">
          <h3 className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
            <span>Ubicación Exacta en el Mapa de Google</span>
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Puedes detectar tu ubicación vía GPS con 1 toque o mover el pin en el mapa hacia tu residencia.
          </p>
        </div>

        <LocationMapPicker
          currentAddress={address}
          selectedZoneCode={selectedZoneCode}
          onChangeAddress={onChangeAddress}
        />
      </div>

      <div className="pt-2 text-right">
        <button
          type="button"
          onClick={onGoToSummary}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 hover:text-white cursor-pointer transition-colors"
        >
          <span>Revisar Resumen y Confirmar Cita ⬇️</span>
          <ChevronDown className="w-3.5 h-3.5 text-brand-400" />
        </button>
      </div>
    </div>
  );
}
