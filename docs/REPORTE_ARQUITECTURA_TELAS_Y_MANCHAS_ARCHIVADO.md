# 📦 ALR COMPANY — Archivo Técnico: Lógica y Componentes de Telas & Manchas (Paso 2)

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder & Fundador:** Angel Luis Rosario  
> **Proyecto:** MITEFREE  
> **Propósito:** Registro completo e inmutable del diseño, constantes, fórmulas y JSX de "Tipo de Tapicería / Telas" y "Nivel de Manchas" retirados del flujo principal del cotizador cliente por ergonomía (los clientes no conocen los tecnicismos de sus telas), preservados para reincorporación futura (ej: Modo Experto o Inspección de Técnicos).  
> **Fecha de Archivo:** Octubre 2026  

---

## 1. 📐 CONSTANTES Y MATRIZ DE PRECIOS ARCHIVADA

### A) Tipos de Tapicería (`FABRIC_OPTIONS`)
Ubicación original: [`apps/pwa-client/src/components/cotizador/cotizador.constants.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/pwa-client/src/components/cotizador/cotizador.constants.ts)

```typescript
export const FABRIC_OPTIONS: FabricOption[] = [
  {
    id: 'SYNTHETIC',
    name: 'Sintética / Microfibra Básica',
    multiplier: 1.0,
    desc: 'Poliéster estándar o telas convencionales. Secado rápido y lavado tradicional.',
  },
  {
    id: 'MICROFIBER',
    name: 'Microfibra Premium / Gamuza',
    multiplier: 1.15,
    desc: 'Tejido aterciopelado resistente. Requiere extracción equilibrada y vapor medio.',
  },
  {
    id: 'LINEN',
    name: 'Lino / Algodón Natural',
    multiplier: 1.2,
    desc: 'Fibras naturales delicadas. Requiere pH neutro y extracción controlada.',
  },
  {
    id: 'VELVET',
    name: 'Terciopelo / Chenille Exclusivo',
    multiplier: 1.4,
    desc: 'Tejido de alto lujo. Cepillado unidireccional y termonebulización protectora.',
  },
  {
    id: 'LEATHER',
    name: 'Piel / Cuero Sintético (Eco-Cuero)',
    multiplier: 1.5,
    desc: 'Limpieza especializada sin inyección profunda + hidratación con ceras protectoras.',
  },
  {
    id: 'SILK',
    name: 'Seda / Brocado Vintage',
    multiplier: 1.8,
    desc: 'Tejido ultrafino que no tolera abrasión. Secado al vacío a baja temperatura.',
  },
];
```

### B) Niveles de Mancha (`STAIN_OPTIONS`)
```typescript
export const STAIN_OPTIONS: StainOption[] = [
  {
    id: 'LIGHT',
    name: 'Polvo y Suciedad Normal',
    surcharge: 0,
    desc: 'Mantenimiento regular. Inyección y extracción profunda sin manchas rebeldes.',
  },
  {
    id: 'MODERATE',
    name: 'Manchas Visibles / Olores de Mascota',
    surcharge: 850,
    desc: 'Manchas de café, comida, orina leve o sudor. Aplicación de enzimas desodorizantes.',
  },
  {
    id: 'CRITICAL',
    name: 'Manchas Críticas / Grasa / Moho Profundo',
    surcharge: 2000,
    desc: 'Afectación severa o moho bacteriano. Tratamiento con luz UV-C y doble enjuague térmico.',
  },
];
```

---

## 2. 🧮 FÓRMULAS DE CÁLCULO ARCHIVADAS

```typescript
// En useCotizadorState.ts:
const fabricMultiplier = selectedFabric.multiplier; // 1.0 a 1.8
const stainSurcharge = selectedStain.surcharge;     // 0 a 2000

// Subtotal con personalización técnica de tela y mancha:
const subtotalWithFabric = Math.round(activeSubtotal * fabricMultiplier + stainSurcharge);
```

---

## 3. 🎨 CÓDIGO JSX COMPLETO DEL COMPONENTE ARCHIVADO

```tsx
{/* 1. Fabric Type Selector */}
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

{/* 2. Stain Severity Selector */}
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
```

---

## 4. 🔄 CÓMO RESTAURAR EN EL FUTURO (INSTRUCCIONES PARA EL EQUIPO)

Si en el futuro se desea reactivar la selección de telas y manchas:
1. Reincorporar las secciones anteriores en [`FabricAndStainsStep.tsx`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/pwa-client/src/components/cotizador/FabricAndStainsStep.tsx).
2. Conectar los handlers `onSelectFabric` y `onSelectStain` desde `useCotizadorState`.
3. En el Stepper Wizard de [`CotizadorHeader.tsx`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/pwa-client/src/components/cotizador/CotizadorHeader.tsx), renombrar la etiqueta del paso 2 de `'2. Fotos (Opcional)'` a `'2. Tela & Manchas'`.
4. El backend en `@mitefree/domain-core` ([`QuotationPricingEngine`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/packages/domain-core/src/engines/quotation-pricing.engine.ts)) ya cuenta con las fórmulas nativas probadas al 100% con 144 tests unitarios, por lo que responderá de inmediato sin cambios en la API.
