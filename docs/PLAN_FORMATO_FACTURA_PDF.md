# 📋 ALR COMPANY — Plan de Ingeniería ALPHA (v2.0)
## Formato Enterprise de Factura Proforma y Presupuesto Oficial en PDF (Marca MITEFREE)

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder & Fundador:** [Angel Luis Rosario](https://github.com/ALR1730)  
> **Proyecto:** MITEFREE Platform (`apps/api` · `packages/shared-types` · `apps/pwa-client`)  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** 🟡 **PLAN ACTUALIZADO CON FEEDBACK — ESPERANDO CONFIRMACIÓN FINAL**

---

### 1. 🎯 Directivas Incorporadas de Angel Luis Rosario

1. **Emisor y Marca Principal:** El encabezado, diseño y membrete deben estar **estrictamente bajo el nombre de la app: MITEFREE** (no como empresa ALR COMPANY).
2. **RNC y Datos Fiscales Parametrizados:** Dejar el espacio de RNC claramente marcado como marcador de posición configurable para producción (ej: `[RNC: PENDIENTE DE CONFIGURACIÓN DGII]`), listo para ser provisto vía variables de entorno o constante sin tocar código.
3. **Cuentas Bancarias Parametrizadas:** Dejar los espacios para Banco Popular, Banco BHD y Banreservas preparados, marcados como `[CTA_..._PRODUCCION]` y documentados para producción.
4. **Documentación de Producción Dedicada:** Crear `docs/GUIA_CONFIGURACION_FACTURA_PRODUCCION.md` para que el equipo o Angel puedan sustituir RNC y números de cuentas en minutos sin alterar la lógica de negocio.

---

### 2. 🏛️ Arquitectura de Configuración (`invoice.config.ts`)

Se creará [`apps/api/src/infrastructure/pdf/invoice.config.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/infrastructure/pdf/invoice.config.ts) desacoplando la presentación de los datos sensibles:

```ts
export interface InvoiceBrandingConfig {
  appName: string;       // "MITEFREE"
  tagline: string;       // "Limpieza & Desinfección Inteligente de Muebles"
  phone: string;         // "(809) 513-4773"
  email: string;         // "contacto@mitefree.com"
  website: string;       // "mitefree.com"
  city: string;          // "Santiago / Santo Domingo, República Dominicana"
  rnc: string;           // Fallback marcado para producción o env var
  bankAccounts: {
    bankName: string;
    accountType: string;
    accountNumber: string;
    holder: string;
  }[];
}
```

---

### 3. 📋 Plan de Modificaciones Archivo por Archivo

| Capa | Archivo | Rol | Modificación |
| :--- | :--- | :--- | :--- |
| **Shared Kernel** | [`quotation.dto.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/packages/shared-types/src/dtos/quotation.dto.ts) | Chief Architect | Agregar `QuotationItemResponseDto` y campos opcionales de cliente en `QuotationResponseDto`. |
| **Application** | [`get-quotation.use-case.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/application/quotations/get-quotation.use-case.ts) | Principal Engineer | Mapear los `quotation.items` del agregado de dominio para que el generador de PDF disponga de los muebles cotizados. |
| **Infrastructure** | [`invoice.config.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/infrastructure/pdf/invoice.config.ts) (Nuevo) | Principal Engineer | Centralizar marca MITEFREE, RNC parametrizado y cuentas bancarias marcadas para producción. |
| **Infrastructure** | [`quotation-pdf.service.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/infrastructure/pdf/quotation-pdf.service.ts) | Principal & DX | Rediseño vectorial PDF-1.4: Membrete MITEFREE, cuadro de metadatos (`FACT-COT-2026-XXXX`), tabla estilizada de muebles, resumen financiero (30%/70%), cuentas bancarias marcadas y sello de garantía 48h. |
| **Delivery WebAPI** | [`quotations.controller.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/presentation/controllers/quotations.controller.ts) | DX Champion | `Content-Disposition: attachment; filename="Factura-MITEFREE-${code}.pdf"`. |
| **Presentation PWA** | [`QuoteSummaryStep.tsx`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/pwa-client/src/components/cotizador/QuoteSummaryStep.tsx) | DX Champion | Botón con etiqueta: `"📄 Descargar Factura Proforma (PDF)"`. |
| **Documentación** | [`GUIA_CONFIGURACION_FACTURA_PRODUCCION.md`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/docs/GUIA_CONFIGURACION_FACTURA_PRODUCCION.md) (Nuevo) | DX Champion | Manual paso a paso para poblar RNC y cuentas reales en producción mediante variables de entorno o constantes. |

---

### 4. 🧪 Control de Calidad y Autovalidación (Protocolo ZETA)

1. **Compilación:** `bun x tsc` sin errores en `packages/shared-types`, `apps/api` y `apps/pwa-client`.
2. **TDD:** `bun test` mantiene los 144 tests y 51 tests de API en verde.
3. **Verificación en Navegador:** Descargar el PDF generado en caliente y verificar visualmente el membrete MITEFREE, la tabla de muebles, los marcadores de RNC y las cuentas de banco.

---

### 5. 🛑 Solicitud de Confirmación (Protocolo ALPHA)

Angel, el plan ha sido ajustado al 100% con tus indicaciones:
- Emisor exclusivo: **MITEFREE**.
- RNC y cuentas bancarias parametrizados y marcados con placeholders de producción.
- Guía de configuración documentada en `docs/`.

¿Confirmas proceder con la ejecución de este plan?
