'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import type { MainCategoryId } from './cotizador.types';
import { MAIN_CATEGORIES } from './cotizador.constants';

interface CategorySelectorGridProps {
  selectedMainCategory: MainCategoryId;
  hasItemsInOrder: boolean;
  getCategoryStartingPrice: (catId: MainCategoryId) => string;
  getCategoryCount: (catName: string) => number;
  onSelectCategory: (catId: MainCategoryId) => void;
  onScrollToCustomizer: () => void;
}

export function CategorySelectorGrid({
  selectedMainCategory,
  hasItemsInOrder,
  getCategoryStartingPrice,
  getCategoryCount,
  onSelectCategory,
  onScrollToCustomizer,
}: CategorySelectorGridProps) {
  return (
    <div id="categories-section" className="space-y-3 scroll-mt-20">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg sm:text-xl font-extrabold text-white">
          {hasItemsInOrder ? '➕ Agrega otra pieza a tu orden' : '1. ¿Qué deseas limpiar?'}
        </h2>
        <span className="text-xs text-brand-400 font-semibold font-mono">Paso 1 de 3</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {MAIN_CATEGORIES.map((cat) => {
          const isSelected = selectedMainCategory === cat.id;
          const countInOrder = getCategoryCount(cat.name);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`relative rounded-3xl p-3 text-left transition-all duration-200 flex flex-col justify-between overflow-hidden border cursor-pointer ${
                isSelected
                  ? 'border-brand-400 bg-brand-500/15 tech-glow shadow-xl scale-[1.01]'
                  : 'border-dark-border bg-dark-surface/85 hover:border-brand-500/30 hover:bg-dark-surface'
              }`}
            >
              <div className="relative w-full h-28 sm:h-36 rounded-2xl overflow-hidden bg-dark-bg mb-2.5">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 300px"
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="block text-sm sm:text-base font-extrabold text-white leading-tight">
                    {cat.name}
                  </span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {getCategoryStartingPrice(cat.id)}
                  </span>
                </div>

                {countInOrder > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[11px] border border-cyan-500/30 shrink-0">
                    {countInOrder} en orden
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Conector Visual hacia el Personalizador */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={onScrollToCustomizer}
          className="inline-flex items-center gap-1.5 text-xs text-brand-300 font-semibold hover:text-white transition-colors cursor-pointer"
        >
          <span>Siguiente: Personaliza tu {selectedMainCategory} abajo ⬇️</span>
          <ChevronDown className="w-3.5 h-3.5 text-brand-400" />
        </button>
      </div>
    </div>
  );
}
