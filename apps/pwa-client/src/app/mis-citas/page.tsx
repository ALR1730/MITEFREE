'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Search,
  AlertCircle,
  Loader2,
  Inbox,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { AppointmentResponseDto } from '@mitefree/shared-types';

function MisCitasContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');

  const [appointment, setAppointment] = useState<AppointmentResponseDto | null>(null);
  const [savedAppointments, setSavedAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncText, setLastSyncText] = useState<string>('Sincronizado en vivo');

  // Cargar lista de IDs de citas guardadas localmente
  const loadSavedIds = useCallback((): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('mitefree_guest_appointments');
      const list = raw ? JSON.parse(raw) : [];
      const lastId = localStorage.getItem('mitefree_last_appointment_id');
      if (lastId && !list.includes(lastId)) {
        list.unshift(lastId);
      }
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }, []);

  const saveAppointmentId = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const current = loadSavedIds();
      if (!current.includes(id)) {
        current.unshift(id);
        localStorage.setItem('mitefree_guest_appointments', JSON.stringify(current));
      }
      localStorage.setItem('mitefree_last_appointment_id', id);
    } catch {
      // Ignorar error de storage
    }
  }, [loadSavedIds]);

  // Refrescar manualmente la cita activa
  const handleManualRefresh = async () => {
    if (!appointment?.id) return;
    setIsRefreshing(true);
    try {
      const res = await apiClient.appointments.getById(appointment.id);
      if (res.success && res.data) {
        setAppointment(res.data);
        setLastSyncText(`Actualizado ${new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      }
    } catch {
      // Ignorar
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Auto-refresco en vivo cada 4 segundos para sincronizar con el panel del administrador en tiempo real
  useEffect(() => {
    if (!appointment?.id) return;
    const interval = setInterval(async () => {
      try {
        const res = await apiClient.appointments.getById(appointment.id);
        if (res.success && res.data) {
          setAppointment((prev) => {
            if (
              !prev ||
              prev.status !== res.data.status ||
              prev.technicianName !== res.data.technicianName ||
              prev.technicianId !== res.data.technicianId
            ) {
              return res.data;
            }
            return prev;
          });
          if (res.data.status === 'Completed') {
            setIsApproved(true);
          }
        }
      } catch {
        // Silently preserve current state
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [appointment?.id]);

  // Carga inicial: por URL (?id=...) o por localStorage o fallback de cita de Angel
  useEffect(() => {
    async function init() {
      setLoading(true);
      const targetId = urlId || (typeof window !== 'undefined' ? localStorage.getItem('mitefree_last_appointment_id') : null);

      if (targetId) {
        try {
          const res = await apiClient.appointments.getById(targetId);
          if (res.success && res.data) {
            setAppointment(res.data);
            saveAppointmentId(res.data.id);
            setSavedAppointments([res.data]);
            if (res.data.status === 'Completed') {
              setIsApproved(true);
            }
          }
        } catch {
          // Fallback silencioso
        }
      } else {
        // Si no hay cita guardada, consultar por la cita canónica de Angel Luis Rosario para demostración fluida
        try {
          const res = await apiClient.appointments.lookup({ phone: '829-207-4079' });
          if (res.success && res.data.length > 0) {
            const angelApt = res.data[0]!;
            setAppointment(angelApt);
            saveAppointmentId(angelApt.id);
            setSavedAppointments([angelApt]);
          }
        } catch {
          // Silencioso
        }
      }

      // Cargar citas adicionales del historial si existen
      const allIds = loadSavedIds();
      if (allIds.length > 0) {
        const fetched: AppointmentResponseDto[] = [];
        for (const id of allIds.slice(0, 5)) {
          if (id === targetId && appointment) {
            fetched.push(appointment);
            continue;
          }
          try {
            const r = await apiClient.appointments.getById(id);
            if (r.success && r.data) {
              fetched.push(r.data);
            }
          } catch {
            // Ignorar
          }
        }
        if (fetched.length > 0) {
          setSavedAppointments(fetched);
          if (!appointment && fetched[0]) {
            setAppointment(fetched[0]);
          }
        }
      }

      setLoading(false);
    }

    init();
  }, [urlId]);

  // Búsqueda rápida por teléfono dominicano o código de cita
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchError('Ingresa tu número de teléfono de WhatsApp o código de cita.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Si parece un teléfono o código
      const isPhone = /\d{7,}/.test(query.replace(/\D/g, ''));
      const lookupParams = isPhone ? { phone: query } : { code: query };

      const res = await apiClient.appointments.lookup(lookupParams);

      if (res.success && res.data.length > 0) {
        const found = res.data[0]!;
        setAppointment(found);
        saveAppointmentId(found.id);

        // Actualizar lista acumulativa
        setSavedAppointments((prev) => {
          const exists = prev.some((p) => p.id === found.id);
          return exists ? prev : [found, ...prev];
        });

        if (found.status === 'Completed') {
          setIsApproved(true);
        }
        setSearchError(null);
      } else {
        // Intentar búsqueda directa por UUID si tiene formato largo
        if (query.length >= 8) {
          const directRes = await apiClient.appointments.getById(query);
          if (directRes.success && directRes.data) {
            setAppointment(directRes.data);
            saveAppointmentId(directRes.data.id);
            return;
          }
        }
        setSearchError('No encontramos citas registradas con ese número o código. Verifica tus datos.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al consultar la cita.';
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };

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

  const formattedDate = appointment?.scheduledDate
    ? new Date(appointment.scheduledDate).toLocaleDateString('es-DO', {
        weekday: 'short',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Fecha por confirmar';

  const timeSlotLabel = appointment?.timeSlotId
    ? appointment.timeSlotId.includes('MORNING') || appointment.timeSlotId === 'MORNING'
      ? 'Mañana (08:30 – 11:30 AM)'
      : appointment.timeSlotId.includes('AFTERNOON') || appointment.timeSlotId === 'AFTERNOON'
      ? 'Tarde (01:00 – 04:00 PM)'
      : 'Vespertino (04:30 – 07:30 PM)'
    : 'Bloque Programado';

  const steps = [
    {
      label: 'Cita Agendada',
      done: true,
      time: 'Registrada',
    },
    {
      label: 'Cita Confirmada',
      done: status !== 'PendingPayment',
      current: status === 'PendingPayment',
      time: status === 'PendingPayment' ? 'Pendiente' : 'Aprobada',
    },
    {
      label: 'Técnico en Ruta',
      done: status === 'InProgress' || status === 'Completed',
      current: status === 'EnRoute',
      time: status === 'EnRoute' ? 'En trayecto' : status === 'InProgress' || status === 'Completed' ? 'Llegó a destino' : 'Programado',
    },
    {
      label: 'Desinfección Quirúrgica UV-C',
      done: status === 'Completed',
      current: status === 'InProgress',
      time: status === 'InProgress' ? 'En ejecución' : status === 'Completed' ? 'Finalizado' : 'Pendiente',
    },
    {
      label: 'Inspección & Aprobación',
      done: isApproved || status === 'Completed',
      current: status === 'InProgress' && !isApproved,
      pending: status !== 'Completed' && !isApproved,
      time: isApproved || status === 'Completed' ? 'Certificado' : 'Al finalizar',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Telemetría de Cita & Cuadrilla</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Seguimiento de tu Servicio en Vivo
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Rastrea a tu cuadrilla técnica en tiempo real sin necesidad de contraseñas.
        </p>
      </div>

      {/* Buscador Rápido por Teléfono o Código de Cita */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 shadow-lg">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>¿Agendaste desde otro celular o PC? Consulta aquí:</span>
            </span>
            <span className="text-[11px] text-gray-400">
              Solo ingresa tu WhatsApp o Código
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ej: 809-555-0188 o #A1B2C3D4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Rastrear</span>
            </button>
          </div>

          {searchError && (
            <p className="text-xs text-amber-400 flex items-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{searchError}</span>
            </p>
          )}
        </form>
      </div>

      {/* Selector de Pestañas Multicita (si el cliente tiene más de 1 servicio guardado) */}
      {savedAppointments.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-[10px] uppercase font-bold text-gray-500 shrink-0">Mis Citas:</span>
          {savedAppointments.map((apt) => (
            <button
              key={apt.id}
              type="button"
              onClick={() => {
                setAppointment(apt);
                setIsApproved(apt.status === 'Completed');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                appointment?.id === apt.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                  : 'bg-dark-surface/80 text-gray-400 border border-dark-border hover:text-white'
              }`}
            >
              #{apt.id.substring(0, 8).toUpperCase()} ({apt.status})
            </button>
          ))}
        </div>
      )}

      {/* Tarjeta Principal de la Cita */}
      {loading ? (
        <div className="glass-card rounded-3xl p-12 text-center text-gray-400 space-y-3 animate-pulse border border-dark-border">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs">Sincronizando telemetría de cuadrilla...</p>
        </div>
      ) : appointment ? (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-dark-border space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-dark-border/60">
            <div>
              <span className="text-xs font-mono text-gray-500 uppercase">
                Cita #{appointment.id.substring(0, 8).toUpperCase()}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {appointment.serviceDescription || 'Servicio de Desinfección & Limpieza'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.className}`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.dotClass}`} />
                <span>{badge.label}</span>
              </span>
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-xl bg-dark-surface border border-dark-border hover:border-cyan-500/50 text-gray-400 hover:text-cyan-400 transition-all cursor-pointer"
                title="Actualizar estado en vivo"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Rejilla de Información */}
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
              <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="truncate">
                <span className="text-gray-400 block">Ubicación / Sector</span>
                <span className="font-semibold text-white truncate block">
                  {appointment.address || appointment.zoneCode || 'República Dominicana'}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper de Progreso */}
          <div className="py-4">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-dark-border -translate-y-1/2 z-0" />
              {steps.map((st, i) => (
                <div key={st.label} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      st.done
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : st.current
                        ? 'bg-cyan-500 text-dark-bg animate-pulse'
                        : 'bg-dark-surface border border-dark-border text-gray-500'
                    }`}
                  >
                    {st.done ? '✓' : i + 1}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-300 hidden sm:block text-center max-w-[100px]">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Perfil de Cuadrilla Técnica Enriquecido */}
          <div className="p-5 rounded-2xl bg-dark-surface/80 border border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-dark-bg font-extrabold text-xl flex items-center justify-center tech-glow shadow-md shrink-0">
                {appointment.technicianName
                  ? appointment.technicianName.includes('Kelvin')
                    ? 'KR'
                    : appointment.technicianName.includes('Marcos')
                      ? 'MS'
                      : appointment.technicianName.includes('Darío')
                        ? 'DT'
                        : appointment.technicianName.includes('Junior')
                          ? 'JP'
                          : 'MF'
                  : 'MF'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-white">
                    {appointment.technicianName || 'Despacho Central MITEFREE'}
                  </h4>
                  {appointment.technicianName ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {status === 'EnRoute'
                        ? '🚚 En Camino al Domicilio'
                        : status === 'InProgress'
                          ? '⚡ Desinfección UV-C Activa'
                          : 'Cuadrilla Asignada'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Coordinando Cuadrilla
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {appointment.technicianName
                    ? 'Especialistas Certificados en Inyección-Extracción & Protocolo Quirúrgico UV-C 254nm'
                    : 'La cuadrilla técnica será asignada en breve según tu zona territorial.'}
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">4.98</span>
                  <span className="text-gray-500">(Garantía 100% Certificada · ALR COMPANY)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`https://wa.me/18095134773?text=${encodeURIComponent(
                  `¡Hola MITEFREE! Tengo una consulta sobre mi cita #${appointment.id.substring(0, 8).toUpperCase()} con ${appointment.technicianName || 'el despacho'}.`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-hover hover:bg-dark-border border border-dark-border text-xs font-semibold text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Soporte</span>
              </a>
            </div>
          </div>

          {/* Aprobación e Inspección */}
          <div className="pt-4 border-t border-dark-border/60">
            {appointment.status === 'Completed' || isApproved ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-fadeIn space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>¡Servicio Completado & Aprobado con Éxito!</span>
                </div>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  Tu protocolo quirúrgico de inyección-extracción y desinfección UV-C ha concluido. Tu garantía oficial MITEFREE de 48 horas está activa.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={apiClient.appointments.getFinalInvoicePdfUrl(appointment.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                    title="Descargar Factura Final de Servicio Completado en formato térmico 80mm"
                  >
                    <Download className="w-4 h-4" />
                    <span>🧾 Descargar Factura Final (PDF Térmico)</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Inspección Final de Satisfacción</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Una vez que el técnico concluya la desinfección, confirma tu satisfacción aquí.
                  </p>
                </div>
                <button
                  onClick={handleApprove}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-xs tech-glow active:scale-95 transition-transform cursor-pointer"
                >
                  Aprobar Servicio & Liberar Garantía
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-10 text-center space-y-5 border border-dark-border">
          <div className="w-14 h-14 rounded-full bg-dark-surface border border-dark-border mx-auto flex items-center justify-center text-gray-500">
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No hay citas activas en este dispositivo</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
              Si ya reservaste, ingresa tu número de WhatsApp en el buscador superior, o consulta directamente una cita de demostración.
            </p>
          </div>

          <div className="pt-1">
            <span className="text-[11px] text-gray-400 block mb-2 font-mono uppercase tracking-wider">
              Acceso Rápido de Prueba:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('829-207-4079');
                  apiClient.appointments.lookup({ phone: '829-207-4079' }).then((r) => {
                    if (r.success && r.data[0]) {
                      setAppointment(r.data[0]);
                      saveAppointmentId(r.data[0].id);
                    }
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-dark-surface border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/10 cursor-pointer"
              >
                Angel Luis Rosario (829-207-4079)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('809-555-0123');
                  apiClient.appointments.lookup({ phone: '809-555-0123' }).then((r) => {
                    if (r.success && r.data[0]) {
                      setAppointment(r.data[0]);
                      saveAppointmentId(r.data[0].id);
                    }
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-dark-surface border border-emerald-500/30 text-emerald-300 text-xs hover:bg-emerald-500/10 cursor-pointer"
              >
                Laura Mercedes (809-555-0123)
              </button>
            </div>
          </div>

          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-xs tech-glow"
          >
            <span>Agendar un Servicio Nuevo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MisCitasPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
          Cargando telemetría de citas...
        </div>
      }
    >
      <MisCitasContent />
    </Suspense>
  );
}
