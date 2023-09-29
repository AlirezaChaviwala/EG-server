import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/HttpException.filters';
import * as passport from 'passport';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(passport.initialize());
  app.enableCors();

  await app.listen(process.env.PORT, () =>
    console.log(`Server listening on port ${process.env.PORT}`),
  );
}
bootstrap();
