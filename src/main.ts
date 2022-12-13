import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupMiddlewares from './setup-middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupMiddlewares(app);
  await app.listen(3000);
}
bootstrap();
