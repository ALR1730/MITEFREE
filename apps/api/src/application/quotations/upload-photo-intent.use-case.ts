import { Injectable, Inject } from '@nestjs/common';
import { Result, ok, fail } from '@mitefree/domain-core';
import type {
  PhotoUploadIntentDto,
  PhotoUploadIntentResponseDto,
} from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import {
  STORAGE_SERVICE,
  type IStorageService,
} from '../../infrastructure/storage/storage.interface.js';

@Injectable()
export class UploadPhotoIntentUseCase
  implements IUseCase<PhotoUploadIntentDto, Result<PhotoUploadIntentResponseDto, string>>
{
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  async execute(
    dto: PhotoUploadIntentDto,
  ): Promise<Result<PhotoUploadIntentResponseDto, string>> {
    // Validar extensiones y tamaño seguro (Zero-Trust)
    if (dto.sizeBytes > 5 * 1024 * 1024) {
      return fail('File size exceeds the 5MB limit');
    }

    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(dto.mimeType)) {
      return fail(`Unsupported mime type: ${dto.mimeType}`);
    }

    const presigned = await this.storageService.generatePresignedUploadUrl({
      filename: dto.filename,
      mimeType: dto.mimeType,
      quotationId: dto.quotationId,
      expiresInSeconds: 900, // 15 minutos
    });

    return ok({
      uploadUrl: presigned.uploadUrl,
      publicUrl: presigned.publicUrl,
      storageKey: presigned.storageKey,
      expiresInSeconds: presigned.expiresInSeconds,
    });
  }
}
