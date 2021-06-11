import { Module } from '@nestjs/common';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { ProfileService } from './profile.service';
import { ProfileSerializer } from './serializers/profile.serializer';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UserPackageModule],
  providers: [ProfileService, ProfileSerializer],
  controllers: [ProfileController],
})
export class ProfileModule {}
