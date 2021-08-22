import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  CAPTCHA_PACKAGE_NAME,
  CAPTCHA_SERVICE_NAME,
  CaptchaServiceClient,
  GenerateTaskResponse,
  ValidateTaskResponse,
} from '@cryptomath/cryptomath-api-proto/types/captcha';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CaptchaPackageService implements OnModuleInit {
  private readonly logger = new Logger(CaptchaPackageService.name);
  private client: CaptchaServiceClient;

  constructor(@Inject(CAPTCHA_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client =
      this.clientGrpc.getService<CaptchaServiceClient>(CAPTCHA_SERVICE_NAME);
  }

  async generateTask(): Promise<[boolean, GenerateTaskResponse]> {
    try {
      const observable = this.client.generateTask({});
      const response = await firstValueFrom<GenerateTaskResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async validateTask(
    uuid: string,
    answer: number,
  ): Promise<[boolean, ValidateTaskResponse]> {
    try {
      const observable = this.client.validateTask({
        uuid,
        answer,
      });
      const response = await firstValueFrom<ValidateTaskResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}
