import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { ArticleExtra } from '../interfaces/article-extra.interface';
import { ArticleResponseDTO } from '../dto/response/article.dto';
import { UserSerializerService } from '@models/users/serializers/user.serializer';
import { HubSerializerService } from './hub.serializer';
import { TagSerializerService } from './tag.serializer';
import { fromUnixTime } from 'date-fns';

@Injectable()
export class ArticleSerializerService extends BaseSerializerService<
  ArticleExtra,
  ArticleResponseDTO
> {
  constructor(
    private readonly userSerializerServive: UserSerializerService,
    private readonly hubSerializerService: HubSerializerService,
    private readonly tagSerializerService: TagSerializerService,
  ) {
    super();
  }

  async serialize(articleExtra: ArticleExtra): Promise<ArticleResponseDTO> {
    return {
      id: articleExtra.id,
      title: articleExtra.title,
      abstract: articleExtra.abstract,
      user: await this.userSerializerServive.serialize(articleExtra.user),
      hubs: await this.hubSerializerService.serializeCollection(
        articleExtra.hubs,
      ),
      tags: await this.tagSerializerService.serializeCollection(
        articleExtra.tags,
      ),
      comments_count: articleExtra.commentsCount,
      rating: articleExtra.rating,
      created_at: fromUnixTime(articleExtra.createdAt),
      updated_at: fromUnixTime(articleExtra.updatedAt),
    };
  }
}
