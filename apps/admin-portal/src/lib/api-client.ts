/**
 * MITEFREE Typed API Client for Admin Portal — ALR COMPANY
 * Clean Architecture & RFC 7807 ProblemDetails Client
 */

import type {
  ProblemDetailsDto,
  AppointmentResponseDto,
  AssignTechnicianDto,
  TransitionAppointmentStatusDto,
  PaymentRecordResponseDto,
  ReviewPaymentDto,
  QuotationResponseDto,
  DiscountPolicyConfig,
  ClientDirectoryItemDto,
  CatalogItem,
  CreateCatalogItemDto,
  UpdateCatalogItemDto,
} from '@mitefree/shared-types';

export type ApiResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        title: string;
        detail: string;
        status?: number;
        errors?: Record<string, string[]>;
      };
    };

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    // Si el usuario navega desde su celular o IP de red (ej: 10.0.0.176),
    // la API debe apuntar a la misma IP del host en el puerto 4000.
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:4000/api/v1`;
  }
  return 'http://localhost:4000/api/v1';
}

async function getAdminToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const token =
    localStorage.getItem('mitefree_auth_token') || localStorage.getItem('mitefree_admin_token');
  if (token) return token;

  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'angel.rosario@mitefree.com.do',
        password: 'AdminMitefree2026*',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('mitefree_admin_token', data.token);
        return data.token;
      }
    }
  } catch {
    // Continuar si no se pudo conectar
  }
  return null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const adminToken = await getAdminToken();
  if (adminToken && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.ok) {
      const data = (await response.json()) as T;
      return { success: true, data };
    }

    try {
      const problem = (await response.json()) as ProblemDetailsDto;
      return {
        success: false,
        error: {
          title: problem.title || 'Error de Validación',
          detail: problem.detail || 'Ocurrió un error en la operación.',
          status: problem.status || response.status,
          errors: problem.errors,
        },
      };
    } catch {
      return {
        success: false,
        error: {
          title: 'Error del Servidor',
          detail: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        },
      };
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'No se pudo conectar al servidor.';
    return {
      success: false,
      error: {
        title: 'Error de Red / API',
        detail: `No se pudo comunicar con el API Core (${url}). (${errorMessage})`,
        status: 0,
      },
    };
  }
}

export const adminApiClient = {
  appointments: {
    listAll: () => request<AppointmentResponseDto[]>('/appointments'),

    getById: (id: string) => request<AppointmentResponseDto>(`/appointments/${id}`),

    getFinalInvoicePdfUrl: (id: string) => `${getApiBaseUrl()}/appointments/${id}/invoice/pdf`,

    assignTechnician: (id: string, body: AssignTechnicianDto) =>
      request<AppointmentResponseDto>(`/appointments/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    transitionStatus: (id: string, body: TransitionAppointmentStatusDto) =>
      request<AppointmentResponseDto>(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },

  payments: {
    listAll: () => request<PaymentRecordResponseDto[]>('/payments'),

    review: (id: string, body: ReviewPaymentDto) =>
      request<PaymentRecordResponseDto>(`/payments/${id}/review`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  quotations: {
    getById: (id: string) => request<QuotationResponseDto>(`/quotations/${id}`),

    getPdfUrl: (id: string) => `${getApiBaseUrl()}/quotations/${id}/pdf`,
  },

  config: {
    getDiscounts: () => request<DiscountPolicyConfig>('/config/discounts'),
    updateDiscounts: (body: DiscountPolicyConfig) =>
      request<DiscountPolicyConfig>('/config/discounts', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  },

  clients: {
    getAll: () => request<ClientDirectoryItemDto[]>('/auth/clients'),
  },

  catalog: {
    getAll: () => request<CatalogItem[]>('/catalog'),
    create: (body: CreateCatalogItemDto) =>
      request<CatalogItem>('/catalog', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: UpdateCatalogItemDto) =>
      request<CatalogItem>(`/catalog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ success: boolean; id: string }>(`/catalog/${id}`, {
        method: 'DELETE',
      }),
    reset: () =>
      request<CatalogItem[]>('/catalog/reset', {
        method: 'POST',
      }),
  },
};
