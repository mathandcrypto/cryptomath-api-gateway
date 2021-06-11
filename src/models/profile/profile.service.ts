import { Injectable } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { AuthUser } from '@auth/interfaces/auth-user.interface';
import { GetAuthUserProfileError } from './enums/get-auth-user-profile-error.enum';
import { AuthUserProfile } from './interfaces/auth-user-profile.interface';
import { GetUserProfileError } from './enums/get-user-profile-error.enum';
import { UserProfile } from './interfaces/user-profile.interface';

@Injectable()
export class ProfileService {
  constructor(private readonly userPackageService: UserPackageService) {}

  async getAuthUserProfile(
    user: AuthUser,
  ): Promise<[boolean, GetAuthUserProfileError, AuthUserProfile]> {
    const userId = user.id;

    const authUserProfileResponse = await Promise.all([
      this.userPackageService.findAvatar(userId),
      this.userPackageService.findProfile(userId),
    ]);

    const [findAvatarStatus, findAvatarResponse] = authUserProfileResponse[0];

    if (!findAvatarStatus) {
      return [false, GetAuthUserProfileError.FindAvatarError, null];
    }

    const [findProfileStatus, findProfileResponse] = authUserProfileResponse[1];

    if (!findProfileStatus) {
      return [false, GetAuthUserProfileError.FindProfileError, null];
    }

    const { isAvatarExists, avatar } = findAvatarResponse;
    const { isProfileExists, profile } = findProfileResponse;

    return [
      true,
      null,
      {
        ...user,
        avatar: isAvatarExists ? avatar : null,
        profile: isProfileExists ? profile : null,
      },
    ];
  }

  async getUserProfile(
    userId: number,
  ): Promise<[boolean, GetUserProfileError, UserProfile]> {
    const [
      findUserStatus,
      findUserResponse,
    ] = await this.userPackageService.findOne(userId);

    if (!findUserStatus) {
      return [false, GetUserProfileError.FindUserError, null];
    }

    const { isUserExists, user } = findUserResponse;

    if (!isUserExists) {
      return [false, GetUserProfileError.UserNotExists, null];
    }

    const userProfileResponse = await Promise.all([
      this.userPackageService.findAvatar(userId),
      this.userPackageService.findProfile(userId),
    ]);

    const [findAvatarStatus, findAvatarResponse] = userProfileResponse[0];

    if (!findAvatarStatus) {
      return [false, GetUserProfileError.FindAvatarError, null];
    }

    const [findProfileStatus, findProfileResponse] = userProfileResponse[1];

    if (!findProfileStatus) {
      return [false, GetUserProfileError.FindProfileError, null];
    }

    const { isAvatarExists, avatar } = findAvatarResponse;
    const { isProfileExists, profile } = findProfileResponse;

    return [
      true,
      null,
      {
        user,
        avatar: isAvatarExists ? avatar : null,
        profile: isProfileExists ? profile : null,
      },
    ];
  }
}
