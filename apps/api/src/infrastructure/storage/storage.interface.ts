export interface GeneratePresignedUrlParams {
  filename: string;
  mimeType: string;
  quotationId?: string;
  expiresInSeconds?: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
  storageKey: string;
  expiresInSeconds: number;
}

export interface IStorageService {
  generatePresignedUploadUrl(params: GeneratePresignedUrlParams): Promise<PresignedUploadResult>;
  verifyObjectExists(storageKey: string): Promise<boolean>;
}

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');
