import { Module } from '@nestjs/common';
import { SearchConfigModule } from '@config/search/config.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SEARCH_PACKAGE_NAME } from '@cryptomath/cryptomath-api-proto/types/search';
import { SearchConfigService } from '@config/search/config.service';
import { SearchArticlesPackageService } from './search-articles-package.service';
import { join } from 'path';

@Module({
  imports: [SearchConfigModule],
  providers: [
    {
      provide: SEARCH_PACKAGE_NAME,
      inject: [SearchConfigService],
      useFactory: (searchConfigService: SearchConfigService) => {
        const { protoFile, url } = searchConfigService;

        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: SEARCH_PACKAGE_NAME,
            protoPath: join(
              process.cwd(),
              'node_modules/@cryptomath/cryptomath-api-proto/proto',
              protoFile,
            ),
            url,
          },
        });
      },
    },
    SearchArticlesPackageService,
  ],
  exports: [SearchArticlesPackageService],
})
export class SearchPackageModule {}
