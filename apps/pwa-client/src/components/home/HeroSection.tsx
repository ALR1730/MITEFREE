import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Droplets,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 md:pt-12 md:pb-20">
      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-gradient-to-r from-brand-800/25 via-brand-500/20 to-brand-700/25 blur-[130px] rounded-full pointer-events-none -z-10"
      />

      {/* Top Header Card / Trust Banner */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-brand-400 text-xs font-semibold mb-5 border border-brand-500/30 tech-glow">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mite Free Clean · Limpieza & Desinfección Profesional a Domicilio</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Tu hogar impecable, fresco y libre de ácaros en{' '}
          <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-white bg-clip-text text-transparent">
            pocas horas.
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
          Especialistas en lavado y desinfección profunda a domicilio para tus colchones, muebles,
          alfombras y sillas en <strong>San Pedro de Macorís</strong>, <strong>La Romana</strong> y{' '}
          <strong>Santo Domingo Este</strong>. Cotiza en 60 segundos y paga al finalizar.
        </p>

        {/* Action CTAs */}
        <div className="mt-7 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/cotizar"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-sm sm:text-base tech-glow shadow-xl active:scale-95 transition-all"
          >
            <span>Cotizar y Agendar Cita</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="https://wa.me/18095134773?text=%C2%A1Hola%20Mite%20Free%20Clean!%20Deseo%20cotizar%20un%20servicio%20de%20limpieza%20a%20domicilio%20para%20mis%20muebles%20y%20colchones."
            target="_blank"
            rel="noreferrer"
            aria-label="Contactar a Mite Free Clean por WhatsApp"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm hover:bg-emerald-500/25 transition-all shadow-md active:scale-95"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span>Solicitar por WhatsApp</span>
          </a>
        </div>

        {/* Trust Points */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sin anticipo obligatorio
          </span>
          <span aria-hidden="true">•</span>
          <span className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" /> Secado en 2-3 horas
          </span>
          <span aria-hidden="true">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-400" /> Despacho directo a tu puerta
          </span>
        </div>
      </div>

      {/* Hero Photo Card Showcase */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-dark-border/80 shadow-2xl max-w-4xl mx-auto group">
        <div className="relative w-full h-64 sm:h-80 md:h-[400px]">
          <Image
            src="/hero-service.jpg"
            alt="Especialista Mite Free Clean realizando limpieza y desinfección a domicilio"
            fill
            priority
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
            className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
        </div>

        {/* Floating Feature Badges over image */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 backdrop-blur-md">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-400 font-bold block">
              Protocolo Certificado
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Inyección y Extracción Térmica UV-C
            </h2>
            <p className="text-xs text-gray-300 hidden sm:block">
              Eliminamos ácaros microscópicos, gérmenes y suciedad acumulada sin dañar tus fibras.
            </p>
          </div>

          <Link
            href="/cotizar"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-xs tech-glow whitespace-nowrap shadow-md active:scale-95 transition-all"
          >
            <span>Ver Precios por Pieza</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
