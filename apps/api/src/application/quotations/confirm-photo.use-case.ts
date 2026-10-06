import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Result, ok, fail } from '@mitefree/domain-core';
import type { PhotoConfirmDto, PhotoConfirmResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import {
  STORAGE_SERVICE,
  type IStorageService,
} from '../../infrastructure/storage/storage.interface.js';

@Injectable()
export class ConfirmPhotoUseCase
  implements IUseCase<PhotoConfirmDto, Result<PhotoConfirmResponseDto, string>>
{
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  async execute(dto: PhotoConfirmDto): Promise<Result<PhotoConfirmResponseDto, string>> {
    const exists = await this.storageService.verifyObjectExists(dto.storageKey);
    if (!exists) {
      return fail('Storage object does not exist or has expired');
    }

    const photoId = randomUUID();
    const createdAt = new Date().toISOString();

    return ok({
      photoId,
      quotationItemId: dto.quotationItemId,
      publicUrl: dto.publicUrl,
      createdAt,
    });
  }
}
