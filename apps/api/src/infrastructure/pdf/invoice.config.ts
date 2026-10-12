/**
 * MITEFREE — Configuración Centralizada de Factura Proforma y Presupuesto Oficial en PDF
 * 
 * ALR COMPANY — División de Ingeniería de Software
 * 
 * Este módulo centraliza las credenciales, membrete y cuentas bancarias de la app MITEFREE.
 * Para pasar a PRODUCCIÓN:
 *  1. Definir las variables de entorno correspondientes en el archivo .env del servidor (o panel de despliegue).
 *  2. O actualizar los valores por defecto en este archivo.
 *  Consulta la guía completa en: docs/GUIA_CONFIGURACION_FACTURA_PRODUCCION.md
 */

export interface BankAccountConfig {
  bankName: string;
  accountType: string;
  accountNumber: string;
  holder: string;
  rncCedula: string;
}

export interface InvoiceBrandingConfig {
  appName: string;
  legalEntity: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  rnc: string;
  bankAccounts: BankAccountConfig[];
  termsAndWarranty: string[];
}

export const INVOICE_CONFIG: InvoiceBrandingConfig = {
  // Marca y Nombre de la Aplicación
  appName: process.env.INVOICE_APP_NAME || 'MITEFREE',
  legalEntity: process.env.INVOICE_LEGAL_ENTITY || 'MITEFREE SRL',
  tagline:
    process.env.INVOICE_TAGLINE ||
    'Limpieza Quirúrgica & Desinfección Inteligente de Muebles y Colchones',
  phone: process.env.INVOICE_PHONE || '(809) 513-4773',
  email: process.env.INVOICE_EMAIL || 'contacto@mitefree.com',
  website: process.env.INVOICE_WEBSITE || 'www.mitefree.com',
  address:
    process.env.INVOICE_ADDRESS ||
    'Cobertura Nacional · Santiago & Gran Santo Domingo, Rep. Dominicana',

  // RNC / Registro Fiscal para Producción (Marcado para reemplazo rápido)
  rnc: process.env.INVOICE_RNC || '[RNC: PENDIENTE DE CONFIGURACIÓN DGII - PRODUCCIÓN]',

  // Cuentas Bancarias Dominicanas para Pago por Transferencia / Depósito
  bankAccounts: [
    {
      bankName: 'Banco Popular',
      accountType: 'Cuenta Corriente',
      accountNumber: process.env.INVOICE_BANK_BPD || '[CTA_BPD_PRODUCCION]',
      holder: process.env.INVOICE_BANK_HOLDER || '[TITULAR_CUENTA_PRODUCCION]',
      rncCedula: process.env.INVOICE_BANK_ID || '[RNC_O_CEDULA_PROD]',
    },
    {
      bankName: 'Banco BHD',
      accountType: 'Cuenta de Ahorros',
      accountNumber: process.env.INVOICE_BANK_BHD || '[CTA_BHD_PRODUCCION]',
      holder: process.env.INVOICE_BANK_HOLDER || '[TITULAR_CUENTA_PRODUCCION]',
      rncCedula: process.env.INVOICE_BANK_ID || '[RNC_O_CEDULA_PROD]',
    },
    {
      bankName: 'Banreservas',
      accountType: 'Cuenta de Ahorros',
      accountNumber: process.env.INVOICE_BANK_BANRESERVAS || '[CTA_BANRESERVAS_PRODUCCION]',
      holder: process.env.INVOICE_BANK_HOLDER || '[TITULAR_CUENTA_PRODUCCION]',
      rncCedula: process.env.INVOICE_BANK_ID || '[RNC_O_CEDULA_PROD]',
    },
  ],

  // Términos del Servicio y Garantía MITEFREE
  termsAndWarranty: [
    'Tarifa Congelada: Presupuesto garantizado sin variaciones durante 7 dias de vigencia.',
    'Inspeccion Previa: El tecnico certifica el estado del tejido y manchas en tu domicilio.',
    'Garantia 48 Horas: Si una mancha tratable persiste, reaplicamos el protocolo sin costo.',
    'Protocolo Quirurgico: Inyeccion-extraccion profunda y desinfeccion UV-C certificada.',
    'Pago contra Entrega: Cancelas el total tras tu inspeccion de conformidad y visto bueno.',
  ],
};
