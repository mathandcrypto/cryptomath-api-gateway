import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Tag } from 'cryptomath-api-proto/types/articles';
import { TagResponseDTO } from '../dto/response/tag.dto';
import { HubSerializerService } from './hub.serializer';

@Injectable()
export class TagSerializerService extends BaseSerializerService<
  Tag,
  TagResponseDTO
> {
  constructor(private readonly hubSerializerService: HubSerializerService) {
    super();
  }

  async serialize(tag: Tag): Promise<TagResponseDTO> {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      hub: await this.hubSerializerService.serialize(tag.hub),
      articles_count: tag.articlesCount,
    };
  }
}
