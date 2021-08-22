import { Module } from '@nestjs/common';
import { SearchPackageModule } from '@providers/grpc/search/search-package.module';
import { ArticlesPackageModule } from '@providers/grpc/articles/articles-package.module';
import { SearchArticlesHubsService } from './hubs.service';
import { SearchArticlesTagsService } from './tags.service';
import { SearchArticlesHubSerializerService } from './serializers/hub.serializer';
import { SearchArticlesTagSerializerService } from './serializers/tag.serializer';
import { HubSerializerService } from '@models/articles/serializers/hub.serializer';
import { TagSerializerService } from '@models/articles/serializers/tag.serializer';
import { HubLogoSerializerService } from '@models/articles/serializers/hub-logo.serializer';
import { SearchArticlesHubsController } from './hubs.controller';
import { SearchArticlesTagsController } from './tags.controller';

@Module({
  imports: [SearchPackageModule, ArticlesPackageModule],
  providers: [
    SearchArticlesHubsService,
    SearchArticlesTagsService,
    SearchArticlesHubSerializerService,
    SearchArticlesTagSerializerService,
    HubSerializerService,
    TagSerializerService,
    HubLogoSerializerService,
  ],
  controllers: [SearchArticlesHubsController, SearchArticlesTagsController],
})
export class SearchArticlesModule {}
