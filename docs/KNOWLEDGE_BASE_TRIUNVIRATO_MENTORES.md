# 🏛️ Base de Conocimiento de Ingeniería: El Triunvirato de Mentoría

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder de Proyecto & Founder:** [Angel Luis Rosario](https://github.com/ALR1730)  
> **Estándar de Calidad:** Turing-Grade (Clean Architecture · DDD · SOLID · Patrones GoF)  
> **Fecha de Emisión:** 12 de Octubre de 2026  
> **Propósito:** Documento de referencia que consolida las metodologías, patrones y filosofías técnicas de los tres canales de mentoría oficial de ALR COMPANY para la toma de decisiones arquitectónicas en backend, persistencia y frontend.

---

## 🧭 1. Resumen Ejecutivo del Triunvirato

Para que una plataforma enterprise como **MITEFREE** sea indestructible, mantenible a 5 años y escalable, el equipo de ingeniería de ALR COMPANY sintetiza las enseñanzas de tres grandes referentes de habla hispana:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          EL TRIUNVIRATO DE MENTORÍA ALR COMPANY                        │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ 🎓 Ing. Leonardo         │ 🛠️ Héctor de León           │ 🎨 Gentleman Programming      │
│ (@leonardtv93)           │ (@hdeleonnet)               │ (@gentlemanprogramming)       │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ • Onion Architecture     │ • Patrones GoF Pragmáticos  │ • Clean Frontend Architecture │
│ • Repository Pattern     │ • EF Core Alto Rendimiento  │ • Patrón Adapter (ACL)        │
│ • Fluent API Segregada   │ • SOLID sin sobreingeniería │ • Screaming Architecture      │
│ • Auth de Roles/Sesiones │ • C# Moderno & Inmutable    │ • TypeScript Estricto (No Any)│
│ • C# .NET 9 Empresarial  │ • CQRS & Strategy Pattern   │ • Inversión de Dependencias   │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

---

## 🎓 2. Ing. Leonardo (`@leonardtv93`) — Mentor Académico y Fundacional

Canal de referencia: [youtube.com/@leonardtv93](https://www.youtube.com/@leonardtv93)  
Cátedra base: *Programación III — C#, .NET 9, Onion Architecture y Desarrollo Web Empresarial*.

### 2.1 Principios y Filosofía Arquitectónica
El Ing. Leonardo forjó la disciplina técnica y los estándares de arquitectura multicapa de Angel Luis Rosario, reflejados en repositorios como [RealEstateApp](https://github.com/ALR1730/RealEstateApp) y [UPS-orion](https://github.com/ALR1730/UPS-orion).

1. **Onion Architecture Rigurosa:**
   - La estructura se organiza en anillos concéntricos con dependencias estrictas hacia adentro:
     ```
     [ Domain ] ◄── [ Application ] ◄── [ Infrastructure ] ◄── [ Presentation (WebAPI / MVC) ]
     ```
   - **Capa Domain:** Contiene únicamente entidades de negocio puras, enumeraciones y Value Objects. Cero referencias a frameworks, paquetes NuGet de persistencia o librerías HTTP.
   - **Capa Application:** Define las interfaces de repositorios (`IRepository<T>`), los DTOs, ViewModels, servicios de aplicación y contratos de validación.
   - **Capa Infrastructure (Persistence & Shared):** Implementa el `DbContext`, configuraciones de base de datos, repositorios concretos y servicios externos (correo, SMS).
   - **Capa Presentation:** Controladores delgados (*Thin Controllers*) que únicamente reciben la petición, delegan en la capa de aplicación y retornan la respuesta tipada.

2. **Repository Pattern Genérico y Especializado:**
   - Uso de una interfaz base `IGenericRepository<T>` para operaciones CRUD atómicas (`AddAsync`, `UpdateAsync`, `DeleteAsync`, `GetByIdAsync`, `GetAllAsync`).
   - Creación de repositorios especializados (`IQuotationRepository`, `IAppointmentRepository`) para consultas complejas que involucran agregados, filtros específicos o transacciones complejas.

3. **Fluent API Segregada (`IEntityTypeConfiguration<T>`):**
   - **Regla de Oro:** Prohibido ensuciar las entidades del dominio con `Data Annotations` de persistencia (`[Column]`, `[ForeignKey]`).
   - Cada entidad tiene su propia clase de configuración que implementa `IEntityTypeConfiguration<TEntity>`.
   - El método `OnModelCreating` del `DbContext` se mantiene limpio aplicando todas las configuraciones automáticamente mediante:
     ```csharp
     modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
     ```

4. **Autenticación y Control de Acceso Empresarial:**
   - Esquemas robustos basados en roles (`Admin`, `User`, `Technician`).
   - Separación estricta de responsabilidades entre el usuario de identidad (ASP.NET Identity / Auth) y el modelo de cliente del dominio.

---

## 🛠️ 3. Héctor de León (`@hdeleonnet`) — Mentor de Patrones, C# y Backend Pragmático

Canal de referencia: [youtube.com/@hdeleonnet](https://www.youtube.com/@hdeleonnet)  
Especialidad: *Microsoft MVP, Patrones de Diseño GoF, Entity Framework Core y C# Moderno*.

### 3.1 Principios y Filosofía de Diseño
La enseñanza fundamental de Héctor de León es: **"Hacer lo complejo simple. Menos ego de arquitecto y más código legible y funcional."**

1. **Patrones de Diseño GoF Pragmáticos:**
   - **Strategy Pattern:** En lugar de cadenas interminables de `if-else` o `switch` para calcular precios, descuentos o recargos, encapsular cada algoritmo en una estrategia que implemente una interfaz común:
     - En MITEFREE: `IFabricPriceStrategy`, `IZonePricingStrategy`. Permite agregar una nueva tela o zona sin tocar el código existente (cumpliendo OCP).
   - **Factory Method & Builder:** Para la construcción de entidades complejas con múltiples validaciones o estados iniciales, evitando constructores monstruosos con 15 parámetros.
   - **Decorator Pattern:** Añadir responsabilidades dinámicamente (logging, caching, métricas de rendimiento) sin alterar el comportamiento de la clase original.
   - **Adapter Pattern:** Envolver cualquier SDK o API externa (Stripe, Cloudflare, WhatsApp) detrás de una interfaz propia de nuestra aplicación para evitar acoplamiento directo a librerías de terceros.
   - **Unit of Work:** Coordinar múltiples repositorios dentro de una sola transacción para garantizar operaciones atómicas (*todo o nada*).

2. **Optimización Extrema de Entity Framework Core:**
   - **`AsNoTracking()` para Lecturas:** Si los datos solo se van a leer para enviarlos a una vista o API, desactivar el Change Tracker para ahorrar memoria y duplicar la velocidad de consulta.
   - **Split Queries (`AsSplitQuery()`):** Al hacer múltiples `.Include()` en relaciones 1:N, EF Core por defecto genera un JOIN masivo que provoca una explosión de producto cartesiano en SQL. Usar `.AsSplitQuery()` para ejecutar consultas independientes y combinar los resultados en memoria.
   - **Proyecciones con `.Select()`:** Nunca traer la entidad completa de 30 columnas si solo necesitas 3 datos para la pantalla. Proyectar directamente al DTO en la consulta SQL.
   - **Manejo Explícito de Transacciones:** Usar `IDbContextTransaction` con bloques `using` para operaciones donde varias tablas deben sincronizarse.

3. **C# Moderno e Idiomático:**
   - Uso de `record` para Value Objects inmutables con igualdad por valor.
   - Pattern Matching (`switch expressions`) para código conciso y seguro.
   - *Primary Constructors* para inyección de dependencias limpia sin boilerplate de campos privados.
   - Activación obligatoria de *Nullable Reference Types* (`#nullable enable`) para exterminar los `NullReferenceException` en tiempo de compilación.

---

## 🎨 4. Gentleman Programming (`@gentlemanprogramming` — Alan Buscaglia) — Clean Architecture en Frontend & TypeScript

Canal de referencia: [youtube.com/@gentlemanprogramming](https://www.youtube.com/@gentlemanprogramming)  
Especialidad: *Arquitectura de Software Frontend, Clean Architecture en React/Next.js y TypeScript de Élite*.

### 4.1 Principios y Filosofía de Diseño
Alan Buscaglia desmonta el mito de que el frontend es solo "hacer interfaces bonitas". El frontend debe regirse por los mismos principios de arquitectura limpia e inversión de dependencias que el backend.

1. **Las 5 Capas de la Clean Architecture en Frontend:**
   ```mermaid
   graph LR
       DS["1. Data Source<br/>(API Call / Fetch)"] -->|"DTO Crudo"| ACL["2. Adapter / ACL<br/>(Anti-Corruption Layer)"]
       ACL -->|"Modelo de Dominio UI"| REP["3. Repository / Store<br/>(Zustand / TanStack Query)"]
       REP --> UC["4. Use Case / Hook<br/>(Lógica & Orquestación)"]
       UC --> UI["5. Componente UI<br/>(Dumb / Presentacional)"]
   ```

   - **Capa 1 — Data Source / Service:** Función pura que hace el llamado HTTP (`fetch` o `axios`). Solo conoce la URL, el método y el formato del request.
   - **Capa 2 — Adapter (Anti-Corruption Layer):** **El corazón de la mantenibilidad.** Transforma la estructura de datos que devuelve la API externa en el modelo puro que la UI necesita consumir.
     > *Si mañana el backend renombra `fabric_type` por `materialCode` o cambia la estructura de fechas, **la UI jamás se modifica**; solo se ajusta el Adapter.*
   - **Capa 3 — Repository / Store:** Almacén de estado tipado (Zustand, React Query, Context). Abstrae cómo y dónde se guarda la información en el cliente.
   - **Capa 4 — Use Cases / Custom Hooks:** Contiene la lógica de interacción del usuario (ej. `useQuotationFlow`, `useBookingSummary`). No contiene JSX ni estilos.
   - **Capa 5 — Componentes UI:** Componentes visuales desacoplados que reciben props tipadas y emiten eventos (`onClick`, `onChange`).

2. **Screaming Architecture & Modularización por Features:**
   - La arquitectura debe "gritar" el dominio del negocio, no las tecnologías.
   - **Estructura Incorrecta (Agrupación por tipo técnico):**
     ```
     src/
       components/   (80 componentes revueltos)
       hooks/        (40 hooks)
       services/     (30 archivos)
     ```
   - **Estructura Correcta (Screaming por Feature):**
     ```
     src/
       modules/
         cotizador/
           components/
           adapters/
           services/
           hooks/
           models/
         agenda/
         billetera/
     ```

3. **Inversión de Dependencias (DIP) en TypeScript:**
   - Un componente visual nunca debe instanciar un servicio de red directamente.
   - Todo se inyecta mediante hooks o props tipadas por interfaz.

4. **TypeScript de Élite (Cero `any`):**
   - El uso de `any` está terminantemente vetado porque desactiva el compilador.
   - Uso de `unknown` para datos no verificados en el borde de entrada de la red, seguido de validación runtime (Zod o Type Guards).
   - *Discriminated Unions* para modelar estados de la UI de forma exhautiva y sin ambigüedades:
     ```typescript
     type RequestState<T> =
       | { status: 'idle' }
       | { status: 'loading' }
       | { status: 'success'; data: T }
       | { status: 'error'; error: ProblemDetails };
     ```

5. **Manejo Predecible de Errores (Result Pattern & RFC 7807):**
   - Prohibido propagar errores silenciosos o envolver todo en `try/catch` vacíos.
   - Los errores de red y validación se modelan como valores de retorno con contratos estándar RFC 7807 (`title`, `status`, `detail`).

---

## 🗺️ 5. Matriz de Equivalencias y Aplicación en MITEFREE

| Necesidad de Ingeniería | Enfoque Ing. Leonardo (.NET 9) | Enfoque Héctor de León (C# / GoF) | Enfoque Gentleman (TS / Web) | Implementación en MITEFREE |
| :--- | :--- | :--- | :--- | :--- |
| **Separación de Capas** | Onion Architecture (`Domain`, `App`, `Infra`) | Clean Architecture pragmática | Clean Architecture en Frontend (5 capas) | Monorepo Turborepo con `domain-core` aislado y Next.js modular. |
| **Acceso a Datos** | `IGenericRepository<T>` + `IRepository` | EF Core `AsNoTracking` + Proyecciones | Data Source ➔ Adapter ➔ Repository Store | Drizzle ORM segregado con fallback en memoria y clientes tipados. |
| **Reglas de Cotización** | Servicio de Aplicación con validación | Strategy Pattern para tarifas/telas | Hook desacoplado + Adapter de cotización | `QuotationPricingEngine` en dominio puro con cálculo en centavos. |
| **Estructura de Carpetas** | Solución `.sln` con proyectos segregados | Módulos cohesivos con SRP | Screaming Architecture por Features | `apps/pwa-client/src/components/{cotizador,agenda}/` modularizado. |
| **Manejo de Errores** | Middleware global con ProblemDetails | Result Pattern sin excepciones de flujo | Discriminated Unions + Result tipado | RFC 7807 estandarizado en NestJS y parseado por `api-client.ts`. |
| **Seguridad y Roles** | ASP.NET Identity con `[Authorize(Roles)]` | Guards e inyección de contexto de usuario | Guards perimetrales + Storage seguro | `JwtAuthGuard` + `RolesGuard` con PBKDF2 SHA-512 y HMAC tokens. |

---

## 🏆 6. Mandato de Integración Operativa para el Equipo

A partir de este momento, cada decisión de ingeniería tomada por el agente en **MITEFREE** o en cualquier proyecto de **ALR COMPANY** debe superar el siguiente filtro mental:

1. **El Filtro del Ing. Leonardo:** ¿Respeta la arquitectura en capas? ¿El dominio se mantiene 100% puro y las entidades desacopladas de librerías externas?
2. **El Filtro de Héctor de León:** ¿Estamos usando el patrón GoF adecuado o estamos inventando una rueda innecesaria? ¿La consulta a base de datos es óptima o estamos cargando entidades pesadas en memoria?
3. **El Filtro de Gentleman Programming:** ¿El componente de React/Next.js está consumiendo un Adapter o está acoplado al DTO de la API? ¿Las carpetas gritan la intención del negocio? ¿Hay algún `any` que deba ser erradicado?

---
*Documento aprobado por ALR COMPANY — División de Ingeniería de Software.*  
*Ley Suprema de Ingeniería · Nivel Premio Turing.*
