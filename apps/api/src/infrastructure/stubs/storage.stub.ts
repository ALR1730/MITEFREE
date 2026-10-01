import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface PresignedUploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  storageKey: string;
  expiresInSeconds: number;
}

@Injectable()
export class MockStorageService {
  private readonly logger = new Logger(MockStorageService.name);

  async generatePresignedUploadUrl(
    filename: string,
    mimeType: string,
  ): Promise<PresignedUploadUrlResponse> {
    const fileId = randomUUID();
    const storageKey = `quotations/${fileId}-${filename}`;
    const publicUrl = `https://storage.mitefree.com/${storageKey}`;
    const uploadUrl = `https://upload.mitefree.com/${storageKey}?signature=mock_sig_${fileId}`;

    this.logger.log(`Generated mock presigned upload URL for: ${filename} (${mimeType})`);

    return {
      uploadUrl,
      publicUrl,
      storageKey,
      expiresInSeconds: 900, // 15 minutes TTL (Security Auditor Rule)
    };
  }
}
