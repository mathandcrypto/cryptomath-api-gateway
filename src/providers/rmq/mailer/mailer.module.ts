import { Module } from '@nestjs/common';
import { MailerConfigModule } from '@config/mailer/config.module';
import { MailerConfigService } from '@config/mailer/config.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MailerService } from './mailer.service';

@Module({
  imports: [MailerConfigModule],
  providers: [
    {
      provide: 'MAILER_SERVICE',
      inject: [MailerConfigService],
      useFactory: (mailerConfigService: MailerConfigService) => {
        const { rmqUrl, rmqQueueName } = mailerConfigService;

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
            queue: rmqQueueName,
          },
        });
      },
    },
    MailerService,
  ],
  exports: [MailerService],
})
export class MailerModule {}
