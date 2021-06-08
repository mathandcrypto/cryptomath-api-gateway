import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService {
  constructor(private configService: ConfigService) {}

  get rmqUser(): string {
    return this.configService.get<string>('mailer.rmqUser');
  }

  get rmqPassword(): string {
    return this.configService.get<string>('mailer.rmqPassword');
  }

  get rmqHost(): string {
    return this.configService.get<string>('mailer.rmqHost');
  }

  get rmqQueueName(): string {
    return this.configService.get<string>('mailer.rmqQueueName');
  }

  get rmqUrl(): string {
    return `amqp://${this.rmqUser}:${this.rmqPassword}@${this.rmqHost}`;
  }
}
