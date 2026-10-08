'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { LayoutDashboard, CalendarDays, Users, CreditCard, Sliders } from 'lucide-react';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  const mobileNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Citas', href: '/citas', icon: CalendarDays },
    { name: 'Cuadrillas', href: '/tecnicos', icon: Users },
    { name: 'Pagos', href: '/pagos', icon: CreditCard },
    { name: 'Tarifas', href: '/configuracion', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-admin-bg text-gray-100 flex antialiased w-full">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Off-Canvas Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-admin-sidebar h-full z-10 flex flex-col shadow-2xl animate-slideRight">
            <Sidebar onClose={() => setMobileDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMenu={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24 lg:pb-8 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (1-Thumb Quick Access) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-admin-sidebar/95 backdrop-blur-md border-t border-admin-border flex items-center justify-around z-40 px-2 safe-area-pb">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href === '/dashboard' && pathname === '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1.5 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
