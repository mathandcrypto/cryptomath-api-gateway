import {
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CaptchaPackageMethodsService } from '@providers/grpc/captcha/captcha-package-methods.service';
import { JwtHandleUserAuthGuard } from '@auth/guards/jwt-handle-user-auth.guard';
import { CaptchaTokenService } from './captcha-token.service';

@Controller('captcha')
@UseGuards(JwtHandleUserAuthGuard)
export class CaptchaController {
  constructor(
    private readonly captchaPackageMethodsService: CaptchaPackageMethodsService,
    private readonly captchaTokenService: CaptchaTokenService,
  ) {}

  @Get('/generate')
  async generateCaptcha(@Req() request) {
    if (request.user) {
      throw new ForbiddenException(
        'You cannot generate captcha tasks when you are logged in',
      );
    }

    const [
      generateStatus,
      generateResponse,
    ] = await this.captchaPackageMethodsService.generateTask();

    if (!generateStatus) {
      throw new InternalServerErrorException('Failed to generate captcha task');
    }

    const { isTaskGenerated, taskPayload, math } = generateResponse;

    if (!isTaskGenerated) {
      throw new InternalServerErrorException('Captcha task not generated');
    }

    const token = await this.captchaTokenService.generateCaptchaToken(
      taskPayload,
    );

    return { token, math };
  }
}
