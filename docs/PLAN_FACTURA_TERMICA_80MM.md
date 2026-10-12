# 📋 ALR COMPANY — Plan de Ingeniería ALPHA (v2.0)
## Formato de Factura Proforma Térmica (80mm POS) para MITEFREE

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder & Fundador:** [Angel Luis Rosario](https://github.com/ALR1730)  
> **Sistema:** MITEFREE Platform (`apps/api` · `packages/shared-types` · `apps/pwa-client`)  
> **Fecha:** 12 de Octubre, 2026  
> **Estado:** 🟡 **PLAN CLARIFICADO — ESPERANDO AUTORIZACIÓN EXPLÍCITA**

---

### 1. 🔍 Aclaración Fundamental de Cuentas Bancarias

- **Banco Popular SE MANTIENE:**  
  Únicamente se remueve la palabra *"Dominicano"*.
  - ❌ Antes: `Banco Popular Dominicano`
  - ✅ Ahora: **`Banco Popular`**
- **Las 3 cuentas bancarias siguen presentes:**
  1. **Banco Popular**
  2. **Banco BHD**
  3. **Banreservas**

---

### 2. 🎯 Resumen de los 4 Puntos de Ejecución

1. **Quitar el Anticipo:**  
   La factura proforma muestra la liquidación completa directa: **Subtotal**, **Descuentos** (si aplican) y **TOTAL A PAGAR**. Se retiran todas las divisiones de anticipo del 30% y saldo del 70%.
2. **Nombre Bancario:**  
   Etiqueta limpia: **`Banco Popular`** (sin la palabra *Dominicano*), junto a Banco BHD y Banreservas.
3. **Formato de Impresión Térmica (Rollo 80mm POS):**  
   - Tamaño de página adaptado a impresoras térmicas de 80mm (ancho: `226.0` pt / 80mm, altura dinámica según la cantidad de muebles).
   - Estilo de ticket de caja: encabezado `*** MITEFREE ***`, divisores de ticket térmico (`====================` y `--------------------`), tipografía de recibo comercial.
4. **Tratamiento del Cliente:**  
   - Cliente registrado: Su nombre completo (ej: `Laura Gómez`).
   - Cliente sin registrarse: **`Consumidor Final (Sin Registrar)`**.

---

### 3. 📋 Archivos a Modificar

1. [`apps/api/src/infrastructure/pdf/invoice.config.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/infrastructure/pdf/invoice.config.ts) ➔ Nombre `'Banco Popular'` (sin 'Dominicano') y términos sin anticipo.
2. [`apps/api/src/infrastructure/repositories/drizzle-quotation.repository.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/infrastructure/repositories/drizzle-quotation.repository.ts) ➔ Consulta de `users` para extraer el nombre del cliente si está registrado.
3. [`apps/api/src/application/quotations/get-quotation.use-case.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/application/quotations/get-quotation.use-case.ts) ➔ Fallback a `"Consumidor Final (Sin Registrar)"` para clientes sin registrar.
4. [`apps/api/src/infrastructure/pdf/quotation-pdf.service.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/infrastructure/pdf/quotation-pdf.service.ts) ➔ Motor vectorial 80mm (ancho 226 pt), ticket térmico con Banco Popular, sin anticipo.
5. [`docs/GUIA_CONFIGURACION_FACTURA_PRODUCCION.md`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/docs/GUIA_CONFIGURACION_FACTURA_PRODUCCION.md) ➔ Actualización técnica de la guía.

---

### 4. 🛑 Confirmación

Angel, Banco Popular **se mantiene firme**, solo quitándole *"Dominicano"*. ¿Confirmas para proceder con la ejecución?
