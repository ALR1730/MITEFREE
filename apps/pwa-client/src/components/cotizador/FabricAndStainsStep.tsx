'use client';

import Image from 'next/image';
import {
  UploadCloud,
  ImageIcon,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import type { FabricOption, StainOption, UploadedPhoto } from './cotizador.types';
import { formatRD } from './cotizador.constants';

interface FabricAndStainsStepProps {
  selectedFabric?: FabricOption;
  selectedStain?: StainOption;
  uploadedPhotos: UploadedPhoto[];
  totalItemsCount: number;
  activeSubtotal: number;
  fabricMultiplier?: number;
  stainSurcharge?: number;
  subtotalWithFabric?: number;
  onSelectFabric?: (fab: FabricOption) => void;
  onSelectStain?: (stain: StainOption) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (id: string) => void;
  onGoToStep: (step: number) => void;
}

export function FabricAndStainsStep({
  uploadedPhotos,
  totalItemsCount,
  activeSubtotal,
  onFileUpload,
  onRemovePhoto,
  onGoToStep,
}: FabricAndStainsStepProps) {
  return (
    <div id="step2-container" className="space-y-6 animate-fadeIn">
      {/* Subida de Fotos Opcional y Diagnóstico Profesional */}
      <div
        id="step2-photos-section"
        className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/30 tech-glow space-y-6 scroll-mt-20"
      >
        {/* Encabezado del Paso 2 */}
        <div className="space-y-2 border-b border-dark-border/60 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Paso 2 de 3 · Opcional</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Fotos de tus Muebles (Opcional)
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Si deseas que nuestros especialistas preparen desmanchadores específicos o reconozcan el estado previo de tus piezas, puedes adjuntar fotos aquí. Si no tienes fotos a mano, puedes continuar sin problemas.
          </p>
        </div>

        {/* Zona de Carga de Fotos */}
        <div className="p-5 rounded-2xl bg-dark-surface/80 border border-dark-border/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">
                  Adjuntar fotografías de las piezas
                </span>
                <span className="text-xs text-gray-400">
                  Formatos JPG, PNG o WebP · Máximo 5MB por foto
                </span>
              </div>
            </div>

            <label className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md active:scale-95">
              <UploadCloud className="w-4 h-4" />
              <span>Subir Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Galería de Fotos Subidas */}
          {uploadedPhotos.length > 0 && (
            <div className="pt-3 border-t border-dark-border/40">
              <span className="text-xs font-semibold text-emerald-400 block mb-2">
                ✓ {uploadedPhotos.length} {uploadedPhotos.length === 1 ? 'foto adjunta' : 'fotos adjuntas'}:
              </span>
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {uploadedPhotos.map((p) => (
                  <div
                    key={p.id}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-brand-500/40 shrink-0 shadow-md"
                  >
                    <Image src={p.preview} alt={p.name} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemovePhoto(p.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-500"
                      title="Eliminar foto"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tarjeta de Tranquilidad para el Cliente */}
        <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 flex items-start gap-3 text-xs text-gray-300">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-white font-semibold text-sm">
              Inspección y Diagnóstico Profesional en tu Domicilio
            </strong>
            <p className="leading-relaxed">
              No te preocupes por identificar el tipo exacto de tela o el origen de las manchas. Nuestros técnicos certificados evaluarán las fibras y aplicarán los desmanchadores biodegradables adecuados directamente al llegar a tu hogar.
            </p>
          </div>
        </div>

        {/* Tarjeta de Resumen de Inversión Transparente */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-left space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">
              Inversión Estimada en Limpieza & Desinfección
            </span>
            <span className="text-[11px] font-mono font-bold text-gray-400">
              {totalItemsCount} {totalItemsCount === 1 ? 'pieza' : 'piezas'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {formatRD(activeSubtotal)}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              Tarifa estándar · 0% anticipo
            </span>
          </div>

          <div className="pt-2 border-t border-dark-border/60 text-xs text-gray-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Incluye aspirado industrial, extracción profunda y sanitización bacteriana</span>
          </div>
        </div>

        {/* Botones de Navegación del Paso 2 */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 text-dark-bg font-extrabold text-sm sm:text-base tech-glow shadow-xl active:scale-95 hover:opacity-95 transition-all cursor-pointer"
          >
            <span>Continuar a Resumen y Fecha ({formatRD(activeSubtotal)})</span>
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
