import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const logger: Logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = new ConfigService();

  app.enableCors();

  app.setGlobalPrefix('/api/v1');
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    logger.verbose(`Server is listening in PORT ${PORT}`);
  });
}
bootstrap();
