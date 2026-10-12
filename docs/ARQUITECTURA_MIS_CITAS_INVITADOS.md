# 📋 MITEFREE — Arquitectura Actual y Propuesta: Gestión de "Mis Citas" para Clientes Invitados (Sin Registro)

> **ALR COMPANY — División de Ingeniería de Software**  
> **Líder & Fundador:** Angel Luis Rosario  
> **Módulo:** `apps/pwa-client` — `/mis-citas` y `/agenda`  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** 🔍 Reporte de Arquitectura y Evaluación Estratégica  

---

## 1. ¿Cómo se está gestionando actualmente en el código?

En MITEFREE, el agendamiento es 100% libre de fricción (el cliente no está obligado a crear cuenta con contraseña antes de reservar). Actualmente, el flujo opera de la siguiente manera:

```
[ Cliente en /agenda ] ➔ Confirma cita ➔ Backend genera UUID
                                               ⬇️
                           Guarda en localStorage del navegador:
                           'mitefree_last_appointment_id' = UUID
                                               ⬇️
[ Cliente en /mis-citas ] ➔ Lee localStorage ➔ GET /api/v1/appointments/:id
                                               ⬇️
                           Muestra estado en vivo (Confirmada, En Ruta, etc.)
```

### Código Activo en `apps/pwa-client/src/app/mis-citas/page.tsx`:
```typescript
const lastId = typeof window !== 'undefined' 
  ? localStorage.getItem('mitefree_last_appointment_id') 
  : null;

if (lastId) {
  const res = await apiClient.appointments.getById(lastId);
  if (res.success && res.data) {
    setAppointment(res.data);
  }
}
```

---

## 2. Diagnóstico: Limitaciones del Modelo Actual

| Situación | Comportamiento Actual | Problema para el Cliente |
| :--- | :--- | :--- |
| **Mismo navegador tras agendar** | Carga la cita en vivo correctamente. | Ninguno (funciona bien en el mismo dispositivo). |
| **Cambio de dispositivo (PC a Celular)** | En el celular `localStorage` está vacío. | Muestra cita demo de ejemplo `#MF-2026-9812` en lugar de la suya. |
| **Múltiples citas del mismo cliente** | Guarda únicamente la última cita agendada. | Sobreescribe la cita anterior en el dispositivo. |
| **Navegación privada / Limpieza de caché** | Pierde el ID local de la cita. | El cliente no tiene forma de recuperarla en pantalla sin soporte. |

---

## 3. Propuesta de Arquitectura Profesional para Clientes Invitados

Para mantener la política de **cero fricción (sin obligar a crear contraseñas)** pero resolviendo el acceso multidispositivo, proponemos implementar una estrategia combinada en 3 capas:

### Capa 1: Deep Link con Token en WhatsApp (Acceso 1-Clic)
Cuando el cliente reserva o recibe el mensaje de WhatsApp, el enlace de seguimiento incluye el identificador de su cita:
```
https://mitefree.com/mis-citas?id=4f3b2a1c...
```
- Al hacer clic en WhatsApp desde cualquier teléfono o PC, `/mis-citas` detecta el parámetro `id` en la URL (`useSearchParams`), carga la cita en vivo inmediatamente y la indexa en el historial del dispositivo.

### Capa 2: Historial Local Multicita (`localStorage` acumulativo)
En lugar de guardar solo `mitefree_last_appointment_id` (1 sola variable), almacenar un listado estructurado:
```json
mitefree_my_appointments = ["uuid-1", "uuid-2"]
```
- Si el cliente agenda 3 servicios en el mes, `/mis-citas` le muestra pestañas o tarjetas con sus 3 servicios activos y su respectivo estado en vivo.

### Capa 3: Buscador de Citas por Teléfono de WhatsApp
Si el cliente entra a `/mis-citas` desde un equipo nuevo donde no tiene historial ni el enlace a mano:
- Mostrar una caja de consulta amigable:
  ```
  🔍 ¿Ya reservaste un servicio?
  Ingresa tu número de WhatsApp o Código de Cita para ver el estado de tu cuadrilla:
  [ +1 809-555-0199 ] ➔ [ Rastrear mi Servicio ]
  ```
- El backend busca las citas asociadas a ese `clientPhone` y las despliega en pantalla.

---

## 4. Próximos Pasos (A la espera de la orden de Angel)
Este documento queda registrado para análisis del Founder. Indícanos cuál de estas estrategias deseas que preparemos en el plan maestro para ejecutar.
