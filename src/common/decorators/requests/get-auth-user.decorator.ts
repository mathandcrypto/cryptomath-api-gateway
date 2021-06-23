import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '@auth/interfaces/auth-user.interface';

export const GetAuthUser = createParamDecorator(
  (data, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
