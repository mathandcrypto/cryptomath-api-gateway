import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { AWSConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_USER_ASSETS_BUCKET_NAME: Joi.string().required(),
        AWS_TMP_OBJECTS_PREFIX: Joi.string().required().default('tmp'),
      }),
    }),
  ],
  providers: [ConfigService, AWSConfigService],
  exports: [AWSConfigService],
})
export class AWSConfigModule {}
