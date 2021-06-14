import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-s3';
import { AWSConfigModule } from '@config/aws/config.module';
import { AWSConfigService } from '@config/aws/config.service';

@Module({
  imports: [
    S3Module.forRootAsync({
      imports: [AWSConfigModule],
      inject: [AWSConfigService],
      useFactory(awsConfigService: AWSConfigService) {
        const { region, accessKeyId, secretAccessKey } = awsConfigService;

        return {
          config: {
            accessKeyId,
            secretAccessKey,
            region,
          },
        };
      },
    }),
  ],
})
export class AWSS3Module {}
