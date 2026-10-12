# 📐 Plan de Ingeniería ALPHA: Mis Citas para Invitados (Punto 1) & Navegación Admin Portal (Punto 3)

> **ALR COMPANY — División de Ingeniería de Software**  
> **Líder & Fundador:** Angel Luis Rosario  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** ✅ **EJECUTADO Y CERTIFICADO (143 Tests Pasados · 100% Type-Safe)**  

---

## 1. Alcance y Objetivos de la Intervención

A partir de los hallazgos de la auditoría en caliente de 35 minutos, se ejecutó y certificó con éxito la implementación conjunta de:
- **Punto 1 (PWA Client & API)**: Gestión integral y sin fricción de **"Mis Citas"** para clientes que agendan como invitados (sin registro obligatorio).
- **Punto 3 (Admin Portal)**: Certificación de navegación, redirecciones canónicas (`/rutas` ➔ `/tecnicos`, `/catalogo` ➔ `/configuracion`) y coherencia de enlaces interactivos en el dashboard.

*(Los puntos 2 — Cupos agotados en agenda — y 4 — Persistencia de cotizaciones — quedan listos para abordarse individualmente a continuación).*

---

## 2. Detalle de Arquitectura por Capas (Clean Architecture)

```
[ Capa Delivery / UI ]
  ├── apps/pwa-client/src/app/mis-citas/page.tsx       ➔ Deep link (?id=...), multicita y buscador reactivo
  ├── apps/pwa-client/src/components/agenda/           ➔ BookingSuccessView.tsx con link en WhatsApp
  └── apps/admin-portal/                               ➔ next.config.ts (redirects) y page.tsx (KPI links)

[ Capa Delivery / WebAPI ]
  └── apps/api/src/presentation/controllers/           ➔ GET /api/v1/appointments/lookup

[ Capa Application ]
  └── apps/api/src/application/appointments/           ➔ LookupAppointmentsUseCase

[ Capa Infrastructure / Persistencia ]
  └── apps/api/src/infrastructure/repositories/        ➔ Búsqueda por teléfono dominicano y código sanitizado
```

---

## 3. Resumen de Implementación Técnica Ejecutada

### A. Punto 1: Mis Citas para Clientes Invitados (PWA & Backend)
1. **Caso de Uso Limpio (`LookupAppointmentsUseCase`)**:
   - `apps/api/src/application/appointments/lookup-appointments.use-case.ts`:
   - Normalización de teléfonos dominicanos (`809`, `829`, `849`, prefijos internacionales `+1`).
   - Búsqueda por código de cita (admite `#MF-XXXX` o fragmentos UUID).
   - Sanitización y validaciones de seguridad con fallback a RFC 7807.
2. **Endpoint Seguro en NestJS**:
   - `apps/api/src/presentation/controllers/appointments.controller.ts`:
   - `GET /api/v1/appointments/lookup` registrado con anterioridad a `@Get(':id')` para evitar colisiones de rutas dinámicas.
3. **Consumo en Cliente PWA (`api-client.ts`)**:
   - `apps/pwa-client/src/lib/api-client.ts`: Método `lookup({ phone, code })` integrado.
4. **Deep Linking en Confirmación de Cita (`BookingSuccessView.tsx`)**:
   - Mensaje de WhatsApp incluye: `🔗 Rastrear en Vivo: https://mitefree.com/mis-citas?id=${bookedAppointmentId}`
   - Botón directo *"Ver en Mis Citas (Live Tracking)"* apunta a `/mis-citas?id=${bookedAppointmentId}`.
5. **Experiencia Multicita y Buscador (`mis-citas/page.tsx`)**:
   - Envuelto en `<Suspense>` según Next.js 15 standards.
   - Persistencia local en `localStorage` con la clave `mitefree_guest_appointments: string[]`.
   - Pestañas superiores para clientes recurrentes que manejan múltiples órdenes concurrentes.
   - Buscador rápido con validación de longitud para rastreo desde cualquier terminal.

---

### B. Punto 3: Navegación y Redirecciones en Admin Portal
1. **Redirecciones Canónicas en `apps/admin-portal/next.config.ts`**:
   - `/rutas` ➔ Redirección permanente (`308 Permanent Redirect`) a `/tecnicos`.
   - `/catalogo` ➔ Redirección permanente (`308 Permanent Redirect`) a `/configuracion`.
2. **Interactividad de KPIs y Enlaces Rápidos en `apps/admin-portal/src/app/page.tsx`**:
   - Tarjetas de métricas envueltas en componentes `<Link>` canónicos:
     - Ingresos Facturados ➔ `/pagos`
     - Citas Hoy ➔ `/citas`
     - Conversión de Cotizador ➔ `/citas`
     - Cashback Acreditado ➔ `/clientes`
   - Enlace directo a *"Cuadrillas"* desde el panel de Despacho Territorial.
   - Enlace directo a *"Ver Tablero Kanban"* desde la cabecera de la tabla de órdenes recientes.

---

## 4. Matriz de Archivos Modificados y Creados

| Archivo | Capa / Módulo | Propósito |
| :--- | :--- | :--- |
| `apps/api/src/application/appointments/lookup-appointments.use-case.ts` | Backend (Application) | Caso de uso de consulta y sanitización telefónica/código. |
| `apps/api/src/modules/appointments.module.ts` | Backend (IoC Container) | Registro del caso de uso en el contenedor NestJS. |
| `apps/api/src/presentation/controllers/appointments.controller.ts` | Backend (Delivery) | Exposición del endpoint `GET /lookup`. |
| `apps/api/test/appointments.use-case.spec.ts` | Backend (QA & TDD) | Suite de pruebas unitarias para el caso de uso lookup. |
| `apps/pwa-client/src/lib/api-client.ts` | PWA (Infrastructure) | Conexión HTTP para lookup de citas. |
| `apps/pwa-client/src/components/agenda/BookingSuccessView.tsx` | PWA (UI) | Deep link en WhatsApp y botón de tracking directo. |
| `apps/pwa-client/src/app/mis-citas/page.tsx` | PWA (UI) | Pantalla interactiva con Suspense, multicita y buscador. |
| `apps/admin-portal/next.config.ts` | Admin (Config) | Redirecciones canónicas permanentes `/rutas` y `/catalogo`. |
| `apps/admin-portal/src/app/page.tsx` | Admin (UI) | Enlaces canónicos en KPIs, despacho y tabla de órdenes. |

---

## 5. Certificación de Calidad y Pruebas (Protocolo ZETA)

### Pruebas Automatizadas Monorepo (`bun test`):
- **143 tests ejecutados**: **143 pasados, 0 fallados** (410 aserciones).
- Se validaron los casos de borde para teléfonos dominicanos (`+1 809-555-0188`, `809-555-0188`), búsqueda con `#` en código, teléfono corto (< 7 dígitos) y payload vacío.

### Verificación de Tipos Estricta (`tsc --noEmit`):
- `apps/api`: **0 errores** (Exit code 0).
- `apps/pwa-client`: **0 errores** (Exit code 0).
- `apps/admin-portal`: **0 errores** (Exit code 0).

---

## 6. Próximos Pasos (Siguientes Fases)

Con los Puntos 1 y 3 debidamente completados y certificados, quedan pendientes para ejecución individual:
1. **Punto 2**: Mensaje amigable y sugerencia inteligente de fechas alternativas cuando los cupos del día seleccionado estén agotados.
2. **Punto 4**: Persistencia y recuperación de cotizaciones no culminadas en PWA Client mediante `localStorage` para prevenir pérdida de selecciones al refrescar la página.
