import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TaskPayload } from 'cryptomath-api-proto/types/captcha';
import { CaptchaConfigService } from '@config/captcha/config.service';
import { DecodeJwtTokenError } from '@common/enums/errors/decode-jwt-token.enum';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class CaptchaTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly captchaConfigService: CaptchaConfigService,
  ) {}

  async generateCaptchaToken(taskPayload: TaskPayload): Promise<string> {
    return this.jwtService.signAsync(taskPayload);
  }

  async decodeCaptchaToken(
    token: string,
  ): Promise<[boolean, DecodeJwtTokenError, TaskPayload]> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.captchaConfigService.captchaTokenSecret,
      });

      return [true, null, payload];
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return [false, DecodeJwtTokenError.TokenExpired, null];
      } else {
        return [false, DecodeJwtTokenError.TokenMalformed, null];
      }
    }
  }
}
