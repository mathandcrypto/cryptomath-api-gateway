import { registerAs } from '@nestjs/config';
import { MailerConfig } from './interfaces/mailer-config.interface';

export default registerAs<MailerConfig>('mailer', () => ({
  rmqUser: process.env.MAILER_SERVICE_RABBITMQ_USER,
  rmqPassword: process.env.MAILER_SERVICE_RABBITMQ_PASSWORD,
  rmqHost: process.env.MAILER_SERVICE_RABBITMQ_HOST,
  rmqQueueName: process.env.MAILER_SERVICE_RABBITMQ_QUEUE_NAME,
}));
