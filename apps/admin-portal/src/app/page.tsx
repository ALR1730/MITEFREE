import {
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Percent,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const kpis = [
    {
      title: 'Ingresos Facturados (Mes)',
      value: '$18,420.00',
      change: '+24.5%',
      isPositive: true,
      sub: 'vs. $14,800 mes anterior',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Citas Hoy en Santo Domingo',
      value: '14 Servicios',
      change: '100% Cuadrillas',
      isPositive: true,
      sub: '4 en curso · 2 completadas',
      icon: CalendarCheck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Conversión de Cotizador',
      value: '68.4%',
      change: '+5.2%',
      isPositive: true,
      sub: 'Cotizaciones ➔ Agendamiento',
      icon: TrendingUp,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Cashback Acreditado',
      value: '$921.00',
      change: '5% Canónico',
      isPositive: true,
      sub: 'Billetera digital fidelizada',
      icon: Percent,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-9821',
      client: 'Laura Mercedes',
      zone: 'Piantini (DN)',
      items: 'Sofá L 5 Puestos (Terciopelo) + Mancha Crítica',
      total: 259.0,
      deposit: 77.7,
      status: 'En Ruta',
      technician: 'Ing. Kelvin Rosario',
    },
    {
      id: 'ORD-9820',
      client: 'Carlos Méndez',
      zone: 'Alma Rosa (SDE)',
      items: '2 Colchones Queen + Sillón Individual',
      total: 205.0,
      deposit: 61.5,
      status: 'Confirmada',
      technician: 'Cuadrilla #02',
    },
    {
      id: 'ORD-9819',
      client: 'Dra. Patricia Gómez',
      zone: 'Naco (DN)',
      items: 'Juego de Sala Completo (Lino Natural)',
      total: 340.0,
      deposit: 102.0,
      status: 'Completada',
      technician: 'Cuadrilla #01',
    },
    {
      id: 'ORD-9818',
      client: 'Manuel Tavárez',
      zone: 'Alameda (SDO)',
      items: 'Sofá 3 Puestos (Microfibra)',
      total: 110.0,
      deposit: 33.0,
      status: 'Pendiente Anticipo',
      technician: 'Por asignar',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Dashboard Ejecutivo & Métricas
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Supervisión en vivo de cotizaciones, despacho territorial y finanzas — ALR COMPANY.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/citas"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs admin-glow-indigo hover:bg-indigo-500 transition-colors"
          >
            <span>Ver Tablero Kanban</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="admin-card rounded-2xl p-5 border border-admin-border admin-card-hover transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-gray-400">{kpi.title}</span>
                <div className={`p-2 rounded-xl border ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono">{kpi.value}</div>
              <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-admin-border/50">
                <span className="text-emerald-400 font-bold">{kpi.change}</span>
                <span className="text-gray-500">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone Performance & Weekly Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Territory dispatch */}
        <div className="admin-card rounded-2xl p-6 border border-admin-border space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
            Despacho por Zonas (Santo Domingo)
          </h3>
          <div className="space-y-3">
            {[
              { zone: 'Distrito Nacional', share: '55%', count: '28 citas / sem', color: 'bg-cyan-500' },
              { zone: 'Santo Domingo Este', share: '25%', count: '13 citas / sem', color: 'bg-indigo-500' },
              { zone: 'Santo Domingo Oeste', share: '12%', count: '6 citas / sem', color: 'bg-emerald-500' },
              { zone: 'Santo Domingo Norte', share: '8%', count: '4 citas / sem', color: 'bg-amber-500' },
            ].map((z, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300 font-medium">{z.zone}</span>
                  <span className="text-gray-400 font-mono">{z.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-admin-card overflow-hidden">
                  <div className={`h-full rounded-full ${z.color}`} style={{ width: z.share }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Protocol Status */}
        <div className="lg:col-span-2 admin-card rounded-2xl p-6 border border-admin-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
              Protocolo Operativo Activo (Zero-Residue UV-C)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
              Certificación ALR-MED-101
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border">
              <span className="text-xs text-gray-400 block">Anticipo Promedio</span>
              <span className="text-lg font-bold text-white font-mono">$64.20 USD</span>
              <span className="text-[10px] text-emerald-400 block mt-1">30% regla canónica</span>
            </div>
            <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border">
              <span className="text-xs text-gray-400 block">Tiempo Promedio Cita</span>
              <span className="text-lg font-bold text-white font-mono">1h 45min</span>
              <span className="text-[10px] text-cyan-400 block mt-1">Extracción + UV-C</span>
            </div>
            <div className="p-4 rounded-xl bg-admin-sidebar border border-admin-border">
              <span className="text-xs text-gray-400 block">Satisfacción Post-Servicio</span>
              <span className="text-lg font-bold text-white font-mono">99.4%</span>
              <span className="text-[10px] text-indigo-400 block mt-1">Certificados emitidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="admin-card rounded-2xl p-6 border border-admin-border space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
            Últimas Órdenes y Servicios Generados
          </h3>
          <span className="text-xs text-gray-500 font-mono">Actualizado en vivo</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border text-gray-400 font-mono uppercase text-[10px]">
                <th className="pb-3">ID Orden</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Zona</th>
                <th className="pb-3">Detalle Muebles</th>
                <th className="pb-3 text-right">Total</th>
                <th className="pb-3 text-right">Anticipo (30%)</th>
                <th className="pb-3 text-center">Estado</th>
                <th className="pb-3">Cuadrilla Asignada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/40 font-mono">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-admin-hover/50 transition-colors">
                  <td className="py-3.5 font-bold text-indigo-400">{ord.id}</td>
                  <td className="py-3.5 text-white font-sans font-semibold">{ord.client}</td>
                  <td className="py-3.5 text-gray-300 font-sans">{ord.zone}</td>
                  <td className="py-3.5 text-gray-400 font-sans max-w-xs truncate">{ord.items}</td>
                  <td className="py-3.5 text-right font-bold text-white">${ord.total.toFixed(2)}</td>
                  <td className="py-3.5 text-right font-bold text-emerald-400">${ord.deposit.toFixed(2)}</td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'Completada'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : ord.status === 'En Ruta'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse'
                          : ord.status === 'Confirmada'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-300 font-sans text-xs">{ord.technician}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
