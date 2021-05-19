import { Module } from '@nestjs/common';
import { CaptchaConfigModule } from '@config/captcha/config.module';
import { CaptchaConfigService } from '@config/captcha/config.service';
import { JwtModule } from '@nestjs/jwt';
import { CaptchaPackageModule } from '@providers/grpc/captcha/captcha-package.module';
import { CaptchaTokenService } from './captcha-token.service';
import { CaptchaController } from './captcha.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [CaptchaConfigModule],
      inject: [CaptchaConfigService],
      useFactory: (captchaConfigService: CaptchaConfigService) => {
        const {
          captchaTokenSecret,
          captchaTokenExpirationTime,
        } = captchaConfigService;

        return {
          secret: captchaTokenSecret,
          signOptions: { expiresIn: captchaTokenExpirationTime },
        };
      },
    }),
    CaptchaPackageModule,
  ],
  controllers: [CaptchaController],
  providers: [CaptchaTokenService],
})
export class CaptchaModule {}
