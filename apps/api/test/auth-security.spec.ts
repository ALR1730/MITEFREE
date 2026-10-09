import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../src/application/auth/auth.service.js';

describe('AuthService — Blindaje Criptográfico & Seguridad OWASP (ALR COMPANY)', () => {
  let authService: AuthService;

  beforeEach(() => {
    // Inicializar servicio en memoria (db = null para modo aislado)
    authService = new AuthService(null);
  });

  describe('Fortalecimiento Criptográfico de Contraseñas (PBKDF2 SHA-512)', () => {
    it('debe autenticar al Founder & Administrador Principal con sus credenciales canónicas', async () => {
      const response = await authService.login({
        identifier: 'angel.rosario@mitefree.com.do',
        password: 'AdminMitefree2026*',
      });

      expect(response).toBeDefined();
      expect(response.token).toBeDefined();
      expect(response.user.email).toBe('angel.rosario@mitefree.com.do');
      expect(response.user.role).toBe('ADMIN');
      expect(response.user.fullName).toBe('Angel Luis Rosario');
    });

    it('debe rechazar contraseñas incorrectas con UnauthorizedException', async () => {
      await expect(
        authService.login({
          identifier: 'angel.rosario@mitefree.com.do',
          password: 'PasswordIncorrecto123*',
        }),
      ).rejects.toThrow('Contraseña incorrecta');
    });

    it('debe registrar un nuevo cliente con hash criptoseguro y login exitoso', async () => {
      const registered = await authService.register({
        fullName: 'Ing. Turing Tester',
        email: 'turing.tester@alrcompany.do',
        phone: '+18099998877',
        password: 'ClaveSegura2026*',
        zoneCode: 'ZONE-SPM',
      });

      expect(registered.user.email).toBe('turing.tester@alrcompany.do');
      expect(registered.user.role).toBe('CLIENT');

      const login = await authService.login({
        identifier: 'turing.tester@alrcompany.do',
        password: 'ClaveSegura2026*',
      });

      expect(login.token).toBeDefined();
      expect(login.user.id).toBe(registered.user.id);
    });
  });

  describe('Firma Criptográfica HMAC-SHA256 de Tokens & Tamper Protection', () => {
    it('debe generar tokens JWT con formato canónico de tres partes (header.payload.signature)', async () => {
      const response = await authService.login({
        identifier: 'angel.rosario@mitefree.com.do',
        password: 'AdminMitefree2026*',
      });

      const parts = response.token.split('.');
      expect(parts.length).toBe(3);

      const header = JSON.parse(Buffer.from(parts[0]!, 'base64url').toString('utf-8'));
      expect(header.alg).toBe('HS256');
      expect(header.typ).toBe('JWT');
    });

    it('debe validar y decodificar correctamente un token legítimo', async () => {
      const response = await authService.login({
        identifier: 'angel.rosario@mitefree.com.do',
        password: 'AdminMitefree2026*',
      });

      const verified = authService.verifyToken(response.token);
      expect(verified).not.toBeNull();
      expect(verified?.email).toBe('angel.rosario@mitefree.com.do');
      expect(verified?.role).toBe('ADMIN');
      expect(verified?.fullName).toBe('Angel Luis Rosario');
      expect(verified?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('debe RECHAZAR inmediatamente cualquier token con firma manipulada (anti-tampering)', async () => {
      const response = await authService.login({
        identifier: 'angel.rosario@mitefree.com.do',
        password: 'AdminMitefree2026*',
      });

      const parts = response.token.split('.');
      // Alterar el último carácter de la firma
      const forgedSig = parts[2]!.slice(0, -1) + (parts[2]!.endsWith('a') ? 'b' : 'a');
      const forgedToken = `${parts[0]}.${parts[1]}.${forgedSig}`;

      const verified = authService.verifyToken(forgedToken);
      expect(verified).toBeNull();
    });

    it('debe RECHAZAR cualquier intento de elevación de privilegios alterando el payload', async () => {
      // Login como cliente
      const clientLogin = await authService.login({
        identifier: 'laura.mercedes@gmail.com',
        password: 'Mitefree2026*',
      });

      const parts = clientLogin.token.split('.');
      // Modificar el payload para intentar escalar a ADMIN
      const payload = JSON.parse(Buffer.from(parts[1]!, 'base64url').toString('utf-8'));
      payload.role = 'ADMIN';
      const forgedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

      // Ensamblar token falso con la firma original del cliente
      const forgedToken = `${parts[0]}.${forgedPayload}.${parts[2]}`;

      const verified = authService.verifyToken(forgedToken);
      expect(verified).toBeNull();
    });

    it('debe rechazar tokens con formato malformado o cadenas vacías', () => {
      expect(authService.verifyToken('')).toBeNull();
      expect(authService.verifyToken('token.invalido')).toBeNull();
      expect(authService.verifyToken('un.dos.tres.cuatro')).toBeNull();
    });
  });
});
