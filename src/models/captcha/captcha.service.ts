import { Injectable } from '@nestjs/common';
import { CaptchaTokenService } from './captcha-token.service';
import { CaptchaPackageService } from '@providers/grpc/captcha/captcha-package.service';
import { ValidateAnswerError } from './enums/errors/validate-answer.enum';
import { DecodeJwtTokenError } from '@common/enums/errors/decode-jwt-token.enum';

@Injectable()
export class CaptchaService {
  constructor(
    private readonly captchaTokenService: CaptchaTokenService,
    private readonly captchaPackageService: CaptchaPackageService,
  ) {}

  async validateAnswer(
    token: string,
    answer: number,
  ): Promise<[boolean, ValidateAnswerError | DecodeJwtTokenError, boolean]> {
    const [
      decodeStatus,
      errorType,
      payload,
    ] = await this.captchaTokenService.decodeCaptchaToken(token);

    if (!decodeStatus) {
      return [false, errorType, false];
    }

    const { uuid, params } = payload;

    const [
      validateStatus,
      validateResponse,
    ] = await this.captchaPackageService.validateTask(uuid, params, answer);

    if (!validateStatus) {
      return [false, ValidateAnswerError.ValidateTaskError, false];
    }

    const { isTaskFound, isAnswerCorrect } = validateResponse;

    if (!isTaskFound) {
      return [false, ValidateAnswerError.TaskNotFound, false];
    }

    return [true, null, isAnswerCorrect];
  }
}
