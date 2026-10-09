import type { Metadata } from 'next';
import {
  HeroSection,
  CategoryGrid,
  HowItWorksSection,
  BenefitsSection,
  FinalCtaSection,
  HomeJsonLd,
} from '@/components/home';

export const metadata: Metadata = {
  title: 'MITEFREE — Limpieza & Desinfección Inteligente de Muebles y Colchones',
  description:
    'Servicio profesional a domicilio en San Pedro de Macorís, La Romana y Santo Domingo Este. Cotiza en 60 segundos, 0% anticipo obligatorio y secado en 2-3 horas.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mite Free Clean — Tu Hogar Libre de Ácaros en Pocas Horas',
    description:
      'Lavado y desinfección profunda a domicilio para colchones, muebles, alfombras y sillas en República Dominicana. Cotiza en línea sin anticipo.',
    url: 'https://mitefree.com',
    siteName: 'MITEFREE',
    images: [
      {
        url: '/hero-service.jpg',
        width: 1200,
        height: 630,
        alt: 'Especialista Mite Free Clean realizando limpieza a domicilio',
      },
    ],
    locale: 'es_DO',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <div className="flex flex-col items-center">
        <HeroSection />
        <CategoryGrid />
        <HowItWorksSection />
        <BenefitsSection />
        <FinalCtaSection />
      </div>
    </>
  );
}
