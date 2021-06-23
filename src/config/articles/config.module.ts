import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { ArticlesConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        ARTICLES_SERVICE_PROTO_FILE: Joi.string().required(),
        ARTICLES_SERVICE_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, ArticlesConfigService],
  exports: [ArticlesConfigService],
})
export class ArticlesConfigModule {}
