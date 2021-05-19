import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { CaptchaConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        CAPTCHA_SERVICE_PROTO_FILE: Joi.string().required(),
        CAPTCHA_SERVICE_URL: Joi.string().required(),
        JWT_CAPTCHA_TOKEN_SECRET: Joi.string().min(5).required(),
        JWT_CAPTCHA_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, CaptchaConfigService],
  exports: [CaptchaConfigService],
})
export class CaptchaConfigModule {}
