# 📋 PLAN DE EJECUCIÓN — FASE 5: MOTOR DE BILLETERA, FIDELIZACIÓN & ANTI-FRAUDE

> **Organización:** ALR COMPANY — División de Ingeniería de Software  
> **Líder de Proyecto & Founder:** **Angel Luis Rosario** ([github.com/ALR1730](https://github.com/ALR1730))  
> **Mentor de Referencia:** **Ing. Leonardo** (Clean Architecture, DDD, .NET 9 / C#)  
> **Estándar:** Código Turing-Grade · Protocolos ALPHA, BETA, GAMMA, DELTA, EPSILON, ZETA  
> **Documento Base:** [`docs/MASTER_PLAN_ARQUITECTURA.md`](./MASTER_PLAN_ARQUITECTURA.md) — Sección 6.D  

---

## 1. OBJETIVO DE LA FASE 5

Implementar el sistema integral de **Fidelización y Billetera Digital (`WalletLedger`)** con contabilidad inmutable de doble asiento, algoritmo de **Cashback Automático (5%)**, **Programa de Embajadores/Referidos** con barreras anti-fraude, y **Redención de Saldo** en cotizaciones con límite de salvaguarda financiera (tope 50% de la orden).

---

## 2. COMPONENTES Y ESPECIFICACIONES TÉCNICAS

### A. Dominio Puro (`packages/domain-core`) — Protocolo BETA (Cero dependencias)
1. **`LoyaltyPolicyEngine`**:
   - `calculateCashback(paidAmount: Money, ratePercent?: number): Money` (Tasa default: 5%).
   - `calculateMaxRedeemable(orderTotal: Money, maxPercent?: number): Money` (Tope default: 50% del total).
   - `validateReferralEligibility(params)`:
     - Anti-auto-referido (`referrerUserId !== refereeUserId`).
     - Anti-fraude de contacto (`referrerPhone !== refereePhone` y `referrerEmail !== refereeEmail`).
     - Condición de liquidación: Solo liquidable cuando la cita del referido alcanza estado `Completed`.
2. **`Wallet` Aggregate Root & `WalletTransaction` Entity**:
   - Soporte para `creditReferralBonus(transactionId, amount, sourceRef, now)`.
   - Soporte para `adjustBalance(transactionId, amount, isPositive, reason, now)`.
   - Garantía de inmutabilidad y cálculo secuencial de `balanceBefore` y `balanceAfter`.

### B. Shared Contracts & DTOs (`packages/shared-types`)
1. `ApplyWalletRedemptionDto`: Monto a redimir, id de cita/cotización, validación contra tope de orden.
2. `ValidateReferralCodeDto`: Código ingresado, teléfono y email del prospecto.
3. `ReferralRewardResultDto`: Estatus de validación, bono asignable, descuento de bienvenida.
4. `WalletLedgerResponseDto`: Saldo actual, total acreditado histórico, total redimido histórico, listado tipado de transacciones.

### C. Casos de Uso & API Core (`apps/api`)
1. `ProcessAppointmentCompletedCashbackUseCase`:
   - Se ejecuta cuando una cita pasa a `COMPLETED`.
   - Acredita el 5% de lo pagado a la billetera del cliente de forma transaccional.
2. `ValidateReferralCodeUseCase`:
   - Consulta y valida códigos de embajadores aplicando reglas anti-fraude.
3. `ProcessReferralBonusUseCase`:
   - Al completarse la primera cita de un usuario referido, acredita $20 USD / RD$ 1,200 DOP al patrocinador.
4. `ApplyWalletRedemptionUseCase`:
   - Aplica saldo al balance de la orden respetando el tope del 50%.
5. `WalletsController`:
   - Endpoints `/api/v1/wallets/me`, `/api/v1/wallets/referrals/validate`, `/api/v1/wallets/redeem`, `/api/v1/wallets/transactions`.

### D. Experiencia de Usuario & Interfaces
1. **PWA Client (`apps/pwa-client`)**:
   - `/wallet`: Visualización en tiempo real del saldo, ledger contable, generador de enlace para compartir código por WhatsApp.
   - `/cotizar`: Paso 3 con switch para "Usar saldo de mi billetera" con cálculo dinámico del descuento hasta el 50%.
2. **Admin Portal (`apps/admin-portal`)**:
   - Panel de control y auditoría de billeteras en `/configuracion` y `/dashboard`: métricas de cashback emitido, auditoría anti-fraude y listado de transacciones.

---

## 3. SUITE DE PRUEBAS TDD
- Tests unitarios en `packages/domain-core` para `LoyaltyPolicyEngine` y operaciones de `Wallet`.
- Tests de integración en `apps/api` para casos de uso de cashback, validación de referidos y redención con tope.
- Cobertura objetivo: **≥ 95%**.
