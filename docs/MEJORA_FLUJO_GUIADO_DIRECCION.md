# 🏢 MITEFREE — Mejora de UX: Flujo Guiado Progresivo (Ubicación ➔ Detalle de Residencia)

> **ALR COMPANY — División de Ingeniería de Software**  
> **Líder & Fundador:** Angel Luis Rosario  
> **Módulo:** `apps/pwa-client` — `LocationMapPicker.tsx`  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** 🔄 Implementado con opción de reversión documentada  

---

## 1. Justificación de la Experiencia de Usuario (Gentleman Programming)

En la versión inicial, el formulario presentaba dos campos simultáneos (Calle y Apartamento) debajo del mapa sin jerarquía.
Para seguir la metodología **guiada e intuitiva** solicitada por Angel Luis Rosario:
1. El usuario interactúa primero con el mapa (vía GPS satelital, toque en el mapa o selección de sector).
2. Tan pronto el punto geográfico queda fijado, la interfaz **transiciona y guía automáticamente** al usuario:
   - Desplaza la vista suavemente hacia el campo de detalle de residencia.
   - Coloca el cursor (`focus()`) en el campo:
     `<input placeholder="ej: Torre Bella Vista Center, Piso 5, Apto 5B" ... />`
   - Destaca el campo con una tarjeta visual guiada: *"✓ Punto fijado en el mapa. 👉 Ahora indica tu número, torre, piso o apartamento"*.

---

## 2. Puntos de Cambio en Código

- **Archivo modificado:** `apps/pwa-client/src/components/agenda/LocationMapPicker.tsx`
- **Hook añadido:** `useRef<HTMLInputElement>` (`apartmentInputRef`).
- **Función de transición:**
  ```typescript
  const focusApartmentInput = () => {
    setTimeout(() => {
      if (apartmentInputRef.current) {
        apartmentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        apartmentInputRef.current.focus();
      }
    }, 200);
  };
  ```
- **Disparadores de la guía**:
  - Al completar la detección GPS exitosa.
  - Al hacer clic o soltar el pin en el mapa interactivo.
  - Al hacer clic en un sector rápido (ej. Piantini, Bella Vista, etc.).

---

## 3. Procedimiento de Reversión (Rollback en caso de requerirse)

Si en cualquier momento se desea volver a la vista en cuadrícula estática simultánea anterior:
1. Reemplazar la sección guiada en `LocationMapPicker.tsx` por el bloque clásico de 2 columnas `grid grid-cols-1 sm:grid-cols-2`.
2. O ejecutar reversión git del commit correspondiente.
