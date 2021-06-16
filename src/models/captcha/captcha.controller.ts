import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { CaptchaPackageMethodsService } from '@providers/grpc/captcha/captcha-package-methods.service';
import { GuestGuard } from '@auth/guards/guest.guard';
import { CaptchaTokenService } from './captcha-token.service';
import { CaptchaGenerateResponseDTO } from './dto/captcha-generate-response.dto';
import { GenerateCaptchaException } from './constants/exceptions/generate-captcha.exception';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('captcha')
@Controller('captcha')
@UseGuards(GuestGuard)
export class CaptchaController {
  constructor(
    private readonly captchaPackageMethodsService: CaptchaPackageMethodsService,
    private readonly captchaTokenService: CaptchaTokenService,
  ) {}

  @Get('/generate')
  @ApiOperation({ summary: 'Generate new captcha task' })
  @ApiResponse({
    status: 200,
    type: CaptchaGenerateResponseDTO,
    description: 'Generated captcha task data',
  })
  async generateCaptcha(): Promise<CaptchaGenerateResponseDTO> {
    const [
      generateStatus,
      generateResponse,
    ] = await this.captchaPackageMethodsService.generateTask();

    if (!generateStatus) {
      throw new InternalServerErrorException(
        GenerateCaptchaException.GenerateTaskError,
      );
    }

    const { isTaskGenerated, taskPayload, math } = generateResponse;

    if (!isTaskGenerated) {
      throw new InternalServerErrorException(
        GenerateCaptchaException.TaskNotGenerated,
      );
    }

    const token = await this.captchaTokenService.generateCaptchaToken(
      taskPayload,
    );

    return { token, math };
  }
}
