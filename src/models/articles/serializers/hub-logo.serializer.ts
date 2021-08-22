import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { HubLogo } from '@cryptomath/cryptomath-api-proto/types/articles';
import { HubLogoResponseDTO } from '../dto/response/hub-logo.dto';

@Injectable()
export class HubLogoSerializerService extends BaseSerializerService<
  HubLogo,
  HubLogoResponseDTO
> {
  async serialize(hubLogo: HubLogo): Promise<HubLogoResponseDTO> {
    return {
      id: hubLogo.id,
      url: hubLogo.url,
    };
  }
}
