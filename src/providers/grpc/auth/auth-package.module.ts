import { Module } from '@nestjs/common';
import { AuthConfigModule } from '@config/auth/config.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@cryptomath/cryptomath-api-proto/types/auth';
import { AuthConfigService } from '@config/auth/config.service';
import { AuthPackageService } from './auth-package.service';
import { join } from 'path';

@Module({
  imports: [AuthConfigModule],
  providers: [
    {
      provide: AUTH_PACKAGE_NAME,
      inject: [AuthConfigService],
      useFactory: (authConfigService: AuthConfigService) => {
        const { protoFile, url } = authConfigService;

        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
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
    AuthPackageService,
  ],
  exports: [AuthPackageService],
})
export class AuthPackageModule {}
