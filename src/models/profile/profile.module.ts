import { Module } from '@nestjs/common';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { StorageModule } from '@common/shared/storage/storage.module';
import { AWSConfigModule } from '@config/aws/config.module';
import { AWSS3Module } from '@providers/aws/s3/aws-s3.module';
import { ProfileService } from './profile.service';
import { ProfileSerializerService } from './serializers/profile.serializer';
import { UploadAvatarSerializerService } from './serializers/upload-avatar.serializer';
import { AvatarSerializerService } from '@models/users/serializers/avatar.serializer';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UserPackageModule, StorageModule, AWSConfigModule, AWSS3Module],
  providers: [
    ProfileService,
    ProfileSerializerService,
    UploadAvatarSerializerService,
    AvatarSerializerService,
  ],
  controllers: [ProfileController],
})
export class ProfileModule {}
