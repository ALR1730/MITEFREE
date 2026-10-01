/**
 * RFC 7807 — Problem Details for HTTP APIs
 * Universal Error Format for ALR COMPANY
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export const createProblemDetails = (params: {
  status: number;
  title: string;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
}): ProblemDetails => ({
  type: `https://alrcompany.com/errors/http-${params.status}`,
  title: params.title,
  status: params.status,
  detail: params.detail,
  instance: params.instance,
  errors: params.errors,
  timestamp: new Date().toISOString(),
});
