import { Controller, Get } from '@nestjs/common';
import { WelcomeResponseDTO } from '@common/dto/response/welcome.dto';
import { AppConfigService } from '@config/app/config.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('main')
@Controller('/')
export class AppController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get basic information about the API' })
  @ApiResponse({
    status: 200,
    type: WelcomeResponseDTO,
    description: 'API info',
  })
  welcome(): WelcomeResponseDTO {
    const { buildVersion, url, docsPath } = this.appConfigService;

    return {
      message: 'Hi there! This is CryptoMath API',
      version: buildVersion,
      documentation: `${url}/${docsPath}`,
    };
  }
}
