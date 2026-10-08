# 📐 Planes Estratégicos de Implementación — MITEFREE

> **Organización:** [ALR COMPANY](https://github.com/ALR1730) — División de Ingeniería de Software  
> **Líder de Proyecto & Founder:** [Angel Luis Rosario](https://github.com/ALR1730)  
> **Mentor Académico:** Ing. Leonardo (Clean Architecture, DDD, .NET 9 / C#)  
> **Versión:** 3.0.0 — Edición "Turing-Grade"  
> **Fecha:** Octubre 2026

---

## 🧭 Resumen Comparativo de Opciones

| Plan       | Enfoque Principal                                     | Capas Afectadas                                    | Rol Líder                     | Retorno de Valor Inmediato                                                  |
| :--------- | :---------------------------------------------------- | :------------------------------------------------- | :---------------------------- | :-------------------------------------------------------------------------- |
| **PLAN A** | **Consolidación & Higiene de Código**                 | Todo el Monorepo (Git / Docs)                      | Principal Engineer & DevOps   | Cero deuda técnica, git history inmaculado, Master Plan al día.             |
| **PLAN B** | **Conexión E2E Frontend ↔ API (Fetch/React Query)**   | `apps/pwa-client`, `apps/admin-portal`, `apps/api` | Chief Architect & DX Champion | El sistema deja de usar mocks y se vuelve 100% interactivo en vivo.         |
| **PLAN C** | **Entorno de Datos Realistas (Seed Drizzle + Demo)**  | `packages/database`, `apps/api`                    | Principal Engineer & QA       | Base de datos poblada con cuadrillas, zonas de Santo Domingo y citas vivas. |
| **PLAN D** | **Motor de Notificaciones (WhatsApp Bridge + Email)** | `apps/api` (Infra), `shared-types`                 | Security Auditor & Principal  | Confirmaciones instantáneas, alertas de depósito y recordatorios de 24h.    |

---

## 🔵 PLAN A: Consolidación, Auditoría y Git Hygiene (El Enfoque "Boy Scout")

### 1. Propósito & Justificación

En este momento hay **62 archivos modificados sin commitear**. Aunque los 118 tests pasan y el type-check es perfecto, mantener un diff tan grande expone al equipo a pérdida accidental de contexto o regresiones no rastreables. Este plan busca "cerrar la caja fuerte" antes de agregar nuevas piezas.

### 2. Capas Afectadas

- `docs/`: Actualización formal del `MASTER_PLAN_ARQUITECTURA.md` (marcar Fases 2, 3, 4 y 5 como concluidas).
- `packages/domain-core` & `packages/shared-types`: Formateo e indexación final.
- `apps/pwa-client` & `apps/admin-portal`: Limpieza de temporales y estandarización.

### 3. Matriz de Ejecución Quirúrgica

1. **Auditoría de Diff**: Revisar que no haya `console.log` residuales, claves expuestas o `any` desatendidos.
2. **Formateo Global**: Ejecutar `bun run format` con Prettier para alinear tabulaciones y saltos de línea (CRLF/LF).
3. **Sincronización del Master Plan**:
   - Actualizar la tabla de estado general en [`docs/MASTER_PLAN_ARQUITECTURA.md`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/docs/MASTER_PLAN_ARQUITECTURA.md).
   - Documentar la resolución de los motores de Agenda, Pagos y Billetera.
4. **Commits Atómicos en Convención Conventional Commits**:
   - `feat(pwa): enhance multi-step quotation workflow, fabric matrix and UI assets`
   - `feat(admin): polish dispatch kanban board, payment reconciliation and settings`
   - `docs(master-plan): synchronize implementation progress across phases 2 to 5`
5. **Quality Gate Final**: Correr `bun run type-check && bun test`.

### 4. Definición de "Done" (Criterios de Aceptación)

- `git status` limpio en rama de trabajo.
- Historial de Git legible con commits atómicos de menos de 25 archivos cada uno.
- Documentación de arquitectura reflejando exactamente el código existente.

---

## 🟢 PLAN B: Conexión E2E de Frontends con API Core (El Enfoque "Full Stack Vivo")

### 1. Propósito & Justificación

Actualmente los frontends (`pwa-client` y `admin-portal`) tienen interfaces ricas pero utilizan datos locales o mocks simulados en algunos componentes. Este plan conecta ambos frontends con los endpoints REST de `apps/api` mediante un cliente HTTP fuertemente tipado.

### 2. Capas Afectadas

- `Delivery Layer` (`apps/pwa-client` y `apps/admin-portal`).
- `Presentation Layer` (`apps/api` — verificación de CORS, headers y serialización).
- `packages/shared-types` (Reutilización de DTOs en clientes web).

### 3. Matriz de Ejecución Quirúrgica

1. **Configuración de Variables de Entorno & CORS**:
   - Habilitar variables `NEXT_PUBLIC_API_URL` en ambos frontends.
   - Configurar middleware de CORS en `apps/api/src/main.ts` para permitir `localhost:3000` (PWA) y `localhost:3001` (Admin).
2. **Implementación del API Client Tipado**:
   - Crear un cliente HTTP ligero basado en `fetch` con tipado estricto que retorne `Result<T, ProblemDetails>`.
   - Manejo centralizado de errores RFC 7807 para mostrar toasts elegantes en la UI.
3. **Cableado PWA Client**:
   - Cotizador (`/cotizar`): Llamada real a `POST /api/v1/quotations/preview`.
   - Carga de fotos: Obtención de Presigned URL en `POST /api/v1/quotations/upload-photo-intent` y subida binaria.
   - Agenda (`/agenda`): Consulta en vivo de slots disponibles en `GET /api/v1/appointments/available-slots`.
4. **Cableado Admin Portal**:
   - Tablero Kanban (`/citas`): Consumo en tiempo real de citas por estado y reasignación mediante `POST /api/v1/appointments/:id/assign`.
   - Conciliación (`/pagos`): Aprobación/rechazo de pagos bancarios mediante `POST /api/v1/payments/:id/review`.
5. **Validación de Experiencia de Usuario**:
   - Probar con el subagente de navegador o navegación manual la creación de una cotización y verla aparecer instantáneamente en el Kanban del Admin Portal.

### 4. Definición de "Done" (Criterios de Aceptación)

- Una cotización creada en el PWA se persiste en la API y se refleja en el Admin Portal sin recargar manualmente la página.
- Respuestas de error del backend se renderizan con títulos descriptivos legibles para el usuario.

---

## 🟡 PLAN C: Semillero de Base de Datos & Demo Operativa (El Enfoque "Mundo Real")

### 1. Propósito & Justificación

Para validar el sistema visualmente y demostrarlo a clientes o inversionistas, se requiere que la base de datos contenga datos operacionales reales de la República Dominicana: zonas de Santo Domingo (Piantini, Naco, Bella Vista, Arroyo Hondo, Zona Oriental), cuadrillas técnicas con nombres y fotos reales, y citas en diversos estados del ciclo de vida.

### 2. Capas Afectadas

- `packages/database` (Script de Seeding con Drizzle ORM).
- `Infrastructure Layer` (`apps/api/src/infrastructure/database`).

### 3. Matriz de Ejecución Quirúrgica

1. **Diseño del Script de Seed (`packages/database/src/seed.ts`)**:
   - **Técnicos & Cuadrillas**: 3 cuadrillas asignadas a zonas estratégicas (`DN_POLIGONO`, `SDE`, `DN_CENTRO`).
   - **Clientes Reales**: Perfiles de clientes con billetera digital cargada de cashback previo y códigos de referidos generados.
   - **Catálogo de Servicios & Materiales**: Sofás de lino, terciopelo, colchones king size, tratamientos antiácaros.
   - **Citas en Pipeline**:
     - 2 citas en `PENDING_PAYMENT` (esperando anticipo del 30%).
     - 2 citas en `CONFIRMED` (bloqueando slots en agenda).
     - 1 cita en `EN_ROUTE` (con técnico desplazándose).
     - 3 citas en `COMPLETED` (con cashback acreditado en el ledger).
   - **Pagos por Conciliar**: 2 transferencias bancarias de Banco Popular y Banreservas con comprobante adjunto ficticio.
2. **Comando de Ejecución en `package.json`**:
   - Crear script `bun run db:seed` en root y en el paquete database.
3. **Auditoría de Invariantes**:
   - Verificar que ningún registro viole las llaves foráneas o las invariantes del dominio puro.

### 4. Definición de "Done" (Criterios de Aceptación)

- `bun run db:seed` ejecuta en < 3 segundos e inserta el conjunto completo de datos sin fallas de integridad referencial.
- Al iniciar `bun run dev`, tanto el PWA como el Admin Portal muestran métricas vivas, tarjetas en el Kanban y un historial creíble.

---

## 🟣 PLAN D: Motor de Notificaciones WhatsApp & Alertas Transaccionales (El Enfoque "Engagement")

### 1. Propósito & Justificación

En el negocio de servicios a domicilio en República Dominicana, WhatsApp es el canal crítico de conversión y retención. Cuando un cliente cotiza o agenda, una notificación instantánea reduce el abandono en un 40% y asegura el cobro del anticipo del 30%.

### 2. Capas Afectadas

- `Domain Core`: Eventos de Dominio (`QuotationCreatedEvent`, `AppointmentScheduledEvent`, `DepositReceivedEvent`).
- `Application Layer`: Handlers de eventos asíncronos.
- `Infrastructure Layer`: Adaptador `WhatsAppNotificationService` (Meta Cloud API / Twilio) y `EmailService` (Resend).

### 3. Matriz de Ejecución Quirúrgica

1. **Definición de Puerto en Dominio**:
   - Crear interfaz `INotificationService` en `packages/domain-core` o en la capa de aplicación.
2. **Plantillas de Mensajes**:
   - _Cotización Lista_: Enlace directo a la cotización con PDF adjunto y desglose del anticipo del 30%.
   - _Anticipo Aprobado_: Confirmación formal con fecha, bloque horario y nombre de la cuadrilla técnica asignada.
   - _Recordatorio 24 Horas_: Alerta automática al cliente un día antes de la visita con instrucciones previas.
3. **Adaptador de Infraestructura (`apps/api`)**:
   - Implementar adaptador con fallback a modo desarrollo (imprime mensaje enriquecido en logs estructurados con formato JSON de Serilog/Pino si no hay API key configurada).
4. **Pruebas de Integración**:
   - Suites de prueba unitarias con mocks para validar que los eventos de dominio disparan la notificación con los parámetros correctos.

### 4. Definición de "Done" (Criterios de Aceptación)

- Cada cambio de estado de una cita o pago dispara el evento correspondiente sin bloquear la transacción HTTP principal.
- Los logs en dev muestran la plantilla renderizada con datos dinámicos.

---

## 📊 Matriz de Decisión Recomendada

```
                        Impacto Operativo
                                ▲
                                │
               [PLAN B]         │         [PLAN C]
             Conexión E2E       │       Demo & Datos
           (Full Stack Vivo)    │        del Mundo Real
                                │
        ◄───────────────────────┼───────────────────────► Esfuerzo / Tiempo
                                │
               [PLAN A]         │         [PLAN D]
             Consolidación      │        Notificaciones
           & Git Hygiene        │           WhatsApp
                                │
                                ▼
```

### 💡 Recomendación del Equipo de Élite ALR:

1. **Paso 1 (Inmediato):** Ejecutar el **PLAN A** (Consolidación y commit limpio) para asegurar la base sólida de 62 archivos y dejar el repositorio blindado.
2. **Paso 2 (Núcleo del día):** Ejecutar el **PLAN B** o **PLAN C** para que puedas interactuar en el navegador con la plataforma viva.
