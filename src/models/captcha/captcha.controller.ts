import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { CaptchaPackageMethodsService } from '@providers/grpc/captcha/captcha-package-methods.service';
import { GuestGuard } from '@auth/guards/guest.guard';
import { CaptchaTokenService } from './captcha-token.service';

@Controller('captcha')
@UseGuards(GuestGuard)
export class CaptchaController {
  constructor(
    private readonly captchaPackageMethodsService: CaptchaPackageMethodsService,
    private readonly captchaTokenService: CaptchaTokenService,
  ) {}

  @Get('/generate')
  async generateCaptcha() {
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
