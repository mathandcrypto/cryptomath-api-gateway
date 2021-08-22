import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AWSConfigService {
  constructor(private configService: ConfigService) {}

  get region(): string {
    return this.configService.get<string>('aws.region');
  }

  get accessKeyId(): string {
    return this.configService.get<string>('aws.accessKeyId');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('aws.secretAccessKey');
  }

  get userAssetsBucketName(): string {
    return this.configService.get<string>('aws.userAssetsBucketName');
  }

  get tmpObjectsPrefix(): string {
    return this.configService.get<string>('aws.tmpObjectsPrefix');
  }

  getUrlFromBucket(bucketName: string, fileName: string): string {
    return `https://${bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
  }
}
