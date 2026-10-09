import {
  Sparkles,
  ShieldCheck,
  Calendar,
  HeartHandshake,
  Droplets,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export interface ServiceCategory {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  image: string;
  badge: string;
  desc: string;
}

export interface WorkflowStep {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface TrustBenefit {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export const HOME_CATEGORIES: ServiceCategory[] = [
  {
    id: 'Colchones',
    name: 'Colchones',
    subtitle: 'Matrimonial, Queen, King y Cunas',
    price: 'Desde RD$ 2,500',
    image: '/cat-mattress.jpg',
    badge: 'Más Solicitado',
    desc: 'Eliminación profunda de ácaros, bacterias y manchas de sudor.',
  },
  {
    id: 'Muebles de Sala',
    name: 'Muebles & Sofás',
    subtitle: '1 a 5+ plazas y modulares en L',
    price: 'Desde RD$ 1,500',
    image: '/cat-sofa.jpg',
    badge: 'Hogar Confort',
    desc: 'Extracción hidrocinética y tratamiento anti-olores.',
  },
  {
    id: 'Alfombras',
    name: 'Alfombras',
    subtitle: 'Pie de cama, salas y a la medida',
    price: 'Desde RD$ 600',
    image: '/cat-rug.jpg',
    badge: 'Lavado Especial',
    desc: 'Limpieza de fibras profundas con secado acelerado.',
  },
  {
    id: 'Sillas de Comedor',
    name: 'Sillas de Comedor',
    subtitle: 'Tapizadas en tela, microfibra o lino',
    price: 'RD$ 300 c/u',
    image: '/cat-chair.jpg',
    badge: 'Ideal Comedor',
    desc: 'Desmanchado cuidadoso y protección de tejidos.',
  },
];

export const HOME_STEPS: WorkflowStep[] = [
  {
    num: '1',
    title: 'Elige qué deseas limpiar',
    desc: 'Selecciona tus colchones, sofás, alfombras o sillas con botones gráficos sencillos y ve tu precio estimado al instante.',
    icon: Sparkles,
  },
  {
    num: '2',
    title: 'Escoge tu día y horario',
    desc: 'Te visitamos en tu fecha preferida por la mañana o la tarde con cuadrillas uniformadas y tecnología profesional.',
    icon: Calendar,
  },
  {
    num: '3',
    title: 'Disfruta tu hogar renovado',
    desc: 'Secado rápido en 2 a 3 horas, 0% anticipo obligatorio (pagas al finalizar) y ganas 5% de cashback en tu billetera digital.',
    icon: ShieldCheck,
  },
];

export const HOME_BENEFITS: TrustBenefit[] = [
  {
    title: 'Sin Anticipo Obligatorio',
    desc: 'Pagas el 100% al finalizar el servicio cuando confirmes tu completa satisfacción.',
    icon: HeartHandshake,
  },
  {
    title: 'Secado Rápido (2-3 Horas)',
    desc: 'Extracción por inyección potente que no empapa tus muebles ni deja malos olores.',
    icon: Droplets,
  },
  {
    title: '99.9% Libre de Ácaros',
    desc: 'Tecnología hospitalaria UV-C y productos biodegradables seguros para niños y mascotas.',
    icon: ShieldCheck,
  },
  {
    title: '5% Cashback en Billetera',
    desc: 'Acumula saldo directo para tus próximas limpiezas o comparte tu enlace de referidos.',
    icon: Wallet,
  },
];
