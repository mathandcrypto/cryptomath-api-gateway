import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { SearchHit } from '@models/search/interfaces/search-hit.interface';
import { Tag } from '@cryptomath/cryptomath-api-proto/types/articles';
import { SearchArticlesTagResponseDTO } from '../dto/response/tag.dto';
import { TagSerializerService } from '@models/articles/serializers/tag.serializer';

@Injectable()
export class SearchArticlesTagSerializerService extends BaseSerializerService<
  SearchHit<Tag>,
  SearchArticlesTagResponseDTO
> {
  constructor(private readonly tagSerializerService: TagSerializerService) {
    super();
  }

  async serialize(
    tagHit: SearchHit<Tag>,
  ): Promise<SearchArticlesTagResponseDTO> {
    return {
      score: tagHit.score,
      data: await this.tagSerializerService.serialize(tagHit.data),
    };
  }
}
