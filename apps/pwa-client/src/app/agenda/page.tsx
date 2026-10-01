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
} from 'lucide-react';

const COVERAGE_ZONES = [
  { id: 'DN', name: 'Distrito Nacional', areas: 'Piantini, Naco, Bella Vista, Gazcue, Evaristo' },
  { id: 'SDE', name: 'Santo Domingo Este', areas: 'Alma Rosa, Ensanche Ozama, Autopista San Isidro' },
  { id: 'SDO', name: 'Santo Domingo Oeste', areas: 'Herrera, Alameda, Manoguayabo, Los Ríos' },
  { id: 'SDN', name: 'Santo Domingo Norte', areas: 'Villa Mella, El Edén, Mirador Norte' },
];

const TIME_SLOTS = [
  { id: 'MORNING', label: 'Bloque Mañana', time: '08:30 AM – 11:30 AM', available: true, badge: 'Recomendado' },
  { id: 'AFTERNOON', label: 'Bloque Tarde', time: '01:00 PM – 04:00 PM', available: true, badge: 'Popular' },
  { id: 'EVENING', label: 'Bloque Vespertino', time: '04:30 PM – 07:30 PM', available: true, badge: 'Últimos cupos' },
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
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Gestión de Rutas y Despacho</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Agendamiento de Cuadrilla Técnica
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Asignamos especialistas con equipamiento hospitalario UV-C en tu zona.
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
                  <span className="text-[11px] uppercase font-semibold text-gray-400">{item.dayName}</span>
                  <span className="text-lg font-bold text-white my-0.5">{item.dayNum}</span>
                  <span className="text-[10px] text-gray-400">{item.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Zone selector */}
          <div className="glass-card rounded-2xl p-6 border border-dark-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>2. Zona Geográfica de Cobertura</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COVERAGE_ZONES.map((zone) => (
                <button
                  type="button"
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedZone === zone.id
                      ? 'border-cyan-500 bg-cyan-500/10 tech-glow-blue text-white'
                      : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-400'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{zone.name}</div>
                  <p className="text-xs text-gray-400 mt-0.5">{zone.areas}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Time Slots */}
          <div className="glass-card rounded-2xl p-6 border border-dark-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>3. Bloque Horario Disponible</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedSlot === slot.id
                      ? 'border-brand-500 bg-brand-500/15 tech-glow text-white'
                      : 'border-dark-border bg-dark-surface/60 hover:bg-dark-hover text-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-white">{slot.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-mono">
                      {slot.badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-300 mt-1">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Client info */}
          <div className="glass-card rounded-2xl p-6 border border-dark-border space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" />
              <span>4. Datos de Contacto y Dirección</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Mercedes"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp / Teléfono</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +1 (809) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Dirección Exacta y Referencia</label>
              <textarea
                required
                rows={2}
                placeholder="Ej: Calle Federico Geraldino #45, Edif. Torre Azul, Apto 5B, Piantini"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-brand-500 via-cyan-500 to-emerald-400 text-dark-bg font-extrabold text-sm tech-glow shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Confirmar Cita & Bloquear Cuadrilla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* Confirmation Success Card */
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-brand-500/40 text-center animate-fadeIn space-y-6 tech-glow">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/40 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">¡Cita Agendada Exitosamente!</h2>
            <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto">
              Hemos reservado el bloque para <span className="text-brand-400 font-semibold">{fullName}</span> en{' '}
              <span className="text-white font-medium">{address}</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-surface/90 border border-dark-border text-xs text-left max-w-sm mx-auto space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Bloque:</span>
              <span className="text-white font-mono">{selectedSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Zona:</span>
              <span className="text-white font-mono">{selectedZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Notificaciones:</span>
              <span className="text-emerald-400">Vía WhatsApp ({phone})</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/mis-citas"
              className="px-6 py-3 rounded-xl bg-brand-500 text-dark-bg font-bold text-xs tech-glow"
            >
              Ver Estado en Mis Citas
            </Link>
            <Link
              href="/wallet"
              className="px-6 py-3 rounded-xl glass-panel text-gray-300 hover:text-white text-xs"
            >
              Consultar Mi Billetera Cashback
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
