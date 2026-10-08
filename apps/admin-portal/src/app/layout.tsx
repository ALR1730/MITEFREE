import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MITEFREE Ops — Centro de Despacho & Control Operativo',
  description:
    'Panel de operaciones, despacho de cuadrillas y métricas de ALR COMPANY para la plataforma MITEFREE.',
  icons: {
    icon: '/logo-mitefree.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} min-h-screen bg-admin-bg text-gray-100 flex antialiased`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
