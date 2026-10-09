'use client';

import {
  ShoppingCart,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';
import type { SelectedQuoteItem } from './cotizador.types';
import { formatRD } from './cotizador.constants';

interface OrderSummaryTrayProps {
  selectedItems: SelectedQuoteItem[];
  totalItemsCount: number;
  activeSubtotal: number;
  isMinimumOrderMet: boolean;
  amountMissingForMinimum: number;
  minProgressPercentage: number;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onProceed: () => void;
}

export function OrderSummaryTray({
  selectedItems,
  totalItemsCount,
  activeSubtotal,
  isMinimumOrderMet,
  amountMissingForMinimum,
  minProgressPercentage,
  onUpdateQuantity,
  onRemoveItem,
  onProceed,
}: OrderSummaryTrayProps) {
  if (selectedItems.length === 0) return null;

  return (
    <div
      id="order-summary-tray"
      className="glass-card rounded-3xl p-5 sm:p-6 border-2 border-brand-500/40 tech-glow space-y-4 animate-fadeIn shadow-2xl"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-dark-border/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-dark-bg flex items-center justify-center font-bold shadow-md">
            <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs text-brand-300 font-bold uppercase tracking-wider block">
              Tus Piezas Seleccionadas ({totalItemsCount})
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {formatRD(activeSubtotal)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onProceed}
          disabled={!isMinimumOrderMet}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-lg cursor-pointer ${
            isMinimumOrderMet
              ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg tech-glow active:scale-95 hover:opacity-95'
              : 'bg-dark-surface border border-dark-border text-gray-500 cursor-not-allowed opacity-75'
          }`}
        >
          <span>
            {isMinimumOrderMet
              ? `Continuar a fecha y dirección (${totalItemsCount} ${totalItemsCount === 1 ? 'pieza' : 'piezas'})`
              : `Mínimo RD$ 1,500 (Faltan ${formatRD(amountMissingForMinimum)})`}
          </span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Termómetro de Pedido Mínimo */}
      {!isMinimumOrderMet ? (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Servicio a domicilio desde <strong>RD$ 1,500</strong>. Te faltan{' '}
              <strong className="text-white font-mono">
                {formatRD(amountMissingForMinimum)}
              </strong>{' '}
              (agrega otra pieza abajo para completar tu orden).
            </span>
          </div>
          <div className="w-full sm:w-28 bg-dark-bg h-2 rounded-full overflow-hidden border border-amber-500/30 shrink-0">
            <div
              className="bg-gradient-to-r from-amber-500 to-brand-400 h-full transition-all duration-300"
              style={{ width: `${minProgressPercentage}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs flex items-center gap-2 text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>¡Mínimo alcanzado!</strong> Visita técnica a domicilio incluida sin recargo de
            traslado.
          </span>
        </div>
      )}

      {/* Lista de Artículos en la Orden */}
      <div className="divide-y divide-dark-border/40">
        {selectedItems.map((item) => (
          <div
            key={item.cartId}
            className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-2xl shrink-0 p-2 rounded-xl bg-dark-surface border border-dark-border">
                {item.iconText}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-white text-sm flex flex-wrap items-center gap-1.5">
                  <span>{item.name}</span>
                  {item.bothSides && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                      Ambos Lados
                    </span>
                  )}
                  {item.extraSeats > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      +{item.extraSeats} Plazas
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">
                  {formatRD(item.unitPrice)} unitario · Subtotal:{' '}
                  <strong className="text-brand-300 font-mono">{formatRD(item.itemTotal)}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
              {/* Stepper del Carrito */}
              <div className="flex items-center gap-2 bg-dark-bg border border-dark-border rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.cartId, -1)}
                  className="w-7 h-7 rounded-lg bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Restar cantidad"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-cyan-300 font-mono text-xs">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.cartId, 1)}
                  className="w-7 h-7 rounded-lg bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Sumar cantidad"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Total del Item */}
              <span className="font-mono font-bold text-brand-400 text-sm min-w-[85px] text-right">
                {formatRD(item.itemTotal)}
              </span>

              {/* Botón Eliminar */}
              <button
                type="button"
                onClick={() => onRemoveItem(item.cartId)}
                className="text-gray-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                title="Eliminar artículo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prompt para agregar más piezas */}
      <div className="pt-2 text-center border-t border-dark-border/40">
        <span className="text-xs text-brand-300 font-semibold inline-flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-brand-400" />
          ¿Deseas agregar otra pieza? Elige una categoría abajo ⬇️
        </span>
      </div>
    </div>
  );
}
