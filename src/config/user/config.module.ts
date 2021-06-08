import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { UserConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        USER_SERVICE_PROTO_FILE: Joi.string().required(),
        USER_SERVICE_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, UserConfigService],
  exports: [UserConfigService],
})
export class UserConfigModule {}
