import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  SendRegisterNotifyRequest,
  SendRegisterNotifyResponse,
} from '@cryptomath/cryptomath-api-message-types';

@Injectable()
export class MailerService {
  constructor(@Inject('MAILER_SERVICE') private client: ClientProxy) {}

  sendRegisterNotify(
    userId: number,
    email: string,
    displayName: string,
    confirmCode: string,
  ): Observable<SendRegisterNotifyResponse> {
    return this.client.emit<
      SendRegisterNotifyResponse,
      SendRegisterNotifyRequest
    >('send-register-notify', {
      userId,
      email,
      displayName,
      confirmCode,
    });
  }
}
