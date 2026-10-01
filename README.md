# 🛡️ MITEFREE — Enterprise Platform
> **Organización:** [ALR COMPANY](https://github.com/ALR1730) — División de Ingeniería de Software  
> **Líder de Proyecto & Founder:** [Angel Luis Rosario](https://github.com/ALR1730)  
> **Mentor Académico:** Ing. Leonardo (Base formativa Programación III: C#, .NET 9, Onion Architecture)  
> **Arquitectura:** Clean Architecture · Domain-Driven Design (DDD) · Turborepo Monorepo  
> **Estándar:** Nivel Premio Turing — Precisión quirúrgica, modular y con cero deuda técnica.

---

## 📖 Descripción General

**MITEFREE** es una plataforma integral de grado industrial diseñada para automatizar la captación, cotización algorítmica de precisión, agendamiento con optimización de rutas y fidelización (cashback inmutable) de servicios especializados de desinfección y limpieza profunda de tapicería, colchones y muebles.

Para conocer la especificación técnica completa, consulte el documento maestro:
👉 **[Plano Maestro de Arquitectura de Software v3.0.0](docs/MASTER_PLAN_ARQUITECTURA.md)**

---

## ⚡ Quickstart (Onboarding en 5 Pasos)

```bash
# 1. Clonar el repositorio
git clone https://github.com/ALR1730/MITEFREE.git
cd MITEFREE

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Instalar dependencias con Bun
bun install

# 4. Generar y aplicar migraciones de base de datos (PostgreSQL / Neon)
bun run db:migrate

# 5. Iniciar todo el ecosistema en desarrollo (PWA + Admin + API Core)
bun run dev
```

---

## 🏛️ Estructura del Proyecto (Turborepo Monorepo)

```text
mitefree/
├── apps/
│   ├── pwa-client/       # Next.js 15 App Router PWA de cara al cliente final
│   ├── admin-portal/     # Next.js 15 Panel de Operaciones, Despacho y Finanzas
│   └── api/              # Core API NestJS 11+ / Bun con Clean Architecture estricta
├── packages/
│   ├── domain-core/      # Entidades puras, Value Objects y algoritmos de pricing
│   ├── database/         # Schemas Drizzle ORM, migraciones y pool Neon Postgres
│   ├── shared-types/     # DTOs y validadores Zod compartidos
│   └── ui/               # Sistema de diseño y componentes compartidos
├── docs/                 # Plano maestro de arquitectura y documentación técnica
└── tests/                # Suites de pruebas Vitest, Testcontainers y Playwright
```

---

## 🗺️ Mapa de Equivalencias para Desarrolladores .NET

| Capa TypeScript / Bun | Proyecto Equivalente .NET 9 ([RealEstateApp](https://github.com/ALR1730/RealEstateApp)) |
| :--- | :--- |
| `packages/domain-core` | `Mitefree.Core.Domain` |
| `apps/api/src/application` | `Mitefree.Core.Application` (CQRS / MediatR) |
| `packages/database` + `infra/persistence` | `Mitefree.Infrastructure.Persistence` (EF Core / Drizzle) |
| `apps/api/src/infrastructure` | `Mitefree.Infrastructure.Shared` |
| `apps/api/src/presentation` | `Mitefree.Presentation.WebAPI` |
| `apps/pwa-client` & `admin-portal` | ASP.NET MVC / Razor / Blazor Views |

---

## 🛡️ Protocolo de Calidad ALR COMPANY

- Cobertura mínima en motores de cálculo (Pricing, Agenda, Cashback): **≥ 95%**.
- Regla de dependencia absoluta: `Domain` no conoce a `Infrastructure`.
- Formato de errores estandarizado bajo RFC 7807 (ProblemDetails).
