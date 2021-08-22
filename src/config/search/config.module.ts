import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { SearchConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        SEARCH_SERVICE_PROTO_FILE: Joi.string().required(),
        SEARCH_SERVICE_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, SearchConfigService],
  exports: [SearchConfigService],
})
export class SearchConfigModule {}
