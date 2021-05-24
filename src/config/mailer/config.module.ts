import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { MailerConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MAILER_SERVICE_RABBITMQ_USER: Joi.string().required(),
        MAILER_SERVICE_RABBITMQ_PASSWORD: Joi.string().required(),
        MAILER_SERVICE_RABBITMQ_HOST: Joi.string().required(),
        MAILER_SERVICE_RABBITMQ_QUEUE_NAME: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, MailerConfigService],
  exports: [MailerConfigService],
})
export class MailerConfigModule {}
