import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesConfigService {
  constructor(private configService: ConfigService) {}

  get protoFile(): string {
    return this.configService.get<string>('articles.protoFile');
  }

  get url(): string {
    return this.configService.get<string>('articles.url');
  }
}
