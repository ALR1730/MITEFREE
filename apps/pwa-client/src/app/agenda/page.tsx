'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  User,
  Phone,
  Zap,
  Tag,
  Truck,
  Sparkles,
} from 'lucide-react';

const COVERAGE_ZONES = [
  {
    id: 'ZONE-SPM',
    name: 'San Pedro de Macorís',
    areas:
      'San Pedro (Centro), Consuelo, Quisqueya, Ramón Santana, Guayacanes, Juan Dolio, El Puerto',
    hasCluster: true,
  },
  {
    id: 'ZONE-LR',
    name: 'La Romana',
    areas: 'La Romana (Centro), Villa Hermosa, Guaymate, Cumayasa, Caleta',
    hasCluster: true,
  },
  {
    id: 'ZONE-SDE',
    name: 'Santo Domingo Este',
    areas:
      'Alma Rosa, Ensanche Ozama, Autopista San Isidro, Los Frailes, Autopista Las Américas, Invivienda, Lucerna',
    hasCluster: true,
  },
];

const TIME_SLOTS = [
  {
    id: 'MORNING',
    label: 'Bloque Mañana',
    time: '08:30 AM – 11:30 AM',
    available: true,
    hasRoutePromotion: true,
  },
  {
    id: 'AFTERNOON',
    label: 'Bloque Tarde',
    time: '01:00 PM – 04:00 PM',
    available: true,
    hasRoutePromotion: false,
  },
  {
    id: 'EVENING',
    label: 'Bloque Vespertino',
    time: '04:30 PM – 07:30 PM',
    available: true,
    hasRoutePromotion: false,
  },
];

export default function AgendaPage() {
  const [selectedZone, setSelectedZone] = useState<string>(COVERAGE_ZONES[0]!.id);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[0]!.id);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Generate next 6 dates
  const availableDates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('es-ES', { month: 'short' });
    return { offset: i + 1, dateStr: d.toISOString().split('T')[0], dayName, dayNum, month };
  });

  const currentZoneObj = COVERAGE_ZONES.find((z) => z.id === selectedZone)!;
  const currentSlotObj = TIME_SLOTS.find((s) => s.id === selectedSlot)!;
  const selectedDateObj = availableDates.find((d) => d.offset === selectedDayOffset)!;

  // Evaluar si aplica el 15% por agrupación de cuadrilla en la misma zona
  const hasRoutePromo = currentZoneObj.hasCluster && currentSlotObj.hasRoutePromotion;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert('Por favor completa tu nombre, teléfono y dirección.');
      return;
    }
    setIsBooked(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20">
          <Truck className="w-3.5 h-3.5" />
          <span>Motor de Logística & Rutas DDD · Fase 3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Agendamiento de Cuadrilla Técnica
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Asignamos especialistas con equipamiento hospitalario UV-C optimizando desplazamientos por
          zona.
        </p>
      </div>

      {!isBooked ? (
        <form onSubmit={handleConfirm} className="space-y-8 animate-fadeIn">
          {/* 1. Date selector */}
          <div className="glass-card rounded-2xl p-6 border border-dark-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-brand-400" />
              <span>1. Selecciona el Día de Servicio</span>
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {availableDates.map((item) => (
                <button
                  type="button"
                  key={item.offset}
                  onClick={() => setSelectedDayOffset(item.offset)}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                    selectedDayOffset === item.offset
                      ? 'border-brand-500 bg-brand-500/15 tech-glow text-white'
                      : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-400'
                  }`}
                >
                  <span className="text-[11px] uppercase font-semibold text-gray-400">
                    {item.dayName}
                  </span>
                  <span className="text-lg font-bold text-white my-0.5">{item.dayNum}</span>
                  <span className="text-[10px] text-gray-400">{item.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Zone selector */}
          <div className="glass-card rounded-2xl p-6 border border-dark-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>2. Cuadrante Geoespacial de Cobertura</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COVERAGE_ZONES.map((zone) => (
                <button
                  type="button"
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedZone === zone.id
                      ? 'border-cyan-500 bg-cyan-500/10 tech-glow text-white'
                      : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-white">{zone.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-bg/80 text-cyan-400 border border-cyan-500/20">
                      {zone.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{zone.areas}</p>
                  {zone.hasCluster && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <Zap className="w-3 h-3" />
                      <span>Cuadrilla activa en zona (Aplica 15% Descuento)</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Time slot selector */}
          <div className="glass-card rounded-2xl p-6 border border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>3. Bloque Horario de 3 Horas</span>
              </h2>
              {hasRoutePromo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <Tag className="w-3.5 h-3.5" />
                  <span>15% OFF de Ruta Activo</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isPromo = currentZoneObj.hasCluster && slot.hasRoutePromotion;
                return (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      selectedSlot === slot.id
                        ? 'border-indigo-500 bg-indigo-500/15 tech-glow text-white'
                        : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-300'
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-1">{slot.label}</div>
                    <p className="text-xs text-gray-400 font-mono mb-2">{slot.time}</p>
                    {isPromo ? (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        15% Descuento Ruta
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] text-gray-500">
                        Tarifa Estándar
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Client info */}
          <div className="glass-card rounded-2xl p-6 border border-dark-border space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>4. Datos del Domicilio de Servicio</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: María Mercedes Guzmán"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Teléfono / WhatsApp de Notificaciones
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ej: +1 809-555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Dirección Exacta (Calle, Edificio, Apto, Sector)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Av. Winston Churchill #105, Torre Empresarial, Apto 4B, Piantini"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="p-6 rounded-2xl bg-dark-surface/90 border border-brand-500/30 tech-glow flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Garantía de Puntualidad y Sanidad Certificada</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedDateObj.dayName} {selectedDateObj.dayNum} de {selectedDateObj.month} ·{' '}
                {currentSlotObj.time} · {currentZoneObj.name}
              </p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-sm tech-glow shadow-lg active:scale-95 transition-all"
            >
              <span>Confirmar Cita</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        /* Confirmation screen */
        <div className="glass-card rounded-2xl p-8 border border-emerald-500/40 animate-fadeIn text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center tech-glow">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              ¡Cita Reservada con Éxito!
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Hemos asignado la ventana horaria en el sistema de despacho de MITEFREE.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-dark-surface/80 border border-dark-border text-left space-y-3 max-w-md mx-auto text-xs">
            <div className="flex justify-between border-b border-dark-border/40 pb-2">
              <span className="text-gray-400">Cliente:</span>
              <span className="font-bold text-white">{fullName}</span>
            </div>
            <div className="flex justify-between border-b border-dark-border/40 pb-2">
              <span className="text-gray-400">Fecha y Bloque:</span>
              <span className="font-bold text-cyan-400">
                {selectedDateObj.dayNum} de {selectedDateObj.month} ({currentSlotObj.label})
              </span>
            </div>
            <div className="flex justify-between border-b border-dark-border/40 pb-2">
              <span className="text-gray-400">Zona / Sector:</span>
              <span className="font-bold text-white">{currentZoneObj.name}</span>
            </div>
            <div className="flex justify-between border-b border-dark-border/40 pb-2">
              <span className="text-gray-400">Dirección:</span>
              <span className="font-mono text-gray-300">{address}</span>
            </div>
            {hasRoutePromo && (
              <div className="flex justify-between pt-1 text-emerald-400 font-bold">
                <span>Bonificación Aplicada:</span>
                <span>15% Descuento de Ruta</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Link
              href="/mis-citas"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-xs tech-glow"
            >
              <span>Ver en Mis Citas (Live Tracking)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
