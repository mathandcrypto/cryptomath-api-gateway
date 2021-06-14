import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  PayloadTooLargeException,
  BadRequestException,
  mixin,
  Type,
  NotAcceptableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Multipart } from 'fastify-multipart';
import BusboyConfig = busboy.BusboyConfig;

export function FastifyFileInterceptor(
  fieldName: string,
  options?: BusboyConfig,
) {
  class MixinInterceptor implements NestInterceptor {
    transformException(error: (Error & { code: string }) | undefined) {
      if (error.code) {
        switch (error.code) {
          case 'FST_PARTS_LIMIT':
            return new PayloadTooLargeException('Reached parts limit');
          case 'FST_FILES_LIMIT':
            return new PayloadTooLargeException('Reached files limit');
          case 'FST_FIELDS_LIMIT':
            return new PayloadTooLargeException('Reached fields limit');
          case 'FST_REQ_FILE_TOO_LARGE':
            return new PayloadTooLargeException('File too large');
          case 'FST_PROTO_VIOLATION':
            return new BadRequestException('Invalid field name');
          case 'FST_INVALID_MULTIPART_CONTENT_TYPE':
            return new NotAcceptableException('Request is not multipart');
        }
      }

      return error;
    }

    checkMultipart(multipart: Multipart) {
      if (multipart.fieldname !== fieldName) {
        throw new BadRequestException('Invalid field name');
      }
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest();

      if (!req.isMultipart()) {
        throw new NotAcceptableException('Request is not multipart');
      }

      try {
        const data = (await req.file(options)) as Multipart;

        this.checkMultipart(data);

        req.multipart = data;
      } catch (error) {
        throw this.transformException(error);
      }

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
