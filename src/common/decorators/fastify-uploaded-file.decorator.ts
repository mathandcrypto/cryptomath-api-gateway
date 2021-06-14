import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Multipart } from 'fastify-multipart';

export const FastifyUploadedFile = createParamDecorator(
  (data, ctx: ExecutionContext): Multipart => {
    const req = ctx.switchToHttp().getRequest();

    return req.multipart;
  },
);
