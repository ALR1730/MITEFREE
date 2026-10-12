import { Injectable } from '@nestjs/common';
import { INVOICE_CONFIG } from './invoice.config.js';

export interface FinalInvoiceItem {
  furnitureType: string;
  quantity?: number;
  subtotal: number;
}

export interface FinalInvoiceData {
  appointmentId: string;
  quotationId?: string;
  completedAt: Date;
  clientName: string;
  clientPhone: string;
  address: string;
  technicianName: string;
  items: FinalInvoiceItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  currency: string;
  paymentMethod?: string;
}

@Injectable()
export class FinalInvoicePdfService {
  /**
   * Genera el documento PDF canónico para la Factura Final de Servicio Completado de MITEFREE
   * en formato de IMPRESIÓN TÉRMICA (Rollo 80mm POS).
   * 
   * Características técnicas:
   *  - Dimensiones: 80 mm de ancho (226.0 pt) con altura adaptable al contenido.
   *  - Documento de liquidación total: Total pagado / cancelado (cero anticipos pendientes).
   *  - Datos de técnico ejecutor, cliente y dirección donde se realizó el servicio.
   *  - Certificación de desinfección y activación formal de Garantía de Satisfacción 48 Horas.
   */
  async generateFinalInvoicePdf(data: FinalInvoiceData): Promise<Buffer> {
    const shortId = data.appointmentId.substring(0, 8).toUpperCase();
    const invoiceCode = `FAC-2026-${shortId}`;

    const completedDate = new Date(data.completedAt);
    const dateStr = completedDate.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const timeStr = completedDate.toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Vencimiento de la garantía de 48 horas
    const guaranteeExpiry = new Date(completedDate.getTime() + 48 * 60 * 60 * 1000);
    const guaranteeExpiryStr = guaranteeExpiry.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + guaranteeExpiry.toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const clientName = data.clientName || 'Consumidor Final (Sin Registrar)';
    const clientPhone = data.clientPhone || 'Vía Web';
    const address = data.address || 'Servicio Residencial a Domicilio';
    const technicianName = data.technicianName || 'Cuadrilla Técnica MITEFREE';
    const formattedTotal = `$${data.total.toFixed(2)} ${data.currency || 'DOP'}`;

    const items =
      data.items && data.items.length > 0
        ? data.items
        : [
            {
              furnitureType: 'Servicio de Limpieza Quirúrgica',
              quantity: 1,
              subtotal: data.subtotal || data.total,
            },
          ];

    // Sanitización para PDF Type1
    const sanitize = (str: string): string => {
      if (!str) return '';
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\\/g, '')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
    };

    const pageWidth = 226.0;
    const itemsCount = Math.min(items.length, 10);
    const contentNeededHeight = 440 + itemsCount * 25;
    const pageHeight = Math.max(520.0, contentNeededHeight);

    const drawCommands: string[] = [];

    // Helper: Línea horizontal vectorial
    const line = (yPos: number, lineWidth = 0.5, isDouble = false) => {
      drawCommands.push(`${lineWidth.toFixed(2)} w`);
      drawCommands.push('0.200 0.200 0.200 RG');
      drawCommands.push(`10.0 ${yPos.toFixed(1)} m 216.0 ${yPos.toFixed(1)} l S`);
      if (isDouble) {
        drawCommands.push(`10.0 ${(yPos - 2).toFixed(1)} m 216.0 ${(yPos - 2).toFixed(1)} l S`);
      }
    };

    // Helper: Texto
    const text = (
      content: string,
      xPos: number,
      yPos: number,
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
      drawCommands.push(`${xPos.toFixed(1)} ${yPos.toFixed(1)} Td`);
      drawCommands.push(`(${clean}) Tj`);
      drawCommands.push('ET');
    };

    // Helper: Texto centrado térmico
    const textCenter = (
      content: string,
      yPos: number,
      font: 'F1' | 'F2',
      size: number,
      r = 0,
      g = 0,
      b = 0,
    ) => {
      const charWidth = size * (font === 'F1' ? 0.55 : 0.5);
      const estWidth = content.length * charWidth;
      const xPos = Math.max(10, (pageWidth - estWidth) / 2);
      text(content, xPos, yPos, font, size, r, g, b);
    };

    let y = pageHeight - 20;

    // 1. ENCABEZADO TÉRMICO MITEFREE
    line(y, 1.0, true);
    y -= 16;

    textCenter(INVOICE_CONFIG.appName, y, 'F1', 16, 0.05, 0.1, 0.2);
    y -= 11;
    textCenter('Limpieza Quirurgica & Desinfeccion UV-C', y, 'F2', 7.5, 0.2, 0.25, 0.35);
    y -= 10;

    line(y, 0.5);
    y -= 11;

    textCenter('FACTURA FINAL DE SERVICIO COMPLETADO', y, 'F1', 7.5, 0.05, 0.45, 0.35);
    y -= 10;
    textCenter(`No. ${invoiceCode}`, y, 'F1', 8.5, 0.05, 0.1, 0.2);
    y -= 9;
    textCenter(`Fecha Cierre: ${dateStr}  Hora: ${timeStr}`, y, 'F2', 6.5, 0.25, 0.3, 0.4);
    y -= 9;
    textCenter(`RNC: ${INVOICE_CONFIG.rnc}`, y, 'F2', 6, 0.35, 0.4, 0.5);
    y -= 9;
    textCenter(`Tel: ${INVOICE_CONFIG.phone}  |  ${INVOICE_CONFIG.website}`, y, 'F2', 6.5, 0.25, 0.3, 0.4);
    y -= 8;

