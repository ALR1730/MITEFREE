'use client';

import React, { useState } from 'react';
import { ShieldAlert, Calculator } from 'lucide-react';
import type { DiscountPolicyConfig } from '@mitefree/shared-types';

interface LiveSimulatorCardProps {
  discountPolicy: DiscountPolicyConfig;
  depositRate: number;
}

export function LiveSimulatorCard({ discountPolicy, depositRate }: LiveSimulatorCardProps) {
  const [simBasePrice, setSimBasePrice] = useState<number>(2500);
  const [simMultiplier, setSimMultiplier] = useState<number>(1.0);
  const [simSurcharge, setSimSurcharge] = useState<number>(500);
  const [simCouponDiscount, setSimCouponDiscount] = useState<number>(0);
  const [simWallet, setSimWallet] = useState<number>(0);
  const [simSelectedZone, setSimSelectedZone] = useState<string>('ZONE-SPM');
  const [simSelectedSlot, setSimSelectedSlot] = useState<string>('MORNING');

  const activeZoneObj = discountPolicy.zones.find((z) => z.zoneCode === simSelectedZone);
  const activeSlotObj = discountPolicy.slots.find((s) => s.slotCode === simSelectedSlot);

  const zoneDiscountPct = activeZoneObj?.enabled ? activeZoneObj.discountPercentage : 0;
  const slotDiscountPct = activeSlotObj?.enabled ? activeSlotObj.discountPercentage : 0;
  const totalCustomDiscountPct = zoneDiscountPct + slotDiscountPct;

  const simSubtotal = Math.round((simBasePrice * simMultiplier + simSurcharge) * 100) / 100;
  const simPromoDiscountAmount =
    Math.round(simSubtotal * (totalCustomDiscountPct / 100) * 100) / 100;
  const simTotalDiscounts = simPromoDiscountAmount + simCouponDiscount;
  const simAfterDiscount = Math.max(0, simSubtotal - simTotalDiscounts);
  const simTotal = Math.max(0, Math.round((simAfterDiscount - simWallet) * 100) / 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="admin-card rounded-2xl p-6 border border-admin-border space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Recargos por Severidad de Manchas</span>
        </h3>

        <div className="space-y-3">
          {[
            {
              level: 'LIGHT (Leve)',
              fee: 'RD$ 0',
              desc: 'Mantenimiento preventivo general e higienización',
            },
            {
              level: 'MODERATE (Moderada)',
              fee: '+RD$ 300',
              desc: 'Grasa, café, derrame superficial de alimentos',
            },
            {
              level: 'CRITICAL (Crítica)',
              fee: '+RD$ 500',
              desc: 'Orina, sangre, fluidos orgánicos (Tratamiento Enzimático)',
            },
          ].map((stain, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-admin-sidebar border border-admin-border flex justify-between items-center"
            >
              <div>
                <span className="text-xs font-bold text-white block">{stain.level}</span>
                <span className="text-[11px] text-gray-400">{stain.desc}</span>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400">{stain.fee}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Quotation Engine Simulator with Dynamic Custom Discounts */}
      <div className="admin-card rounded-2xl p-6 border border-indigo-500/30 admin-glow-indigo space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-400" />
          <span>Simulador Algorítmico en Vivo (DDD — RD$)</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-admin-border">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Zona a Evaluar:</label>
              <select
                value={simSelectedZone}
                onChange={(e) => setSimSelectedZone(e.target.value)}
                className="w-full px-2 py-1 rounded bg-admin-sidebar border border-admin-border text-white text-xs"
              >
                {discountPolicy.zones.map((z) => (
                  <option key={z.zoneCode} value={z.zoneCode}>
                    {z.name} ({z.enabled ? `${z.discountPercentage}%` : '0%'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Horario a Evaluar:</label>
              <select
                value={simSelectedSlot}
                onChange={(e) => setSimSelectedSlot(e.target.value)}
                className="w-full px-2 py-1 rounded bg-admin-sidebar border border-admin-border text-white text-xs"
              >
                {discountPolicy.slots.map((s) => (
                  <option key={s.slotCode} value={s.slotCode}>
                    {s.label} ({s.enabled ? `${s.discountPercentage}%` : '0%'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Precio Base (RD$):</span>
            <input
              type="number"
              value={simBasePrice}
              onChange={(e) => setSimBasePrice(Number(e.target.value))}
              className="w-24 px-2 py-1 rounded bg-admin-sidebar border border-admin-border text-white text-right font-mono"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Multiplicador Tela:</span>
            <span className="font-mono text-cyan-400">x{simMultiplier.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Recargo / Extra (RD$):</span>
            <span className="font-mono text-amber-400">
              +RD$ {simSurcharge.toLocaleString('es-DO')}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-admin-border">
            <span className="text-gray-300 font-bold">Subtotal Calculado:</span>
            <span className="font-mono text-white font-bold">
              RD$ {simSubtotal.toLocaleString('es-DO')}
            </span>
          </div>

          <div className="flex justify-between items-center text-emerald-400">
            <span className="flex items-center gap-1">
              <span>Descuento Promocional:</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                {totalCustomDiscountPct}% OFF
              </span>
            </span>
            <span className="font-mono">
              {simPromoDiscountAmount > 0
                ? `-RD$ ${simPromoDiscountAmount.toLocaleString('es-DO')}`
                : 'RD$ 0'}
            </span>
          </div>

          {simCouponDiscount > 0 && (
            <div className="flex justify-between items-center text-emerald-400">
              <span>Descuento Cupón:</span>
              <span className="font-mono">-RD$ {simCouponDiscount.toLocaleString('es-DO')}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-cyan-400">
            <span>Canje Cashback Billetera:</span>
            <span className="font-mono">-RD$ {simWallet.toLocaleString('es-DO')}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-admin-border text-sm">
            <span className="text-white font-extrabold">Total Final:</span>
            <span className="font-mono text-indigo-400 font-extrabold">
              RD$ {simTotal.toLocaleString('es-DO')} DOP
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 pt-1 text-[11px] text-gray-400">
            <span className="text-emerald-400 font-bold">
              ✓ 0% Anticipo (Pago 100% al finalizar)
            </span>
            <span>
              Cobro total:{' '}
              <b className="text-white font-mono">RD$ {simTotal.toLocaleString('es-DO')}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
