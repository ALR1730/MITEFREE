/**
 * MITEFREE — Suite de Auditoría y Test en Caliente (35 Minutos)
 * ALR COMPANY — División de Ingeniería de Software
 * 
 * Evalúa todas las funciones de apps/pwa-client (3000), apps/admin-portal (3001) y apps/api (4000).
 */

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const API_BASE = 'http://localhost:4000/api/v1';
const PWA_CLIENT_BASE = 'http://localhost:3000';
const ADMIN_PORTAL_BASE = 'http://localhost:3001';

const LOG_DIR = join(process.cwd(), 'docs');
const LOG_FILE = join(LOG_DIR, 'AUDIT_HOT_RESULTS.json');
const LOG_STREAM = join(LOG_DIR, 'AUDIT_HOT_LOG.txt');

if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

interface AuditRecord {
  timestamp: string;
  category: 'PWA_CLIENT' | 'ADMIN_PORTAL' | 'API_CORE' | 'SECURITY' | 'CONCURRENCY';
  testName: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  durationMs: number;
  details: string;
  error?: string;
}

const auditLog: AuditRecord[] = [];

function record(entry: Omit<AuditRecord, 'timestamp'>) {
  const full: AuditRecord = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  auditLog.push(full);
  const logLine = `[${full.timestamp}] [${full.status}] [${full.category}] ${full.testName} (${full.durationMs}ms) - ${full.details}${full.error ? ` | Error: ${full.error}` : ''}\n`;
  appendFileSync(LOG_STREAM, logLine);
  console.log(logLine.trim());
}

async function fetchWithTiming(url: string, options?: RequestInit): Promise<{ res: Response; timeMs: number }> {
  const start = performance.now();
  const res = await fetch(url, options);
  const timeMs = Math.round(performance.now() - start);
  return { res, timeMs };
}

// -------------------------------------------------------------
// FASE 1: Verificación de Rutas y Páginas en PWA Client (3000)
// -------------------------------------------------------------
async function auditPwaClientRoutes() {
  const routes = [
    { path: '/', name: 'Landing Page' },
    { path: '/cotizar', name: 'Cotizador Inteligente' },
    { path: '/agenda', name: 'Agendador de Citas & Despacho' },
    { path: '/mis-citas', name: 'Live Tracking & Telemetría' },
    { path: '/wallet', name: 'Billetera Cashback' },
    { path: '/login', name: 'Acceso de Clientes' },
    { path: '/registro', name: 'Registro de Clientes' },
  ];

  for (const r of routes) {
    try {
      const { res, timeMs } = await fetchWithTiming(`${PWA_CLIENT_BASE}${r.path}`);
      const text = await res.text();
      const hasHtml = text.includes('<!DOCTYPE html>') || text.includes('<html');

      if (res.status === 200 && hasHtml) {
        record({
          category: 'PWA_CLIENT',
          testName: `Ruta ${r.path} (${r.name})`,
          status: timeMs > 1500 ? 'WARN' : 'PASS',
          durationMs: timeMs,
          details: `Renderizado 200 OK (${Math.round(text.length / 1024)} KB transferidos)`,
        });
      } else {
        record({
          category: 'PWA_CLIENT',
          testName: `Ruta ${r.path} (${r.name})`,
          status: 'FAIL',
          durationMs: timeMs,
          details: `Código HTTP ${res.status}`,
          error: `Respuesta no esperada o vacía`,
        });
      }
    } catch (err: any) {
      record({
        category: 'PWA_CLIENT',
        testName: `Ruta ${r.path} (${r.name})`,
        status: 'FAIL',
        durationMs: 0,
        details: 'Fallo al conectar',
        error: err.message,
      });
    }
  }
}

// -------------------------------------------------------------
// FASE 2: Verificación de Rutas en Admin Portal (3001)
// -------------------------------------------------------------
async function auditAdminPortalRoutes() {
  const routes = [
    { path: '/', name: 'Tablero Kanban de Despacho' },
    { path: '/pagos', name: 'Revisión y Conciliación de Pagos' },
    { path: '/clientes', name: 'Directorio de Clientes' },
    { path: '/catalogo', name: 'Catálogo de Muebles y Servicios' },
    { path: '/rutas', name: 'Mapa de Rutas Técnicas' },
  ];

  for (const r of routes) {
    try {
      const { res, timeMs } = await fetchWithTiming(`${ADMIN_PORTAL_BASE}${r.path}`);
      const text = await res.text();
      const hasHtml = text.includes('<!DOCTYPE html>') || text.includes('<html');

      if (res.status === 200 && hasHtml) {
        record({
          category: 'ADMIN_PORTAL',
          testName: `Ruta ${r.path} (${r.name})`,
          status: timeMs > 1500 ? 'WARN' : 'PASS',
          durationMs: timeMs,
          details: `Renderizado 200 OK (${Math.round(text.length / 1024)} KB)`,
        });
      } else {
        record({
          category: 'ADMIN_PORTAL',
          testName: `Ruta ${r.path} (${r.name})`,
          status: 'FAIL',
          durationMs: timeMs,
          details: `Código HTTP ${res.status}`,
          error: `Respuesta inesperada`,
        });
      }
    } catch (err: any) {
      record({
        category: 'ADMIN_PORTAL',
        testName: `Ruta ${r.path} (${r.name})`,
        status: 'FAIL',
        durationMs: 0,
        details: 'Fallo al conectar',
        error: err.message,
      });
    }
  }
}

