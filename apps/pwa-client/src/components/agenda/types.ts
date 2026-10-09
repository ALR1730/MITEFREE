import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';

export const COVERAGE_ZONES = [
  {
    id: 'ZONE-SPM',
    name: 'San Pedro de Macorís',
    areas:
      'San Pedro (Centro), Consuelo, Quisqueya, Ramón Santana, Guayacanes, Juan Dolio, El Puerto',
  },
  {
    id: 'ZONE-LR',
    name: 'La Romana',
    areas: 'La Romana (Centro), Villa Hermosa, Guaymate, Cumayasa, Caleta',
  },
  {
    id: 'ZONE-SDE',
    name: 'Santo Domingo Este',
    areas:
      'Alma Rosa, Ensanche Ozama, Autopista San Isidro, Los Frailes, Autopista Las Américas, Invivienda, Lucerna',
  },
  {
    id: 'ZONE-DN',
    name: 'Distrito Nacional',
    areas: 'Piantini, Naco, Bella Vista, Gazcue, Zona Colonial, Evaristo Morales',
  },
];

export const TIME_SLOTS = [
  {
    id: 'MORNING',
    label: 'Bloque Mañana',
    time: '08:30 AM – 11:30 AM',
    available: true,
  },
  {
    id: 'AFTERNOON',
    label: 'Bloque Tarde',
    time: '01:00 PM – 04:00 PM',
    available: true,
  },
  {
    id: 'EVENING',
    label: 'Bloque Vespertino',
    time: '04:30 PM – 07:30 PM',
    available: true,
  },
];

export const AGENDA_STEPS = [
  { num: 1, label: 'Fecha', id: 'agenda-date-section', icon: CalendarIcon },
  { num: 2, label: 'Zona', id: 'agenda-zone-section', icon: MapPin },
  { num: 3, label: 'Horario', id: 'agenda-slot-section', icon: Clock },
  { num: 4, label: 'Contacto', id: 'agenda-contact-section', icon: User },
  { num: 5, label: 'Confirmar', id: 'agenda-confirm-section', icon: ShieldCheck },
];

export interface LocalQuoteItem {
  cartId: string;
  catalogId?: string;
  name: string;
  category?: string;
  iconText?: string;
  bothSides?: boolean;
  extraSeats?: number;
  rugDimensions?: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

export interface LocalQuoteSummary {
  items: LocalQuoteItem[];
  total: number;
  deposit: number;
  fabric?: string;
  stain?: string;
}
