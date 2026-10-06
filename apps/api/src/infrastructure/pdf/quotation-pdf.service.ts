import { Injectable } from '@nestjs/common';
import type { QuotationResponseDto } from '@mitefree/shared-types';

@Injectable()
export class QuotationPdfService {
  /**
   * Genera el documento PDF canónico de alta fidelidad para una cotización oficial de MITEFREE.
   * Diseñado con tipografía corporativa, desglose financiero, anticipo del 30% y sello de validez de 7 días.
   */
  async generateQuotationPdf(quotation: QuotationResponseDto): Promise<Buffer> {
    const formattedTotal = `$${quotation.total.toFixed(2)} ${quotation.currency}`;
    const formattedDeposit = `$${quotation.depositRequired.toFixed(2)} ${quotation.currency}`;
    const remainingBalance = (quotation.total - quotation.depositRequired).toFixed(2);
    const formattedRemaining = `$${remainingBalance} ${quotation.currency}`;
    const shortId = quotation.id.substring(0, 8).toUpperCase();
    const quoteCode = `COT-2026-${shortId}`;
    const issueDate = new Date(quotation.createdAt).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const expiryDate = new Date(quotation.expiresAt).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Generador de PDF vectorial puro conforme a la especificación estándar PDF-1.4
    const contentStream = `
BT
/F1 22 Tf
50 740 Td
(MITEFREE) Tj
/F2 10 Tf
120 742 Td
(|  ALR COMPANY - Division de Ingenieria de Software) Tj
0 -20 Td
(Especialistas en Desinfeccion y Limpieza Quirurgica de Tapiceria) Tj
0 -30 Td
/F1 14 Tf
(PRESUPUESTO OFICIAL CONGELADO) Tj
0 -18 Td
/F2 10 Tf
(Codigo de Cotizacion: ${quoteCode}) Tj
0 -14 Td
(Fecha de Emision: ${issueDate}) Tj
0 -14 Td
(Validez: Congelado hasta el ${expiryDate} - 7 dias) Tj
0 -14 Td
(Cliente UUID: ${quotation.clientId}) Tj
0 -14 Td
(Estado: ${quotation.status}) Tj
0 -30 Td
/F1 12 Tf
(DESGLOSE FINANCIERO Y LIQUIDACION) Tj
0 -18 Td
/F2 10 Tf
(---------------------------------------------------------------------------------) Tj
0 -16 Td
(Subtotal Bruto:                                             $${quotation.subtotal.toFixed(2)} ${quotation.currency}) Tj
0 -14 Td
(Descuento Promocional / Ruta:                              -$${quotation.discountAmount.toFixed(2)} ${quotation.currency}) Tj
0 -14 Td
(---------------------------------------------------------------------------------) Tj
0 -16 Td
/F1 11 Tf
(TOTAL DEL SERVICIO:                                       ${formattedTotal}) Tj
0 -16 Td
/F2 10 Tf
(Anticipo Requerido de Reserva [30%]:                         ${formattedDeposit}) Tj
0 -14 Td
(Saldo Restante contra Servicio Aprobado [70%]:               ${formattedRemaining}) Tj
0 -30 Td
/F1 11 Tf
(TERMINOS DE SERVICIO Y GARANTIA MITEFREE) Tj
0 -16 Td
/F2 9 Tf
(1. Este presupuesto garantiza la tarifa sin alteraciones durante los 7 dias de vigencia.) Tj
0 -12 Td
(2. El anticipo del 30% reserva la cuadrilla especializada y el bloque de ruta geoespacial.) Tj
0 -12 Td
(3. El 70% restante se liquida unicamente tras la inspeccion de conformidad del cliente.) Tj
0 -12 Td
(4. Protocolo certificado con desinfeccion de amonios de quinta generacion y UV-C.) Tj
0 -30 Td
/F2 8 Tf
(Documento generado electronicamente por la plataforma MITEFREE. Verificado por ALR COMPANY.) Tj
ET
`;

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
  /MediaBox [0 0 595 842]
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
0000000266 00000 n 
000000${(266 + streamLength + 50).toString().padStart(4, '0')} 00000 n 
000000${(266 + streamLength + 130).toString().padStart(4, '0')} 00000 n 
trailer
<<
  /Size 7
  /Root 1 0 R
>>
startxref
${350 + streamLength}
%%EOF`;

    return Buffer.from(pdfDocument, 'utf8');
  }
}
