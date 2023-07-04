import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: Logger = new Logger("main");
  const PORT = process.env.PORT || 3000;
  await app.listen((PORT), () => {
    logger.verbose(`Server is listening in PORT ${PORT}`);
  });
}
bootstrap();
