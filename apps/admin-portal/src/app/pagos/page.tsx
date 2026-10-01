'use client';

import { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Filter,
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  orderId: string;
  client: string;
  amount: number;
  type: 'ANTICIPO_30' | 'FINAL_70';
  method: 'STRIPE_CARD' | 'TRANSFER_POPULAR' | 'TRANSFER_BHD' | 'TRANSFER_BANRESERVAS';
  referenceNumber: string;
  status: 'RECONCILED' | 'PENDING' | 'REJECTED';
  date: string;
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-8812',
    orderId: 'ORD-9821',
    client: 'Laura Mercedes',
    amount: 77.7,
    type: 'ANTICIPO_30',
    method: 'STRIPE_CARD',
    referenceNumber: 'ch_3N19K2840192',
    status: 'RECONCILED',
    date: 'Hoy, 10:05 AM',
  },
  {
    id: 'PAY-8811',
    orderId: 'ORD-9820',
    client: 'Carlos Méndez',
    amount: 61.5,
    type: 'ANTICIPO_30',
    method: 'TRANSFER_POPULAR',
    referenceNumber: 'BPD-99214401',
    status: 'PENDING',
    date: 'Hoy, 09:42 AM',
  },
  {
    id: 'PAY-8810',
    orderId: 'ORD-9819',
    client: 'Dra. Patricia Gómez',
    amount: 238.0,
    type: 'FINAL_70',
    method: 'TRANSFER_BHD',
    referenceNumber: 'BHD-10948201',
    status: 'RECONCILED',
    date: 'Ayer, 04:30 PM',
  },
  {
    id: 'PAY-8809',
    orderId: 'ORD-9817',
    client: 'Roberto Peña',
    amount: 39.0,
    type: 'ANTICIPO_30',
    method: 'TRANSFER_BANRESERVAS',
    referenceNumber: 'BR-88402910',
    status: 'PENDING',
    date: 'Ayer, 02:15 PM',
  },
];

export default function PagosPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);

  const handleApprove = (id: string) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'RECONCILED' } : p)));
  };

  const totalReconciled = payments
    .filter((p) => p.status === 'RECONCILED')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Conciliación de Pagos & Transferencias Bancarias
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Verificación de anticipos obligatorios del 30% y liquidación final contra servicio.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card rounded-2xl p-5 border border-admin-border">
          <span className="text-xs font-semibold text-gray-400">Total Conciliado (Hoy)</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ${totalReconciled.toFixed(2)} USD
          </div>
          <span className="text-[11px] text-gray-500 block mt-1">Fondos disponibles en cuenta</span>
        </div>

        <div className="admin-card rounded-2xl p-5 border border-admin-border">
          <span className="text-xs font-semibold text-gray-400">Pendiente de Conciliación</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            ${pendingAmount.toFixed(2)} USD
          </div>
          <span className="text-[11px] text-gray-500 block mt-1">Comprobantes por validar</span>
        </div>

        <div className="admin-card rounded-2xl p-5 border border-admin-border">
          <span className="text-xs font-semibold text-gray-400">Canales Aceptados</span>
          <div className="text-sm font-bold text-white mt-1">Stripe · BPD · BHD · Banreservas</div>
          <span className="text-[11px] text-indigo-400 block mt-1">Idempotencia 100% activa</span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="admin-card rounded-2xl p-6 border border-admin-border space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Transacciones Registradas en Pasarela y Banco
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border text-gray-400 font-mono uppercase text-[10px]">
                <th className="pb-3">ID Pago</th>
                <th className="pb-3">Orden</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Concepto</th>
                <th className="pb-3">Método / Banco</th>
                <th className="pb-3">Comprobante #</th>
                <th className="pb-3 text-right">Importe</th>
                <th className="pb-3 text-center">Estado</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/40 font-mono">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-admin-hover/50 transition-colors">
                  <td className="py-3.5 font-bold text-indigo-400">{p.id}</td>
                  <td className="py-3.5 text-gray-300">{p.orderId}</td>
                  <td className="py-3.5 text-white font-sans font-semibold">{p.client}</td>
                  <td className="py-3.5 font-sans">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-admin-card border border-admin-border text-gray-300">
                      {p.type === 'ANTICIPO_30' ? 'Anticipo 30%' : 'Saldo Final 70%'}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-300 font-sans text-xs">
                    {p.method.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 text-gray-400">{p.referenceNumber}</td>
                  <td className="py-3.5 text-right font-bold text-white">${p.amount.toFixed(2)}</td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'RECONCILED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      }`}
                    >
                      {p.status === 'RECONCILED' ? 'Conciliado' : 'Por Validar'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-sans">
                    {p.status === 'PENDING' ? (
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                      >
                        Aprobar
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-500 flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verificado</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
