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
import { FastifyFileInterceptorException } from '../constants/exceptions/fastify-file-interceptor.exception';

export function FastifyFileInterceptor(
  fieldName: string,
  options?: BusboyConfig,
) {
  class MixinInterceptor implements NestInterceptor {
    transformException(error: (Error & { code: string }) | undefined) {
      if (error.code) {
        switch (error.code) {
          case 'FST_PARTS_LIMIT':
            return new PayloadTooLargeException(
              FastifyFileInterceptorException.ReachedPartsLimit,
            );
          case 'FST_FILES_LIMIT':
            return new PayloadTooLargeException(
              FastifyFileInterceptorException.ReachedFilesLimit,
            );
          case 'FST_FIELDS_LIMIT':
            return new PayloadTooLargeException(
              FastifyFileInterceptorException.ReachedFieldsLimit,
            );
          case 'FST_REQ_FILE_TOO_LARGE':
            return new PayloadTooLargeException(
              FastifyFileInterceptorException.FileTooLarge,
            );
          case 'FST_PROTO_VIOLATION':
            return new BadRequestException(
              FastifyFileInterceptorException.InvalidFieldName,
            );
          case 'FST_INVALID_MULTIPART_CONTENT_TYPE':
            return new NotAcceptableException(
              FastifyFileInterceptorException.NotMultipartRequest,
            );
        }
      }

      return error;
    }

    checkMultipart(multipart: Multipart) {
      if (multipart.fieldname !== fieldName) {
        throw new BadRequestException(
          FastifyFileInterceptorException.InvalidFieldName,
        );
      }
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest();

      if (!req.isMultipart()) {
        throw new NotAcceptableException(
          FastifyFileInterceptorException.NotMultipartRequest,
        );
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
