import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuestGuardException } from '../constants/exceptions/guest-guard.exception';

@Injectable()
export class GuestGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (user) {
      throw (
        err ||
        new ForbiddenException(GuestGuardException.AuthorizedUsersNotAllowed)
      );
    }

    return user;
  }
}
