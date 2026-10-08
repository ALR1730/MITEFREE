import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdminLayoutClient } from '../components/AdminLayoutClient';

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
      <body className={`${inter.variable} min-h-screen bg-admin-bg text-gray-100 antialiased`}>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
