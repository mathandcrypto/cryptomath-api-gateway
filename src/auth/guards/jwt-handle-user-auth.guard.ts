import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtHandleUserAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    return user;
  }
}
