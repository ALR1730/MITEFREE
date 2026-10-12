# 📋 PROTOCOLO ALPHA — PLAN DE INGENIERÍA: PUNTO 2 (Cupos Agotados y Sugerencia de Fechas en /agenda)

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder & Fundador:** Angel Luis Rosario  
> **Proyecto:** MITEFREE  
> **Estado:** 🛑 **PENDIENTE DE CONFIRMACIÓN EXPLÍCITA DE ANGEL LUIS ROSARIO**  
> **Cumplimiento Normativo:** Constitución de Ingeniería v4.0 · Protocolo ALPHA · Protocolo ZETA  

---

## 1. 🔍 DIAGNÓSTICO DE CAUSA RAÍZ Y ESTADO ACTUAL

En la auditoría exhaustiva en caliente de 35 minutos y revisión de código en `apps/pwa-client`, se detectaron las siguientes vulnerabilidades de experiencia de usuario y validación:

1. **Botones de Franja Horaria no respetan `available: boolean` (`TimeSlotSection.tsx`):**
   - La propiedad `dynamicSlots` recibe `available: boolean` desde el endpoint `GET /api/v1/appointments/slots`, pero el componente `<button>` no tiene el atributo `disabled={!slot.available}` ni estilos condicionales de bloqueo.
   - Un cliente puede hacer clic en un turno con capacidad agotada (ej: `Morning` con 2 cuadrillas ya ocupadas), activando `onSelectSlot(slot.id)` sin restricción visual.
2. **Ausencia de Badge Informativo "Cupo Lleno":**
   - Actualmente, todos los turnos muestran la tarifa horaria o descuento sin advertir al cliente que el turno está saturado.
3. **Falta de Auto-Selección Segura y Manejo de Día Completo Agotado (`agenda/page.tsx`):**
   - Si la selección por defecto apunta a un turno saturado, no conmuta automáticamente al primer turno disponible.
   - Si todos los turnos del día están ocupados (`dynamicSlots.every(s => !s.available)`), no se muestra un banner de recomendación que sugiera saltar con un solo clic al siguiente día disponible (`availableDates`).
4. **Validación de Envío en Formulario (`BookingConfirmSection.tsx` & `handleConfirm`):**
   - Si un usuario tiene seleccionado un turno no disponible, el botón de confirmación no se bloquea y permite enviar la solicitud, requiriendo un rechazo tardío del backend.

---

## 2. 🏛️ DELIMITACIÓN DE CAPAS Y ROLES DE INGENIERÍA

- **Capa del Sistema:** `Delivery / Presentation Layer` (`apps/pwa-client`).
- **Roles Responsables:**
  - **Rol 6 — DX Champion & Gentleman Programming:** Diseño de interfaces intuitivas, micro-interacciones, badges claros de *"Cupo Lleno"*, prevención de errores del usuario y sugerencia amigable de fechas alternativas.
  - **Rol 2 — Principal Engineer (Héctor de León & Ing. Leonardo):** Blindaje del estado del componente, reactividad limpia, inmutabilidad y validación de seguridad previa al dispatch de la mutación.
  - **Rol 3 — QA & TDD Enforcer:** Validación de tipos (`tsc --noEmit`), preservación de los 143 tests del monorepo y cobertura de edge cases (día completamente lleno vs. slots parcialmente llenos).
  - **Rol 4 — Security Auditor:** Validación en dos niveles (cliente y servidor) para evitar que solicitudes con turnos agotados alcancen la base de datos.

---

## 3. 🎯 ARCHIVOS A MODIFICAR Y ESPECIFICACIÓN TÉCNICA DETALLADA

