import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  CAPTCHA_PACKAGE_NAME,
  CAPTCHA_SERVICE_NAME,
  CaptchaServiceClient,
  GenerateTaskResponse,
  ValidateTaskResponse,
} from 'cryptomath-api-proto/types/captcha';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class CaptchaPackageService implements OnModuleInit {
  private readonly logger = new Logger(CaptchaPackageService.name);
  private client: CaptchaServiceClient;

  constructor(@Inject(CAPTCHA_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.clientGrpc.getService<CaptchaServiceClient>(
      CAPTCHA_SERVICE_NAME,
    );
  }

  async generateTask(difficulty = 5): Promise<[boolean, GenerateTaskResponse]> {
    try {
      const response = await this.client
        .generateTask({ difficulty })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async validateTask(
    uuid: string,
    params: number[],
    answer: number,
  ): Promise<[boolean, ValidateTaskResponse]> {
    try {
      const response = await this.client
        .validateTask({
          uuid,
          params,
          answer,
        })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}
