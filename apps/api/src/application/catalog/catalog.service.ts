import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_CATALOG_ITEMS,
  type CatalogItem,
  type CreateCatalogItemDto,
  type UpdateCatalogItemDto,
} from '@mitefree/shared-types';

@Injectable()
export class CatalogService {
  private items: CatalogItem[] = JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));

  getAll(): CatalogItem[] {
    return this.items;
  }

  create(body: CreateCatalogItemDto): CatalogItem {
    const newItem: CatalogItem = {
      id: body.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: body.name,
      category: body.category,
      basePrice: Number(body.basePrice),
      bothSidesPrice: body.bothSidesPrice !== undefined ? Number(body.bothSidesPrice) : undefined,
      iconText: body.iconText || '🪑',
      image: body.image || '/cat-chair.jpg',
      subtitle: body.subtitle || `Tarifa estándar RD$ ${Number(body.basePrice).toLocaleString('es-DO')}`,
      dimensions: body.dimensions,
      isMattress: body.isMattress ?? body.category === 'Colchones',
      isSofaModular: body.isSofaModular,
      isChair: body.isChair ?? body.category === 'Sillas de Comedor',
      isRug: body.isRug ?? body.category === 'Alfombras',
      isCustomRug: body.isCustomRug,
    };

    this.items.push(newItem);
    return newItem;
  }

  update(id: string, body: UpdateCatalogItemDto): CatalogItem {
    const index = this.items.findIndex((it) => it.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado en el catálogo.`);
    }

    const current = this.items[index]!;
    const updated: CatalogItem = {
      ...current,
      ...body,
      basePrice: body.basePrice !== undefined ? Number(body.basePrice) : current.basePrice,
      bothSidesPrice:
        body.bothSidesPrice !== undefined ? Number(body.bothSidesPrice) : current.bothSidesPrice,
    };

    this.items[index] = updated;
    return updated;
  }

  delete(id: string): { success: boolean; id: string } {
    const index = this.items.findIndex((it) => it.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado.`);
    }

    this.items.splice(index, 1);
    return { success: true, id };
  }

  reset(): CatalogItem[] {
    this.items = JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));
    return this.items;
  }
}
