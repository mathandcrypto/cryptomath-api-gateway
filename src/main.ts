import { NestFactory } from '@nestjs/core';
import { AppConfigService } from '@config/app/config.service';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, Logger, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('CryptoMath API')
    .setDescription('Public API for CryptoMath services')
    .setVersion('0.0.1')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const logger = new Logger('bootstrap');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  setupSwagger(app);

  const appConfigService = app.get(AppConfigService);
  const { port } = appConfigService;

  await app.listen(port);

  const url = await app.getUrl();
  logger.log(`Application is running on ${url}, port: ${port}`);
}
bootstrap();
