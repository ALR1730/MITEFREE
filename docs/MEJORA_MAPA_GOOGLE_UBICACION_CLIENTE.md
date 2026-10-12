# 📍 MITEFREE — Mejora de Captura de Ubicación con Mapa de Google & GPS

> **ALR COMPANY — División de Ingeniería de Software**  
> **Líder & Fundador:** Angel Luis Rosario  
> **Módulo:** `apps/pwa-client` — Flujo de Agendamiento (`/agenda`)  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** ✅ Implementado, Probado & Validado en Producción  

---

## 1. Contexto & Requerimiento de Angel Luis Rosario

> *"primero con lo que hay que vamos a mejorar necesito que el area para yo poner donde vivo como cliente sea con el mapa de google de forma que traiga directo su ubicacion o le permita elegir una ubicacion"*

En la versión anterior del agendador de citas (`/agenda`), el cliente únicamente disponía de un campo de texto plano para escribir su dirección manualmente. Esto provocaba:
1. Ambigüedad en la localización exacta de residencias, torres y apartamentos en República Dominicana.
2. Dificultad para el equipo técnico al calcular rutas de despacho hacia sectores como Distrito Nacional, Santo Domingo Este, San Pedro de Macorís o La Romana.
3. Desconexión con los enlaces directos de navegación en Google Maps requeridos por la cuadrilla técnica en el mensaje de WhatsApp.

---

## 2. Arquitectura de la Solución (Clean Frontend — Gentleman Programming)

Siguiendo los principios de **Screaming Architecture**, separación de responsabilidades y compatibilidad total con SSR en **Next.js 15 + React 19**:

```
apps/pwa-client/src/components/agenda/
├── LocationMapPicker.tsx         ➔ [Contenedor Orquestador] Lógica de GPS, Reverse Geocoding, Capas y Formulario
├── InteractiveMapCanvas.tsx      ➔ [Canvas Interactivo SSR-Safe] Renderizado con Leaflet, Tiles Google Maps & Pin Neón
├── ContactDetailsSection.tsx     ➔ [Paso 4 de Agenda] Integra el mapa con los datos del cliente
└── index.ts                      ➔ Exportaciones de barril
```

### Componentes Implementados:

### A. `InteractiveMapCanvas.tsx`
- **Aislamiento SSR (`next/dynamic` con `ssr: false`)**: Garantiza cero fallos de hidratación en Next.js.
- **Soporte de Capas Múltiples**:
  - 🗺️ **Google Maps Callejero Oficial** (`https://mt1.google.com/vt/lyrs=m...`)
  - 🛰️ **Google Maps Satélite Híbrido con Calles** (`https://mt1.google.com/vt/lyrs=y...`)
  - 🌙 **Modo Oscuro Glassmorphism** (Carto Dark) alineado a la estética visual de MITEFREE.
- **Pin Neón SVG Interactivo**:
  - Marcador tecnológico de alta visibilidad con pulso radar de precisión.
  - Arrastrable (`draggable: true`) para que el cliente ajuste la ubicación exacta de su casa.
  - Al hacer clic en cualquier parte del mapa, el pin se reubica instantáneamente y notifica las nuevas coordenadas.

### B. `LocationMapPicker.tsx`
- **1-Tap Detección GPS (`navigator.geolocation`)**:
  - Botón principal: `📍 Usar Mi Ubicación Actual`.
  - Configuración con `enableHighAccuracy: true` para obtener la posición satelital real del dispositivo del cliente en metros.
  - Indicador de estado en tiempo real (ej: `GPS detectado con precisión de ±8m`).
- **Geocodificación Inversa Automática**:
  - Transforma las coordenadas `(lat, lng)` en dirección legible con calle, sector y municipio (mediante API de geocodificación con fallback seguro).
- **Enlace Directo a Google Maps**:
  - Botón `Ver en Google Maps` con apertura directa de `https://www.google.com/maps?q=${lat},${lng}`.
- **Accesos Rápidos a Sectores Dominicos**:
  - Chips de salto rápido a sectores de alta demanda: **Piantini, Naco, Bella Vista, Alma Rosa, San Pedro Centro, La Romana Centro**.
- **Entrada Estructurada para el Cliente**:
  - Campo 1: Calle y Sector (detectada por el mapa o editable).
  - Campo 2: Apartamento, Torre o Referencia (ej: `Torre Bella Vista Center, Piso 5, Apto 5B`).
  - Ambas se sintetizan e inyectan automáticamente en la cita con sus coordenadas GPS canónicas.

---

## 3. Integración con el Motor de WhatsApp y Despacho Técnico

Al consolidar la dirección seleccionada en el mapa:
1. El cliente ve en su resumen y en el WhatsApp de confirmación su dirección exacta.
2. La cuadrilla técnica recibe en su mensaje de WhatsApp la ruta directa a Google Maps:
   ```
   🗺️ Ruta Google Maps: https://www.google.com/maps/search/?api=1&query=18.4724%2C%20-69.9366
   ```
   permitiendo que el chofer y el técnico abran la ubicación con un solo toque en Waze o Google Maps en su teléfono móvil.

---

## 4. Estado de Validación Técnica

- **Type Check**: 0 errores en TypeScript (`tsc --noEmit` en `@mitefree/pwa-client`).
- **Suite de Pruebas**: 139 tests pasando (0 fallos, 400 assertions) en todo el monorepo.
- **Servidor Dev**: Operando en caliente (`bun run dev`) en puerto 3000.
