import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}

  get protoFile(): string {
    return this.configService.get<string>('auth.protoFile');
  }

  get url(): string {
    return this.configService.get<string>('auth.url');
  }
}
