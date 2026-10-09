'use client';

import { Sparkles } from 'lucide-react';

interface CotizadorHeaderProps {
  currentStep: number;
  isMinimumOrderMet: boolean;
  goToStep: (step: number) => void;
}

export function CotizadorHeader({
  currentStep,
  isMinimumOrderMet,
  goToStep,
}: CotizadorHeaderProps) {
  return (
    <>
      {/* Top Clean Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mite Free Clean · Cotización Inmediata</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cotizador Inteligente de Servicios
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg mx-auto">
          Selecciona tamaños y cantidades para ver tu precio al instante. Visita a domicilio desde{' '}
          <strong>RD$ 1,500</strong> (0% anticipo).
        </p>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="flex items-center justify-between mb-8 max-w-sm mx-auto px-2">
        {[
          { num: 1, label: '1. Piezas' },
          { num: 2, label: '2. Tela & Manchas' },
          { num: 3, label: '3. Resumen' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  if (s.num === 1) goToStep(1);
                  if (s.num === 2 && isMinimumOrderMet) goToStep(2);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  currentStep >= s.num
                    ? 'bg-gradient-to-tr from-brand-600 to-cyan-400 text-dark-bg tech-glow shadow-md'
                    : 'bg-dark-surface border border-dark-border text-gray-500 hover:text-gray-300'
                }`}
              >
                {s.num}
              </button>
              <span
                className={`text-[11px] font-medium mt-1 text-center whitespace-nowrap ${
                  currentStep >= s.num ? 'text-brand-300 font-bold' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-4 transition-colors ${
                  currentStep > s.num ? 'bg-cyan-400' : 'bg-dark-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
