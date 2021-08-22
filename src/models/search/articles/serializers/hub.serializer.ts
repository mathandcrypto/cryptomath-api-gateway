import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { SearchHit } from '@models/search/interfaces/search-hit.interface';
import { Hub } from '@cryptomath/cryptomath-api-proto/types/articles';
import { SearchArticlesHubResponseDTO } from '../dto/response/hub.dto';
import { HubSerializerService } from '@models/articles/serializers/hub.serializer';

@Injectable()
export class SearchArticlesHubSerializerService extends BaseSerializerService<
  SearchHit<Hub>,
  SearchArticlesHubResponseDTO
> {
  constructor(private readonly hubSerializerService: HubSerializerService) {
    super();
  }

  async serialize(
    hubHit: SearchHit<Hub>,
  ): Promise<SearchArticlesHubResponseDTO> {
    return {
      score: hubHit.score,
      data: await this.hubSerializerService.serialize(hubHit.data),
    };
  }
}
