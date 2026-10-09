'use client';

import { ArrowRight } from 'lucide-react';
import type { SelectedQuoteItem } from './cotizador.types';
import { formatRD } from './cotizador.constants';

interface StickyBottomCartBarProps {
  selectedItems: SelectedQuoteItem[];
  currentStep: number;
  totalItemsCount: number;
  itemsSubtotal: number;
  isMinimumOrderMet: boolean;
  amountMissingForMinimum: number;
  onProceed: () => void;
}

export function StickyBottomCartBar({
  selectedItems,
  currentStep,
  totalItemsCount,
  itemsSubtotal,
  isMinimumOrderMet,
  amountMissingForMinimum,
  onProceed,
}: StickyBottomCartBarProps) {
  if (selectedItems.length === 0 || currentStep !== 1) return null;

  return (
    <div className="md:hidden fixed bottom-16 left-3 right-3 z-40 p-3 rounded-2xl glass-panel border border-brand-500/40 tech-glow flex items-center justify-between shadow-2xl backdrop-blur-xl animate-fadeIn">
      <div>
        <span className="text-[10px] text-gray-400 block font-mono">
          {totalItemsCount} {totalItemsCount === 1 ? 'pieza' : 'piezas'}
        </span>
        <span className="text-base font-extrabold text-brand-300 font-mono">
          {formatRD(itemsSubtotal)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          if (!isMinimumOrderMet) {
            alert(
              `Faltan RD$ ${amountMissingForMinimum.toLocaleString('es-DO')} para el mínimo a domicilio de RD$ 1,500.`,
            );
            return;
          }
          onProceed();
        }}
        disabled={!isMinimumOrderMet}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
          isMinimumOrderMet
            ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg tech-glow shadow-md active:scale-95'
            : 'bg-dark-surface border border-dark-border text-gray-500 opacity-75'
        }`}
      >
        <span>
          {isMinimumOrderMet ? 'Continuar' : `Faltan ${formatRD(amountMissingForMinimum)}`}
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