### Archivo 1: `apps/pwa-client/src/components/agenda/TimeSlotSection.tsx`
- **Responsabilidad:** Renderizado de la lista de turnos y alerta de día saturado.
- **Cambios precisos:**
  1. Agregar soporte a `disabled={!slot.available}` en cada botón de franja horaria.
  2. Aplicar estilos Tailwind de deshabilitación:
     - `opacity-45 cursor-not-allowed border-rose-500/20 bg-dark-surface/30 grayscale hover:bg-dark-surface/30 shadow-none`
  3. Badge condicional:
     - Si `!slot.available`: renderizar `<span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">🚫 Cupo Lleno (Sin cuadrilla)</span>`.
     - Si `slot.available`: conservar el badge de descuento dinámico o tarifa estándar.
  4. Banner de Día Completo Saturado:
     - Si `allSlotsFull` (`dynamicSlots.length > 0 && dynamicSlots.every(s => !s.available)`):
       - Mostrar tarjeta de recomendación destacada:
         - Icono `AlertTriangle` o `Calendar`.
         - Mensaje: *"Todos los turnos de este día están 100% reservados por nuestras cuadrillas."*
         - Botón de acción rápido: *"Ver disponibilidad para el siguiente día ➔"*, que invoca el callback `onSelectNextDay()`.
  5. Extender la interfaz `TimeSlotSectionProps` con:
     - `onSelectNextDay?: () => void;`
     - `hasNextAvailableDay?: boolean;`
     - `nextDayLabel?: string;`

### Archivo 2: `apps/pwa-client/src/app/agenda/page.tsx`
- **Responsabilidad:** Orquestador de estado de la página de agendamiento.
- **Cambios precisos:**
  1. **Auto-selección de turno disponible:**
     - En `useEffect` al resolver `apiClient.appointments.getSlots(...)`:
       - Si el `selectedSlot` actual no está disponible (`!mappedSlots.find(s => s.id === selectedSlot)?.available`), seleccionar automáticamente el primer turno disponible (`firstAvailableSlot.id`).
  2. **Bloqueo en `handleSelectSlot`:**
     - Comprobar que el slot seleccionado esté disponible antes de actualizar el estado y avanzar el scroll:
       ```ts
       const target = dynamicSlots.find(s => s.id === slotId);
       if (!target || !target.available) return;
       ```
  3. **Función de salto al siguiente día disponible (`handleSelectNextDay`):**
     - Buscar el siguiente índice en `availableDates` y cambiar `selectedDayOffset`.
  4. **Validación defensiva en `handleConfirm`:**
     - Validar `if (!currentSlotObj.available)` antes del payload; si no está disponible, emitir mensaje amigable y detener la ejecución.

### Archivo 3: `apps/pwa-client/src/components/agenda/BookingConfirmSection.tsx`
- **Responsabilidad:** Resumen final y botón de acción principal.
- **Cambios precisos:**
  1. Recibir prop `isSlotAvailable?: boolean` (default `true`).
  2. Si `!isSlotAvailable`:
     - Deshabilitar el botón de confirmación (`disabled={isSubmitting || !isSlotAvailable}`).
     - Mostrar aviso en ámbar/rojo: *"El turno seleccionado está lleno. Por favor selecciona otro turno para confirmar."*

---

## 4. ⚠️ ANÁLISIS DE RIESGOS Y EFECTOS SECUNDARIOS

| Riesgo Posible | Severidad | Mitigación Técnica |
| :--- | :---: | :--- |
| El usuario queda atrapado en un día sin turnos | Media | Banner con botón instantáneo *"Ver disponibilidad para [Siguiente Día] ➔"* |
| La API no devuelve slots (error de red) | Baja | Mantiene fallback seguro a `TIME_SLOTS` con `available: true` para no bloquear al usuario offline |
| Regresión en el cálculo de descuentos horarios | Nula | La lógica de `discountPolicy.slots` se preserva intacta para slots disponibles |
| Regresión en tests del monorepo | Nula | Los motores de dominio no se tocan; se valida con `bun test` y `tsc --noEmit` |

---

## 5. 🛑 SOLICITUD FORMAL DE AUTORIZACIÓN (PROTOCOLO ALPHA)

Angel, este es el plan propuesto para implementar el **Punto 2 (Cupos Agotados y Sugerencia de Fechas en /agenda)** con los más altos estándares de ALR COMPANY.

**¿Apruebas proceder con esta ejecución técnica?**
