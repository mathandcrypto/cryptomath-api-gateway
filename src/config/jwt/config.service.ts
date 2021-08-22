import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get accessTokenSecret(): string {
    return this.configService.get<string>('jwt.accessTokenSecret');
  }

  get accessTokenExpirationTime(): string {
    return this.configService.get<string>('jwt.accessTokenExpirationTime');
  }

  get refreshTokenSecret(): string {
    return this.configService.get<string>('jwt.refreshTokenSecret');
  }

  get refreshTokenExpirationTime(): string {
    return this.configService.get<string>('jwt.refreshTokenExpirationTime');
  }
}
