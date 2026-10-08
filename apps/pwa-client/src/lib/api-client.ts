/**
 * MITEFREE Typed API Client — ALR COMPANY
 * Clean Architecture & RFC 7807 ProblemDetails Client
 */

import type {
  ProblemDetailsDto,
  PricePreviewRequestDto,
  PricePreviewResponseDto,
  CreateQuotationRequestDto,
  QuotationResponseDto,
  PhotoUploadIntentDto,
  PhotoUploadIntentResponseDto,
  PhotoConfirmDto,
  PhotoConfirmResponseDto,
  CreateAppointmentDto,
  AppointmentResponseDto,
  TimeSlotAvailabilityDto,
  WalletResponseDto,
  ValidateReferralCodeDto,
  ReferralValidationResponseDto,
  ApplyWalletRedemptionDto,
  WalletRedemptionResponseDto,
  DiscountPolicyConfig,
  RegisterClientDto,
  LoginDto,
  WhatsAppOtpLoginDto,
  AuthResponseDto,
  UserProfileDto,
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

    // Attempt to parse RFC 7807 ProblemDetails
    try {
      const problem = (await response.json()) as ProblemDetailsDto;
      return {
        success: false,
        error: {
          title: problem.title || 'Error de Validación',
          detail: problem.detail || 'Ocurrió un error en la solicitud.',
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
        title: 'Error de Conexión',
        detail: `No se pudo comunicar con el API Core (${url}). Verifique que el servicio esté activo. (${errorMessage})`,
        status: 0,
      },
    };
  }
}

export const apiClient = {
  quotations: {
    calculatePreview: (body: PricePreviewRequestDto) =>
      request<PricePreviewResponseDto>('/quotations/preview', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    create: (body: CreateQuotationRequestDto) =>
      request<QuotationResponseDto>('/quotations', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getById: (id: string) => request<QuotationResponseDto>(`/quotations/${id}`),

    getPdfUrl: (id: string) => `${API_BASE_URL}/quotations/${id}/pdf`,

    requestPhotoUpload: (body: PhotoUploadIntentDto) =>
      request<PhotoUploadIntentResponseDto>('/quotations/photos/upload-intent', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    confirmPhoto: (body: PhotoConfirmDto) =>
      request<PhotoConfirmResponseDto>('/quotations/photos/confirm', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  appointments: {
    getSlots: (zoneCode: string, date: string) =>
      request<TimeSlotAvailabilityDto[]>(
        `/appointments/slots?zoneCode=${encodeURIComponent(zoneCode)}&date=${encodeURIComponent(date)}`,
      ),

    schedule: (body: CreateAppointmentDto) =>
      request<AppointmentResponseDto>('/appointments', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getById: (id: string) => request<AppointmentResponseDto>(`/appointments/${id}`),
  },

  wallets: {
    getByUserId: (userId: string) => request<WalletResponseDto>(`/wallets/user/${userId}`),

    validateReferral: (body: ValidateReferralCodeDto) =>
      request<ReferralValidationResponseDto>('/wallets/referrals/validate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    redeem: (body: ApplyWalletRedemptionDto) =>
      request<WalletRedemptionResponseDto>('/wallets/redeem', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  config: {
    getDiscounts: () => request<DiscountPolicyConfig>('/config/discounts'),
  },

  auth: {
    register: (body: RegisterClientDto) =>
      request<AuthResponseDto>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    login: (body: LoginDto) =>
      request<AuthResponseDto>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    loginWithOtp: (body: WhatsAppOtpLoginDto) =>
      request<AuthResponseDto>('/auth/whatsapp-otp', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getMe: (token?: string) =>
      request<UserProfileDto>('/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
  },
};
