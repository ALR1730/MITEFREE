'use client';

import {
  CheckCircle,
  Tag,
  Check,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  FileDown,
  FileText,
} from 'lucide-react';
import type { SelectedQuoteItem, FabricOption, StainOption } from './cotizador.types';
import { formatRD } from './cotizador.constants';

interface QuoteSummaryStepProps {
  selectedItems: SelectedQuoteItem[];
  totalItemsCount: number;
  selectedFabric: FabricOption;
  selectedStain: StainOption;
  promoCode: string;
  couponApplied: boolean;
  couponDiscount: number;
  total: number;
  isSubmittingQuotation: boolean;
  onPromoCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
  onGoToStep: (step: number) => void;
  onProceedToSchedule: () => void;
  whatsappMessage: string;
  persistedQuotationId?: string | null;
  pdfDownloadUrl?: string | null;
}

export function QuoteSummaryStep({
  selectedItems,
  totalItemsCount,
  selectedFabric,
  selectedStain,
  promoCode,
  couponApplied,
  couponDiscount,
  total,
  isSubmittingQuotation,
  onPromoCodeChange,
  onApplyCoupon,
  onGoToStep,
  onProceedToSchedule,
  whatsappMessage,
  persistedQuotationId,
  pdfDownloadUrl,
}: QuoteSummaryStepProps) {
  return (
    <div id="step3-container" className="space-y-6 animate-fadeIn scroll-mt-20">
      {/* Big Summary Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-dark-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-dark-border/60 gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-400 font-bold block">
              Resumen de tu Cotización
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">
              Desinfección & Lavado a Domicilio
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {persistedQuotationId && (
              <span className="px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <FileText className="w-3.5 h-3.5 text-brand-400" />
                <span>#COT-{persistedQuotationId.slice(0, 8).toUpperCase()}</span>
              </span>
            )}
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>0% Anticipo</span>
            </div>
          </div>
        </div>

        {/* Items Breakdown */}
        <div className="space-y-3 text-xs">
          <span className="font-bold text-gray-400 uppercase tracking-wider block">
            Artículos a tratar ({totalItemsCount} piezas):
          </span>
          <div className="divide-y divide-dark-border/40">
            {selectedItems.map((it) => (
              <div key={it.cartId} className="py-2.5 flex justify-between items-center">
                <span className="text-white font-medium">
                  {it.quantity}x {it.name}
                  {it.bothSides && ' (Ambos Lados)'}
                  {it.extraSeats > 0 && ` (+${it.extraSeats} plazas)`}
                </span>
                <span className="font-mono font-bold text-brand-400">
                  {formatRD(it.itemTotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Garantía de Servicio & Diagnóstico Profesional */}
        <div className="p-3.5 rounded-xl bg-dark-surface/60 border border-dark-border text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-gray-300">
              <strong className="text-white">Servicio Todo Incluido:</strong> Inspección de tejido, desmanchado profundo y sanitización UV-C en tu domicilio.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold shrink-0 hidden sm:inline-block">
            Garantía 100%
          </span>
        </div>

        {/* Coupon & Cashback */}
        <div className="p-4 rounded-2xl bg-dark-surface/80 border border-dark-border space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Tag className="w-4 h-4 text-brand-400" />
              <span className="text-gray-300 font-semibold">¿Tienes cupón de descuento?</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value)}
                placeholder="Ej. ALRPROMO"
                className="px-3 py-1.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs font-mono uppercase focus:border-brand-500 outline-none w-full sm:w-36"
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                className="px-4 py-1.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-300 font-bold hover:bg-brand-500/25 transition-colors whitespace-nowrap cursor-pointer"
              >
                {couponApplied ? 'Aplicado' : 'Aplicar'}
              </button>
            </div>
          </div>

          {couponApplied && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Descuento de {formatRD(couponDiscount)} aplicado exitosamente.</span>
            </div>
          )}
        </div>

        {/* Final Total Box */}
        <div className="p-6 rounded-3xl bg-dark-surface/90 border border-brand-500/40 tech-glow space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400 block">
                Total Final a Pagar:
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {formatRD(total)}{' '}
                <span className="text-xs font-sans text-brand-400 font-normal">DOP</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pagas 100% al finalizar tu servicio</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed pt-2 border-t border-dark-border/40">
            Cobertura en <strong>San Pedro de Macorís</strong>, <strong>La Romana</strong> y{' '}
            <strong>Santo Domingo Este</strong>. No cobramos adelanto; pagas cuando veas tus
            muebles limpios y desinfectados.
          </p>
        </div>

        {/* Actions: Agendar Online / Pedir por WhatsApp / Descargar PDF */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl glass-panel text-xs text-gray-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Atrás</span>
          </button>

          {pdfDownloadUrl && (
            <a
              href={pdfDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-dark-surface/90 hover:bg-dark-hover border border-dark-border hover:border-brand-500/50 text-brand-300 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              title="Descargar Factura Proforma y Presupuesto Oficial congelado con validez de 7 días"
            >
              <FileDown className="w-4 h-4 text-brand-400" />
              <span>Descargar Factura (PDF)</span>
            </a>
          )}

          <a
            href={
              whatsappMessage.startsWith('https://wa.me')
                ? whatsappMessage
                : `https://wa.me/18095134773?text=${whatsappMessage}`
            }
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pedir por WhatsApp (809-513-4773)</span>
          </a>

          <button
            type="button"
            onClick={onProceedToSchedule}
            disabled={isSubmittingQuotation}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-xs sm:text-sm tech-glow shadow-lg active:scale-95 transition-all text-center disabled:opacity-50 cursor-pointer"
          >
            <span>
              {isSubmittingQuotation
                ? 'Preparando Agenda...'
                : 'Agendar Fecha y Hora en Línea'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
