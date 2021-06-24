import { Module } from '@nestjs/common';
import { ArticlesPackageModule } from '@providers/grpc/articles/articles-package.module';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { UsersModule } from '@models/users/users.module';
import { ArticleSerializerService } from './serializers/article.serializer';
import { HubSerializerService } from './serializers/hub.serializer';
import { HubLogoSerializerService } from './serializers/hub-logo.serializer';
import { TagSerializerService } from './serializers/tag.serializer';
import { ArticlesService } from './articles.service';
import { HubsService } from './hubs.service';
import { TagsService } from './tags.service';
import { ArticlesController } from './articles.controller';
import { HubsController } from './hubs.controller';
import { TagsController } from './tags.controller';

@Module({
  imports: [ArticlesPackageModule, UserPackageModule, UsersModule],
  providers: [
    ArticleSerializerService,
    HubSerializerService,
    HubLogoSerializerService,
    TagSerializerService,
    ArticlesService,
    HubsService,
    TagsService,
  ],
  controllers: [ArticlesController, HubsController, TagsController],
})
export class ArticlesModule {}
