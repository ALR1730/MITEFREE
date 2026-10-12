'use client';

import { useState, useEffect } from 'react';
import { adminApiClient } from '@/lib/api-client';
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
  Zap,
  ChevronRight,
  UserCheck,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { WhatsAppAdminAdapter } from '@/lib/whatsapp-adapter';

interface KanbanAppointment {
  id: string;
  client: string;
  phone: string;
  zone: string;
  zoneCode: 'ZONE-SPM' | 'ZONE-LR' | 'ZONE-SDE' | 'ZONE-DN';
  address: string;
  timeSlot: string;
  service: string;
  total: number;
  deposit: number;
  status: 'PENDING_DEPOSIT' | 'CONFIRMED' | 'IN_ROUTE' | 'IN_SERVICE' | 'COMPLETED';
  technician?: string;
}

const TECHNICIAN_CREWS = [
  'Ing. Kelvin Rosario (Cuadrilla #01 - San Pedro)',
  'Marcos Santana (Cuadrilla #02 - Santo Domingo Este)',
  'Darío Tavárez (Cuadrilla #03 - La Romana)',
  'Junior Polanco (Cuadrilla #04 - SPM / Consuelo)',
];

const INITIAL_APPOINTMENTS: KanbanAppointment[] = [
  {
    id: 'APT-101',
    client: 'Laura Mercedes',
    phone: '+1 809-555-0123',
    zone: 'San Pedro de Macorís',
    zoneCode: 'ZONE-SPM',
    address: 'Consuelo, C/ Principal #45',
    timeSlot: '08:30 – 11:30 AM',
    service: 'Mueble 5 Plazas (Modular) + Mancha Crítica',
    total: 4000.0,
    deposit: 1200.0,
    status: 'IN_ROUTE',
    technician: 'Ing. Kelvin Rosario (Cuadrilla #01 - San Pedro)',
  },
  {
    id: 'APT-102',
    client: 'Carlos Méndez',
    phone: '+1 809-555-0188',
    zone: 'Santo Domingo Este',
    zoneCode: 'ZONE-SDE',
    address: 'Alma Rosa, C/ Costa Rica #12',
    timeSlot: '01:00 – 04:00 PM',
    service: 'Colchón Queen (Ambos Lados) + 4 Sillas Comedor',
    total: 4700.0,
    deposit: 1410.0,
    status: 'CONFIRMED',
    technician: 'Marcos Santana (Cuadrilla #02 - Santo Domingo Este)',
  },
  {
    id: 'APT-103',
    client: 'Dra. Patricia Gómez',
    phone: '+1 809-555-0944',
    zone: 'La Romana',
    zoneCode: 'ZONE-LR',
    address: 'Villa Hermosa, C/ Central #8',
    timeSlot: '04:30 – 07:30 PM',
    service: 'Colchón King Size (Ambos Lados)',
    total: 4000.0,
    deposit: 1200.0,
    status: 'CONFIRMED',
    technician: 'Darío Tavárez (Cuadrilla #03 - La Romana)',
  },
  {
    id: 'APT-104',
    client: 'Miguelina Valenzuela',
    phone: '+1 809-555-0612',
    zone: 'Santo Domingo Este',
    zoneCode: 'ZONE-SDE',
    address: 'Los Frailes, C/ Duarte #99',
    timeSlot: '08:30 – 11:30 AM',
    service: 'Mueble 3 Plazas + 2 Sillas Comedor',
    total: 3100.0,
    deposit: 930.0,
    status: 'PENDING_DEPOSIT',
  },
  {
    id: 'APT-105',
    client: 'Roberto Salcedo',
    phone: '+1 809-555-0777',
    zone: 'San Pedro de Macorís',
    zoneCode: 'ZONE-SPM',
    address: 'Guayacanes, C/ Mella #18',
    timeSlot: '08:30 – 11:30 AM',
    service: 'Mueble 2 Plazas (Love Seat)',
    total: 2000.0,
    deposit: 600.0,
    status: 'COMPLETED',
    technician: 'Ing. Kelvin Rosario (Cuadrilla #01 - San Pedro)',
  },
];

