'use client';

import React from 'react';
import { MapPin, Zap, ChevronDown } from 'lucide-react';
import { COVERAGE_ZONES } from './types';
import type { DiscountPolicyConfig } from '@mitefree/shared-types';

interface ZoneSelectorSectionProps {
  selectedZone: string;
  currentZoneObj: (typeof COVERAGE_ZONES)[0];
  discountPolicy: DiscountPolicyConfig;
  onSelectZone: (zoneId: string) => void;
  onScrollToSection: (sectionId: string, offset?: number) => void;
}

export function ZoneSelectorSection({
  selectedZone,
  currentZoneObj,
  discountPolicy,
  onSelectZone,
  onScrollToSection,
}: ZoneSelectorSectionProps) {
  return (
    <div
      id="agenda-zone-section"
      className="glass-card rounded-2xl p-6 border border-dark-border scroll-mt-24 space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>2. Selecciona tu Ciudad / Sector</span>
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          ✓ {currentZoneObj.name}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COVERAGE_ZONES.map((zone) => {
          const zPolicy = discountPolicy.zones.find((z) => z.zoneCode === zone.id);
          const hasZoneDiscount =
            (zPolicy?.enabled ?? false) && (zPolicy?.discountPercentage ?? 0) > 0;

          return (
            <button
              type="button"
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedZone === zone.id
                  ? 'border-cyan-500 bg-cyan-500/10 tech-glow text-white scale-[1.01]'
                  : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-white">{zone.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-bg/80 text-cyan-400 border border-cyan-500/20">
                  {zone.id}
                </span>
              </div>
              <p className="text-xs text-gray-400">{zone.areas}</p>
              {hasZoneDiscount && (
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <Zap className="w-3 h-3" />
                  <span>Promoción de Zona ({zPolicy!.discountPercentage}% OFF)</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2 text-right">
        <button
          type="button"
          onClick={() => onScrollToSection('agenda-slot-section', 80)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
        >
          <span>Siguiente: Elige tu Turno Preferido ⬇️</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
