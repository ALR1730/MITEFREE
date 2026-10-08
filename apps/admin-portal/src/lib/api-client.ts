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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
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

    getPdfUrl: (id: string) => `${API_BASE_URL}/quotations/${id}/pdf`,
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
};
