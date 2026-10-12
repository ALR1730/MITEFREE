# 📋 PROTOCOLO ALPHA — PLAN DE INGENIERÍA: PUNTO 4 (Persistencia Formal de Cotización para Clientes Invitados)

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder & Fundador:** Angel Luis Rosario  
> **Proyecto:** MITEFREE  
> **Estado:** 🛑 **PENDIENTE DE CONFIRMACIÓN EXPLÍCITA DE ANGEL LUIS ROSARIO**  
> **Cumplimiento Normativo:** Constitución de Ingeniería v4.0 · Protocolo ALPHA · Protocolo BETA · Protocolo ZETA  

---

## 1. 🔍 DIAGNÓSTICO DE CAUSA RAÍZ Y ESTADO ACTUAL

En la auditoría exhaustiva en caliente y análisis de la persistencia de cotizaciones en el cotizador (`/cotizar`), se diagnosticó la siguiente limitación arquitectónica:

1. **Esquema de Validación Rígido (`packages/shared-types/src/dtos/quotation.dto.ts`):**
   - El esquema `CreateQuotationRequestSchema` exige obligatoriamente un `clientId: z.string().uuid()`.
   - Cuando un visitante sin cuenta previa (invitado) realiza una cotización, no posee un UUID de usuario registrado. El frontend intenta enviar un UUID en ceros (`00000000-0000-0000-0000-000000000000`), el cual falla en PostgreSQL debido a la restricción de clave foránea `quotations.client_id -> users.id`.
2. **Falta de Resolución de Cliente Invitado en el Caso de Uso (`CreateQuotationUseCase`):**
   - En el backend, mientras que `ScheduleAppointmentUseCase` ya resuelve eficazmente a los invitados mapeándolos al cliente canónico (`SEED_IDS.CLIENT_LAURA`), `CreateQuotationUseCase` no implementa esta resolución, provocando que la creación de la cotización falle silenciosamente.
3. **Degradación a Parámetros Volátiles en el Frontend (`useCotizadorState.ts`):**
   - Al fallar la llamada a `apiClient.quotations.create`, el cotizador cae en un bloque `catch` y redirige a `/agenda?total=...&deposit=...` **sin `quotationId`**.
   - Consecuencia: La cotización nunca queda registrada en base de datos. Si el cliente no agenda en ese instante o refresca el navegador, la cotización formal se pierde, no se genera el PDF oficial y el despachador en el Admin Portal no puede auditar los ítems exactos presupuestados.
4. **Ausencia de Descarga de PDF y Código Formal en el Resumen (`QuoteSummaryStep.tsx`):**
   - El endpoint backend de generación de PDF congelado (`GET /api/v1/quotations/:id/pdf`) ya existe y funciona, pero la UI no ofrece al cliente invitado la opción de descargar su presupuesto en PDF ni de copiar su código formal `#COT-XXXXXX`.

---

## 2. 🏛️ DELIMITACIÓN DE CAPAS Y ROLES DE INGENIERÍA

- **Capas Involucradas:**
  - `Shared Types / Domain Contracts` (`packages/shared-types`).
  - `Application Layer` (`apps/api/src/application/quotations/create-quotation.use-case.ts`).
  - `Delivery / Presentation Layer` (`apps/pwa-client/src/components/cotizador`).
- **Roles Responsables:**
  - **Rol 1 — Chief Architect (Robert C. Martin / Uncle Bob):** Asegurar consistencia de contratos entre cotizaciones y citas, garantizando que todo agendamiento pueda trazarse a una cotización formal.
  - **Rol 2 — Principal Engineer (Héctor de León & Ing. Leonardo):** Manejo robusto de persistencia en Drizzle ORM, transaccionalidad y resolución limpia del cliente invitado con fallback a `SEED_IDS.CLIENT_LAURA`.
  - **Rol 6 — DX Champion (Gentleman Programming):** Experiencia de usuario impecable: generación automática de la cotización, botón para descargar PDF oficial (con validez de 7 días), código formal en WhatsApp y guardado en `localStorage`.
  - **Rol 3 — QA & TDD Enforcer:** Preservación de los 143 tests existentes, adición o actualización de pruebas unitarias y validación con `tsc --noEmit`.