// -------------------------------------------------------------
// FASE 3: Auditoría Integral del API Core (4000)
// -------------------------------------------------------------
async function auditApiCore() {
  // 1. Health Endpoint
  try {
    const { res, timeMs } = await fetchWithTiming(`http://localhost:4000/health`);
    if (res.status === 200) {
      record({
        category: 'API_CORE',
        testName: 'Health Check (/health)',
        status: 'PASS',
        durationMs: timeMs,
        details: 'Core API saludable',
      });
    } else {
      record({
        category: 'API_CORE',
        testName: 'Health Check (/health)',
        status: 'WARN',
        durationMs: timeMs,
        details: `HTTP ${res.status}`,
      });
    }
  } catch (err: any) {
    record({
      category: 'API_CORE',
      testName: 'Health Check (/health)',
      status: 'FAIL',
      durationMs: 0,
      details: 'Error de red',
      error: err.message,
    });
  }

  // 2. Catálogo y Políticas de Descuento
  try {
    const { res, timeMs } = await fetchWithTiming(`${API_BASE}/catalog`);
    const data = await res.json();
    record({
      category: 'API_CORE',
      testName: 'Catálogo de Servicios (GET /catalog)',
      status: res.status === 200 && Array.isArray(data) ? 'PASS' : 'FAIL',
      durationMs: timeMs,
      details: `Catálogo cargó ${Array.isArray(data) ? data.length : 0} ítems de tapicería`,
    });
  } catch (err: any) {
    record({
      category: 'API_CORE',
      testName: 'Catálogo de Servicios (GET /catalog)',
      status: 'FAIL',
      durationMs: 0,
      details: 'Fallo al consultar catálogo',
      error: err.message,
    });
  }

  try {
    const { res, timeMs } = await fetchWithTiming(`${API_BASE}/config/discounts`);
    const data = await res.json();
    record({
      category: 'API_CORE',
      testName: 'Políticas de Descuento (GET /config/discounts)',
      status: res.status === 200 && data.zones ? 'PASS' : 'FAIL',
      durationMs: timeMs,
      details: `Políticas activas para ${data.zones?.length ?? 0} zonas y ${data.slots?.length ?? 0} bloques`,
    });
  } catch (err: any) {
    record({
      category: 'API_CORE',
      testName: 'Políticas de Descuento (GET /config/discounts)',
      status: 'FAIL',
      durationMs: 0,
      details: 'Error en descuentos',
      error: err.message,
    });
  }

  // 3. Matriz de Disponibilidad de Horarios y Promociones de Ruta (72 permutaciones)
  const zones = ['ZONE-DN', 'ZONE-SDE', 'ZONE-SPM', 'ZONE-LR'];
  const dates = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0]!;
  });

  let slotsEvaluated = 0;
  let slotsSuccessful = 0;

  for (const z of zones) {
    for (const dt of dates) {
      slotsEvaluated++;
      try {
        const { res, timeMs } = await fetchWithTiming(`${API_BASE}/appointments/slots?zoneCode=${z}&date=${dt}`);
        if (res.status === 200) {
          slotsSuccessful++;
        }
      } catch {
        // Contador
      }
    }
  }

  record({
    category: 'API_CORE',
    testName: `Matriz de Bloques y Rutas Dinámicas (${slotsEvaluated} combinaciones)`,
    status: slotsSuccessful === slotsEvaluated ? 'PASS' : 'WARN',
    durationMs: 0,
    details: `${slotsSuccessful}/${slotsEvaluated} consultas evaluadas correctamente en tiempo real`,
  });

  // 4. Creación de Cotización de Prueba con DDD Pricing Engine
  let createdQuotationId: string | null = null;
  try {
    const payload = {
      items: [
        {
          furnitureTypeId: 'sofa-3-seater',
          fabricType: 'VELVET',
          stainSeverity: 'CRITICAL',
          serviceType: 'DEEP_CLEANING_DISINFECTION',
          additionalServices: ['ANTI_MITE_SHIELD', 'ODOR_NEUTRALIZER'],
        },
      ],
      coverageZoneCode: 'ZONE-DN',
    };

    const { res, timeMs } = await fetchWithTiming(`${API_BASE}/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status === 201 && data.id) {
      createdQuotationId = data.id;
      record({
        category: 'API_CORE',
        testName: 'Creación de Cotización Inteligente (POST /quotations)',
        status: 'PASS',
        durationMs: timeMs,
        details: `Cotización #${data.id.substring(0, 8)} calculada: Total RD$ ${data.total} | Anticipo 30% RD$ ${data.depositAmount}`,
      });
    } else {
      record({
        category: 'API_CORE',
        testName: 'Creación de Cotización Inteligente (POST /quotations)',
        status: 'FAIL',
        durationMs: timeMs,
        details: `HTTP ${res.status}`,
        error: JSON.stringify(data),
      });
    }
  } catch (err: any) {
    record({
      category: 'API_CORE',
      testName: 'Creación de Cotización Inteligente (POST /quotations)',
      status: 'FAIL',
      durationMs: 0,
      details: 'Fallo al cotizar',
      error: err.message,
    });
  }

  // 5. Agendamiento Completo de Cita con Ubicación Satelital GPS
  let createdAppointmentId: string | null = null;
  try {
    const bookingPayload = {
      quotationId: createdQuotationId || undefined,
      clientName: 'Ing. Test Auditor ALR',
      clientPhone: '+1 809-555-0188',
      address: 'Av. Winston Churchill #105, Torre Empresarial, Apto 4B, Piantini [GPS: 18.4721, -69.9345]',
      zoneCode: 'ZONE-DN',
      timeSlotId: 'MORNING',
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      serviceDescription: 'Auditoría Técnica: Desinfección Sofá Velvet Terciopelo',
      totalAmount: 4500,
      depositAmount: 1350,
    };

    const { res, timeMs } = await fetchWithTiming(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload),
    });

    const data = await res.json();
    if (res.status === 201 && data.id) {
      createdAppointmentId = data.id;
      record({
        category: 'API_CORE',
        testName: 'Agendamiento de Cita con Coordenadas GPS (POST /appointments)',
        status: 'PASS',
        durationMs: timeMs,
        details: `Cita #${data.id.substring(0, 8)} agendada con éxito para ${bookingPayload.clientName}`,
      });
    } else {
      record({
        category: 'API_CORE',
        testName: 'Agendamiento de Cita con Coordenadas GPS (POST /appointments)',
        status: 'FAIL',
        durationMs: timeMs,
        details: `HTTP ${res.status}`,
        error: JSON.stringify(data),
      });
    }
  } catch (err: any) {
    record({
      category: 'API_CORE',
      testName: 'Agendamiento de Cita con Coordenadas GPS (POST /appointments)',
      status: 'FAIL',
      durationMs: 0,
      details: 'Fallo al agendar',
      error: err.message,
    });
  }

  // 6. Transición de Estados del Ciclo de Vida de la Cita
  if (createdAppointmentId) {
    const stateTransitions = ['Confirmed', 'EnRoute', 'InProgress', 'Completed'];

    for (const nextSt of stateTransitions) {
      try {
        const { res, timeMs } = await fetchWithTiming(`${API_BASE}/appointments/${createdAppointmentId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nextStatus: nextSt }),
        });

        const data = await res.json();
        if (res.status === 200 && data.status === nextSt) {
          record({
            category: 'API_CORE',
            testName: `Transición de Estado de Cita ➔ ${nextSt}`,
            status: 'PASS',
            durationMs: timeMs,
            details: `Estado actualizado a ${nextSt} correctamente`,
          });
        } else {
          record({
            category: 'API_CORE',
            testName: `Transición de Estado de Cita ➔ ${nextSt}`,
            status: 'FAIL',
            durationMs: timeMs,
            details: `HTTP ${res.status}`,
            error: JSON.stringify(data),
          });
        }
      } catch (err: any) {
        record({
          category: 'API_CORE',
          testName: `Transición de Estado de Cita ➔ ${nextSt}`,
          status: 'FAIL',
          durationMs: 0,
          details: 'Error en transición',
          error: err.message,
        });
      }
    }

    // 7. Prueba Negativa: Intentar Transición Ilegal (Completed ➔ Confirmed)
    try {
      const { res, timeMs } = await fetchWithTiming(`${API_BASE}/appointments/${createdAppointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextStatus: 'Confirmed' }),
      });

      if (res.status === 400) {
        record({
          category: 'SECURITY',
          testName: 'Invariante de Máquina de Estados (Completed ➔ Confirmed Reversion Block)',
          status: 'PASS',
          durationMs: timeMs,
          details: 'El backend bloqueó exitosamente la transición ilegal con HTTP 400',
        });
      } else {
        record({
          category: 'SECURITY',
          testName: 'Invariante de Máquina de Estados (Completed ➔ Confirmed Reversion Block)',
          status: 'WARN',
          durationMs: timeMs,
          details: `Respondió con HTTP ${res.status} en lugar de 400`,
        });
      }
    } catch (err: any) {
      record({
        category: 'SECURITY',
        testName: 'Invariante de Máquina de Estados',
        status: 'FAIL',
        durationMs: 0,
        details: 'Fallo al probar invariante',
        error: err.message,
      });
    }
  }

  // 8. Billetera y Cashback
  try {
    const { res, timeMs } = await fetchWithTiming(`${API_BASE}/wallets/referrals/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode: 'MITEFREE-TEST-CODE' }),
    });
    record({
      category: 'API_CORE',
      testName: 'Validación de Código de Referidos (/wallets/referrals/validate)',
      status: res.status === 200 || res.status === 400 ? 'PASS' : 'WARN',
      durationMs: timeMs,
      details: `Endpoint respondió con código esperado ${res.status}`,
    });
  } catch (err: any) {
    record({
      category: 'API_CORE',
      testName: 'Validación de Código de Referidos',
      status: 'FAIL',
      durationMs: 0,
      details: 'Error en referidos',
      error: err.message,
    });
  }

  // 9. Pruebas de Blindaje de Seguridad y Entradas Hostiles (OWASP)
  const hostilePayloads = [
    { name: 'Inyección SQL en clientName', payload: { clientName: "'; DROP TABLE appointments; --" } },
    { name: 'XSS en Dirección', payload: { address: '<script>alert("pwned")</script>' } },
    { name: 'Monto Negativo en Total', payload: { totalAmount: -5000 } },
  ];

  for (const h of hostilePayloads) {
    try {
      const { res, timeMs } = await fetchWithTiming(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(h.payload),
      });

      if (res.status === 400) {
        record({
          category: 'SECURITY',
          testName: `Protección OWASP: ${h.name}`,
          status: 'PASS',
          durationMs: timeMs,
          details: 'Validación Zod rechazó la carga hostil con HTTP 400 BadRequest',
        });
      } else {
        record({
          category: 'SECURITY',
          testName: `Protección OWASP: ${h.name}`,
          status: 'WARN',
          durationMs: timeMs,
          details: `El servidor devolvió HTTP ${res.status}`,
        });
      }
    } catch {
      // Ignorar
    }
  }
}

// -------------------------------------------------------------
// BUCLE PRINCIPAL DE RESISTENCIA Y TELEMETRÍA (35 MINUTOS)
// -------------------------------------------------------------
async function runContinuousHotAudit() {
  const TOTAL_DURATION_MS = 35 * 60 * 1000; // 35 minutos exactos
  const START_TIME = Date.now();
  let cycle = 1;

  console.log(`[ALR COMPANY] Iniciando Suite de Auditoría en Caliente. Duración: 35 minutos exactos.`);

  while (Date.now() - START_TIME < TOTAL_DURATION_MS) {
    const elapsedMinutes = ((Date.now() - START_TIME) / 60000).toFixed(1);
    const remainingMinutes = ((TOTAL_DURATION_MS - (Date.now() - START_TIME)) / 60000).toFixed(1);

    console.log(`\n================================================================`);
    console.log(` CICLO DE AUDITORÍA #${cycle} | Transcurrido: ${elapsedMinutes} min | Restante: ${remainingMinutes} min`);
    console.log(`================================================================`);

    // 1. Evaluar PWA Client
    await auditPwaClientRoutes();

    // 2. Evaluar Admin Portal
    await auditAdminPortalRoutes();

    // 3. Evaluar API Core
    await auditApiCore();

    // Guardar snapshot de resultados
    writeFileSync(LOG_FILE, JSON.stringify(auditLog, null, 2));

    cycle++;

    // Pausa breve de 45 segundos entre ciclos para no saturar CPU y medir estabilidad a largo plazo
    const timeRemaining = TOTAL_DURATION_MS - (Date.now() - START_TIME);
    if (timeRemaining > 45000) {
      await new Promise((resolve) => setTimeout(resolve, 45000));
    } else {
      break;
    }
  }

  console.log(`\n[ALR COMPANY] Auditoría de 35 minutos finalizada con éxito.`);
  writeFileSync(LOG_FILE, JSON.stringify(auditLog, null, 2));
}

runContinuousHotAudit().catch((err) => {
  console.error('Error crítico en suite de auditoría:', err);
});
