import { CheckCircle2 } from 'lucide-react';
import { HOME_STEPS } from './home-data';

export function HowItWorksSection() {
  return (
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
        {HOME_STEPS.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
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
  );
}
