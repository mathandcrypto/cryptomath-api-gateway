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

  get tokenSecret(): string {
    return this.configService.get<string>('captcha.tokenSecret');
  }

  get tokenExpirationTime(): string {
    return this.configService.get<string>('captcha.tokenExpirationTime');
  }
}