const COLUMNS: Array<{
  id: KanbanAppointment['status'];
  title: string;
  color: string;
  border: string;
}> = [
  {
    id: 'PENDING_DEPOSIT',
    title: 'Por Confirmar (Sin Anticipo)',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  {
    id: 'CONFIRMED',
    title: 'Confirmadas / En Agenda',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  {
    id: 'IN_ROUTE',
    title: 'Cuadrilla en Ruta',
    color: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
  {
    id: 'IN_SERVICE',
    title: 'Servicio en Proceso',
    color: 'text-brand-400',
    border: 'border-brand-500/30',
  },
  {
    id: 'COMPLETED',
    title: 'Completado y Liquidado',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
];

export default function CitasPage() {
  const [appointments, setAppointments] = useState<KanbanAppointment[]>(INITIAL_APPOINTMENTS);
  const [filterZone, setFilterZone] = useState<string>('ALL');
  const [activeMobileCol, setActiveMobileCol] = useState<'ALL' | KanbanAppointment['status']>(
    'ALL',
  );

  const CREW_UUID_MAP: Record<string, string> = {
    'Ing. Kelvin Rosario (Cuadrilla #01 - San Pedro)': '11111111-1111-4111-8111-111111111111',
    'Marcos Santana (Cuadrilla #02 - Santo Domingo Este)': '44444444-4444-4444-8444-444444444444',
    'Darío Tavárez (Cuadrilla #03 - La Romana)': '33333333-3333-4333-8333-333333333333',
    'Junior Polanco (Cuadrilla #04 - SPM / Consuelo)': '22222222-2222-4222-8222-222222222222',
  };

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await adminApiClient.appointments.listAll();
        if (res.success && res.data.length > 0) {
          const zoneNameMap: Record<string, string> = {
            'ZONE-SPM': 'San Pedro de Macorís',
            'ZONE-LR': 'La Romana',
            'ZONE-SDE': 'Santo Domingo Este',
            'ZONE-DN': 'Distrito Nacional',
          };

          const apiCards: KanbanAppointment[] = res.data.map((apt) => {
            const zCode = (apt.zoneCode as any) || 'ZONE-SPM';
            return {
              id: apt.id,
              client: apt.clientName || `Cliente #${apt.clientId.substring(0, 6)}`,
              phone: apt.clientPhone || '+1 809-555-0100',
              zone: zoneNameMap[zCode] || 'San Pedro de Macorís',
              zoneCode: zCode,
              address: apt.address || `Servicio programado (${apt.scheduledDate})`,
              timeSlot:
                apt.timeSlotLabel ||
                (apt.timeSlotId.includes('MORNING')
                  ? '08:30 – 11:30 AM'
                  : apt.timeSlotId.includes('EVENING')
                    ? '04:30 – 07:30 PM'
                    : '01:00 – 04:00 PM'),
              service:
                apt.serviceDescription || `Cotización Ref #${apt.quotationId.substring(0, 6)}`,
              total: apt.totalAmount ?? 3500.0,
              deposit: apt.depositAmount ?? 1050.0,
              status:
                apt.status === 'Confirmed'
                  ? 'CONFIRMED'
                  : apt.status === 'EnRoute'
                    ? 'IN_ROUTE'
                    : apt.status === 'InProgress'
                      ? 'IN_SERVICE'
                      : apt.status === 'Completed'
                        ? 'COMPLETED'
                        : 'PENDING_DEPOSIT',
              technician:
                apt.technicianName ||
                (apt.technicianId
                  ? apt.technicianId.includes('1111')
                    ? 'Ing. Kelvin Rosario (Cuadrilla #01 - San Pedro)'
                    : apt.technicianId.includes('4444')
                      ? 'Marcos Santana (Cuadrilla #02 - Santo Domingo Este)'
                      : apt.technicianId.includes('3333')
                        ? 'Darío Tavárez (Cuadrilla #03 - La Romana)'
                        : 'Junior Polanco (Cuadrilla #04 - SPM / Consuelo)'
                  : undefined),
            };
          });

          setAppointments(apiCards);
        }
      } catch {
        // Fallback mantenido
      }
    }

    loadAppointments();
    const interval = setInterval(loadAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAppointments =
    filterZone === 'ALL' ? appointments : appointments.filter((a) => a.zoneCode === filterZone);

  const moveStatus = async (id: string, nextStatus: KanbanAppointment['status']) => {
    // Actualización optimista de UI
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: nextStatus } : apt)),
    );

    const apiStatusMap: Record<KanbanAppointment['status'], any> = {
      PENDING_DEPOSIT: 'PendingPayment',
      CONFIRMED: 'Confirmed',
      IN_ROUTE: 'EnRoute',
      IN_SERVICE: 'InProgress',
      COMPLETED: 'Completed',
    };

    try {
      const res = await adminApiClient.appointments.transitionStatus(id, {
        nextStatus: apiStatusMap[nextStatus],
      });
      if (res.success) {
        setWhatsappToast(`Estado actualizado: ${nextStatus}`);
        setTimeout(() => setWhatsappToast(null), 3000);
      }
    } catch {
      // Optimistic state preserved
    }
  };

  const assignTech = async (id: string, techName: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, technician: techName } : apt)),
    );

    const targetTechId = CREW_UUID_MAP[techName] || '11111111-1111-4111-8111-111111111111';

    try {
      const res = await adminApiClient.appointments.assignTechnician(id, {
        technicianId: targetTechId,
      });
      if (res.success) {
        setWhatsappToast(`Cuadrilla asignada: ${techName.split('(')[0]?.trim()}`);
        setTimeout(() => setWhatsappToast(null), 3000);
      }
    } catch {
      // Optimistic state preserved
    }
  };

  const [whatsappToast, setWhatsappToast] = useState<string | null>(null);

  const handleWhatsAppClient = (apt: KanbanAppointment) => {
    const deepLink = WhatsAppAdminAdapter.createBookingConfirmationLink(
      {
        appointmentCode: apt.id,
        clientName: apt.client,
        scheduledDate: 'Fecha Agendada',
        timeSlotLabel: apt.timeSlot,
        crewName: apt.technician || 'Por Asignar',
        address: apt.address,
        zoneName: apt.zone,
        depositPaidDop: apt.deposit,
        remainingBalanceDop: Math.max(0, apt.total - apt.deposit),
      },
      apt.phone,
    );

    const { opened } = WhatsAppAdminAdapter.openOrCopy(deepLink);
    setWhatsappToast(
      opened
        ? `Abriendo WhatsApp para ${apt.client}...`
        : `Mensaje de ${apt.client} copiado al portapapeles`,
    );
    setTimeout(() => setWhatsappToast(null), 3500);
  };

  const handleWhatsAppCrew = (apt: KanbanAppointment) => {
    const crewLeaderPhone = '+18095134773';
    const deepLink = WhatsAppAdminAdapter.createCrewDispatchLink(
      {
        appointmentCode: apt.id,
        crewName: apt.technician || 'Cuadrilla MITEFREE',
        clientName: apt.client,
        clientPhone: apt.phone,
        address: apt.address,
        zoneName: apt.zone,
        timeSlotLabel: apt.timeSlot,
        taskSummary: apt.service,
        mapsQuery: `${apt.address}, ${apt.zone}, Republica Dominicana`,
      },
      crewLeaderPhone,
    );

    const { opened } = WhatsAppAdminAdapter.openOrCopy(deepLink);
    setWhatsappToast(
      opened
        ? `Despacho enviado a WhatsApp de ${apt.technician || 'la Cuadrilla'}!`
        : `Ruta de despacho copiada al portapapeles`,
    );
    setTimeout(() => setWhatsappToast(null), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-1 border border-cyan-500/20">
            <Truck className="w-3.5 h-3.5" />
            <span>Tablero de Despacho & Optimización de Rutas (Fase 3)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Control de Citas & Flota por Zonas
          </h1>
          <p className="text-xs text-gray-400">
            Monitoreo en tiempo real, transiciones de estado de servicio y asignación de cuadrillas.
          </p>
        </div>

        {/* Zone filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-admin-sidebar border border-admin-border text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="ALL">Todas las Zonas</option>
            <option value="ZONE-SPM">San Pedro de Macorís (y municipios)</option>
            <option value="ZONE-LR">La Romana (y municipios)</option>
            <option value="ZONE-SDE">Santo Domingo Este</option>
          </select>
        </div>
      </div>

      {/* Mobile Column Selector Tabs */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none w-full">
        <button
          type="button"
          onClick={() => setActiveMobileCol('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeMobileCol === 'ALL'
              ? 'bg-cyan-500 text-dark-bg tech-glow shadow'
              : 'bg-admin-sidebar border border-admin-border text-gray-400 hover:text-white'
          }`}
        >
          Todas las Columnas ({filteredAppointments.length})
        </button>
        {COLUMNS.map((col) => {
          const count = filteredAppointments.filter((a) => a.status === col.id).length;
          return (
            <button
              type="button"
              key={col.id}
              onClick={() => setActiveMobileCol(col.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeMobileCol === col.id
                  ? 'bg-cyan-500 text-dark-bg tech-glow shadow'
                  : 'bg-admin-sidebar border border-admin-border text-gray-400 hover:text-white'
              }`}
            >
              <span>{col.title.split('(')[0]?.split('/')[0]?.trim()}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeMobileCol === col.id
                    ? 'bg-dark-bg/25 text-dark-bg'
                    : 'bg-admin-card text-gray-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Container (Flex scroll, NEVER overlaps) */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 snap-x scrollbar-thin w-full min-w-0">
        {COLUMNS.map((col) => {
          const colAppointments = filteredAppointments.filter((a) => a.status === col.id);
          const isHiddenOnMobile = activeMobileCol !== 'ALL' && activeMobileCol !== col.id;

          return (
            <div
              key={col.id}
              className={`flex-col w-full sm:w-[310px] lg:w-[300px] xl:w-[320px] shrink-0 snap-start rounded-2xl bg-admin-sidebar/90 border border-admin-border p-3.5 space-y-3 ${
                isHiddenOnMobile ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-admin-border/60">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="w-5 h-5 rounded-full bg-admin-card flex items-center justify-center text-[10px] font-bold text-gray-300">
                  {colAppointments.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl bg-admin-card border border-admin-border hover:border-gray-600 transition-all space-y-2.5 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-admin-sidebar text-cyan-400 border border-cyan-500/20">
                        {apt.id}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded bg-dark-bg/60">
                        {apt.zoneCode}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white">{apt.client}</h4>
                      <p className="text-[11px] text-gray-400 truncate">{apt.service}</p>
                    </div>

                    <div className="space-y-1 text-[11px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span className="font-mono text-gray-300">{apt.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span className="truncate">{apt.address}</span>
                      </div>
                    </div>

                    {/* Technician selector */}
                    <div className="pt-2 border-t border-admin-border/50">
                      <label className="text-[10px] text-gray-500 block mb-1 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-cyan-400" />
                        <span>Cuadrilla Asignada:</span>
                      </label>
                      <select
                        value={apt.technician || ''}
                        onChange={(e) => assignTech(apt.id, e.target.value)}
                        className="w-full px-2 py-1 rounded bg-admin-sidebar border border-admin-border text-[10px] text-white focus:outline-none focus:border-cyan-500 truncate"
                      >
                        <option value="">Sin Asignar</option>
                        {TECHNICIAN_CREWS.map((t, idx) => (
                          <option key={idx} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quick WhatsApp Actions (Estrategia Sin API) */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-admin-border/50">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppClient(apt)}
                        title="Enviar confirmación oficial de cita al cliente"
                        className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors text-[10px] font-semibold cursor-pointer active:scale-95"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-400" />
                        <span>WA Cliente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleWhatsAppCrew(apt)}
                        title="Despachar hoja de ruta con Google Maps a la cuadrilla técnica"
                        className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-colors text-[10px] font-semibold cursor-pointer active:scale-95"
                      >
                        <Share2 className="w-3 h-3 text-cyan-400" />
                        <span>Despacho WA</span>
                      </button>
                    </div>

                    {/* Status Advance Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-admin-border/40 text-[10px]">
                      <span className="font-mono font-bold text-white">
                        RD$ {apt.total.toLocaleString('es-DO')}
                      </span>

                      {col.id === 'PENDING_DEPOSIT' && (
                        <button
                          onClick={() => moveStatus(apt.id, 'CONFIRMED')}
                          className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-semibold"
                        >
                          Confirmar →
                        </button>
                      )}
                      {col.id === 'CONFIRMED' && (
                        <button
                          onClick={() => moveStatus(apt.id, 'IN_ROUTE')}
                          className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 font-semibold"
                        >
                          En Ruta →
                        </button>
                      )}
                      {col.id === 'IN_ROUTE' && (
                        <button
                          onClick={() => moveStatus(apt.id, 'IN_SERVICE')}
                          className="px-2 py-1 rounded bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 font-semibold"
                        >
                          Iniciar →
                        </button>
                      )}
                      {col.id === 'IN_SERVICE' && (
                        <button
                          onClick={() => moveStatus(apt.id, 'COMPLETED')}
                          className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-semibold"
                        >
                          Finalizar ✓
                        </button>
                      )}
                      {col.id === 'COMPLETED' && (
                        <a
                          href={adminApiClient.appointments.getFinalInvoicePdfUrl(apt.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 font-semibold flex items-center gap-1 text-[11px]"
                          title="Descargar o Imprimir Factura Final Térmica 80mm"
                        >
                          Factura Final 🧾
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {colAppointments.length === 0 && (
                  <div className="p-6 text-center text-gray-500 text-xs italic">
                    Sin citas en este estado
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Feedback Toast */}
      {whatsappToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-md shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{whatsappToast}</span>
        </div>
      )}
    </div>
  );
}
