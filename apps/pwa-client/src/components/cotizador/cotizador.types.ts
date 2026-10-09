import type { CatalogItem } from '@mitefree/shared-types';

export type { CatalogItem };

export interface SelectedQuoteItem {
  cartId: string;
  catalogId: string;
  name: string;
  category: 'Colchones' | 'Muebles de Sala' | 'Sillas de Comedor' | 'Alfombras';
  iconText: string;
  bothSides: boolean;
  extraSeats: number;
  rugDimensions?: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

export interface FabricOption {
  id: string;
  name: string;
  multiplier: number;
  desc: string;
}

export interface StainOption {
  id: string;
  name: string;
  surcharge: number;
  desc: string;
}

export interface MainCategoryOption {
  id: 'Colchones' | 'Muebles de Sala' | 'Alfombras' | 'Sillas de Comedor';
  name: string;
  priceStarting: string;
  image: string;
  defaultItemId: string;
}

export type MainCategoryId = MainCategoryOption['id'];

export interface UploadedPhoto {
  id: string;
  name: string;
  preview: string;
  size: string;
}
