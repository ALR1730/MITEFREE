'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Filter,
  CheckCircle,
  Truck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface KanbanAppointment {
  id: string;
  client: string;
  phone: string;
  zone: string;
  address: string;
  timeSlot: string;
  service: string;
  total: number;
  deposit: number;
  status: 'PENDING_DEPOSIT' | 'CONFIRMED' | 'IN_ROUTE' | 'IN_SERVICE' | 'COMPLETED';
  technician?: string;
}

const INITIAL_APPOINTMENTS: KanbanAppointment[] = [
  {
    id: 'APT-101',
    client: 'Laura Mercedes',
    phone: '+1 809-555-0123',
    zone: 'Distrito Nacional',
    address: 'Piantini, Calle Geraldino #45',
    timeSlot: '08:30 – 11:30 AM',
    service: 'Sofá L 5 Puestos (Terciopelo) + Mancha Crítica',
    total: 259.0,
    deposit: 77.7,
    status: 'IN_ROUTE',
    technician: 'Ing. Kelvin Rosario (Cuadrilla #04)',
  },
  {
    id: 'APT-102',
    client: 'Carlos Méndez',
    phone: '+1 809-555-0188',
    zone: 'Santo Domingo Este',
    address: 'Alma Rosa, C/ Costa Rica #12',
    timeSlot: '01:00 – 04:00 PM',
    service: '2 Colchones Queen + Sillón Individual',
    total: 205.0,
    deposit: 61.5,
    status: 'CONFIRMED',
    technician: 'Sin asignar',
  },
  {
    id: 'APT-103',
    client: 'Dra. Patricia Gómez',
    phone: '+1 809-555-0144',
    zone: 'Distrito Nacional',
    address: 'Naco, Av. Tiradentes Torre Sol',
    timeSlot: '08:30 – 11:30 AM',
    service: 'Juego de Sala Lino Natural',
    total: 340.0,
    deposit: 102.0,
    status: 'COMPLETED',
    technician: 'Cuadrilla #01 (Luis Almonte)',
  },
  {
    id: 'APT-104',
    client: 'Manuel Tavárez',
    phone: '+1 809-555-0177',
    zone: 'Santo Domingo Oeste',
    address: 'Alameda, Manzana B casa 8',
    timeSlot: '04:30 – 07:30 PM',
    service: 'Sofá 3 Puestos Microfibra',
    total: 110.0,
    deposit: 33.0,
    status: 'PENDING_DEPOSIT',
  },
  {
    id: 'APT-105',
    client: 'Sofía Reyes',
    phone: '+1 809-555-0199',
    zone: 'Distrito Nacional',
    address: 'Bella Vista, Av. Sarasota',
    timeSlot: '01:00 – 04:00 PM',
    service: 'Colchón King Size + Desinfección UV-C',
    total: 95.0,
    deposit: 28.5,
    status: 'IN_SERVICE',
    technician: 'Cuadrilla #03 (Pedro Henríquez)',
  },
];

const COLUMNS = [
  {
    id: 'PENDING_DEPOSIT',
    label: 'Pendiente Anticipo (30%)',
    color: 'border-amber-500/40 text-amber-400',
  },
  {
    id: 'CONFIRMED',
    label: 'Confirmada / Por Asignar',
    color: 'border-indigo-500/40 text-indigo-400',
  },
  { id: 'IN_ROUTE', label: 'Técnico en Ruta (GPS)', color: 'border-cyan-500/40 text-cyan-400' },
  {
    id: 'IN_SERVICE',
    label: 'En Limpieza Quirúrgica',
    color: 'border-purple-500/40 text-purple-400',
  },
  {
    id: 'COMPLETED',
    label: 'Completada & Certificada',
    color: 'border-emerald-500/40 text-emerald-400',
  },
];

export default function CitasKanbanPage() {
  const [appointments, setAppointments] = useState<KanbanAppointment[]>(INITIAL_APPOINTMENTS);

  const moveNext = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== id) return apt;
        if (apt.status === 'PENDING_DEPOSIT') return { ...apt, status: 'CONFIRMED' };
        if (apt.status === 'CONFIRMED')
          return { ...apt, status: 'IN_ROUTE', technician: 'Ing. Kelvin Rosario (Cuadrilla #04)' };
        if (apt.status === 'IN_ROUTE') return { ...apt, status: 'IN_SERVICE' };
        if (apt.status === 'IN_SERVICE') return { ...apt, status: 'COMPLETED' };
        return apt;
      }),
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Tablero Kanban de Despacho & Citas
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Flujo de estados de servicio en tiempo real para Gran Santo Domingo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-admin-card border border-admin-border text-gray-300 font-mono">
            Total en Tablero: {appointments.length} Citas
          </span>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colAppointments = appointments.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-admin-sidebar/90 rounded-2xl p-4 border border-admin-border flex flex-col min-w-[260px] h-[calc(100vh-14rem)]"
            >
              {/* Column Header */}
              <div className={`pb-3 mb-3 border-b ${col.color} flex justify-between items-center`}>
                <h3 className="text-xs font-bold uppercase tracking-wider">{col.label}</h3>
                <span className="w-5 h-5 rounded-full bg-admin-card border border-admin-border text-[11px] font-mono flex items-center justify-center font-bold text-white">
                  {colAppointments.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="admin-card rounded-xl p-4 border border-admin-border space-y-3 admin-card-hover transition-all text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-indigo-400">{apt.id}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        ${apt.deposit} USD (30%)
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">{apt.client}</h4>
                      <p className="text-gray-400 text-[11px] mt-0.5">{apt.service}</p>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-gray-400 border-t border-admin-border/50 pt-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{apt.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{apt.timeSlot}</span>
                      </div>
                      {apt.technician && (
                        <div className="flex items-center gap-1.5 text-brand-400 font-semibold pt-1">
                          <Truck className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{apt.technician}</span>
                        </div>
                      )}
                    </div>

                    {apt.status !== 'COMPLETED' && (
                      <button
                        onClick={() => moveNext(apt.id)}
                        className="w-full mt-2 py-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-[11px] font-bold text-indigo-300 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                      >
                        <span>Avanzar Estado</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {colAppointments.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-[11px] text-gray-600 border border-dashed border-admin-border/60 rounded-xl">
                    Sin citas en este estado
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
