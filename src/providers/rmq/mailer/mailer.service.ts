import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  SendRegisterNotifyRequest,
  SendRegisterNotifyResponse,
} from 'cryptomath-api-message-types';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(@Inject('MAILER_SERVICE') private client: ClientProxy) {}

  sendRegisterNotify(
    userId: number,
    email: string,
    displayName: string,
    confirmCode: string,
  ): [boolean, Observable<SendRegisterNotifyResponse>] {
    try {
      const observable = this.client.emit<
        SendRegisterNotifyResponse,
        SendRegisterNotifyRequest
      >('send-register-notify', {
        userId,
        email,
        displayName,
        confirmCode,
      });

      return [true, observable];
    } catch (error) {
      this.logger.log(error);

      return [false, null];
    }
  }
}
