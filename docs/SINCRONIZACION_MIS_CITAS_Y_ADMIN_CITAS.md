# ⚡ Reporte de Ingeniería: Sincronización en Tiempo Real entre Admin Kanban y Mis Citas

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder & Fundador:** Angel Luis Rosario  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** ✅ **IMPLEMENTADO, CERTIFICADO Y SINCRONIZADO EN VIVO**  

---

## 1. Diagnóstico de la Desconexión Detectada

Al auditar la interacción entre **[http://localhost:3001/citas](http://localhost:3001/citas)** (Admin Kanban) y **[http://localhost:3000/mis-citas](http://localhost:3000/mis-citas)** (PWA Telemetría de Cliente), se identificaron tres causas raíces:

1. **Bug en `ZodValidationPipe` de NestJS (`apps/api`)**:
   - Al aplicar `@UsePipes(new ZodValidationPipe(TransitionAppointmentStatusSchema))` a nivel de método en `PATCH :id/status`, NestJS ejecutaba el pipe sobre `@Param('id')`. El validador fallaba con `HTTP 400 Validation Error: Expected object, received string`. Las transiciones de estado desde el Kanban eran rechazadas por el backend.
2. **Citas Sembradas con Campos Nulos en Base de Datos**:
   - Las citas sembradas en `SEED_DATA.appointments` no contenían `clientName`, `clientPhone`, `address`, `serviceDescription` ni `totalAmount`. Al cargarse en memoria, aparecían vacías o requerían fallbacks genéricos.
3. **Falta de Sondeo Reactivo y Desacoplamiento de Cuadrillas**:
   - En `apps/admin-portal/src/app/citas/page.tsx`, `assignTech` enviaba un UUID falso (`b0000000...`) en lugar del ID real del técnico.
   - En `apps/pwa-client/src/app/mis-citas/page.tsx`, la vista era estática tras el primer render: si el administrador cambiaba el estado o asignaba un técnico, el cliente nunca se enteraba sin un refresco completo manual del navegador.

---

## 2. Soluciones de Arquitectura Aplicadas (Clean Architecture)

### A. Corrección del Validador Zod (`ZodValidationPipe.ts`)
Se incorporó el soporte para `ArgumentMetadata` de NestJS:
```ts
transform(value: unknown, metadata?: ArgumentMetadata) {
  // Ignora parámetros de ruta o query si el schema valida el body
  if (metadata && metadata.type !== 'body' && metadata.type !== 'custom') {
    return value;
  }
  return this.schema.parse(value);
}
```
Con esto, `@Param('id')` pasa sin obstrucción y `@Body()` es validado estrictamente.

### B. Poblamiento Enriquecido de Citas Canónicas
Se dotó al repositorio y al seeder de datos completos y reales de la República Dominicana:
- **Cita Founder Angel Luis Rosario** (`#A8715231`): Teléfono `829-207-4079`, Sector Villa Municipal SPM, Cuadrilla Ing. Kelvin Rosario (`#01`).
- **Cita Laura Mercedes** (`#70000001`): Teléfono `809-555-0123`, Consuelo SPM, Cuadrilla Ing. Kelvin Rosario (`#01`).
- **Cita Carlos Méndez** (`#70000002`): Teléfono `809-555-0188`, Alma Rosa SDE, Cuadrilla Marcos Santana (`#02`).
- **Cita Dra. Patricia Gómez** (`#70000003`): Teléfono `809-555-0944`, Villa Hermosa LR, Cuadrilla Carlos Santana (`#03`).

### C. Resolución de Nombres de Cuadrillas (`technician-name.helper.ts`)
Tanto en `GetAppointmentUseCase`, `ListAppointmentsUseCase`, `AssignTechnicianUseCase`, `TransitionAppointmentStatusUseCase` y `LookupAppointmentsUseCase`, se inyecta el nombre canónico y legible de la cuadrilla técnica en el DTO devuelto (`technicianName`).

### D. Sincronización Reactiva en PWA Client (`mis-citas/page.tsx`)
- **Polling reactivo cada 4 segundos**: Consulta la API en segundo plano; si el admin en `localhost:3001` mueve la cita a `En Ruta`, `En Servicio` o `Completada`, la PWA en `localhost:3000` actualiza el Stepper, el badge y el estado en vivo instantáneamente.
- **Botón manual `🔄 Actualizar Telemetría`** con microanimación `animate-spin`.
- **Perfil de cuadrilla enriquecido**: Muestra el nombre real del técnico, sus iniciales (`KR`, `MS`, `DT`, `JP`), badge de estado en camino y botón directo para WhatsApp.
- **Chips de acceso rápido de prueba**: En el estado vacío, botones para consultar con 1 clic las citas activas de Angel o Laura.

---

## 3. Matriz de Pruebas de Integración Ejecutadas

| Prueba | Resultado |
| :--- | :---: |
| `PATCH /appointments/:id/status` (PendingPayment ➔ Confirmed) | ✅ HTTP 200 |
| `PATCH /appointments/:id/status` (Confirmed ➔ EnRoute) | ✅ HTTP 200 |
| `PATCH /appointments/:id/assign` (Asignación Kelvin Rosario) | ✅ HTTP 200 |
| `GET /appointments/lookup?phone=829-207-4079` | ✅ HTTP 200 (1 cita encontrada) |
| `GET /appointments/lookup?phone=809-555-0123` | ✅ HTTP 200 (1 cita encontrada) |
| Suite Vitest Monorepo (`bun test`) | ✅ **143 / 143 Pasados** |
| Type-Check Monorepo (`apps/api`, `apps/pwa-client`, `apps/admin-portal`) | ✅ **0 Errores** |

---

## 4. Instrucciones para Prueba en Caliente

1. Abre en una pestaña: **[http://localhost:3001/citas](http://localhost:3001/citas)** (Admin Kanban).
2. Abre en otra pestaña: **[http://localhost:3000/mis-citas](http://localhost:3000/mis-citas)** (PWA Cliente).
3. En la PWA, verás cargada la cita de **Angel Luis Rosario** (o puedes buscar `829-207-4079`).
4. En el Admin Kanban, haz clic en **"Iniciar →"** (para pasarla a *Servicio en Proceso*) o cámbiale la cuadrilla técnica.
5. Observa cómo en la pestaña de **Mis Citas**, en menos de 4 segundos, el estado, el Stepper y la información técnica cambian automáticamente sin refrescar la página.
