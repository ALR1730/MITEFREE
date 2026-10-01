import Link from 'next/link';
import { Sparkles, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-dark-border/80 bg-dark-surface/80 py-12 px-4 sm:px-6 lg:px-8 mt-20 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-dark-bg">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">MITE<span className="text-brand-500">FREE</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Plataforma enterprise de desinfección profunda de ácaros y alérgenos con tecnología hospitalaria UV-C y extracción hidrocinética.
          </p>
          <div className="text-xs text-gray-500 font-mono">
            Una división de ingeniería de <span className="text-brand-400 font-semibold">ALR COMPANY</span>.
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-3">Servicios</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/cotizar" className="hover:text-brand-400 transition-colors">Cotizador Inteligente</Link></li>
            <li><Link href="/agenda" className="hover:text-brand-400 transition-colors">Agendamiento Inmediato</Link></li>
            <li><Link href="/mis-citas" className="hover:text-brand-400 transition-colors">Seguimiento de Cuadrilla</Link></li>
            <li><Link href="/wallet" className="hover:text-brand-400 transition-colors">Billetera de Cashback</Link></li>
          </ul>
        </div>

        {/* Cobertura */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-3">Zonas de Cobertura</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Distrito Nacional (Piantini, Naco, Bella Vista)</li>
            <li>Santo Domingo Este (Alma Rosa, San Isidro)</li>
            <li>Santo Domingo Oeste (Herrera, Alameda)</li>
            <li>Santo Domingo Norte (Villa Mella, El Edén)</li>
          </ul>
        </div>

        {/* Garantías */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-3">Garantía ALR</h4>
          <div className="flex items-start gap-2.5 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
            <span>99.9% de reducción de ácaros y bacterias garantizado por laboratorio.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-gray-400">
            <Award className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <span>Técnicos certificados con protocolo Zero-Residue.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-gray-400">
            <HeartHandshake className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
            <span>30% de anticipo seguro con devolución garantizada ante cancelaciones oportunas.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-dark-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>© 2026 ALR COMPANY. Desarrollado bajo Clean Architecture y Turing-Grade Standard.</p>
        <p className="mt-2 sm:mt-0">Founder: Angel Luis Rosario · Mentor: Ing. Leonardo</p>
      </div>
    </footer>
  );
}
