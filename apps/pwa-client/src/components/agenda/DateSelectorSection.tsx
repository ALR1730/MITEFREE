'use client';

import React from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

export interface DateItem {
  offset: number;
  dayName: string;
  dayNum: number;
  month: string;
  dateStr: string;
}

interface DateSelectorSectionProps {
  availableDates: DateItem[];
  selectedDateObj: DateItem;
  selectedDayOffset: number;
  onSelectDate: (offset: number) => void;
  onScrollToSection: (sectionId: string, offset?: number) => void;
}

export function DateSelectorSection({
  availableDates,
  selectedDateObj,
  selectedDayOffset,
  onSelectDate,
  onScrollToSection,
}: DateSelectorSectionProps) {
  return (
    <div
      id="agenda-date-section"
      className="glass-card rounded-2xl p-6 border border-dark-border scroll-mt-24 space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-brand-400" />
          <span>1. Selecciona el Día de Servicio</span>
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-300 border border-brand-500/30">
          ✓ {selectedDateObj.dayName} {selectedDateObj.dayNum} de {selectedDateObj.month}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {availableDates.map((item) => (
          <button
            type="button"
            key={item.offset}
            onClick={() => onSelectDate(item.offset)}
            className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedDayOffset === item.offset
                ? 'border-brand-500 bg-brand-500/15 tech-glow text-white scale-[1.02]'
                : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-400'
            }`}
          >
            <span className="text-[11px] uppercase font-semibold text-gray-400">
              {item.dayName}
            </span>
            <span className="text-lg font-bold text-white my-0.5">{item.dayNum}</span>
            <span className="text-[10px] text-gray-400">{item.month}</span>
          </button>
        ))}
      </div>

      <div className="pt-2 text-right">
        <button
          type="button"
          onClick={() => onScrollToSection('agenda-zone-section', 80)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
        >
          <span>Siguiente: Selecciona tu Ciudad o Sector ⬇️</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
