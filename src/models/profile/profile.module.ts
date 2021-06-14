import { Module } from '@nestjs/common';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { StorageModule } from '@common/shared/storage/storage.module';
import { AWSConfigModule } from '@config/aws/config.module';
import { AWSS3Module } from '@providers/aws/s3/aws-s3.module';
import { ProfileService } from './profile.service';
import { ProfileSerializer } from './serializers/profile.serializer';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UserPackageModule, StorageModule, AWSConfigModule, AWSS3Module],
  providers: [ProfileService, ProfileSerializer],
  controllers: [ProfileController],
})
export class ProfileModule {}
