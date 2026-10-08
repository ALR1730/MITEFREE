/**
 * MITEFREE Enterprise Database Seeder — ALR COMPANY
 * Líder de Proyecto & Founder: Angel Luis Rosario
 *
 * Poblamiento de datos operacionales realistas para la República Dominicana:
 * - Zonas territoriales exclusivas (SPM, La Romana, SDE, DN)
 * - Cuadrillas técnicas certificadas con especialidades UV-C
 * - Clientes reales con direcciones residenciales y comerciales
 * - Catálogo completo de tapicería, factores de tela y severidad de manchas
 * - Citas en el pipeline (PendingPayment, Confirmed, EnRoute, Completed)
 * - Pagos bancarios (Banreservas, Banco Popular) y pasarela Stripe
 * - Billeteras digitales con balance de cashback y transacciones de fidelización
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/index.js';

// Constantes canónicas de IDs para consistencia referencial
export const SEED_IDS = {
  // Técnicos
  TECH_KELVIN: '11111111-1111-4111-8111-111111111111',
  TECH_ERICKSON: '22222222-2222-4222-8222-222222222222',
  TECH_CARLOS: '33333333-3333-4333-8333-333333333333',
  TECH_MARCOS: '44444444-4444-4444-8444-444444444444',

  // Clientes
  CLIENT_LAURA: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  CLIENT_CARLOS_M: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  CLIENT_PATRICIA: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  CLIENT_MANUEL: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  CLIENT_ROBERTO: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',

  // Bloques horarios
  SLOT_MORNING_SPM: '90000001-0000-4000-8000-000000000001',
  SLOT_AFTERNOON_SPM: '90000001-0000-4000-8000-000000000002',
  SLOT_MORNING_LR: '90000002-0000-4000-8000-000000000001',
  SLOT_AFTERNOON_LR: '90000002-0000-4000-8000-000000000002',
  SLOT_MORNING_SDE: '90000003-0000-4000-8000-000000000001',
  SLOT_AFTERNOON_SDE: '90000003-0000-4000-8000-000000000002',

  // Cotizaciones
  QUOT_9821: '80000001-0000-4000-8000-000000000001',
  QUOT_9820: '80000002-0000-4000-8000-000000000002',
  QUOT_9819: '80000003-0000-4000-8000-000000000003',
  QUOT_9818: '80000004-0000-4000-8000-000000000004',

  // Citas
  APT_EN_ROUTE: '70000001-0000-4000-8000-000000000001',
  APT_CONFIRMED: '70000002-0000-4000-8000-000000000002',
  APT_COMPLETED: '70000003-0000-4000-8000-000000000003',
  APT_PENDING: '70000004-0000-4000-8000-000000000004',

  // Pagos
  PAY_8812: '60000001-0000-4000-8000-000000000001',
  PAY_8811: '60000002-0000-4000-8000-000000000002',
  PAY_8810: '60000003-0000-4000-8000-000000000003',
  PAY_8809: '60000004-0000-4000-8000-000000000004',
  PAY_8808: '60000005-0000-4000-8000-000000000005',
};

export const SEED_DATA = {
  users: [
    // Técnicos Operativos
    {
      id: SEED_IDS.TECH_KELVIN,
      email: 'kelvin.rosario@mitefree.com.do',
      phone: '+18095134773',
      fullName: 'Ing. Kelvin Rosario',
      role: 'TECHNICIAN',
      isActive: true,
    },
    {
      id: SEED_IDS.TECH_ERICKSON,
      email: 'erickson.polanco@mitefree.com.do',
      phone: '+18095134774',
      fullName: 'Erickson Polanco',
      role: 'TECHNICIAN',
      isActive: true,
    },
    {
      id: SEED_IDS.TECH_CARLOS,
      email: 'carlos.santana@mitefree.com.do',
      phone: '+18095134775',
      fullName: 'Carlos Santana',
      role: 'TECHNICIAN',
      isActive: true,
    },
    {
      id: SEED_IDS.TECH_MARCOS,
      email: 'marcos.santana@mitefree.com.do',
      phone: '+18095134776',
      fullName: 'Marcos Santana',
      role: 'TECHNICIAN',
      isActive: true,
    },

    // Clientes Dominicanos
    {
      id: SEED_IDS.CLIENT_LAURA,
      email: 'laura.mercedes@gmail.com',
      phone: '+18095550101',
      fullName: 'Laura Mercedes Guzmán',
      role: 'CLIENT',
      isActive: true,
    },
    {
      id: SEED_IDS.CLIENT_CARLOS_M,
      email: 'carlos.mendez@hotmail.com',
      phone: '+18095550202',
      fullName: 'Carlos Méndez Pimentel',
      role: 'CLIENT',
      isActive: true,
    },
    {
      id: SEED_IDS.CLIENT_PATRICIA,
      email: 'patricia.gomez@clinica.do',
      phone: '+18095550303',
      fullName: 'Dra. Patricia Gómez',
      role: 'CLIENT',
      isActive: true,
    },
    {
      id: SEED_IDS.CLIENT_MANUEL,
      email: 'manuel.tavarez@outlook.com',
      phone: '+18095550404',
      fullName: 'Manuel Tavárez',
      role: 'CLIENT',
      isActive: true,
    },
    {
      id: SEED_IDS.CLIENT_ROBERTO,
      email: 'roberto.salcedo@gmail.com',
      phone: '+18095550505',
      fullName: 'Roberto Salcedo',
      role: 'CLIENT',
      isActive: true,
    },
  ],

  addresses: [
    {
      id: '50000001-0000-4000-8000-000000000001',
      userId: SEED_IDS.CLIENT_LAURA,
      street: 'Av. Independencia #45, Edif. Miramar Apt 4B',
      city: 'San Pedro de Macorís',
      latitude: 18.4539,
      longitude: -69.3087,
      zoneCode: 'ZONE-SPM',
      isDefault: true,
    },
    {
      id: '50000002-0000-4000-8000-000000000002',
      userId: SEED_IDS.CLIENT_CARLOS_M,
      street: 'Calle Costa Rica #102, Alma Rosa I',
      city: 'Santo Domingo Este',
      latitude: 18.4861,
      longitude: -69.8542,
      zoneCode: 'ZONE-SDE',
      isDefault: true,
    },
    {
      id: '50000003-0000-4000-8000-000000000003',
      userId: SEED_IDS.CLIENT_PATRICIA,
      street: 'Calle Francisco Richiez #22, Buena Vista',
      city: 'La Romana',
      latitude: 18.4273,
      longitude: -68.9728,
      zoneCode: 'ZONE-LR',
      isDefault: true,
    },
    {
      id: '50000004-0000-4000-8000-000000000004',
      userId: SEED_IDS.CLIENT_MANUEL,
      street: 'Av. Las Américas Km 11, Los Frailes II',
      city: 'Santo Domingo Este',
      latitude: 18.4719,
      longitude: -69.7891,
      zoneCode: 'ZONE-SDE',
      isDefault: true,
    },
    {
      id: '50000005-0000-4000-8000-000000000005',
      userId: SEED_IDS.CLIENT_ROBERTO,
      street: 'Calle Federico Geraldino #78, Torre Piantini',
      city: 'Distrito Nacional',
      latitude: 18.4725,
      longitude: -69.9362,
      zoneCode: 'ZONE-DN',
      isDefault: true,
    },
  ],

  technicianProfiles: [
    {
      id: '40000001-0000-4000-8000-000000000001',
      userId: SEED_IDS.TECH_KELVIN,
      assignedZone: 'ZONE-SPM',
      commissionRate: 0.15,
      isAvailable: true,
    },
    {
      id: '40000002-0000-4000-8000-000000000002',
      userId: SEED_IDS.TECH_ERICKSON,
      assignedZone: 'ZONE-LR',
      commissionRate: 0.15,
      isAvailable: true,
    },
    {
      id: '40000003-0000-4000-8000-000000000003',
      userId: SEED_IDS.TECH_CARLOS,
      assignedZone: 'ZONE-SDE',
      commissionRate: 0.15,
      isAvailable: true,
    },
    {
      id: '40000004-0000-4000-8000-000000000004',
      userId: SEED_IDS.TECH_MARCOS,
      assignedZone: 'ZONE-SDE',
      commissionRate: 0.15,
      isAvailable: true,
    },
  ],

  services: [
    {
      id: '30000001-0000-4000-8000-000000000001',
      code: 'SOFA_MODULAR',
      name: 'Sofá Modular / Seccional L',
      description:
        'Desinfección profunda con extracción hidrocinética y radiación UV-C grado médico',
      basePrice: '2500.00',
      isActive: true,
    },
    {
      id: '30000002-0000-4000-8000-000000000002',
      code: 'MATTRESS_QUEEN',
      name: 'Colchón Queen Size (Ambos Lados)',
      description: 'Erradicación de ácaros Dermatophagoides, bacterias y alérgenos en ambas caras',
      basePrice: '2200.00',
      isActive: true,
    },
    {
      id: '30000003-0000-4000-8000-000000000003',
      code: 'MATTRESS_KING',
      name: 'Colchón King Size (Ambos Lados)',
      description: 'Higienización total tamaño King con protocolo térmico a 140°C y luz UV-C',
      basePrice: '2800.00',
      isActive: true,
    },
    {
      id: '30000004-0000-4000-8000-000000000004',
      code: 'DINING_CHAIR',
      name: 'Sillas de Comedor Acolchadas',
      description: 'Extracción de grasa, polvo y manchas en tapicería de sillas',
      basePrice: '350.00',
      isActive: true,
    },
    {
      id: '30000005-0000-4000-8000-000000000005',
      code: 'RUG_EXTRACTION',
      name: 'Alfombras Decorativas / Por Medida',
      description: 'Limpieza profunda de fibra con secado acelerado en 2 horas',
      basePrice: '1200.00',
      isActive: true,
    },
  ],

  fabricTypes: [
    {
      id: '20000001-0000-4000-8000-000000000001',
      code: 'SYNTHETIC',
      name: 'Sintética / Poliéster',
      multiplier: '1.00',
      requiresSpecialCare: false,
    },
    {
      id: '20000002-0000-4000-8000-000000000002',
      code: 'MICROFIBER',
      name: 'Microfibra / Gamuzina',
      multiplier: '1.15',
      requiresSpecialCare: false,
    },
    {
      id: '20000003-0000-4000-8000-000000000003',
      code: 'LINEN',
      name: 'Lino Natural',
      multiplier: '1.20',
      requiresSpecialCare: true,
    },
    {
      id: '20000004-0000-4000-8000-000000000004',
      code: 'VELVET',
      name: 'Terciopelo / Chenille',
      multiplier: '1.40',
      requiresSpecialCare: true,
    },
    {
      id: '20000005-0000-4000-8000-000000000005',
      code: 'LEATHER',
      name: 'Cuero / Piel Genuina',
      multiplier: '1.50',
      requiresSpecialCare: true,
    },
  ],

  stainSeverities: [
    {
      id: '10000001-0000-4000-8000-000000000001',
      code: 'LIGHT',
      name: 'Leve (Mantenimiento preventivo)',
      surchargeAmount: '0.00',
    },
    {
      id: '10000002-0000-4000-8000-000000000002',
      code: 'MODERATE',
      name: 'Moderada (Grasa, café, derrames)',
      surchargeAmount: '15.00',
    },
    {
      id: '10000003-0000-4000-8000-000000000003',
      code: 'CRITICAL',
      name: 'Crítica (Orina, sangre, fluidos orgánicos)',
      surchargeAmount: '35.00',
    },
  ],

  timeSlots: [
    {
      id: SEED_IDS.SLOT_MORNING_SPM,
      code: 'MORNING',
      startTime: '08:30',
      endTime: '11:30',
      zoneCode: 'ZONE-SPM',
    },
    {
      id: SEED_IDS.SLOT_AFTERNOON_SPM,
      code: 'AFTERNOON',
      startTime: '13:00',
      endTime: '16:00',
      zoneCode: 'ZONE-SPM',
    },
    {
      id: SEED_IDS.SLOT_MORNING_LR,
      code: 'MORNING',
      startTime: '08:30',
      endTime: '11:30',
      zoneCode: 'ZONE-LR',
    },
    {
      id: SEED_IDS.SLOT_AFTERNOON_LR,
      code: 'AFTERNOON',
      startTime: '13:00',
      endTime: '16:00',
      zoneCode: 'ZONE-LR',
    },
    {
      id: SEED_IDS.SLOT_MORNING_SDE,
      code: 'MORNING',
      startTime: '08:30',
      endTime: '11:30',
      zoneCode: 'ZONE-SDE',
    },
    {
      id: SEED_IDS.SLOT_AFTERNOON_SDE,
      code: 'AFTERNOON',
      startTime: '13:00',
      endTime: '16:00',
      zoneCode: 'ZONE-SDE',
    },
  ],

  quotations: [
    {
      id: SEED_IDS.QUOT_9821,
      clientId: SEED_IDS.CLIENT_LAURA,
      status: 'Confirmed',
      subtotal: '4000.00',
      discountAmount: '0.00',
      total: '4000.00',
      depositRequired: '1200.00',
      currency: 'DOP',
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    },
    {
      id: SEED_IDS.QUOT_9820,
      clientId: SEED_IDS.CLIENT_CARLOS_M,
      status: 'Confirmed',
      subtotal: '4700.00',
      discountAmount: '0.00',
      total: '4700.00',
      depositRequired: '1410.00',
      currency: 'DOP',
      expiresAt: new Date(Date.now() + 6 * 24 * 3600 * 1000),
    },
    {
      id: SEED_IDS.QUOT_9819,
      clientId: SEED_IDS.CLIENT_PATRICIA,
      status: 'Confirmed',
      subtotal: '4000.00',
      discountAmount: '0.00',
      total: '4000.00',
      depositRequired: '1200.00',
      currency: 'DOP',
      expiresAt: new Date(Date.now() + 5 * 24 * 3600 * 1000),
    },
    {
      id: SEED_IDS.QUOT_9818,
      clientId: SEED_IDS.CLIENT_MANUEL,
      status: 'Sent',
      subtotal: '2500.00',
      discountAmount: '0.00',
      total: '2500.00',
      depositRequired: '750.00',
      currency: 'DOP',
      expiresAt: new Date(Date.now() + 4 * 24 * 3600 * 1000),
    },
  ],

  appointments: [
    {
      id: SEED_IDS.APT_EN_ROUTE,
      quotationId: SEED_IDS.QUOT_9821,
      clientId: SEED_IDS.CLIENT_LAURA,
      technicianId: SEED_IDS.TECH_KELVIN,
      timeSlotId: SEED_IDS.SLOT_MORNING_SPM,
      scheduledDate: new Date(),
      status: 'EnRoute',
    },
    {
      id: SEED_IDS.APT_CONFIRMED,
      quotationId: SEED_IDS.QUOT_9820,
      clientId: SEED_IDS.CLIENT_CARLOS_M,
      technicianId: SEED_IDS.TECH_CARLOS,
      timeSlotId: SEED_IDS.SLOT_AFTERNOON_SDE,
      scheduledDate: new Date(Date.now() + 24 * 3600 * 1000),
      status: 'Confirmed',
    },
    {
      id: SEED_IDS.APT_COMPLETED,
      quotationId: SEED_IDS.QUOT_9819,
      clientId: SEED_IDS.CLIENT_PATRICIA,
      technicianId: SEED_IDS.TECH_ERICKSON,
      timeSlotId: SEED_IDS.SLOT_MORNING_LR,
      scheduledDate: new Date(Date.now() - 24 * 3600 * 1000),
      status: 'Completed',
    },
    {
      id: SEED_IDS.APT_PENDING,
      quotationId: SEED_IDS.QUOT_9818,
      clientId: SEED_IDS.CLIENT_MANUEL,
      technicianId: null,
      timeSlotId: SEED_IDS.SLOT_AFTERNOON_SDE,
      scheduledDate: new Date(Date.now() + 48 * 3600 * 1000),
      status: 'PendingPayment',
    },
  ],

  payments: [
    {
      id: SEED_IDS.PAY_8812,
      appointmentId: SEED_IDS.APT_EN_ROUTE,
      type: 'DEPOSIT',
      method: 'STRIPE',
      status: 'COMPLETED',
      amount: '35.00',
      currency: 'USD',
      externalReference: 'ch_3M88A1239812',
      idempotencyKey: 'idemp_stripe_8812',
    },
    {
      id: SEED_IDS.PAY_8811,
      appointmentId: SEED_IDS.APT_CONFIRMED,
      type: 'DEPOSIT',
      method: 'BANK_TRANSFER',
      status: 'PENDING',
      amount: '42.30',
      currency: 'USD',
      externalReference: 'TRANSF-BR-88129',
      idempotencyKey: 'idemp_transf_8811',
    },
    {
      id: SEED_IDS.PAY_8810,
      appointmentId: SEED_IDS.APT_COMPLETED,
      type: 'SETTLEMENT',
      method: 'BANK_TRANSFER',
      status: 'COMPLETED',
      amount: '72.00',
      currency: 'USD',
      externalReference: 'TRANSF-BPD-44910',
      idempotencyKey: 'idemp_transf_8810',
    },
    {
      id: SEED_IDS.PAY_8809,
      appointmentId: SEED_IDS.APT_PENDING,
      type: 'DEPOSIT',
      method: 'BANK_TRANSFER',
      status: 'PENDING',
      amount: '22.50',
      currency: 'USD',
      externalReference: 'TRANSF-BHD-19022',
      idempotencyKey: 'idemp_transf_8809',
    },
    {
      id: SEED_IDS.PAY_8808,
      appointmentId: SEED_IDS.APT_COMPLETED,
      type: 'DEPOSIT',
      method: 'STRIPE',
      status: 'COMPLETED',
      amount: '56.10',
      currency: 'USD',
      externalReference: 'ch_3N19A9912001',
      idempotencyKey: 'idemp_stripe_8808',
    },
  ],

  wallets: [
    {
      id: '01000001-0000-4000-8000-000000000001',
      userId: SEED_IDS.CLIENT_LAURA,
      balance: '11.20',
      version: 2,
    },
    {
      id: '01000002-0000-4000-8000-000000000002',
      userId: SEED_IDS.CLIENT_CARLOS_M,
      balance: '4.50',
      version: 1,
    },
    {
      id: '01000003-0000-4000-8000-000000000003',
      userId: SEED_IDS.CLIENT_PATRICIA,
      balance: '21.50',
      version: 3,
    },
  ],

  walletTransactions: [
    {
      id: '02000001-0000-4000-8000-000000000001',
      walletId: '01000001-0000-4000-8000-000000000001',
      type: 'EARNED',
      amount: '11.20',
      balanceBefore: '0.00',
      balanceAfter: '11.20',
      sourceReference: 'Cashback 5% Orden #ORD-9821 (San Pedro de Macorís)',
    },
    {
      id: '02000002-0000-4000-8000-000000000002',
      walletId: '01000002-0000-4000-8000-000000000002',
      type: 'EARNED',
      amount: '4.50',
      balanceBefore: '0.00',
      balanceAfter: '4.50',
      sourceReference: 'Cashback 5% Orden #ORD-9820 (Alma Rosa SDE)',
    },
    {
      id: '02000003-0000-4000-8000-000000000003',
      walletId: '01000003-0000-4000-8000-000000000003',
      type: 'REFERRAL_BONUS',
      amount: '20.00',
      balanceBefore: '1.50',
      balanceAfter: '21.50',
      sourceReference: 'Bono Embajador MITEFREE por referir a Dra. Carmen Peña',
    },
  ],
};

/**
 * Función principal de Seeding.
 * Ejecutable mediante: bun run db:seed
 */
