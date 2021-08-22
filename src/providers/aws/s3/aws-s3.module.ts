import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { AWSConfigModule } from '@config/aws/config.module';
import { AWSConfigService } from '@config/aws/config.service';

@Module({
  imports: [
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [AWSConfigModule],
        inject: [AWSConfigService],
        useFactory: (awsConfigService: AWSConfigService) => {
          const { region, accessKeyId, secretAccessKey } = awsConfigService;

          return {
            region,
            accessKeyId,
            secretAccessKey,
          };
        },
      },
      services: [S3],
    }),
  ],
})
export class AWSS3Module {}
