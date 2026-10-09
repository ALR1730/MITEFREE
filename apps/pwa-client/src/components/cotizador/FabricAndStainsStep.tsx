'use client';

import Image from 'next/image';
import {
  Layers,
  Droplets,
  UploadCloud,
  ImageIcon,
  Check,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import type { FabricOption, StainOption, UploadedPhoto } from './cotizador.types';
import { FABRIC_OPTIONS, STAIN_OPTIONS, formatRD } from './cotizador.constants';

interface FabricAndStainsStepProps {
  selectedFabric: FabricOption;
  selectedStain: StainOption;
  uploadedPhotos: UploadedPhoto[];
  totalItemsCount: number;
  activeSubtotal: number;
  fabricMultiplier: number;
  stainSurcharge: number;
  subtotalWithFabric: number;
  onSelectFabric: (fab: FabricOption) => void;
  onSelectStain: (stain: StainOption) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (id: string) => void;
  onGoToStep: (step: number) => void;
}

export function FabricAndStainsStep({
  selectedFabric,
  selectedStain,
  uploadedPhotos,
  totalItemsCount,
  activeSubtotal,
  fabricMultiplier,
  stainSurcharge,
  subtotalWithFabric,
  onSelectFabric,
  onSelectStain,
  onFileUpload,
  onRemovePhoto,
  onGoToStep,
}: FabricAndStainsStepProps) {
  return (
    <div id="step2-container" className="space-y-6 animate-fadeIn">
      {/* Fabric Type Selector */}
      <div
        id="fabric-section"
        className="glass-card rounded-3xl p-5 sm:p-6 border border-dark-border space-y-4 scroll-mt-20"
      >
        <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Tipo de Tapicería / Tela</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Selecciona el material de tus piezas para ajustar el producto químico y la técnica de
              secado.
            </p>
          </div>
          <span className="text-xs text-cyan-400 font-semibold font-mono hidden sm:inline-block">
            {selectedFabric.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FABRIC_OPTIONS.map((fab) => {
            const isSelected = selectedFabric.id === fab.id;
            return (
              <button
                key={fab.id}
                type="button"
                onClick={() => onSelectFabric(fab)}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 tech-glow-blue scale-[1.01]'
                    : 'bg-dark-surface/80 border-dark-border hover:border-brand-500/30 hover:bg-dark-surface'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-white text-sm">{fab.name}</span>
                  <div className="flex items-center gap-2">
                    {fab.multiplier > 1.0 && (
                      <span className="text-[11px] font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                        +{Math.round((fab.multiplier - 1) * 100)}% cuidado
                      </span>
                    )}
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-dark-bg flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-1">{fab.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conector Visual */}
      <div className="flex justify-center my-1">
        <div className="w-8 h-8 rounded-full bg-dark-surface border border-dark-border text-cyan-400 flex items-center justify-center shadow-md">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Stain Severity Selector */}
      <div
        id="stains-section"
        className="glass-card rounded-3xl p-5 sm:p-6 border border-dark-border space-y-4 scroll-mt-20"
      >
        <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Nivel de Suciedad o Manchas</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Garantizamos tratamiento con desmanchador biodegradable y luz ultravioleta UV-C.
            </p>
          </div>
          <span className="text-xs text-brand-400 font-semibold font-mono hidden sm:inline-block">
            {selectedStain.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STAIN_OPTIONS.map((stain) => {
            const isSelected = selectedStain.id === stain.id;
            return (
              <button
                key={stain.id}
                type="button"
                onClick={() => onSelectStain(stain)}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-brand-500/15 border-brand-400 tech-glow scale-[1.01]'
                    : 'bg-dark-surface/80 border-dark-border hover:border-brand-500/30 hover:bg-dark-surface'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm block">{stain.name}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-brand-500 text-dark-bg flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stain.desc}</p>
                </div>
                <span className="text-xs font-mono font-bold text-brand-400 mt-3 block">
                  {stain.surcharge === 0 ? 'Sin recargo' : `+${formatRD(stain.surcharge)}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conector Visual */}
      <div className="flex justify-center my-1">
        <div className="w-8 h-8 rounded-full bg-dark-surface border border-dark-border text-brand-400 flex items-center justify-center shadow-md">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Acciones del Paso 2, Fotos & Tarifa Dinámica */}
      <div
        id="step2-actions-section"
        className="glass-card rounded-3xl p-5 sm:p-6 border border-brand-500/30 tech-glow space-y-5 scroll-mt-20"
      >
        {/* Photo Upload */}
        <div className="space-y-3 pb-2 border-b border-dark-border/60">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Foto de tus Muebles (Opcional)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Si deseas que el especialista prepare productos específicos antes de la visita, sube
              una foto.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-xs font-bold text-white transition-all">
              <ImageIcon className="w-4 h-4 text-brand-400" />
              <span>Seleccionar Imagen (Máx 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>

            {uploadedPhotos.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {uploadedPhotos.map((p) => (
                  <div
                    key={p.id}
                    className="relative w-14 h-14 rounded-xl overflow-hidden border border-brand-500/40 shrink-0"
                  >
                    <Image src={p.preview} alt={p.name} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemovePhoto(p.id)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PRECIO ESTIMADO ACTUALIZADO CON TELA & MANCHAS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-left space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">
              Total con Tratamiento de Tejido & Manchas
            </span>
            <span className="text-[11px] font-mono font-bold text-gray-400">
              {totalItemsCount} {totalItemsCount === 1 ? 'pieza' : 'piezas'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {formatRD(subtotalWithFabric)}
            </span>
            <span className="text-xs text-gray-400">
              Base: {formatRD(activeSubtotal)}
              {fabricMultiplier > 1 && ` · Tela: +${Math.round((fabricMultiplier - 1) * 100)}%`}
              {stainSurcharge > 0 && ` · Manchas: +${formatRD(stainSurcharge)}`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-border/60 text-xs">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Tela: <strong>{selectedFabric.name}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="truncate">Manchas: <strong>{selectedStain.name}</strong></span>
            </div>
          </div>
        </div>

        {/* Botones de Acción del Paso 2 */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-sm sm:text-base tech-glow shadow-xl active:scale-95 hover:opacity-95 transition-all cursor-pointer"
          >
            <span>Continuar a Resumen y Fecha ({formatRD(subtotalWithFabric)})</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl glass-panel text-xs sm:text-sm text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Volver a modificar piezas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
