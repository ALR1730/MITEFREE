# 📘 ALR COMPANY — Guía de Configuración para Producción
## Factura Proforma y Presupuesto Oficial en PDF (MITEFREE)

> **Aplicación:** MITEFREE — Limpieza & Desinfección Inteligente de Muebles  
> **Líder & Fundador:** [Angel Luis Rosario](https://github.com/ALR1730)  
> **Ubicación del Código:** [`apps/api/src/infrastructure/pdf/invoice.config.ts`](file:///c:/Users/DELL/Desktop/wordspace/MITEFREE/apps/api/src/infrastructure/pdf/invoice.config.ts)  
> **Fecha:** 12 de Octubre, 2026

---

### 1. 🎯 Propósito del Módulo

El generador de facturas proforma y presupuestos oficiales en PDF de **MITEFREE** está diseñado bajo estándares de alta fidelidad visual y desacoplamiento estricto.

- **Nombre y Marca:** El encabezado, diseño y membrete visual operan bajo el nombre de la app: **MITEFREE**.
- **Cero Código Hardcodeado:** Los datos fiscales (RNC) y las cuentas bancarias dominicanas están parametrizados mediante variables de entorno con marcadores visibles (`[..._PRODUCCION]`).
- **Paso a Producción Inmediato:** Cuando la empresa esté lista para operar en producción, **no es necesario modificar ninguna línea de código TypeScript**. Basta con definir las variables en el `.env` de producción.

---

### 2. 🔑 Variables de Entorno para Producción

Agrega o ajusta las siguientes variables en el archivo `.env` del backend (`apps/api/.env` o en el panel de variables de entorno de tu proveedor de Cloud / VPS):

```bash
# ==============================================================================
# MITEFREE — CONFIGURACIÓN DE FACTURACIÓN Y MEMBRETE EN PDF (PRODUCCIÓN)
# ==============================================================================

# Nombre de la aplicación y entidad legal
INVOICE_APP_NAME="MITEFREE"
INVOICE_LEGAL_ENTITY="MITEFREE SRL"
INVOICE_TAGLINE="Limpieza Quirúrgica & Desinfección Inteligente de Muebles y Colchones"

# Datos Fiscales (DGII República Dominicana)
INVOICE_RNC="131-XXXXXXX-X"

# Canales de Atención Oficial
INVOICE_PHONE="(809) 513-4773"
INVOICE_EMAIL="facturacion@mitefree.com"
INVOICE_WEBSITE="www.mitefree.com"
INVOICE_ADDRESS="Santiago & Gran Santo Domingo, República Dominicana"

# Cuentas Bancarias Dominicanas para Pago por Transferencia / Depósito
INVOICE_BANK_BPD="812-XXXXXX-X"               # Banco Popular (Cta. Corriente)
INVOICE_BANK_BHD="045-XXXXXX-X"               # Banco BHD (Cta. Ahorros)
INVOICE_BANK_BANRESERVAS="960-XXXXXX-X"       # Banreservas (Cta. Ahorros)
INVOICE_BANK_HOLDER="Angel Luis Rosario / MITEFREE" # Titular oficial
INVOICE_BANK_ID="131-XXXXXXX-X"               # RNC o Cédula del titular
```

---

### 3. 🛠️ Estructura del Ticket Térmico Generado (80mm POS)

El documento PDF generado es un **recibo térmico de 80 mm (226 pt)** optimizado para impresión en campo:
1. **Encabezado Térmico MITEFREE:** Título `*** MITEFREE ***`, lema de servicio clínico y desinfección UV-C.
2. **Metadatos de Ticket:** Código único (`COT-2026-XXXXXXXX`), fecha y hora exacta de emisión, RNC y canales de contacto.
3. **Datos del Cliente:** Nombre del cliente registrado o formalmente rotulado como **`Consumidor Final (Sin Registrar)`**.
4. **Tabla de Muebles Cotizados:** Lista de piezas con protocolo (`Inyección-Extracción + UV-C`), cantidad y precio en DOP.
5. **Liquidación Directa (Sin Anticipo):** Subtotal, descuentos aplicables y **TOTAL A PAGAR** destacado.
6. **Cuentas Bancarias:** Detalle de cuentas en **Banco Popular**, **Banco BHD** y **Banreservas** con el código de cotización como referencia.
7. **Garantía Clínica y Pie de Ticket:** Garantía de 48 horas, tarifa congelada por 7 días y mensaje de agradecimiento.

---

### 4. 🧪 Verificación Local y Testing

Para verificar cómo luce el documento generado:
```bash
# Descargar un PDF de prueba desde la API local
curl.exe -s http://localhost:4000/api/v1/quotations/80000001-0000-4000-8000-000000000001/pdf -o test_factura.pdf
```
O desde la interfaz web del cliente:
1. Acceder a `http://localhost:3000/cotizar`.
2. Seleccionar muebles y avanzar al Paso 3 (Resumen).
3. Hacer clic en **"📄 Descargar Factura (PDF)"**.
