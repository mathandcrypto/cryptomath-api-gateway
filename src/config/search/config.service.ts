import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchConfigService {
  constructor(private configService: ConfigService) {}

  get protoFile(): string {
    return this.configService.get<string>('search.protoFile');
  }

  get url(): string {
    return this.configService.get<string>('search.url');
  }
}
