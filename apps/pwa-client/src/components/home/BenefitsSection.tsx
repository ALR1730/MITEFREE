import { HOME_BENEFITS } from './home-data';

export function BenefitsSection() {
  return (
    <section className="w-full border-y border-dark-border/60 bg-dark-surface/40 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold text-white">¿Por qué confiar en MITEFREE?</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Más de 4,850 clientes satisfechos en la región este y Santo Domingo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOME_BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-dark-card/60 border border-dark-border/80 flex flex-col space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{b.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
