import { Module } from '@nestjs/common';
import { AuthConfigModule } from '@config/auth/config.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from 'cryptomath-api-proto/proto/build/auth';
import { AuthConfigService } from '@config/auth/config.service';
import { AuthPackageService } from './auth-package.service';
import { AuthPackageMethodsService } from './auth-package-methods.service';
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
              'node_modules/cryptomath-api-proto/proto',
              protoFile,
            ),
            url,
          },
        });
      },
    },
    AuthPackageService,
    AuthPackageMethodsService,
  ],
  exports: [AuthPackageService, AuthPackageMethodsService],
})
export class AuthPackageModule {}
