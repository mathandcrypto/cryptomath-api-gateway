import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { UploadAvatarResponseDTO } from '../dto/upload-avatar-response.dto';
import { AWSObject } from '@common/interfaces/aws-object.interface';

@Injectable()
export class UploadAvatarSerializerService extends BaseSerializerService<
  AWSObject,
  UploadAvatarResponseDTO
> {
  async serialize(awsObject: AWSObject): Promise<UploadAvatarResponseDTO> {
    return {
      key: awsObject.key,
      url: awsObject.url,
    };
  }
}
