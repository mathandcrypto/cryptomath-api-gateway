import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GuestGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (user) {
      throw err || new ForbiddenException('Not available to authorized users');
    }

    return user;
  }
}
