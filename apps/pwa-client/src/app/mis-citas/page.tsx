'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { AppointmentResponseDto } from '@mitefree/shared-types';

export default function MisCitasPage() {
  const [appointment, setAppointment] = useState<AppointmentResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const lastId =
          typeof window !== 'undefined'
            ? localStorage.getItem('mitefree_last_appointment_id')
            : null;

        if (lastId) {
          const res = await apiClient.appointments.getById(lastId);
          if (res.success && res.data) {
            setAppointment(res.data);
            if (res.data.status === 'Completed') {
              setIsApproved(true);
            }
          }
        }
      } catch {
        // Fallback to demo default
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, []);

  const handleApprove = () => {
    setIsApproved(true);
  };

  const status = appointment?.status || 'EnRoute';

  const getStatusBadge = () => {
    switch (status) {
      case 'PendingPayment':
        return {
          label: 'Pendiente de Pago',
          className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dotClass: 'bg-amber-400',
        };
      case 'Confirmed':
        return {
          label: 'Cita Confirmada',
          className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dotClass: 'bg-emerald-400',
        };
      case 'EnRoute':
        return {
          label: 'Técnico en Ruta',
          className: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 tech-glow-blue',
          dotClass: 'bg-cyan-400 animate-ping',
        };
      case 'InProgress':
        return {
          label: 'En Servicio (UV-C Activo)',
          className: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          dotClass: 'bg-purple-400 animate-pulse',
        };
      case 'Completed':
        return {
          label: 'Servicio Completado',
          className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dotClass: 'bg-emerald-400',
        };
      default:
        return {
          label: 'En Proceso',
          className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          dotClass: 'bg-blue-400',
        };
    }
  };

  const badge = getStatusBadge();

  const steps = [
    {
      label: 'Cita Agendada',
      done: true,
      time: 'Registrada',
    },
    {
      label: 'Cita Confirmada (Sin Anticipo)',
      done: status !== 'PendingPayment',
      current: status === 'PendingPayment',
      time: status === 'PendingPayment' ? 'Pendiente' : 'Aprobada',
    },
    {
      label: 'Técnico en Ruta',
      done: status === 'InProgress' || status === 'Completed',
      current: status === 'EnRoute',
      time: status === 'EnRoute' ? 'ETA: 18 min' : status === 'InProgress' || status === 'Completed' ? 'Completado' : 'Próximamente',
    },
    {
      label: 'Desinfección Quirúrgica UV-C',
      done: status === 'Completed',
      current: status === 'InProgress',
      time: status === 'InProgress' ? 'En ejecución' : status === 'Completed' ? 'Finalizado' : 'Estimado',
    },
    {
      label: 'Inspección & Aprobación',
      done: isApproved || status === 'Completed',
      current: status === 'InProgress' && !isApproved,
      pending: status !== 'Completed' && !isApproved,
      time: isApproved || status === 'Completed' ? 'Certificado' : 'Al finalizar',
    },
  ];

  const formattedDate = appointment?.scheduledDate
    ? new Date(appointment.scheduledDate).toLocaleDateString('es-DO', {
        weekday: 'short',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Hoy, 01 Octubre 2026';

  const timeSlotLabel = appointment?.timeSlotId
    ? appointment.timeSlotId.includes('MORNING') || appointment.timeSlotId === 'MORNING'
      ? 'Mañana (08:30 – 11:30 AM)'
      : 'Tarde (01:00 – 04:00 PM)'
    : 'Mañana (08:30 – 11:30 AM)';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Telemetría de Cita & Cuadrilla</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Seguimiento de tu Servicio en Vivo
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Rastrea a tu técnico en tiempo real y certifica la finalización del protocolo.
        </p>
      </div>

      {/* Main Appointment Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-dark-border space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-dark-border/60">
          <div>
            <span className="text-xs font-mono text-gray-500 uppercase">
              {appointment ? `Cita #${appointment.id.substring(0, 8).toUpperCase()}` : 'Orden #MF-2026-9812'}
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {appointment?.serviceDescription || 'Desinfección Sofá Modular L + Colchón Queen'}
            </h2>
          </div>
          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.className}`}
          >
            <span className={`w-2 h-2 rounded-full ${badge.dotClass}`} />
            <span>{badge.label}</span>
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-dark-surface/60 border border-dark-border">
            <Calendar className="w-5 h-5 text-brand-400 shrink-0" />
            <div>
              <span className="text-gray-400 block">Fecha Programada</span>
              <span className="font-semibold text-white capitalize">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-dark-surface/60 border border-dark-border">
            <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-gray-400 block">Bloque Horario</span>
              <span className="font-semibold text-white">{timeSlotLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-dark-surface/60 border border-dark-border">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-gray-400 block">Ubicación / Dirección</span>
              <span className="font-semibold text-white truncate max-w-[180px] block">
                {appointment?.address || 'Piantini, Santo Domingo'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Stepper */}
        <div className="pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Línea de Tiempo del Servicio
          </h3>

          <div className="relative border-l-2 border-dark-border ml-3 sm:ml-4 space-y-6">
            {steps.map((st, i) => (
              <div key={i} className="relative pl-6 sm:pl-8">
                <div
                  className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all ${
                    st.done
                      ? 'bg-brand-500 border-brand-500 tech-glow'
                      : st.current
                        ? 'bg-cyan-500 border-white ring-4 ring-cyan-500/20 animate-pulse'
                        : 'bg-dark-surface border-gray-600'
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      st.done
                        ? 'text-white'
                        : st.current
                          ? 'text-cyan-400 font-bold'
                          : 'text-gray-500'
                    }`}
                  >
                    {st.label}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono mt-0.5 sm:mt-0">
                    {st.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technician Profile Card */}
        <div className="p-5 rounded-2xl bg-dark-surface/80 border border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-dark-bg font-extrabold text-xl flex items-center justify-center tech-glow shadow-md">
              {appointment?.technicianName
                ? appointment.technicianName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                : 'KR'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">
                  {appointment?.technicianName || 'Ing. Kelvin Rosario'}
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Cuadrilla Activa
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Especialista Certificado en Protocolo UV-C & Higienización
              </p>
              <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">4.98</span>
                <span className="text-gray-500">(142 servicios aprobados)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://wa.me/18095134773"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-hover hover:bg-dark-border border border-dark-border text-xs font-semibold text-white transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+18095134773"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-hover hover:bg-dark-border border border-dark-border text-xs font-semibold text-white transition-colors"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Llamar</span>
            </a>
          </div>
        </div>

        {/* Service Approval Section */}
        <div className="pt-4 border-t border-dark-border/60">
          {!isApproved ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Inspección Final de Satisfacción</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Una vez que el técnico concluya la desinfección, confirma tu satisfacción aquí.
                </p>
              </div>
              <button
                onClick={handleApprove}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-xs tech-glow active:scale-95 transition-transform"
              >
                Aprobar Servicio & Liberar Garantía
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-fadeIn space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>¡Servicio Aprobado con Éxito!</span>
              </div>
              <p className="text-xs text-gray-300">
                Se ha acreditado el 5% de cashback en tu billetera digital y tu certificado de
                desinfección está disponible.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() =>
                    alert('Descargando Certificado Oficial de Desinfección MITEFREE (PDF)...')
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-dark-card border border-dark-border text-xs text-white hover:text-brand-400 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Certificado UV-C (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
