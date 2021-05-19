import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CAPTCHA_PACKAGE_NAME,
  CAPTCHA_SERVICE_NAME,
  CaptchaServiceClient,
} from 'cryptomath-api-proto/proto/build/captcha';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class CaptchaPackageService implements OnModuleInit {
  client: CaptchaServiceClient;

  constructor(@Inject(CAPTCHA_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.clientGrpc.getService<CaptchaServiceClient>(
      CAPTCHA_SERVICE_NAME,
    );
  }
}
