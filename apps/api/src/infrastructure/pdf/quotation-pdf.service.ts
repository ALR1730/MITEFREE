import { Injectable } from '@nestjs/common';
import type { QuotationResponseDto } from '@mitefree/shared-types';
import { INVOICE_CONFIG } from './invoice.config.js';

@Injectable()
export class QuotationPdfService {
  /**
   * Genera el documento PDF canónico de alta fidelidad para la Factura Proforma de MITEFREE
   * en formato de IMPRESIÓN TÉRMICA (Rollo 80mm POS).
   * 
   * Características técnicas:
   *  - Dimensiones: 80 mm de ancho (226.0 pt) con alto adaptable.
   *  - Cero anticipo: Liquidación directa con Subtotal, Descuentos y TOTAL A PAGAR.
   *  - Banco Popular (sin la palabra "Dominicano"), Banco BHD y Banreservas.
   *  - Cliente registrado o "Consumidor Final (Sin Registrar)".
   *  - Compatible con impresoras térmicas Epson, Star, Bixolon, Bluetooth y smartphones.
   */
  async generateQuotationPdf(quotation: QuotationResponseDto): Promise<Buffer> {
    const formattedTotal = `$${quotation.total.toFixed(2)} ${quotation.currency}`;
    const shortId = quotation.id.substring(0, 8).toUpperCase();
    const quoteCode = `COT-2026-${shortId}`;

    const now = new Date(quotation.createdAt);
    const issueDateStr = now.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const issueTimeStr = now.toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const clientName = quotation.clientName || 'Consumidor Final (Sin Registrar)';
    const clientPhone = quotation.clientPhone || 'Vía Web';

    const items =
      quotation.items && quotation.items.length > 0
        ? quotation.items
        : [
            {
              id: '1',
              furnitureType: 'Servicio de Limpieza Quirúrgica',
              fabricType: 'SYNTHETIC',
              stainSeverity: 'LIGHT',
              basePrice: quotation.subtotal,
              fabricMultiplier: 1.0,
              stainSurcharge: 0,
              subtotal: quotation.subtotal,
            },
          ];

    // Sanitización para PDF Type1
    const sanitize = (str: string): string => {
      if (!str) return '';
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
    };

    // Dimensiones térmicas de 80 mm: Ancho fijo = 226 pt (~80mm)
    const pageWidth = 226.0;
    // Cálculo de altura dinámica: Cabecera (~145pt) + Ítems (24pt c/u) + Totales (~70pt) + Bancos (~95pt) + Pie (~75pt)
    const itemsCount = Math.min(items.length, 10);
    const contentNeededHeight = 390 + itemsCount * 25;
    const pageHeight = Math.max(480.0, contentNeededHeight);

    const drawCommands: string[] = [];

    // Helper: Línea horizontal vectorial
    const line = (y: number, lineWidth = 0.5, isDouble = false) => {
      drawCommands.push(`${lineWidth.toFixed(2)} w`);
      drawCommands.push('0.200 0.200 0.200 RG');
      drawCommands.push(`10.0 ${y.toFixed(1)} m 216.0 ${y.toFixed(1)} l S`);
      if (isDouble) {
        drawCommands.push(`10.0 ${(y - 2).toFixed(1)} m 216.0 ${(y - 2).toFixed(1)} l S`);
      }
    };

    // Helper: Texto
    const text = (
      content: string,
      x: number,
      y: number,
      font: 'F1' | 'F2',
      size: number,
      r = 0,
      g = 0,
      b = 0,
    ) => {
      const clean = sanitize(content);
      drawCommands.push('BT');
      drawCommands.push(`/${font} ${size} Tf`);
      drawCommands.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
      drawCommands.push(`${x.toFixed(1)} ${y.toFixed(1)} Td`);
      drawCommands.push(`(${clean}) Tj`);
      drawCommands.push('ET');
    };

    // Helper: Texto centrado térmico
    const textCenter = (
      content: string,
      y: number,
      font: 'F1' | 'F2',
      size: number,
      r = 0,
      g = 0,
      b = 0,
    ) => {
      const charWidth = size * (font === 'F1' ? 0.55 : 0.5);
      const estWidth = content.length * charWidth;
      const x = Math.max(10, (pageWidth - estWidth) / 2);
      text(content, x, y, font, size, r, g, b);
    };

    let y = pageHeight - 20;

    // 1. ENCABEZADO TICKET TÉRMICO (Marca MITEFREE)
    line(y, 1.0, true);
    y -= 16;

    textCenter(INVOICE_CONFIG.appName, y, 'F1', 16, 0.05, 0.1, 0.2);
    y -= 11;
    textCenter('Limpieza Quirurgica de Muebles', y, 'F2', 7.5, 0.2, 0.25, 0.35);
    y -= 9;
    textCenter('Desinfeccion Inteligente UV-C', y, 'F2', 7, 0.3, 0.35, 0.45);
    y -= 10;

    line(y, 0.5);
    y -= 11;

    textCenter('COMPROBANTE / FACTURA PROFORMA', y, 'F1', 7.5, 0.1, 0.15, 0.25);
    y -= 10;
    textCenter(`Ticket No. ${quoteCode}`, y, 'F1', 8, 0.05, 0.45, 0.35);
    y -= 9;
    textCenter(`Fecha: ${issueDateStr}  Hora: ${issueTimeStr}`, y, 'F2', 6.5, 0.25, 0.3, 0.4);
    y -= 9;
    textCenter(`RNC: ${INVOICE_CONFIG.rnc}`, y, 'F2', 6, 0.35, 0.4, 0.5);
    y -= 9;
    textCenter(`Tel: ${INVOICE_CONFIG.phone}  |  ${INVOICE_CONFIG.website}`, y, 'F2', 6.5, 0.25, 0.3, 0.4);
    y -= 9;
    textCenter(INVOICE_CONFIG.address, y, 'F2', 5.5, 0.4, 0.45, 0.55);
    y -= 8;

    line(y, 0.75, true);
    y -= 12;

    // 2. DATOS DEL CLIENTE (Registrado o Consumidor Final)
    text('DATOS DEL CLIENTE:', 12, y, 'F1', 7, 0.1, 0.15, 0.25);
    y -= 10;
    text(`Cliente: ${clientName}`, 12, y, 'F1', 7, 0.05, 0.1, 0.2);
    y -= 9;
    text(`Contacto: ${clientPhone}`, 12, y, 'F2', 6.5, 0.25, 0.3, 0.4);
    y -= 9;
    text('Servicio: A Domicilio / Residencial', 12, y, 'F2', 6.5, 0.25, 0.3, 0.4);
    y -= 8;

    line(y, 0.5);
    y -= 11;

    // 3. TABLA DE MUEBLES COTIZADOS (Estilo Ticket POS)
    text('CANT', 12, y, 'F1', 6.5, 0.1, 0.15, 0.25);
    text('DESCRIPCION DEL SERVICIO', 36, y, 'F1', 6.5, 0.1, 0.15, 0.25);
    text('TOTAL', 180, y, 'F1', 6.5, 0.1, 0.15, 0.25);
    y -= 6;
    line(y, 0.5);
    y -= 10;

    for (let i = 0; i < itemsCount; i++) {
      const it = items[i];
      if (!it) continue;

      // Línea principal de ítem
      text('1x', 12, y, 'F2', 7, 0.2, 0.25, 0.35);
      text(it.furnitureType, 36, y, 'F1', 7, 0.05, 0.1, 0.2);
      const itemPriceStr = `$${Number(it.subtotal).toFixed(2)}`;
      text(itemPriceStr, 172, y, 'F1', 7, 0.05, 0.1, 0.2);
      y -= 8;

      // Detalle del protocolo
      text('(Inyeccion-Extraccion + UV-C)', 36, y, 'F2', 6, 0.4, 0.45, 0.55);
      y -= 11;
    }

    line(y, 0.5);
    y -= 11;

    // 4. TOTALES DIRECTOS (SIN ANTICIPO)
    text('Subtotal de Servicios:', 12, y, 'F2', 7, 0.25, 0.3, 0.4);
    text(`$${quotation.subtotal.toFixed(2)} DOP`, 160, y, 'F1', 7, 0.1, 0.15, 0.25);
    y -= 10;

    if (quotation.discountAmount > 0) {
      text('Descuento Especial:', 12, y, 'F2', 7, 0.25, 0.3, 0.4);
      text(`-$${quotation.discountAmount.toFixed(2)} DOP`, 160, y, 'F1', 7, 0.7, 0.15, 0.15);
      y -= 10;
    }

    line(y, 1.0, true);
    y -= 13;

    // TOTAL GENERAL A PAGAR DESTACADO
    text('TOTAL A PAGAR:', 12, y, 'F1', 9, 0.05, 0.1, 0.2);
    text(formattedTotal, 142, y, 'F1', 9.5, 0.05, 0.5, 0.35);
    y -= 11;

    line(y, 1.0, true);
    y -= 12;

    // 5. CUENTAS BANCARIAS PARA PAGO / TRANSFERENCIA (Popular, BHD, Banreservas)
    textCenter('METODOS DE PAGO / TRANSFERENCIA (RD):', y, 'F1', 6.5, 0.1, 0.15, 0.25);
    y -= 10;

    for (const bank of INVOICE_CONFIG.bankAccounts) {
      text(`* ${bank.bankName}:`, 12, y, 'F1', 6.5, 0.1, 0.15, 0.25);
      text(bank.accountNumber, 120, y, 'F2', 6.5, 0.2, 0.25, 0.35);
      y -= 9;
    }

    text(`Titular: ${INVOICE_CONFIG.bankAccounts[0]?.holder || '[TITULAR_CUENTA_PRODUCCION]'}`, 12, y, 'F2', 6, 0.35, 0.4, 0.5);
    y -= 8;
    text(`Ref al transferir: ${quoteCode}`, 12, y, 'F1', 6.5, 0.05, 0.45, 0.35);
    y -= 8;

    line(y, 0.5);
    y -= 10;

    // 6. GARANTÍA Y POLÍTICAS DE SERVICIO
    textCenter('POLITICA DE SERVICIO & GARANTIA MITEFREE', y, 'F1', 6, 0.15, 0.2, 0.3);
    y -= 9;
    textCenter('* Garantia de Satisfaccion 48 Horas en Manchas', y, 'F2', 5.5, 0.3, 0.35, 0.45);
    y -= 8;
    textCenter('* Protocolo Quirurgico con Luz UV-C Certificado', y, 'F2', 5.5, 0.3, 0.35, 0.45);
    y -= 8;
    textCenter('* Tarifa y Descuentos Congelados por 7 Dias', y, 'F2', 5.5, 0.3, 0.35, 0.45);
    y -= 8;
    textCenter('* Pago contra Entrega tras tu Aprobacion', y, 'F2', 5.5, 0.3, 0.35, 0.45);
    y -= 9;

    line(y, 1.0, true);
    y -= 12;

    // 7. PIE DE TICKET TÉRMICO
    textCenter('*** GRACIAS POR PREFERIR MITEFREE ***', y, 'F1', 7, 0.05, 0.45, 0.35);
    y -= 9;
    textCenter('www.mitefree.com  |  (809) 513-4773', y, 'F2', 6, 0.4, 0.45, 0.55);

    // Flujo final PDF-1.4
    const contentStream = drawCommands.join('\n');
    const streamLength = Buffer.byteLength(contentStream, 'utf8');

    const pdfDocument = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 ${pageWidth.toFixed(1)} ${pageHeight.toFixed(1)}]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 5 0 R
      /F2 6 0 R
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length ${streamLength}
>>
stream
${contentStream}
endstream
endobj
5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
6 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000282 00000 n 
000000${(282 + streamLength + 50).toString().padStart(4, '0')} 00000 n 
000000${(282 + streamLength + 130).toString().padStart(4, '0')} 00000 n 
trailer
<<
  /Size 7
  /Root 1 0 R
>>
startxref
${370 + streamLength}
%%EOF`;

    return Buffer.from(pdfDocument, 'utf8');
  }
}
