import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { HOME_CATEGORIES } from './home-data';

export function CategoryGrid() {
  return (
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
        {HOME_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/cotizar?category=${encodeURIComponent(cat.id)}`}
            className="group glass-card rounded-3xl overflow-hidden border border-dark-border hover:border-brand-500/50 transition-all flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 duration-300"
          >
            <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-dark-surface">
              <Image
                src={cat.image}
                alt={`Servicio de limpieza profunda de ${cat.name}`}
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

                <span
                  aria-hidden="true"
                  className="w-8 h-8 rounded-xl bg-brand-500/10 group-hover:bg-brand-500 group-hover:text-dark-bg text-brand-400 flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
