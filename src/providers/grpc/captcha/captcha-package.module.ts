import { Module } from '@nestjs/common';
import { CaptchaConfigModule } from '@config/captcha/config.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CAPTCHA_PACKAGE_NAME } from 'cryptomath-api-proto/types/captcha';
import { CaptchaConfigService } from '@config/captcha/config.service';
import { CaptchaPackageService } from './captcha-package.service';
import { CaptchaPackageMethodsService } from './captcha-package-methods.service';
import { join } from 'path';

@Module({
  imports: [CaptchaConfigModule],
  providers: [
    {
      provide: CAPTCHA_PACKAGE_NAME,
      inject: [CaptchaConfigService],
      useFactory: (captchaConfigService: CaptchaConfigService) => {
        const { protoFile, url } = captchaConfigService;

        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: CAPTCHA_PACKAGE_NAME,
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
    CaptchaPackageService,
    CaptchaPackageMethodsService,
  ],
  exports: [CaptchaPackageService, CaptchaPackageMethodsService],
})
export class CaptchaPackageModule {}
