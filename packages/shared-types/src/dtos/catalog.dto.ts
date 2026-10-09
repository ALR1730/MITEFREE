import { z } from 'zod';

export const MainCategoryEnum = z.enum([
  'Colchones',
  'Muebles de Sala',
  'Sillas de Comedor',
  'Alfombras',
]);
export type MainCategory = z.infer<typeof MainCategoryEnum>;

export const CatalogItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: MainCategoryEnum,
  basePrice: z.number().min(0),
  bothSidesPrice: z.number().optional(),
  iconText: z.string().default('🪑'),
  image: z.string().default('/cat-chair.jpg'),
  subtitle: z.string().optional(),
  dimensions: z.string().optional(),
  isMattress: z.boolean().optional(),
  isSofaModular: z.boolean().optional(),
  isChair: z.boolean().optional(),
  isRug: z.boolean().optional(),
  isCustomRug: z.boolean().optional(),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;

export const CreateCatalogItemSchema = CatalogItemSchema.omit({ id: true }).extend({
  id: z.string().optional(),
});
export type CreateCatalogItemDto = z.infer<typeof CreateCatalogItemSchema>;

export const UpdateCatalogItemSchema = CatalogItemSchema.partial().omit({ id: true });
export type UpdateCatalogItemDto = z.infer<typeof UpdateCatalogItemSchema>;

export const DEFAULT_CATALOG_ITEMS: CatalogItem[] = [
  // 1. Lavado de Colchones
  {
    id: 'mat-full',
    name: 'Colchón Matrimonial (Full)',
    category: 'Colchones',
    basePrice: 2500,
    bothSidesPrice: 3000,
    iconText: '🛏️',
    image: '/cat-mattress.jpg',
    isMattress: true,
    subtitle: '1 lado RD$ 2,500 · Ambos lados RD$ 3,000',
  },
  {
    id: 'mat-queen',
    name: 'Colchón Queen Size',
    category: 'Colchones',
    basePrice: 3000,
    bothSidesPrice: 3500,
    iconText: '🛏️',
    image: '/cat-mattress.jpg',
    isMattress: true,
    subtitle: '1 lado RD$ 3,000 · Ambos lados RD$ 3,500',
  },
  {
    id: 'mat-king',
    name: 'Colchón King Size',
    category: 'Colchones',
    basePrice: 3500,
    bothSidesPrice: 4000,
    iconText: '🛏️',
    image: '/cat-mattress.jpg',
    isMattress: true,
    subtitle: '1 lado RD$ 3,500 · Ambos lados RD$ 4,000',
  },

  // 2. Muebles de Sala
  {
    id: 'sofa-1',
    name: 'Mueble 1 Plaza (Sillón Individual)',
    category: 'Muebles de Sala',
    basePrice: 1500,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    subtitle: 'Tarifa estándar RD$ 1,500',
  },
  {
    id: 'sofa-2',
    name: 'Mueble 2 Plazas (Love Seat)',
    category: 'Muebles de Sala',
    basePrice: 2000,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    subtitle: 'Tarifa estándar RD$ 2,000',
  },
  {
    id: 'sofa-3',
    name: 'Mueble 3 Plazas',
    category: 'Muebles de Sala',
    basePrice: 2500,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    subtitle: 'Tarifa estándar RD$ 2,500',
  },
  {
    id: 'sofa-4',
    name: 'Mueble 4 Plazas',
    category: 'Muebles de Sala',
    basePrice: 3000,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    subtitle: 'Tarifa estándar RD$ 3,000',
  },
  {
    id: 'sofa-5',
    name: 'Mueble 5 Plazas (Modular en L)',
    category: 'Muebles de Sala',
    basePrice: 3500,
    iconText: '🛋️',
    image: '/cat-sofa.jpg',
    isSofaModular: true,
    subtitle: 'Base 5 plazas RD$ 3,500 (+RD$ 500 c/u extra)',
  },

  // 3. Sillas de Comedor
  {
    id: 'dining-chair',
    name: 'Sillas de Comedor',
    category: 'Sillas de Comedor',
    basePrice: 300,
    iconText: '🪑',
    image: '/cat-chair.jpg',
    isChair: true,
    subtitle: 'RD$ 300 cada una (juegos de 4 o más)',
  },

  // 4. Lavado y Desinfección de Alfombras
  {
    id: 'rug-small',
    name: 'Alfombra Pequeña / Pie de Cama',
    category: 'Alfombras',
    basePrice: 600,
    iconText: '🧶',
    image: '/cat-rug.jpg',
    isRug: true,
    dimensions: 'Hasta 1.50m × 0.80m (~1.2 m²)',
    subtitle: 'Ideal para pasillo o pie de cama (RD$ 600)',
  },
  {
    id: 'rug-medium',
    name: 'Alfombra Mediana (Área / Sala)',
    category: 'Alfombras',
    basePrice: 1200,
    iconText: '🧶',
    image: '/cat-rug.jpg',
    isRug: true,
    dimensions: '2.00m × 1.50m (~3.0 m²)',
    subtitle: 'Área común o sala estándar (RD$ 1,200)',
  },
  {
    id: 'rug-large',
    name: 'Alfombra Grande (Sala Principal)',
    category: 'Alfombras',
    basePrice: 1800,
    iconText: '🧶',
    image: '/cat-rug.jpg',
    isRug: true,
    dimensions: '2.50m × 2.00m (~5.0 m²)',
    subtitle: 'Sala principal o comedor formal (RD$ 1,800)',
  },
  {
    id: 'rug-xlarge',
    name: 'Alfombra Extra Grande / Salón',
    category: 'Alfombras',
    basePrice: 2500,
    iconText: '🧶',
    image: '/cat-rug.jpg',
    isRug: true,
    dimensions: '3.00m × 2.50m (~7.5 m²)',
    subtitle: 'Salones amplios o áreas ejecutivas (RD$ 2,500)',
  },
  {
    id: 'rug-custom',
    name: 'Alfombra por Medida Personalizada',
    category: 'Alfombras',
    basePrice: 300, // RD$ 300 por m²
    iconText: '📏',
    image: '/cat-rug.jpg',
    isRug: true,
    isCustomRug: true,
    subtitle: 'Ajusta largo y ancho en metros (RD$ 300 / m²)',
  },
];
