import type { FabricOption, StainOption, MainCategoryOption } from './cotizador.types';

export const MIN_DOMICILE_ORDER_RD = 1500;

export const FABRIC_OPTIONS: FabricOption[] = [
  {
    id: 'SYNTHETIC',
    name: 'Sintética / Estándar',
    multiplier: 1.0,
    desc: 'Secado acelerado en 2-3 horas, uso cotidiano.',
  },
  {
    id: 'MICROFIBER',
    name: 'Microfibra / Gamuzina',
    multiplier: 1.0,
    desc: 'Tejido suave de alta densidad, cepillado profundo.',
  },
  {
    id: 'LINEN',
    name: 'Lino Natural',
    multiplier: 1.15,
    desc: 'Fibra natural delicada, tratamiento con pH neutro.',
  },
  {
    id: 'VELVET',
    name: 'Terciopelo / Chenille / Lana',
    multiplier: 1.25,
    desc: 'Protección especial contra aplastamiento de hebras.',
  },
  {
    id: 'LEATHER',
    name: 'Cuero / Piel Genuina',
    multiplier: 1.35,
    desc: 'Nutrición con bálsamo hidratante anti-grietas.',
  },
];

export const STAIN_OPTIONS: StainOption[] = [
  {
    id: 'LIGHT',
    name: 'Leve / Mantenimiento',
    surcharge: 0,
    desc: 'Polvo diario, ácaros habituales y uso preventivo (+RD$ 0)',
  },
  {
    id: 'MODERATE',
    name: 'Moderada / Comida o Bebidas',
    surcharge: 300,
    desc: 'Manchas visibles, marcas de café o derrames (+RD$ 300)',
  },
  {
    id: 'CRITICAL',
    name: 'Crítica / Mascotas o Manchas Difíciles',
    surcharge: 500,
    desc: 'Desinfección biológica profunda con enzimas y UV-C (+RD$ 500)',
  },
];

export const MAIN_CATEGORIES: MainCategoryOption[] = [
  {
    id: 'Colchones',
    name: 'Colchones',
    priceStarting: 'Desde RD$ 2,500',
    image: '/cat-mattress.jpg',
    defaultItemId: 'mat-full',
  },
  {
    id: 'Muebles de Sala',
    name: 'Muebles',
    priceStarting: 'Desde RD$ 1,500',
    image: '/cat-sofa.jpg',
    defaultItemId: 'sofa-2',
  },
  {
    id: 'Alfombras',
    name: 'Alfombras',
    priceStarting: 'Desde RD$ 500',
    image: '/cat-rug.jpg',
    defaultItemId: 'rug-small',
  },
  {
    id: 'Sillas de Comedor',
    name: 'Sillas de comedor',
    priceStarting: 'RD$ 300 por silla',
    image: '/cat-chair.jpg',
    defaultItemId: 'dining-chair',
  },
];

export const formatRD = (amount: number) => `RD$ ${Math.round(amount).toLocaleString('es-DO')}`;
