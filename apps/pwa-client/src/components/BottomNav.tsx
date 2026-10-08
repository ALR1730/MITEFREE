'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calculator, Calendar, Wallet, CheckCircle } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/cotizar', label: 'Cotizar', icon: Calculator, isElevated: true },
    { href: '/agenda', label: 'Agenda', icon: Calendar },
    { href: '/mis-citas', label: 'Citas', icon: CheckCircle },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-dark-border/80 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isElevated) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500 text-dark-bg flex items-center justify-center tech-glow shadow-lg transition-transform group-active:scale-95">
                  <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <span className="text-[11px] font-semibold text-brand-400 mt-1">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-brand-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
