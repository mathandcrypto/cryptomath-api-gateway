import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Tag } from 'cryptomath-api-proto/types/articles';
import { TagResponseDTO } from '../dto/response/tag.dto';

@Injectable()
export class TagSerializerService extends BaseSerializerService<
  Tag,
  TagResponseDTO
> {
  async serialize(tag: Tag): Promise<TagResponseDTO> {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      articles_count: tag.articlesCount,
    };
  }
}
