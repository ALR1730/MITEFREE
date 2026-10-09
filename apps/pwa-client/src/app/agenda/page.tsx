'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Truck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_DISCOUNT_POLICY, type DiscountPolicyConfig } from '@mitefree/shared-types';
import {
  COVERAGE_ZONES,
  TIME_SLOTS,
  AGENDA_STEPS,
  type LocalQuoteSummary,
  AgendaStepperBar,
  AgendaQuoteBanner,
  DateSelectorSection,
  ZoneSelectorSection,
  TimeSlotSection,
  ContactDetailsSection,
  BookingConfirmSection,
  BookingSuccessView,
} from '@/components/agenda';

function AgendaContent() {
  const searchParams = useSearchParams();
  const quotationId = searchParams.get('quotationId');
  const totalParam = searchParams.get('total');

  const { user } = useAuth();

  const [selectedZone, setSelectedZone] = useState<string>(COVERAGE_ZONES[0]!.id);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[0]!.id);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookedAppointmentId, setBookedAppointmentId] = useState<string | null>(null);
  const [dynamicSlots, setDynamicSlots] = useState(TIME_SLOTS);
  const [quoteSummary, setQuoteSummary] = useState<LocalQuoteSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [discountPolicy, setDiscountPolicy] =
    useState<DiscountPolicyConfig>(DEFAULT_DISCOUNT_POLICY);

  // Cargar resumen de cotización guardado en el cotizador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('mitefree_quote_summary');
      if (raw) {
        try {
          setQuoteSummary(JSON.parse(raw));
        } catch {
          // Fallback silencioso
        }
      }
    }
  }, []);

  // Prellenar automáticamente con datos del cliente autenticado
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.address) setAddress(user.address);
      if (user.zoneCode) setSelectedZone(user.zoneCode);
    }
  }, [user]);

  // Cargar política de descuentos desde Core API / localStorage
  useEffect(() => {
    async function loadDiscounts() {
      try {
        const res = await apiClient.config.getDiscounts();
        if (res.success && res.data) {
          setDiscountPolicy(res.data);
          return;
        }
      } catch {
        // Fallback a localStorage
      }

      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('mitefree_discount_policy');
        if (local) {
          try {
            setDiscountPolicy(JSON.parse(local));
          } catch {
            // Ignorar parse error
          }
        }
      }
    }
    loadDiscounts();
  }, []);

  // Generar próximos 6 días de disponibilidad
  const availableDates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('es-ES', { month: 'short' });
    return { offset: i + 1, dateStr: d.toISOString().split('T')[0]!, dayName, dayNum, month };
  });

  const selectedDateObj = availableDates.find((d) => d.offset === selectedDayOffset)!;
  const currentZoneObj = COVERAGE_ZONES.find((z) => z.id === selectedZone) || COVERAGE_ZONES[0]!;

  // Desplazamiento suave guiado
  const scrollToSection = (sectionId: string, offset = 80) => {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }, 80);
  };

  const handleSelectDate = (offset: number) => {
    setSelectedDayOffset(offset);
    setActiveStep((prev) => Math.max(prev, 2));
    scrollToSection('agenda-zone-section', 80);
  };

  const handleSelectZone = (zoneId: string) => {
    setSelectedZone(zoneId);
    setActiveStep((prev) => Math.max(prev, 3));
    scrollToSection('agenda-slot-section', 80);
  };

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    setActiveStep((prev) => Math.max(prev, 4));
    scrollToSection('agenda-address-section', 80);
  };

  const handleGoToSummary = () => {
    setActiveStep(5);
    scrollToSection('agenda-summary-section', 80);
  };

  // Reactively fetch available slots from Core API
  useEffect(() => {
    let isCancelled = false;
    async function fetchSlots() {
      if (!selectedDateObj?.dateStr) return;
      try {
        const res = await apiClient.appointments.getSlots(selectedZone, selectedDateObj.dateStr);
        if (res.success && res.data.length > 0 && !isCancelled) {
          setDynamicSlots(
            res.data.map((slot) => ({
              id: slot.timeSlotCode,
              label: slot.label,
              time: `${slot.startTime} – ${slot.endTime}`,
              available: slot.isAvailable,
            })),
          );
        }
      } catch {
        // Fallback a slots predefinidos
      }
    }
    fetchSlots();
    return () => {
      isCancelled = true;
    };
  }, [selectedZone, selectedDateObj?.dateStr]);

  const currentSlotObj =
    dynamicSlots.find((s) => s.id === selectedSlot) || dynamicSlots[0] || TIME_SLOTS[0]!;

  const displaySlotLabel =
    currentSlotObj.label.includes(currentSlotObj.time) || currentSlotObj.label.includes('(')
      ? currentSlotObj.label
      : `${currentSlotObj.label} (${currentSlotObj.time})`;

  // Descuentos dinámicos activos para la selección actual
  const currentZonePolicy = discountPolicy.zones.find((z) => z.zoneCode === selectedZone);
  const zoneDiscountPct = currentZonePolicy?.enabled ? currentZonePolicy.discountPercentage : 0;

  const currentSlotPolicy = discountPolicy.slots.find((s) => s.slotCode === selectedSlot);
  const slotDiscountPct = currentSlotPolicy?.enabled ? currentSlotPolicy.discountPercentage : 0;

  const totalPromoDiscountPct = zoneDiscountPct + slotDiscountPct;

  const effectiveTotal = totalParam ? Number(totalParam) : quoteSummary?.total ?? 3500;
  const effectiveDeposit = Math.round(effectiveTotal * 0.3);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('Por favor completa tu nombre, teléfono y dirección.');
      scrollToSection('agenda-address-section', 80);
      return;
    }

    setIsSubmitting(true);
    try {
      const schedulePayload = {
        quotationId: quotationId && quotationId.length === 36 ? quotationId : undefined,
        clientId: user?.id,
        clientName: fullName.trim(),
        clientPhone: phone.trim(),
        address: address.trim(),
        zoneCode: selectedZone,
        timeSlotId: selectedSlot,
        scheduledDate: new Date(selectedDateObj.dateStr).toISOString(),
        serviceDescription: quotationId
          ? 'Servicio de Desinfección según Cotización'
          : quoteSummary && quoteSummary.items.length > 0
          ? `Desinfección de ${quoteSummary.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}`
          : 'Desinfección y Limpieza de Tapicería',
        totalAmount: effectiveTotal,
        depositAmount: effectiveDeposit,
      };

      const res = await apiClient.appointments.schedule(schedulePayload);
      if (res.success) {
        setBookedAppointmentId(res.data.id);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mitefree_last_appointment_id', res.data.id);
        }
        setIsBooked(true);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        const detail =
          res.error?.detail ||
          'No fue posible registrar la cita en el servidor. Por favor verifique los datos.';
        setErrorMessage(detail);
        alert(`Error al agendar: ${detail}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado al conectar con el servidor.';
      setErrorMessage(msg);
      alert(`Error al agendar: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 pb-32">
      {/* Encabezado */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20">
          <Truck className="w-3.5 h-3.5" />
          <span>Mite Free Clean · Coordinación de Citas a Domicilio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Agenda tu Visita a Domicilio
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg mx-auto">
          Selecciona tu día preferido, zona de cobertura y turno. Nuestros especialistas certificados
          llegarán puntualmente con todo el equipo industrial.
        </p>
      </div>

      {!isBooked ? (
        <>
          <AgendaStepperBar
            activeStep={activeStep}
            onScrollToSection={scrollToSection}
          />

          <AgendaQuoteBanner
            quoteSummary={quoteSummary}
            effectiveTotal={effectiveTotal}
          />

          <form onSubmit={handleConfirm} className="space-y-8 animate-fadeIn">
            <DateSelectorSection
              availableDates={availableDates}
              selectedDateObj={selectedDateObj}
              selectedDayOffset={selectedDayOffset}
              onSelectDate={handleSelectDate}
              onScrollToSection={scrollToSection}
            />

            <ZoneSelectorSection
              selectedZone={selectedZone}
              currentZoneObj={currentZoneObj}
              discountPolicy={discountPolicy}
              onSelectZone={handleSelectZone}
              onScrollToSection={scrollToSection}
            />

            <TimeSlotSection
              selectedSlot={selectedSlot}
              currentSlotObj={currentSlotObj}
              totalPromoDiscountPct={totalPromoDiscountPct}
              dynamicSlots={dynamicSlots}
              discountPolicy={discountPolicy}
              onSelectSlot={handleSelectSlot}
              onScrollToSection={scrollToSection}
            />

            <ContactDetailsSection
              fullName={fullName}
              phone={phone}
              address={address}
              onChangeFullName={setFullName}
              onChangePhone={setPhone}
              onChangeAddress={setAddress}
              onGoToSummary={handleGoToSummary}
            />

            <BookingConfirmSection
              selectedDateObj={selectedDateObj}
              displaySlotLabel={displaySlotLabel}
              currentZoneObj={currentZoneObj}
              address={address}
              effectiveTotal={effectiveTotal}
              fullName={fullName}
              phone={phone}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          </form>
        </>
      ) : (
        <BookingSuccessView
          bookedAppointmentId={bookedAppointmentId}
          fullName={fullName}
          selectedDateObj={selectedDateObj}
          displaySlotLabel={displaySlotLabel}
          currentZoneObj={currentZoneObj}
          address={address}
          effectiveTotal={effectiveTotal}
          totalPromoDiscountPct={totalPromoDiscountPct}
        />
      )}
    </div>
  );
}

export default function AgendaPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">
          Cargando disponibilidad de cuadrillas...
        </div>
      }
    >
      <AgendaContent />
    </Suspense>
  );
}
