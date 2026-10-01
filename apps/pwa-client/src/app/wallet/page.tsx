'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
  Copy,
  Check,
  Award,
  Sparkles,
  ShieldCheck,
  Gift,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'EARNED' | 'REDEEMED' | 'BONUS';
  amount: number;
  description: string;
  date: string;
}

const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-01',
    type: 'EARNED',
    amount: 15.75,
    description: 'Cashback 5% Orden #ORD-8921 (Sofá Modular)',
    date: '28 Sep 2026',
  },
  {
    id: 'tx-02',
    type: 'BONUS',
    amount: 20.0,
    description: 'Bono por referido registrado (Carlos Méndez)',
    date: '15 Sep 2026',
  },
  {
    id: 'tx-03',
    type: 'REDEEMED',
    amount: -12.5,
    description: 'Descuento aplicado en Cita #APT-4310',
    date: '02 Sep 2026',
  },
  {
    id: 'tx-04',
    type: 'EARNED',
    amount: 19.25,
    description: 'Cashback 5% Orden #ORD-7740 (Colchones King)',
    date: '18 Ago 2026',
  },
];

export default function WalletPage() {
  const [copied, setCopied] = useState<boolean>(false);
  const referralCode = 'MITE-ANGEL-2026';

  const balance = 42.5;
  const balanceDop = Math.round(balance * 60.5);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
          <WalletIcon className="w-3.5 h-3.5" />
          <span>Billetera de Fidelización & Cashback</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tu Billetera Digital MITEFREE
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Acumula el 5% en cada desinfección y redime directo en tus próximas limpiezas.
        </p>
      </div>

      {/* Main Balance Card */}
      <div className="relative rounded-3xl overflow-hidden glass-card p-6 sm:p-8 border border-brand-500/30 tech-glow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-500/20 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-gray-400">
              Saldo Total Disponible
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                ${balance.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-brand-400">USD</span>
              <span className="text-xs text-gray-500 font-mono ml-2">
                (≈ RD$ {balanceDop.toLocaleString()} DOP)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-bold">
            <Award className="w-4 h-4 text-brand-400" />
            <span>Nivel Gold (5% Cashback)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-dark-border/60">
          <Link
            href="/cotizar"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-xs tech-glow active:scale-95 transition-transform"
          >
            <span>Usar Saldo en Cotización</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => alert(`Enlace de referidos copiado: mitefree.com/r/${referralCode}`)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass-panel text-gray-300 hover:text-white text-xs border border-dark-border"
          >
            <Share2 className="w-4 h-4 text-brand-400" />
            <span>Compartir Código</span>
          </button>
        </div>
      </div>

      {/* Referral Program Card */}
      <div className="glass-card rounded-2xl p-6 border border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Programa de Embajadores & Referidos</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Comparte tu código: tu amigo recibe $10 de descuento en su primera cita y tú ganas $20
              en tu wallet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="px-3.5 py-2 rounded-xl bg-dark-bg border border-dark-border text-xs font-mono font-bold text-brand-400 select-all">
            {referralCode}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-hover hover:bg-dark-border border border-dark-border text-xs font-semibold text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-brand-400" />
                <span className="text-brand-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-400" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="glass-card rounded-2xl p-6 border border-dark-border space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-bold text-white">Libro Contable de Movimientos (Ledger)</h3>
          <span className="text-xs text-gray-400 font-mono">Total 4 eventos</span>
        </div>

        <div className="divide-y divide-dark-border/40">
          {TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.amount > 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{tx.description}</div>
                  <span className="text-[10px] text-gray-500 font-mono">{tx.date}</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-bold font-mono ${
                    tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} USD
                </span>
                <span className="block text-[10px] text-gray-500 uppercase font-mono">
                  {tx.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
