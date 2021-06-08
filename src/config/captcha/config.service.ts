import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaptchaConfigService {
  constructor(private configService: ConfigService) {}

  get protoFile(): string {
    return this.configService.get<string>('captcha.protoFile');
  }

  get url(): string {
    return this.configService.get<string>('captcha.url');
  }

  get captchaTokenSecret(): string {
    return this.configService.get<string>('captcha.captchaTokenSecret');
  }

  get captchaTokenExpirationTime(): string {
    return this.configService.get<string>('captcha.captchaTokenExpirationTime');
  }
}
