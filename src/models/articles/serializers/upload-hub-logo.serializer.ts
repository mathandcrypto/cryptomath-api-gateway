import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { UploadHubLogoResponseDTO } from '../dto/response/upload-hub-logo.dto';
import { AWSObject } from '@common/interfaces/aws-object.interface';

@Injectable()
export class UploadHubLogoSerializerService extends BaseSerializerService<
  AWSObject,
  UploadHubLogoResponseDTO
> {
  async serialize(awsObject: AWSObject): Promise<UploadHubLogoResponseDTO> {
    return {
      key: awsObject.key,
      url: awsObject.url,
    };
  }
}
