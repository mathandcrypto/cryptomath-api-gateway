import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TaskPayload } from 'cryptomath-api-proto/proto/build/captcha';

@Injectable()
export class CaptchaTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateCaptchaToken(taskPayload: TaskPayload): Promise<string> {
    return this.jwtService.signAsync(taskPayload);
  }
}
