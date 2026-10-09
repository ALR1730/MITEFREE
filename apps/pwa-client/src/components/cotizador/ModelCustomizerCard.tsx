'use client';

import {
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Maximize2,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import type { CatalogItem } from '@mitefree/shared-types';
import type { SelectedQuoteItem, MainCategoryId } from './cotizador.types';
import { formatRD } from './cotizador.constants';

interface ModelCustomizerCardProps {
  selectedMainCategory: MainCategoryId;
  filteredCatalog: CatalogItem[];
  selectedItemId: string;
  currentCatalogItem: CatalogItem;
  currentBothSides: boolean;
  currentExtraSeats: number;
  currentQty: number;
  customLength: number;
  customWidth: number;
  currentUnitPrice: number;
  currentItemTotal: number;
  selectedItems: SelectedQuoteItem[];
  itemsSubtotal: number;
  totalItemsCount: number;
  addedFeedback: string | null;
  onSelectModel: (itemId: string) => void;
  onSelectBothSides: (both: boolean) => void;
  onSelectChairPreset: (count: number) => void;
  onUpdateTempQuantity: (delta: number) => void;
  onUpdateExtraSeats: (delta: number) => void;
  onUpdateCustomLength: (delta: number) => void;
  onUpdateCustomWidth: (delta: number) => void;
  onScrollToQuantity: () => void;
  onProceedFromCustomizer: () => void;
  onAddAndSelectAnother: () => void;
  onProceedAndAddCurrent: () => void;
  onProceedWithExistingItems: () => void;
}

export function ModelCustomizerCard({
  selectedMainCategory,
  filteredCatalog,
  selectedItemId,
  currentCatalogItem,
  currentBothSides,
  currentExtraSeats,
  currentQty,
  customLength,
  customWidth,
  currentUnitPrice,
  currentItemTotal,
  selectedItems,
  itemsSubtotal,
  totalItemsCount,
  addedFeedback,
  onSelectModel,
  onSelectBothSides,
  onSelectChairPreset,
  onUpdateTempQuantity,
  onUpdateExtraSeats,
  onUpdateCustomLength,
  onUpdateCustomWidth,
  onScrollToQuantity,
  onProceedFromCustomizer,
  onAddAndSelectAnother,
  onProceedAndAddCurrent,
  onProceedWithExistingItems,
}: ModelCustomizerCardProps) {
  return (
    <div
      id="customizer-section"
      className="glass-card rounded-3xl p-5 sm:p-6 border border-dark-border space-y-6 scroll-mt-24 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              {selectedMainCategory === 'Colchones'
                ? '¿Qué tamaño de colchón es?'
                : selectedMainCategory === 'Muebles de Sala'
                  ? '¿Qué tipo de mueble de sala tienes?'
                  : selectedMainCategory === 'Alfombras'
                    ? '¿Qué dimensión tiene tu alfombra?'
                    : '¿Cuántas sillas de comedor deseas limpiar?'}
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Tarifas directas calculadas para desinfección profunda a vapor y extracción de ácaros.
          </p>
        </div>
        <span className="text-xs text-cyan-400 font-semibold font-mono hidden sm:inline-block">
          {selectedMainCategory}
        </span>
      </div>

      {/* Modelos según Categoría */}
      {selectedMainCategory === 'Colchones' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Tamaño del colchón
            </label>
            <div className="space-y-2">
              {filteredCatalog.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                    selectedItemId === item.id
                      ? 'bg-brand-500/15 border-brand-400 text-white font-bold'
                      : 'bg-dark-surface/70 border-dark-border text-gray-300 hover:bg-dark-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="selectedMattressModel"
                      checked={selectedItemId === item.id}
                      onChange={() => onSelectModel(item.id)}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs sm:text-sm block">{item.name}</span>
                      {item.subtitle && (
                        <span className="text-[11px] text-gray-400 block font-normal">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 shrink-0 ml-2">
                    RD$ {item.basePrice.toLocaleString('es-DO')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div id="mattress-sides-section" className="scroll-mt-24 space-y-2">
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              ¿Qué lados deseas limpiar?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onSelectBothSides(false)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  !currentBothSides
                    ? 'bg-brand-500 text-dark-bg border-brand-400 tech-glow shadow-md'
                    : 'bg-dark-surface border-dark-border text-gray-400 hover:text-white'
                }`}
              >
                Un lado
              </button>
              <button
                type="button"
                onClick={() => onSelectBothSides(true)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  currentBothSides
                    ? 'bg-brand-500 text-dark-bg border-brand-400 tech-glow shadow-md'
                    : 'bg-dark-surface border-dark-border text-gray-400 hover:text-white'
                }`}
              >
                Ambos lados (+RD${' '}
                {(currentCatalogItem.bothSidesPrice
                  ? currentCatalogItem.bothSidesPrice - currentCatalogItem.basePrice
                  : 500
                ).toLocaleString('es-DO')}
                )
              </button>
            </div>
          </div>

          {/* Stepper Cantidad */}
          <div
            id="active-quantity-section"
            className="flex items-center justify-between pt-3 border-t border-dark-border/60 scroll-mt-24"
          >
            <div>
              <span className="block text-sm font-bold text-white">Cantidad</span>
              <span className="block text-xs text-gray-400">Unidades que deseas limpiar</span>
            </div>
            <div className="flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-1.5 shadow-md">
              <button
                type="button"
                onClick={() => onUpdateTempQuantity(-1)}
                className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-cyan-300 font-mono text-sm">
                {currentQty}
              </span>
              <button
                type="button"
                onClick={() => onUpdateTempQuantity(1)}
                className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMainCategory === 'Muebles de Sala' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Tamaño y tipo de mueble
            </label>
            <div className="space-y-2">
              {filteredCatalog.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                    selectedItemId === item.id
                      ? 'bg-brand-500/15 border-brand-400 text-white font-bold'
                      : 'bg-dark-surface/70 border-dark-border text-gray-300 hover:bg-dark-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="selectedSofaModel"
                      checked={selectedItemId === item.id}
                      onChange={() => onSelectModel(item.id)}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs sm:text-sm block">{item.name}</span>
                      {item.subtitle && (
                        <span className="text-[11px] text-gray-400 block font-normal">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 shrink-0 ml-2">
                    RD$ {item.basePrice.toLocaleString('es-DO')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {(currentCatalogItem.isSofaModular || selectedItemId === 'sofa-5') && (
            <div
              id="sofa-modular-section"
              className="scroll-mt-24 p-3 rounded-2xl bg-dark-surface/90 border border-dark-border space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Plazas adicionales en L:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateExtraSeats(-1)}
                    className="w-7 h-7 rounded-lg bg-dark-bg border border-dark-border text-white flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-bold text-cyan-400 font-mono">
                    {currentExtraSeats}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateExtraSeats(1)}
                    className="w-7 h-7 rounded-lg bg-dark-bg border border-dark-border text-white flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-gray-500 font-mono">(+RD$ 500 c/u)</span>
                </div>
              </div>
              <div className="pt-1 border-t border-dark-border/40 text-right">
                <button
                  type="button"
                  onClick={onScrollToQuantity}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-300 hover:text-white cursor-pointer transition-colors"
                >
                  <span>Elegir cantidad de piezas ⬇️</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-400" />
                </button>
              </div>
            </div>
          )}

          {/* Stepper Cantidad */}
          <div
            id="active-quantity-section"
            className="flex items-center justify-between pt-3 border-t border-dark-border/60 scroll-mt-24"
          >
            <div>
              <span className="block text-sm font-bold text-white">Cantidad</span>
              <span className="block text-xs text-gray-400">Unidades que deseas limpiar</span>
            </div>
            <div className="flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-1.5 shadow-md">
              <button
                type="button"
                onClick={() => onUpdateTempQuantity(-1)}
                className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-cyan-300 font-mono text-sm">
                {currentQty}
              </span>
              <button
                type="button"
                onClick={() => onUpdateTempQuantity(1)}
                className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMainCategory === 'Alfombras' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Tamaño de la alfombra
            </label>
            <div className="space-y-2">
              {filteredCatalog.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                    selectedItemId === item.id
                      ? 'bg-brand-500/15 border-brand-400 text-white font-bold'
                      : 'bg-dark-surface/70 border-dark-border text-gray-300 hover:bg-dark-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="selectedRugModel"
                      checked={selectedItemId === item.id}
                      onChange={() => onSelectModel(item.id)}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs sm:text-sm block">{item.name}</span>
                      {item.dimensions && (
                        <span className="text-[11px] text-gray-400 block font-normal">
                          Medidas: {item.dimensions}
                        </span>
                      )}
                      {item.subtitle && !item.dimensions && (
                        <span className="text-[11px] text-gray-400 block font-normal">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 shrink-0 ml-2">
                    {item.isCustomRug
                      ? `RD$ ${item.basePrice.toLocaleString('es-DO')} / m²`
                      : `RD$ ${item.basePrice.toLocaleString('es-DO')}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {(currentCatalogItem.isCustomRug || selectedItemId === 'rug-custom') && (
            <div
              id="rug-custom-section"
              className="scroll-mt-24 p-3.5 rounded-2xl bg-dark-surface/90 border border-cyan-500/30 space-y-3 text-xs"
            >
              <span className="text-white font-bold block flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-cyan-400" />
                <span>Medidas en metros:</span>
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
                  <span className="text-[11px] text-gray-400 block">Largo (m):</span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onUpdateCustomLength(-0.5)}
                      className="w-7 h-7 rounded-lg bg-dark-surface text-white flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      {customLength.toFixed(1)} m
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateCustomLength(0.5)}
                      className="w-7 h-7 rounded-lg bg-dark-surface text-white flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
                  <span className="text-[11px] text-gray-400 block">Ancho (m):</span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onUpdateCustomWidth(-0.5)}
                      className="w-7 h-7 rounded-lg bg-dark-surface text-white flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      {customWidth.toFixed(1)} m
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateCustomWidth(0.5)}
                      className="w-7 h-7 rounded-lg bg-dark-surface text-white flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-300 pt-1">
                <span>
                  Área: <strong className="text-white">{(customLength * customWidth).toFixed(1)} m²</strong>
                </span>
                <span className="text-brand-400 font-mono font-bold">
                  {formatRD(currentUnitPrice)}
                </span>
              </div>
              <div className="pt-1 border-t border-dark-border/40 text-right">
                <button
                  type="button"
                  onClick={onScrollToQuantity}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-300 hover:text-white cursor-pointer transition-colors"
                >
                  <span>Elegir cantidad de alfombras ⬇️</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-400" />
                </button>
              </div>
            </div>
          )}

          {/* Stepper Cantidad */}
          <div
            id="active-quantity-section"
            className="flex items-center justify-between pt-3 border-t border-dark-border/60 scroll-mt-24"
          >
            <div>
              <span className="block text-sm font-bold text-white">Cantidad</span>
              <span className="block text-xs text-gray-400">Unidades que deseas limpiar</span>
            </div>
            <div className="flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-1.5 shadow-md">
              <button
                type="button"
                onClick={() => onUpdateTempQuantity(-1)}
                className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-cyan-300 font-mono text-sm">
                {currentQty}
              </span>
              <button
                type="button"
                onClick={() => onUpdateTempQuantity(1)}
                className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMainCategory === 'Sillas de Comedor' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Juego de sillas de comedor
            </label>
            <div className="space-y-2">
              {[
                { count: 4, label: 'Juego de 4 Sillas — RD$ 1,200' },
                { count: 6, label: 'Juego de 6 Sillas — RD$ 1,800' },
                { count: 8, label: 'Juego de 8 Sillas — RD$ 2,400' },
              ].map((opt) => (
                <label
                  key={opt.count}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                    currentQty === opt.count
                      ? 'bg-brand-500/15 border-brand-400 text-white font-bold'
                      : 'bg-dark-surface/70 border-dark-border text-gray-300 hover:bg-dark-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="chairPreset"
                    checked={currentQty === opt.count}
                    onChange={() => onSelectChairPreset(opt.count)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stepper Cantidad */}
          <div
            id="active-quantity-section"
            className="flex items-center justify-between pt-3 border-t border-dark-border/60 scroll-mt-24"
          >
            <div>
              <span className="block text-sm font-bold text-white">Total de Sillas</span>
              <span className="block text-xs text-gray-400">
                RD$ {currentCatalogItem.basePrice.toLocaleString('es-DO')} cada silla
              </span>
            </div>
            <div className="flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-1.5 shadow-md">
              <button
                type="button"
                onClick={() => onUpdateTempQuantity(-1)}
                className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-cyan-300 font-mono text-sm">
                {currentQty}
              </span>
              <button
                type="button"
                onClick={() => onUpdateTempQuantity(1)}
                className="w-8 h-8 rounded-xl bg-dark-surface hover:bg-dark-hover text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Toast de Pieza Agregada */}
      {addedFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{addedFeedback}</span>
          </div>
          <span className="text-[10px] text-gray-300 font-mono">Ver arriba 👆</span>
        </div>
      )}

      {/* PRECIO ESTIMADO DEL SERVICIO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-left space-y-1">
        <span className="block text-xs font-semibold text-emerald-400">
          {selectedItems.length > 0 ? 'Precio de esta pieza a agregar' : 'Precio estimado del servicio'}
        </span>
        <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono my-1">
          {formatRD(currentItemTotal)}
        </span>
        <p className="text-[11px] text-gray-400 leading-tight">
          El total final se confirma según la dirección, las condiciones y el servicio requerido.
        </p>
      </div>

      {/* Botones de Acción del Customizador */}
      <div className="space-y-3 pt-1">
        {selectedItems.length === 0 ? (
          <>
            <button
              type="button"
              onClick={onProceedFromCustomizer}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-sm sm:text-base tech-glow shadow-xl active:scale-95 hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Continuar a fecha y dirección (o pago)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onAddAndSelectAnother}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/40 text-xs sm:text-sm font-bold text-brand-300 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brand-400 stroke-[2.5]" />
              <span>+ Añadir esta pieza y agregar otro artículo (+{formatRD(currentItemTotal)})</span>
            </button>
          </>
        ) : (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onProceedAndAddCurrent}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-sm sm:text-base tech-glow shadow-xl active:scale-95 hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Añadir {currentCatalogItem.name} e ir a fecha y pago ({formatRD(itemsSubtotal + currentItemTotal)})</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onAddAndSelectAnother}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/40 text-xs sm:text-sm font-bold text-brand-300 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brand-400 stroke-[2.5]" />
              <span>+ Añadir {currentCatalogItem.name} y agregar otro artículo (+{formatRD(currentItemTotal)})</span>
            </button>

            {itemsSubtotal >= 1500 && (
              <button
                type="button"
                onClick={onProceedWithExistingItems}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <span>O continuar solo con mis {totalItemsCount} piezas guardadas ({formatRD(itemsSubtotal)}) →</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