    line(y, 0.75, true);
    y -= 12;

    // 2. DATOS DE ENTREGA Y TÉCNICO EJECUTOR
    text('COMPROBANTE DE ENTREGA Y RECEPCION:', 12, y, 'F1', 7, 0.1, 0.15, 0.25);
    y -= 10;
    text(`Cliente: ${clientName}`, 12, y, 'F1', 7, 0.05, 0.1, 0.2);
    y -= 9;
    text(`Contacto: ${clientPhone}`, 12, y, 'F2', 6.5, 0.25, 0.3, 0.4);
    y -= 9;
    text(`Direccion: ${address}`, 12, y, 'F2', 6.5, 0.25, 0.3, 0.4);
    y -= 9;
    text(`Tecnico Ejecutor: ${technicianName}`, 12, y, 'F1', 7, 0.05, 0.45, 0.35);
    y -= 9;
    text('Estado del Servicio: COMPLETADO A SATISFACCION', 12, y, 'F1', 6.5, 0.05, 0.5, 0.35);
    y -= 8;

    line(y, 0.5);
    y -= 11;

    // 3. DESGLOSE DE MUEBLES TRATADOS
    text('CANT', 12, y, 'F1', 6.5, 0.1, 0.15, 0.25);
    text('SERVICIO EJECUTADO', 36, y, 'F1', 6.5, 0.1, 0.15, 0.25);
    text('TOTAL', 180, y, 'F1', 6.5, 0.1, 0.15, 0.25);
    y -= 6;
    line(y, 0.5);
    y -= 10;

    for (let i = 0; i < itemsCount; i++) {
      const it = items[i];
      if (!it) continue;

      const qty = it.quantity || 1;
      text(`${qty}x`, 12, y, 'F2', 7, 0.2, 0.25, 0.35);
      text(it.furnitureType, 36, y, 'F1', 7, 0.05, 0.1, 0.2);
      const priceStr = `$${Number(it.subtotal).toFixed(2)}`;
      text(priceStr, 172, y, 'F1', 7, 0.05, 0.1, 0.2);
      y -= 8;

      text('(Inyeccion-Extraccion + Sanitizado UV-C)', 36, y, 'F2', 6, 0.4, 0.45, 0.55);
      y -= 11;
    }

    line(y, 0.5);
    y -= 11;

    // 4. LIQUIDACIÓN FINAL DIRECTA (100% SALDADO / CERO ANTICIPO)
    text('Subtotal Servicios:', 12, y, 'F2', 7, 0.25, 0.3, 0.4);
    text(`$${data.subtotal.toFixed(2)} DOP`, 160, y, 'F1', 7, 0.1, 0.15, 0.25);
    y -= 10;

    if (data.discountAmount > 0) {
      text('Descuento Promocional:', 12, y, 'F2', 7, 0.25, 0.3, 0.4);
      text(`-$${data.discountAmount.toFixed(2)} DOP`, 160, y, 'F1', 0.7, 0.15, 0.15);
      y -= 10;
    }

    line(y, 1.0, true);
    y -= 13;

    text('TOTAL LIQUIDADO:', 12, y, 'F1', 9, 0.05, 0.1, 0.2);
    text(formattedTotal, 142, y, 'F1', 9.5, 0.05, 0.5, 0.35);
    y -= 11;

    text('CONDICION DE PAGO:', 12, y, 'F1', 7.5, 0.1, 0.15, 0.25);
    text('100% PAGADO / CANCELADO', 120, y, 'F1', 7.5, 0.05, 0.5, 0.35);
    y -= 10;

    line(y, 1.0, true);
    y -= 12;

    // 5. CERTIFICACIÓN CLÍNICA Y ACTIVACIÓN DE GARANTÍA 48 HORAS
    textCenter('CERTIFICADO DE SERVICIO & GARANTIA ACTIVA', y, 'F1', 6.5, 0.05, 0.45, 0.35);
    y -= 9;
    textCenter('* Protocolo de Desinfeccion Hospitalaria UV-C Certificado', y, 'F2', 5.5, 0.25, 0.3, 0.4);
    y -= 8;
    textCenter('* Tratamiento Acaricida y Neutralizacion de Olores', y, 'F2', 5.5, 0.25, 0.3, 0.4);
    y -= 8;
    textCenter(`* GARANTIA DE SATISFACCION 48H ACTIVA HASTA:`, y, 'F1', 6, 0.05, 0.45, 0.35);
    y -= 8;
    textCenter(guaranteeExpiryStr, y, 'F1', 6, 0.05, 0.1, 0.2);
    y -= 10;

    line(y, 0.5);
    y -= 11;

    // 6. FIRMA Y CONFORMIDAD DIGITAL
    textCenter('CONFORMIDAD DEL CLIENTE', y, 'F1', 6.5, 0.1, 0.15, 0.25);
    y -= 9;
    textCenter('[ VISTO BUENO Y RECEPCION A SATISFACCION ]', y, 'F1', 6.5, 0.05, 0.5, 0.35);
    y -= 8;
    textCenter(`Certificado Digital No. MITE-VERIFIED-${shortId}`, y, 'F2', 5.5, 0.4, 0.45, 0.55);
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