---

## 3. 🎯 ARCHIVOS A MODIFICAR Y ESPECIFICACIÓN TÉCNICA DETALLADA

### Archivo 1: `packages/shared-types/src/dtos/quotation.dto.ts`
- **Cambio:** Flexibilizar `CreateQuotationRequestSchema` para que `clientId` sea opcional:
  ```typescript
  export const CreateQuotationRequestSchema = z.object({
    clientId: z.string().uuid('Client ID must be a valid UUID').optional(),
    items: z.array(CreateQuotationItemSchema).min(1, 'At least one item is required'),
    discountCode: z.string().optional(),
  });
  ```

### Archivo 2: `apps/api/src/application/quotations/create-quotation.use-case.ts`
- **Cambio:** Implementar resolución de cliente invitado idéntica a `ScheduleAppointmentUseCase`:
  ```typescript
  const resolvedClientId =
    dto.clientId && dto.clientId.length === 36 && dto.clientId !== '00000000-0000-0000-0000-000000000000'
      ? dto.clientId
      : SEED_IDS.CLIENT_LAURA;
  ```
- Asignar `resolvedClientId` al crear el agregado `Quotation.create({ ..., clientId: resolvedClientId })`.
- Resultado: Toda cotización de invitado se persiste con éxito en PostgreSQL y en el repositorio Drizzle con integridad referencial.

### Archivo 3: `apps/pwa-client/src/components/cotizador/useCotizadorState.ts`
- **Cambios:**
  1. En `handleProceedToSchedule`:
     - Enviar `clientId: user?.id || undefined` sin strings inválidos.
     - Al recibir respuesta exitosa (`res.success`), almacenar el ID en `persistedQuotationId` y en `localStorage.setItem('mitefree_last_quotation_id', res.data.id)`.
     - Redirigir a `/agenda?quotationId=${res.data.id}&total=${res.data.total}&deposit=${res.data.depositRequired}`.
  2. Implementar función de pre-guardado o generación de cotización formal (`handleSaveQuotation`):
     - Permite generar la cotización de inmediato al llegar al paso de resumen para que el usuario pueda descargar el PDF antes de decidir agendar.
  3. Vincular el enlace canónico de WhatsApp (`getWhatsAppDeepLink`) para incluir el código formal `#COT-${persistedQuotationId.slice(0, 8).toUpperCase()}`.

### Archivo 4: `apps/pwa-client/src/components/cotizador/QuoteSummaryStep.tsx`
- **Cambios:**
  1. Mostrar badge con el número formal de cotización cuando esté disponible (`#COT-XXXXXX`).
  2. Agregar botón de acción secundaria:
     - `"📄 Descargar Cotización en PDF"` (enlace a `apiClient.quotations.getPdfUrl(persistedQuotationId)` con target `_blank`).
  3. Asegurar que el botón de agendar conserve feedback visual (`Preparando Agenda...` / `Agendar Fecha y Hora en Línea`).

---

## 4. ⚠️ ANÁLISIS DE RIESGOS Y EFECTOS SECUNDARIOS

| Riesgo Posible | Severidad | Mitigación Técnica |
| :--- | :---: | :--- |
| Petición sin `clientId` rompe tests existentes de API | Baja | Los tests existentes ya envían un UUID válido; hacer el campo opcional es retrocompatible (100% no-breaking) |
| El cliente no tiene conexión a internet para generar PDF | Baja | Si la API no responde, se mantiene el fallback local a `localStorage` para no detener el flujo de agendamiento |
| Colisión de cotizaciones entre clientes invitados | Nula | Cada cotización genera un UUID criptográfico independiente (`randomUUID()`) como llave primaria |

---

## 5. 🛑 SOLICITUD FORMAL DE AUTORIZACIÓN (PROTOCOLO ALPHA)

Angel, este es el plan propuesto para implementar el **Punto 4 (Persistencia Formal de Cotizaciones de Clientes Invitados)** garantizando arquitectura limpia y trazabilidad total.

**¿Apruebas proceder con esta ejecución técnica?**
