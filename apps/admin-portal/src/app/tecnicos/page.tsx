'use client';

import { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Star,
  MapPin,
  Truck,
  Phone,
  MessageSquare,
  Award,
  Zap,
} from 'lucide-react';

interface TechnicianSquad {
  id: string;
  name: string;
  squadNumber: string;
  zone: string;
  vehiclePlate: string;
  equipment: string;
  rating: number;
  completedJobs: number;
  totalCommissions: number;
  status: 'ACTIVE' | 'ON_ROUTE' | 'OFFLINE';
  phone: string;
}

const INITIAL_SQUADS: TechnicianSquad[] = [
  {
    id: 'tech-01',
    name: 'Ing. Kelvin Rosario',
    squadNumber: 'Cuadrilla #01',
    zone: 'San Pedro de Macorís (Centro / Consuelo / Quisqueya)',
    vehiclePlate: 'L492019 (Van MITEFREE SPM)',
    equipment: 'Kärcher Inyección-Extracción + Cámara UV-C Médica 254nm',
    rating: 4.98,
    completedJobs: 142,
    totalCommissions: 42600.0,
    status: 'ON_ROUTE',
    phone: '+1 809-513-4773',
  },
  {
    id: 'tech-02',
    name: 'Darío Tavárez',
    squadNumber: 'Cuadrilla #02',
    zone: 'La Romana (Centro / Buena Vista / Villa Hermosa / Guaymate)',
    vehiclePlate: 'L381022 (Van MITEFREE LR)',
    equipment: 'Kärcher Puzzi 10/1 + Desinfección Enzimática Profunda',
    rating: 4.96,
    completedJobs: 118,
    totalCommissions: 35400.0,
    status: 'ACTIVE',
    phone: '+1 809-513-4773',
  },
  {
    id: 'tech-03',
    name: 'Roberto Santana',
    squadNumber: 'Cuadrilla #03',
    zone: 'Santo Domingo Este (Alma Rosa / San Isidro / Ensanche Ozama)',
    vehiclePlate: 'L552011 (Van MITEFREE SDE 1)',
    equipment: 'Sistema de vapor a 140°C + Extracción Hidrocinética',
    rating: 4.94,
    completedJobs: 98,
    totalCommissions: 29400.0,
    status: 'ACTIVE',
    phone: '+1 809-513-4773',
  },
  {
    id: 'tech-04',
    name: 'Marcos Santana',
    squadNumber: 'Cuadrilla #04',
    zone: 'Santo Domingo Este (Los Frailes / Las Américas / Invivienda)',
    vehiclePlate: 'L671043 (Van MITEFREE SDE 2)',
    equipment: 'Equipo Doble Turbina + Luz UV-C Germicida',
    rating: 4.95,
    completedJobs: 89,
    totalCommissions: 26700.0,
    status: 'ON_ROUTE',
    phone: '+1 809-513-4773',
  },
];

export default function TecnicosPage() {
  const [squads] = useState<TechnicianSquad[]>(INITIAL_SQUADS);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Control de Cuadrillas & Especialistas Técnicos
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitoreo de técnicos certificados, equipos UV-C hospitalarios y liquidación de
            comisiones.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            {squads.length} Cuadrillas Operativas
          </span>
        </div>
      </div>

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {squads.map((sq) => (
          <div
            key={sq.id}
            className="admin-card rounded-2xl p-6 border border-admin-border admin-card-hover transition-all space-y-4"
          >
            {/* Top row */}
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-base flex items-center justify-center shadow-md shrink-0">
                  {sq.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white text-base truncate">{sq.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
                      {sq.squadNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-bold">{sq.rating}</span>
                    <span className="text-gray-500 truncate">({sq.completedJobs} completados)</span>
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                  sq.status === 'ON_ROUTE'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 animate-pulse'
                    : sq.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                }`}
              >
                {sq.status === 'ON_ROUTE'
                  ? 'En Ruta (GPS)'
                  : sq.status === 'ACTIVE'
                    ? 'Disponible'
                    : 'Inactivo'}
              </span>
            </div>

            {/* Info details */}
            <div className="space-y-2 text-xs text-gray-300 border-t border-admin-border/50 pt-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Zona: <strong className="text-white">{sq.zone}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  Vehículo: <strong className="text-white font-mono">{sq.vehiclePlate}</strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>
                  Equipamiento: <span className="text-gray-400">{sq.equipment}</span>
                </span>
              </div>
            </div>

            {/* Financial ledger box */}
            <div className="p-3.5 rounded-xl bg-admin-sidebar/80 border border-admin-border flex justify-between items-center text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Comisiones Acumuladas (15%)</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  RD$ {sq.totalCommissions.toLocaleString('es-DO')}
                </span>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${sq.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-admin-card hover:bg-admin-hover border border-admin-border text-emerald-400 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${sq.phone}`}
                  className="p-2 rounded-lg bg-admin-card hover:bg-admin-hover border border-admin-border text-cyan-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
