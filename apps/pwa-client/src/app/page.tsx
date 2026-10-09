import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Wallet,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Phone,
  Droplets,
  HeartHandshake,
  MapPin,
  ChevronRight,
  Star,
} from 'lucide-react';
import { BookingWizard3Steps } from '@/components/BookingWizard3Steps';

export default function HomePage() {
  const benefits = [
    {
      title: 'Sin Anticipo Obligatorio',
      desc: 'Pagas el 100% al finalizar el servicio cuando confirmes tu completa satisfacción.',
      icon: HeartHandshake,
    },
    {
      title: 'Secado Rápido (2-3 Horas)',
      desc: 'Extracción por inyección potente que no empapa tus muebles ni deja malos olores.',
      icon: Droplets,
    },
    {
      title: '99.9% Libre de Ácaros',
      desc: 'Tecnología hospitalaria UV-C y productos biodegradables seguros para niños y mascotas.',
      icon: ShieldCheck,
    },
    {
      title: 'Cashback en tu Billetera',
      desc: 'Acumula saldo directo para tus próximas limpiezas o comparte tu enlace de referidos.',
      icon: Wallet,
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* ================= HERO & 3-STEP RESERVATION ASSISTANT ================= */}
      <section className="relative w-full max-w-4xl mx-auto px-3 sm:px-6 pt-6 pb-12">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* 3-Step Wizard Container */}
        <BookingWizard3Steps initialCategory="colchones" />
      </section>

      {/* ================= SECTION: BENEFICIOS Y CONFIANZA ================= */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 border-t border-dark-border/40">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Garantía de Satisfacción</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            ¿Por qué elegir Mite Free Clean?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Servicio profesional a domicilio en San Pedro de Macorís, La Romana y Santo Domingo Este.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="glass-card p-4 sm:p-5 rounded-2xl border border-dark-border/60 hover:border-brand-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-300 flex items-center justify-center mb-3">
                  <b.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FLOATING WHATSAPP CTA ================= */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
        <a
          href="https://wa.me/18095134773?text=%C2%A1Hola%20Mite%20Free%20Clean!%20Deseo%20cotizar%20un%20servicio%20de%20limpieza%20a%20domicilio%20para%20mis%20muebles%20y%20colchones."
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-xl hover:bg-[#1EBE5D] transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">¿Dudas? Escríbenos por WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
