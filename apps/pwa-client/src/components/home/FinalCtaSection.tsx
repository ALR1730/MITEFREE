import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function FinalCtaSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative rounded-3xl overflow-hidden glass-card p-8 sm:p-12 border border-brand-500/30 tech-glow text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-brand-400 font-bold">
            Atención Inmediata
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            ¿Listo para renovar tus muebles y colchones?
          </h2>
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
            aria-label="Abrir chat de WhatsApp para agendar una limpieza a domicilio"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-dark-hover hover:bg-dark-border border border-dark-border text-white text-sm font-semibold transition-all text-center"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Escribir por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
