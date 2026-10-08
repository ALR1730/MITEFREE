'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfileDto,
  LoginDto,
  WhatsAppOtpLoginDto,
  RegisterClientDto,
} from '@mitefree/shared-types';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: UserProfileDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<{ success: boolean; error?: string }>;
  loginWithOtp: (dto: WhatsAppOtpLoginDto) => Promise<{ success: boolean; error?: string }>;
  register: (dto: RegisterClientDto) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_TOKEN = 'mitefree_auth_token';
const STORAGE_KEY_USER = 'mitefree_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar estado desde localStorage al montar
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignorar errores de parseo
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (authToken: string, userProfile: UserProfileDto) => {
    setToken(authToken);
    setUser(userProfile);
    try {
      localStorage.setItem(STORAGE_KEY_TOKEN, authToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userProfile));
    } catch {
      // Storage error
    }
  };

  const login = async (dto: LoginDto) => {
    try {
      const res = await apiClient.auth.login(dto);
      if (res.success && res.data) {
        saveSession(res.data.token, res.data.user);
        return { success: true };
      }
      return {
        success: false,
        error: !res.success ? res.error.detail : 'Error al iniciar sesión',
      };
    } catch {
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  const loginWithOtp = async (dto: WhatsAppOtpLoginDto) => {
    try {
      const res = await apiClient.auth.loginWithOtp(dto);
      if (res.success && res.data) {
        saveSession(res.data.token, res.data.user);
        return { success: true };
      }
      return {
        success: false,
        error: !res.success ? res.error.detail : 'Error al verificar código WhatsApp',
      };
    } catch {
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  const register = async (dto: RegisterClientDto) => {
    try {
      const res = await apiClient.auth.register(dto);
      if (res.success && res.data) {
        saveSession(res.data.token, res.data.user);
        return { success: true };
      }
      return {
        success: false,
        error: !res.success ? res.error.detail : 'Error en el registro',
      };
    } catch {
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {
      // Storage error
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOtp,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
