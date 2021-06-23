import { Module } from '@nestjs/common';
import { ArticlesConfigModule } from '@config/articles/config.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ARTICLES_PACKAGE_NAME } from 'cryptomath-api-proto/types/articles';
import { ArticlesConfigService } from '@config/articles/config.service';
import { ArticlesPackageService } from './articles-package.service';
import { join } from 'path';

@Module({
  imports: [ArticlesConfigModule],
  providers: [
    {
      provide: ARTICLES_PACKAGE_NAME,
      inject: [ArticlesConfigService],
      useFactory: (articlesConfigService: ArticlesConfigService) => {
        const { protoFile, url } = articlesConfigService;

        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ARTICLES_PACKAGE_NAME,
            protoPath: join(
              process.cwd(),
              'node_modules/cryptomath-api-proto/proto',
              protoFile,
            ),
            url,
          },
        });
      },
    },
    ArticlesPackageService,
  ],
  exports: [ArticlesPackageService],
})
export class ArticlesPackageModule {}
