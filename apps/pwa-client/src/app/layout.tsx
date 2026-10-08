import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MITEFREE — Limpieza & Desinfección Inteligente de Muebles',
  description:
    'Plataforma enterprise para cotización inteligente en 60 segundos, desinfección de ácaros con tecnología hospitalaria, gestión de citas y programa de fidelización cashback.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo-mitefree.png',
    apple: '/logo-mitefree.png',
  },
  authors: [{ name: 'Angel Luis Rosario', url: 'https://github.com/ALR1730' }],
};

export const viewport: Viewport = {
  themeColor: '#00C4FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.variable} min-h-screen bg-dark-bg text-gray-100 antialiased selection:bg-brand-500/30 selection:text-brand-300`}
      >
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)] pb-24 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </AuthProvider>

        {/* PWA Service Worker: Limpieza en dev y activación en producción */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var r of registrations) { r.unregister(); }
                  });
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      for (var n of names) caches.delete(n);
                    });
                  }
                } else {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function(err) {
                      console.error('SW registration error:', err);
                    });
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
