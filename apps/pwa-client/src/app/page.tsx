import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Wallet,
  CheckCircle2,
  Calendar,
  Layers,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const steps = [
    {
      num: '01',
      title: 'Cotización en 60 Segundos',
      desc: 'Selecciona tu tipo de mueble, tejido y grado de manchas. Nuestro motor de precios calcula tu tarifa canónica de inmediato.',
      icon: Zap,
    },
    {
      num: '02',
      title: 'Agenda tu Bloque Horario',
      desc: 'Elige tu fecha y zona geográfica en Santo Domingo. Cuadrillas técnicas con seguimiento GPS en tiempo real.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Desinfección & Cashback',
      desc: 'Eliminación del 99.9% de ácaros con tecnología hospitalaria UV-C. Recibe 5% de reembolso directo en tu billetera digital.',
      icon: Wallet,
    },
  ];

  const highlights = [
    { label: 'Reducción de Ácaros', val: '99.9%', sub: 'Certificación de Laboratorio' },
    { label: 'Tiempo de Secado', val: '2 Horas', sub: 'Extracción Hidrocinética' },
    { label: 'Clientes Satisfechos', val: '4,850+', sub: 'En Gran Santo Domingo' },
    { label: 'Calificación Promedio', val: '4.95 ★', sub: 'De 5 estrellas en reseñas' },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28 flex flex-col items-center text-center">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-brand-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-brand-400 text-xs font-semibold mb-6 border border-brand-500/30 tech-glow">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Tecnología Hospitalaria Anti-Ácaros de Nivel Quirúrgico</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
          Desinfección profunda para tus muebles,{' '}
          <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
            sin ácaros ni alérgenos.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
          Cotiza en 60 segundos con nuestro motor algorítmico, agenda una cuadrilla técnica
          certificada y gana cashback en cada servicio con MITEFREE.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/cotizar"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-base tech-glow hover:opacity-95 transition-all shadow-xl active:scale-95"
          >
            <span>Iniciar Cotización Inteligente</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/agenda"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass-card text-gray-200 font-semibold text-base hover:text-white hover:border-brand-500/40 transition-all border border-dark-border"
          >
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Consultar Disponibilidad</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>30% de anticipo seguro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>Desinfección con luz UV-C</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>Cashback 5% garantizado</span>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="w-full border-y border-dark-border/60 bg-dark-surface/50 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {highlights.map((h, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <span className="text-brand-400">{h.val}</span>
              </span>
              <span className="text-sm font-semibold text-gray-200 mt-1">{h.label}</span>
              <span className="text-xs text-gray-400">{h.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Process: 3 Steps */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase font-mono tracking-widest text-brand-400 font-bold mb-2">
            Flujo Guiado de Experiencia
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            ¿Cómo funciona MITEFREE?
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            Eliminamos la fricción de cotizar por teléfono o mensajes sin respuesta con una
            experiencia digital instantánea.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="relative rounded-2xl glass-card p-8 border border-dark-border hover:border-brand-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-mono font-bold text-gray-600/70 group-hover:text-brand-500/50 transition-colors">
                      {st.num}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{st.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{st.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-dark-border/40 flex items-center text-xs font-semibold text-brand-400">
                  <span>Paso {st.num}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-3xl overflow-hidden glass-card p-8 md:p-14 border border-brand-500/30 tech-glow">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-500/20 blur-[90px] rounded-full -z-10" />

          <div className="max-w-2xl">
            <span className="text-xs uppercase font-mono tracking-widest text-brand-400 font-bold">
              Desinfección de Alta Precisión
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4 leading-tight">
              ¿Listo para una sala y camas libres de ácaros y malos olores?
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 font-light">
              Obtén tu presupuesto formal al instante con desglose transparente y agenda tu cita
              para el bloque horario que mejor te convenga.
            </p>
            <Link
              href="/cotizar"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-bold text-sm tech-glow shadow-lg active:scale-95 transition-all"
            >
              <span>Empezar mi Cotización</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
