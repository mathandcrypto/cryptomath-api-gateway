import { Injectable, Logger } from '@nestjs/common';
import { CaptchaPackageService } from './captcha-package.service';
import {
  GenerateTaskResponse,
  ValidateTaskResponse,
} from 'cryptomath-api-proto/types/captcha';

@Injectable()
export class CaptchaPackageMethodsService {
  private readonly logger = new Logger(CaptchaPackageMethodsService.name);

  constructor(private readonly captchaPackageService: CaptchaPackageService) {}

  async generateTask(difficulty = 5): Promise<[boolean, GenerateTaskResponse]> {
    try {
      const response = await this.captchaPackageService.client
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
      const response = await this.captchaPackageService.client
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
