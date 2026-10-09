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

export default function HomePage() {
  const categories = [
    {
      id: 'Colchones',
      name: 'Colchones',
      subtitle: 'Matrimonial, Queen, King y Cunas',
      price: 'Desde RD$ 2,500',
      image: '/cat-mattress.jpg',
      badge: 'Más Solicitado',
      desc: 'Eliminación profunda de ácaros, bacterias y manchas de sudor.',
    },
    {
      id: 'Muebles de Sala',
      name: 'Muebles & Sofás',
      subtitle: '1 a 5+ plazas y modulares en L',
      price: 'Desde RD$ 1,500',
      image: '/cat-sofa.jpg',
      badge: 'Hogar Confort',
      desc: 'Extracción hidrocinética y tratamiento anti-olores.',
    },
    {
      id: 'Alfombras',
      name: 'Alfombras',
      subtitle: 'Pie de cama, salas y a la medida',
      price: 'Desde RD$ 600',
      image: '/cat-rug.jpg',
      badge: 'Lavado Especial',
      desc: 'Limpieza de fibras profundas con secado acelerado.',
    },
    {
      id: 'Sillas de Comedor',
      name: 'Sillas de Comedor',
      subtitle: 'Tapizadas en tela, microfibra o lino',
      price: 'RD$ 300 c/u',
      image: '/cat-chair.jpg',
      badge: 'Ideal Comedor',
      desc: 'Desmanchado cuidadoso y protección de tejidos.',
    },
  ];

  const steps = [
    {
      num: '1',
      title: 'Elige qué deseas limpiar',
      desc: 'Selecciona tus colchones, sofás, alfombras o sillas con botones gráficos sencillos y ve tu precio estimado al instante.',
      icon: Sparkles,
    },
    {
      num: '2',
      title: 'Escoge tu día y horario',
      desc: 'Te visitamos en tu fecha preferida por la mañana o la tarde con cuadrillas uniformadas y tecnología profesional.',
      icon: Calendar,
    },
    {
      num: '3',
      title: 'Disfruta tu hogar renovado',
      desc: 'Secado rápido en 2 a 3 horas, 0% anticipo obligatorio (pagas al finalizar) y ganas 5% de cashback en tu billetera digital.',
      icon: ShieldCheck,
    },
  ];

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
      title: '5% Cashback en Billetera',
      desc: 'Acumula saldo directo para tus próximas limpiezas o comparte tu enlace de referidos.',
      icon: Wallet,
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-12 md:pb-24">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-gradient-to-r from-brand-800/25 via-brand-500/20 to-brand-700/25 blur-[130px] rounded-full pointer-events-none -z-10" />

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
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm hover:bg-emerald-500/25 transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>Solicitar por WhatsApp</span>
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sin anticipo obligatorio
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" /> Secado en 2-3 horas
            </span>
            <span>•</span>
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
              sizes="(max-width: 768px) 100vw, 900px"
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
              <h3 className="text-base sm:text-lg font-bold text-white">
                Inyección y Extracción Térmica UV-C
              </h3>
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

      {/* ================= SECTION: BOTONES GRÁFICOS INTERACTIVOS (Inspirado en el prototipo) ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2 border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selección Fácil y Rápida</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ¿Qué deseas limpiar hoy?
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Toca cualquiera de las categorías para calcular tu tarifa y reservar tu cita en minutos.
          </p>
        </div>

        {/* 4 Graphic Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/cotizar?category=${encodeURIComponent(cat.id)}`}
              className="group glass-card rounded-3xl overflow-hidden border border-dark-border hover:border-brand-500/50 transition-all flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-dark-surface">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-black/20" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-dark-bg/85 border border-brand-500/30 text-brand-300 backdrop-blur-sm">
                  {cat.badge}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-white drop-shadow-md">{cat.subtitle}</span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-brand-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-dark-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Tarifa</span>
                    <span className="text-sm font-extrabold text-brand-400 font-mono">
                      {cat.price}
                    </span>
                  </div>

                  <span className="w-8 h-8 rounded-xl bg-brand-500/10 group-hover:bg-brand-500 group-hover:text-dark-bg text-brand-400 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= SECTION: CÓMO FUNCIONA EN 3 PASOS ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
            Sin Complicaciones
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Reserva tu limpieza en 3 simples pasos
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Desde tu celular y sin necesidad de esperar cotizaciones por teléfono.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-3xl p-6 sm:p-7 border border-dark-border hover:border-brand-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/25 text-brand-400 flex items-center justify-center tech-glow">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-mono font-extrabold text-brand-500/40">
                      0{st.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{st.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-dark-border/50 text-[11px] font-bold text-brand-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Paso {st.num} garantizado</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= SECTION: BENEFICIOS CLAVE ================= */}
      <section className="w-full border-y border-dark-border/60 bg-dark-surface/40 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-white">¿Por qué confiar en MITEFREE?</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Más de 4,850 clientes satisfechos en la región este y Santo Domingo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-dark-card/60 border border-dark-border/80 flex flex-col space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{b.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION: CTA FINAL ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden glass-card p-8 sm:p-12 border border-brand-500/30 tech-glow text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-brand-400 font-bold">
              Atención Inmediata
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              ¿Listo para renovar tus muebles y colchones?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Calcula tu tarifa ahora mismo o comunícate con nosotros por WhatsApp si deseas una
              evaluación especial para tu hogar o empresa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/cotizar"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-sm tech-glow shadow-lg active:scale-95 transition-all text-center"
            >
              Iniciar Cotización
            </Link>
            <a
              href="https://wa.me/18095134773?text=%C2%A1Hola%20Mite%20Free%20Clean!%20Me%20gustar%C3%ADa%20agendar%20una%20limpieza%20a%20domicilio."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-dark-hover hover:bg-dark-border border border-dark-border text-white text-sm font-semibold transition-all text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
