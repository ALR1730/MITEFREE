# 🛰️ Diagnóstico de Seguridad: Geolocalización GPS en Red Local y Producción (HTTPS vs HTTP)

> **ALR COMPANY — División de Ingeniería de Software**  
> **Líder & Fundador:** Angel Luis Rosario  
> **Proyecto:** MITEFREE — Plataforma Enterprise  
> **Módulo:** `apps/pwa-client` — Selector de Ubicación con Google Maps & GPS  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** 📋 Documentado para evaluación previa (Código intacto por instrucción del Founder)  

---

## 1. Resumen Ejecutivo del Problema

Durante las pruebas de aceptación técnica del selector de mapas:
- ✅ **En `http://localhost:3000`**: El GPS funciona con total precisión, detecta satélites, centra el mapa y traduce la dirección automáticamente.
- ❌ **En `http://10.0.0.176:3000` (IP de red local o en línea sin SSL)**: El navegador rechaza el acceso de inmediato con el error `PERMISSION_DENIED` sin mostrar la ventana de autorización.

---

## 2. Fundamento Técnico de Seguridad (Estándar W3C & Chromium)

La API de Geolocalización (`navigator.geolocation`) está clasificada por el consorcio **W3C** y los motores de navegación modernos (Chromium, WebKit, Gecko) como una **Función de Alta Sensibilidad (Powerful Feature)** que compromete la privacidad física del usuario.

Por diseño inviolable del navegador:
1. **Regla de Contexto Seguro (`window.isSecureContext`)**:
   - La API **solo está habilitada** en conexiones cifradas con certificado SSL (**`https://`**).
2. **Excepción de Desarrollo**:
   - La única excepción sin cifrado que permiten los navegadores es el nombre de host canónico **`localhost`** o **`127.0.0.1`**.
3. **Bloqueo de IPs de Red Local**:
   - Cualquier dirección IP como `http://10.0.0.176:3000` o `http://192.168.x.x:3000` es categorizada por el motor del navegador como **Insecure Context** (`isSecureContext === false`).
   - El navegador bloquea la llamada al hardware GPS **antes de que el código JavaScript pueda si quiera ejecutarse**, para evitar que atacantes en la misma red Wi-Fi puedan interceptar la posición geográfica en texto plano.

---

## 3. Guía Operativa para Pruebas en Dispositivos Móviles

Para probar el GPS en teléfonos o tablets conectados a la misma red antes de pasar a producción con dominio definitivo, existen dos métodos inmediatos:

### Método A: Túnel HTTPS Temporal (Recomendado — 1 minuto)
Levanta un puente con certificado SSL válido hacia tu puerto 3000 sin modificar nada en tu PC:
```powershell
npx localtunnel --port 3000
```
- Esto genera un enlace seguro con candado HTTPS oficial (ej: `https://mitefree-beta.loca.lt`).
- Al abrirlo en el celular, el navegador reconoce el contexto seguro (`https`), solicita los permisos de ubicación y ubica la residencia con precisión milimétrica.

### Método B: Autorizar la IP en Google Chrome Móvil (Sin instalar paquetes)
Si se desea probar directamente en `http://10.0.0.176:3000` desde Google Chrome en el teléfono:
1. Abrir Chrome en el celular y escribir en la barra de direcciones:
   ```
   chrome://flags/#unsafely-treat-insecure-origin-as-secure
   ```
2. Marcar la opción como **Enabled**.
3. En el campo de texto que aparece, escribir exactamente:
   ```
   http://10.0.0.176:3000
   ```
4. Pulsar el botón **Relaunch** para reiniciar el navegador.
5. Al abrir la app, Chrome tratará esa IP como si fuera `localhost` y activará el GPS.

---

## 4. Plan de Mejoras Técnicas Propuestas (En Espera de Aprobación)

Cuando Angel autorice la ejecución, se implementarán los siguientes blindajes defensivos en el código:

### A. Validación Defensiva de Contexto Seguro (`LocationMapPicker.tsx`)
```typescript
// Si no estamos en HTTPS y no es localhost, alertar pedagógicamente al usuario
if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
  setGeoStatus('⚠️ El sensor GPS requiere conexión HTTPS en dispositivos móviles. Puedes tocar libremente en el mapa para marcar tu casa.');
  return;
}
```

### B. Declaración de Políticas de Permisos (`next.config.ts`)
Agregar en las cabeceras HTTP de respuesta:
```typescript
{
  key: 'Permissions-Policy',
  value: 'geolocation=(self)'
}
```
Esto certifica ante el navegador que la aplicación tiene autorización formal para coordinar con los sensores de ubicación.

### C. Fallback Automático por IP
Si el usuario rechaza los permisos o el dispositivo no cuenta con hardware satelital, consultar un endpoint de geolocalización por IP de República Dominicana para posicionar el mapa de forma referencial en Santo Domingo o en la zona seleccionada, evitando que el usuario deba buscar su sector manualmente.

---

## 5. Estado Actual del Repositorio
- **Código en producción/desarrollo**: Intacto y sin modificaciones ad-hoc.
- **Servidor**: Corriendo en vivo (`bun run dev`).
- **Plan**: Registrado formalmente para revisión de Angel Luis Rosario.
