'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { LocalQuoteSummary } from './types';

interface AgendaQuoteBannerProps {
  quoteSummary: LocalQuoteSummary | null;
  effectiveTotal: number;
}

export function AgendaQuoteBanner({ quoteSummary, effectiveTotal }: AgendaQuoteBannerProps) {
  if (!quoteSummary || quoteSummary.items.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 mb-8 space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs sm:text-sm font-extrabold text-white">
            Piezas de tu Cotización ({quoteSummary.items.length} tipo
            {quoteSummary.items.length > 1 ? 's' : ''})
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-gray-400">Total:</span>
          <span className="font-extrabold text-brand-300">
            RD$ {effectiveTotal.toLocaleString('es-DO')}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
            0% Anticipo
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {quoteSummary.items.map((it) => (
          <span
            key={it.cartId}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-dark-surface/90 border border-dark-border text-xs text-gray-200"
          >
            <span>{it.iconText || '✨'}</span>
            <strong className="text-cyan-300">{it.quantity}x</strong>
            <span>{it.name}</span>
            {it.bothSides && (
              <span className="text-[10px] text-brand-300 font-semibold">(Ambos Lados)</span>
            )}
            {it.extraSeats && it.extraSeats > 0 ? (
              <span className="text-[10px] text-indigo-300 font-semibold">
                (+{it.extraSeats} pl)
              </span>
            ) : null}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-dark-border/40">
        <span>
          Tela: <strong className="text-gray-200">{quoteSummary.fabric || 'Estándar'}</strong> · Manchas:{' '}
          <strong className="text-gray-200">{quoteSummary.stain || 'Leve'}</strong>
        </span>
        <Link
          href="/cotizar"
          className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
        >
          Editar cotización ↗
        </Link>
      </div>
    </div>
  );
}