export async function runSeed(connectionUrl?: string): Promise<void> {
  const url = connectionUrl || process.env.DATABASE_URL;

  console.log('----------------------------------------------------');
  console.log('🚀 MITEFREE — SEED OPERACIONAL (ALR COMPANY)');
  console.log('----------------------------------------------------');

  if (!url) {
    console.log('ℹ️  DATABASE_URL no configurada.');
    console.log('✅ El conjunto de datos de seed para República Dominicana está listo');
    console.log(`   - ${SEED_DATA.users.length} Usuarios (Técnicos & Clientes)`);
    console.log(`   - ${SEED_DATA.addresses.length} Direcciones Residenciales en SPM, LR y SDE`);
    console.log(`   - ${SEED_DATA.technicianProfiles.length} Cuadrillas Operativas`);
    console.log(`   - ${SEED_DATA.services.length} Servicios de Desinfección`);
    console.log(
      `   - ${SEED_DATA.appointments.length} Citas en Pipeline (EnRoute, Confirmed, Completed)`,
    );
    console.log(`   - ${SEED_DATA.payments.length} Pagos (Stripe, Banreservas, Banco Popular)`);
    console.log(`   - ${SEED_DATA.wallets.length} Billeteras con Cashback y Bonos Embajador`);
    console.log(
      '💡 Los repositorios in-memory de NestJS consumen automáticamente esta data en desarrollo.',
    );
    return;
  }

  console.log('📡 Conectando a PostgreSQL (Neon / Cloud)...');
  const sql = neon(url);
  const db = drizzle(sql, { schema });

  try {
    console.log('🌱 Insertando Catálogo de Servicios y Telas...');
    for (const s of SEED_DATA.services) {
      await db.insert(schema.services).values(s).onConflictDoNothing();
    }
    for (const f of SEED_DATA.fabricTypes) {
      await db.insert(schema.fabricTypesTable).values(f).onConflictDoNothing();
    }
    for (const st of SEED_DATA.stainSeverities) {
      await db.insert(schema.stainSeveritiesTable).values(st).onConflictDoNothing();
    }

    console.log('🌱 Insertando Bloques Horarios por Zona...');
    for (const sl of SEED_DATA.timeSlots) {
      await db.insert(schema.timeSlots).values(sl).onConflictDoNothing();
    }

    console.log('🌱 Insertando Usuarios y Cuadrillas Técnicas...');
    for (const u of SEED_DATA.users) {
      await db.insert(schema.users).values(u).onConflictDoNothing();
    }
    for (const a of SEED_DATA.addresses) {
      await db.insert(schema.addresses).values(a).onConflictDoNothing();
    }
    for (const tp of SEED_DATA.technicianProfiles) {
      await db.insert(schema.technicianProfiles).values(tp).onConflictDoNothing();
    }

    console.log('🌱 Insertando Cotizaciones y Citas...');
    for (const q of SEED_DATA.quotations) {
      await db.insert(schema.quotations).values(q).onConflictDoNothing();
    }
    for (const apt of SEED_DATA.appointments) {
      await db.insert(schema.appointments).values(apt).onConflictDoNothing();
    }

    console.log('🌱 Insertando Pagos Conciliados y en Revisión...');
    for (const p of SEED_DATA.payments) {
      await db.insert(schema.payments).values(p).onConflictDoNothing();
    }

    console.log('🌱 Insertando Billeteras Digitales y Transacciones...');
    for (const w of SEED_DATA.wallets) {
      await db.insert(schema.wallets).values(w).onConflictDoNothing();
    }
    for (const tx of SEED_DATA.walletTransactions) {
      await db.insert(schema.walletTransactions).values(tx).onConflictDoNothing();
    }

    console.log('✨ ¡Seeding en base de datos completado con éxito absoluto!');
  } catch (error) {
    console.error('❌ Error ejecutando seeding en PostgreSQL:', error);
    throw error;
  }
}

// Auto-ejecución si se corre directamente desde CLI: bun run src/seed.ts
const isMainScript =
  typeof process !== 'undefined' &&
  Boolean(
    process.argv?.[1] &&
    (process.argv[1].endsWith('seed.ts') || process.argv[1].endsWith('seed.js')),
  );

if (isMainScript) {
  runSeed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
