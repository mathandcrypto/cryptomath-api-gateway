import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Hub } from 'cryptomath-api-proto/types/articles';
import { HubResponseDTO } from '../dto/response/hub.dto';
import { HubLogoSerializerService } from './hub-logo.serializer';

@Injectable()
export class HubSerializerService extends BaseSerializerService<
  Hub,
  HubResponseDTO
> {
  constructor(
    private readonly hubLogoSerializerService: HubLogoSerializerService,
  ) {
    super();
  }

  async serialize(hub: Hub): Promise<HubResponseDTO> {
    return {
      id: hub.id,
      name: hub.name,
      description: hub.description,
      logo: hub.logo
        ? await this.hubLogoSerializerService.serialize(hub.logo)
        : null,
      articles_count: hub.articlesCount,
      tags_count: hub.tagsCount,
    };
  }
}
