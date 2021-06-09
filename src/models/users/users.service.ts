import { Injectable } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { GetUserProfileError } from './enums/get-user-profile-error.enum';
import { GetUserProfileResponse } from './interfaces/get-user-profile-response.interface';

@Injectable()
export class UsersService {
  constructor(private readonly userPackageService: UserPackageService) {}

  async getUserProfile(
    id: number,
  ): Promise<[boolean, GetUserProfileError, GetUserProfileResponse]> {
    const [
      findUserStatus,
      findUserResponse,
    ] = await this.userPackageService.findOne(id);

    if (!findUserStatus) {
      return [false, GetUserProfileError.FindUserError, null];
    }

    const { isUserExists, user } = findUserResponse;

    if (!isUserExists) {
      return [false, GetUserProfileError.UserNotExists, null];
    }

    const [
      findAvatarStatus,
      findAvatarResponse,
    ] = await this.userPackageService.findAvatar(id);

    if (!findAvatarStatus) {
      return [false, GetUserProfileError.FindAvatarError, null];
    }

    const { isAvatarExists, avatar } = findAvatarResponse;

    return [
      true,
      null,
      {
        user,
        avatar: isAvatarExists ? avatar : null,
      },
    ];
  }
}
