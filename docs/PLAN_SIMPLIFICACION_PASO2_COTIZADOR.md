# 📋 PROTOCOLO ALPHA — PLAN DE INGENIERÍA: Simplificación de Paso 2 en Cotizador (Solo Fotos Opcionales)

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder & Fundador:** Angel Luis Rosario  
> **Proyecto:** MITEFREE  
> **Estado:** 🛑 **PENDIENTE DE CONFIRMACIÓN EXPLÍCITA DE ANGEL LUIS ROSARIO**  
> **Cumplimiento Normativo:** Constitución de Ingeniería v4.0 · Protocolo ALPHA · Protocolo BETA · Protocolo ZETA  
> **Documento de Archivo:** [`docs/REPORTE_ARQUITECTURA_TELAS_Y_MANCHAS_ARCHIVADO.md`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/docs/REPORTE_ARQUITECTURA_TELAS_Y_MANCHAS_ARCHIVADO.md)  

---

## 1. 🔍 DIAGNÓSTICO Y JUSTIFICACIÓN DE NEGOCIO

En el cotizador inteligente ([`/cotizar`](http://localhost:3000/cotizar)), el **Paso 2** exigía al cliente seleccionar:
1. **Tipo de Tapicería:** 6 opciones técnicas (Sintética, Microfibra, Lino, Terciopelo, Cuero, Seda) con multiplicadores del 1.0 al 1.8.
2. **Nivel de Manchas:** 3 niveles (Normal, Moderada, Crítica) con recargos de RD$ 850 a RD$ 2,000.

### Criterio de Angel Luis Rosario (Founder):
> *"Es normal que los clientes no sepan nada de eso. Vamos a quitar los divs y las lógicas de telas y manchas y solo dejar fotos de tus muebles como opcional."*

La selección técnica obligatoria de telas genera fricción cognitiva y dudas en el cliente promedio dominicano, provocando abandono en el embudo de cotización. En el modelo de servicio real, los técnicos de MITEFREE realizan la inspección de la fibra y aplican los desmanchadores enzimáticos correspondientes directamente en el domicilio.

---

## 2. 🏛️ DELIMITACIÓN DE CAPAS Y ROLES

- **Capa:** `Delivery / Presentation Layer` (`apps/pwa-client/src/components/cotizador`).
- **Roles Responsables:**
  - **Rol 6 — DX Champion (Alan Buscaglia / Gentleman Programming):** Simplificación radical del flujo de usuario (de 3 sub-secciones complejas a 1 tarjeta limpia de fotos opcionales).
  - **Rol 2 — Principal Engineer (Héctor de León):** Preservar la integridad de los contratos DTO del backend usando los valores canónicos estándar por defecto (`FabricType.SYNTHETIC` y `StainSeverity.LIGHT`) sin alterar los cálculos de la base de datos.
  - **Rol 3 — QA & TDD Enforcer:** Garantizar que los 144 tests unitarios del monorepo sigan pasando al 100% y que no existan errores de compilación TypeScript.

---

## 3. 🎯 ARCHIVOS A MODIFICAR Y ESPECIFICACIÓN TÉCNICA DETALLADA

### Archivo 1: `apps/pwa-client/src/components/cotizador/FabricAndStainsStep.tsx`
- **Cambios precisos:**
  1. Eliminar los divs `#fabric-section` y `#stains-section` junto con los conectores intermedios de flechas.
  2. Rediseñar el componente para enfocarse exclusivamente en:
     - **"Fotos de tus Muebles (Opcional)"**: Tarjeta limpia con selector de archivos, drag & drop / preview de imágenes subidas.
     - **Mensaje de tranquilidad al cliente**: *"No te preocupes por el tipo de tela o manchas; nuestros especialistas llevarán todo el equipo industrial y químicos certificados para inspeccionar y tratar tus piezas en tu domicilio."*
  3. Caja de resumen de precio sin recargos de tela o manchas: Muestra el precio base exacto de los muebles seleccionados.
  4. Botones de acción: `"Atrás"` y `"Ver Resumen y Cotización"`.

### Archivo 2: `apps/pwa-client/src/components/cotizador/CotizadorHeader.tsx`
- **Cambios precisos:**
  1. Actualizar la etiqueta del paso 2 en el Stepper Wizard:
     - De: `'2. Tela & Manchas'`
     - A: `'2. Fotos (Opcional)'`

### Archivo 3: `apps/pwa-client/src/components/cotizador/useCotizadorState.ts`
- **Cambios precisos:**
  1. Mantener `selectedFabric` fijo en la tela estándar (`SYNTHETIC`, multiplicador 1.0).
  2. Mantener `selectedStain` fijo en la mancha estándar (`LIGHT`, recargo RD$ 0).
  3. `subtotalWithFabric` equivale directamente a `activeSubtotal` (precio transparente sin multiplicadores forzados).
  4. La subida y previsualización de fotos permanece intacta.

### Archivo 4: `apps/pwa-client/src/components/cotizador/QuoteSummaryStep.tsx`
- **Cambios precisos:**
  1. En lugar de la cuadrícula técnica de telas y manchas, mostrar la nota de servicio:
     - *"Servicio Todo Incluido: Inspección de tejido, desmanchado profundo, inyección-extracción y desinfección UV-C incluidos en tu tarifa."*
  2. Si el cliente adjuntó fotos, mostrar un indicador visual: *"✓ Fotos adjuntas para el especialista"*.

---

## 4. 📦 SALVAGUARDA DE CÓDIGO ARCHIVADO

Toda la lógica, los objetos `FABRIC_OPTIONS`, `STAIN_OPTIONS`, fórmulas y código JSX han sido resguardados en:  
👉 [`docs/REPORTE_ARQUITECTURA_TELAS_Y_MANCHAS_ARCHIVADO.md`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/docs/REPORTE_ARQUITECTURA_TELAS_Y_MANCHAS_ARCHIVADO.md)

---

## 5. 🛑 SOLICITUD FORMAL DE AUTORIZACIÓN (PROTOCOLO ALPHA)

Angel, este es el plan propuesto para simplificar el Paso 2 del cotizador y dejar únicamente la carga de fotos como opcional.

**¿Apruebas proceder con esta ejecución técnica?**
