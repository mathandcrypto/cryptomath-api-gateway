import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { AuthConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        AUTH_SERVICE_PROTO_FILE: Joi.string().required(),
        AUTH_SERVICE_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AuthConfigService],
  exports: [AuthConfigService],
})
export class AuthConfigModule {}
