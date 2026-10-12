# 📋 ALR COMPANY — Plan de Ingeniería ALPHA
## Factura Final de Servicio Completado en Formato Térmico (80mm POS)

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder & Fundador:** [Angel Luis Rosario](https://github.com/ALR1730)  
> **Sistema:** MITEFREE Platform (`apps/api` · `packages/shared-types` · `apps/pwa-client` · `apps/admin-portal`)  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** 🟡 **PLAN PROPUESTO — ESPERANDO AUTORIZACIÓN EXPLÍCITA DE ANGEL LUIS ROSARIO**

---

### 1. 🔍 Diagnóstico y Justificación del Negocio

En el ciclo comercial de MITEFREE existen dos tipos de facturas esenciales:
1. **Factura Proforma / Presupuesto Inicial:** Se emite al cliente en el cotizador antes de agendar para fijar el precio y la orden de servicio (`COT-2026-XXXXXXXX`).
2. **Factura Final de Servicio Completado:** Se emite cuando el técnico finaliza los trabajos en el domicilio del cliente (`FAC-2026-XXXXXXXX`). Certifica que el lavado quirúrgico y desinfección UV-C fueron concluidos a entera satisfacción, registra el pago total efectuado (cero anticipo pendiente) y activa formalmente la **Garantía Clínica de 48 Horas**.

---

### 2. 🏛️ Arquitectura del Módulo de Factura Final

```
[ Técnico o Admin marca cita como 'Completed' ]
         │
         ▼
[ Cliente en 'Mis Citas' o Admin en 'Agenda' ] ──▶ Clic en "Descargar Factura Final (PDF)"
         │
         ▼
[ WebAPI Controller: appointments.controller.ts ] ──▶ GET /api/v1/appointments/:id/invoice
         │
         ▼
[ Application: GetFinalInvoiceUseCase ] ──▶ Carga Appointment + Quotation Items + Técnico
         │
         ▼
[ Infrastructure: FinalInvoicePdfService ] ──▶ Generador Vectorial Térmico 80mm (PDF-1.4)
         │   ├── Encabezado Térmico MITEFREE 80mm
         │   ├── Número de Factura Final: FAC-2026-${shortId}
         │   ├── Técnico asignado que realizó el trabajo
         │   ├── Cliente (Nombre registrado o "Consumidor Final (Sin Registrar)")
         │   ├── Dirección y fecha/hora exacta de finalización
         │   ├── Desglose de piezas tratadas con protocolo UV-C
         │   ├── Liquidación Final: TOTAL PAGADO / CANCELADO (100% saldado)
         │   ├── Certificado de Desinfección y Sello de Garantía 48 Horas Activa
         │   └── Firma / Conformidad digital del cliente
         ▼
[ Stream binario PDF descargable e imprimible en impresoras térmicas portátiles ]
```

---

### 3. 📋 Plan de Modificaciones Archivo por Archivo

#### Archivo 1: `apps/api/src/infrastructure/pdf/final-invoice-pdf.service.ts` (Nuevo)
- **Capa:** Infrastructure / PDF Engine.
- **Rol:** Principal Engineer & DX Champion.
- **Acción:**
  - Crear el generador vectorial para **Factura Final de Servicio Completado** en rollo térmico de 80mm (`MediaBox [0 0 226.0 ${pageHeight}]`).
  - Incluye:
    - `*** MITEFREE ***`
    - `FACTURA FINAL DE SERVICIO / RECIBO DE CONFORMIDAD`
    - `No. FAC-2026-${shortId}`
    - `Técnico Responsable: ${technicianName}`
    - `Cliente: ${clientName || 'Consumidor Final (Sin Registrar)'}`
    - `Dirección: ${address}`
    - Detalle de muebles tratados con protocolo quirúrgico.
    - `TOTAL PAGADO / CANCELADO: $X,XXX.XX DOP` (Estado: Liquidado).
    - `Garantía de Satisfacción 48 Horas Activa` (con fecha de vigencia).
    - `Conformidad del Cliente: Aprobado a Satisfacción`.

#### Archivo 2: `apps/api/src/application/appointments/get-final-invoice.use-case.ts` (Nuevo)
- **Capa:** Application Layer.
- **Rol:** Principal Engineer.
- **Acción:**
  - Caso de uso que valida que la cita existe.
  - Extrae los datos de la cita, el técnico asignado, la cotización asociada y sus ítems.
  - Prepara el modelo de datos para generar la factura final.

#### Archivo 3: `apps/api/src/presentation/controllers/appointments.controller.ts`
- **Capa:** Delivery / WebAPI.
- **Rol:** Security Auditor & DX Champion.
- **Acción:**
  - Exponer endpoint `GET :id/invoice` (y `GET :id/invoice/pdf`).
  - Retornar stream binario `application/pdf` con header:  
    `Content-Disposition: attachment; filename="Factura-Final-MITEFREE-FAC-${shortCode}.pdf"`.

#### Archivo 4: `apps/api/src/modules/appointments.module.ts`
- **Capa:** Delivery / Composition Root.
- **Rol:** Chief Architect.
- **Acción:**
  - Registrar `FinalInvoicePdfService` y `GetFinalInvoiceUseCase` en los providers y exports.

#### Archivo 5: `apps/pwa-client/src/lib/api-client.ts`
- **Capa:** Presentation Adapter.
- **Rol:** DX Champion.
- **Acción:**
  - Agregar helper `getFinalInvoicePdfUrl: (id: string) => `${getApiBaseUrl()}/appointments/${id}/invoice/pdf``.

#### Archivo 6: `apps/pwa-client/src/app/mis-citas/page.tsx`
- **Capa:** Presentation (Frontend).
- **Rol:** DX Champion.
- **Acción:**
  - Cuando la cita esté en estado `Completed` (o aprobada), renderizar el botón oficial:
    `"🧾 Descargar Factura Final (PDF Térmico)"`, permitiendo al cliente descargar e imprimir su comprobante de servicio completado.

---

### 4. ⚠️ Análisis de Regresión y Autovalidación (Protocolo ZETA)

1. **¿Afecta citas en progreso o pendientes?**  
   No. El endpoint genera la factura con el estado actual de la cita; si está completada, refleja la liquidación total final.
2. **¿Rendimiento?**  
   Generación vectorial en memoria < 2 ms.
3. **¿Formato de Impresora?**  
   Ancho nativo de 80mm (226 pt), permitiendo al técnico imprimir el ticket directamente desde su celular o terminal Bluetooth portátil en el domicilio del cliente.

---

### 5. 🛑 Solicitud Formal de Autorización (Protocolo ALPHA)

**Angel Luis Rosario**, este es el plan para implementar la **Factura Final de Servicio Completado** en formato térmico 80mm con liquidación total, técnico ejecutor, sello de garantía activa y botón de descarga en *"Mis Citas"*.

¿Apruebas proceder con esta ejecución técnica?
