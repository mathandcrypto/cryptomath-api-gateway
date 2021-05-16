import { Module } from '@nestjs/common';
import { UserConfigModule } from '@config/user/config.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME } from 'cryptomath-api-proto/proto/build/user';
import { UserConfigService } from '@config/user/config.service';
import { UserPackageService } from './user-package.service';
import { join } from 'path';

@Module({
  imports: [UserConfigModule],
  providers: [
    {
      provide: USER_PACKAGE_NAME,
      inject: [UserConfigService],
      useFactory: (userConfigService: UserConfigService) => {
        const { protoFile, url } = userConfigService;

        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: USER_PACKAGE_NAME,
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
    UserPackageService,
  ],
  exports: [UserPackageService],
})
export class UserPackageModule {}
