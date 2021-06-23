import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetClientIP = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();

    return req.ip;
  },
);
