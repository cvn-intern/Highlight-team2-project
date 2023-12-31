import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { INestApplication, Logger } from '@nestjs/common';
import * as compression from 'compression';

export let app: INestApplication;

async function bootstrap() {
  const logger: Logger = new Logger('main');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(
    compression({
      filter: () => {
        return true;
      },
    }),
  );

  app.setGlobalPrefix('/api/v1');
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    logger.verbose(`Server is listening in PORT ${PORT}`);
  });
}
bootstrap();
