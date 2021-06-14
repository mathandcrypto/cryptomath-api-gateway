import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { UploadAvatarResponseDTO } from '../dto/upload-avatar-response.dto';

@Injectable()
export class UploadAvatarSerializer extends BaseSerializerService<
  ManagedUpload.SendData,
  UploadAvatarResponseDTO
> {
  async serialize(
    uploadResult: ManagedUpload.SendData,
  ): Promise<UploadAvatarResponseDTO> {
    return {
      key: uploadResult.Key,
      url: uploadResult.Location,
    };
  }
}
