import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaConfig } from './utils/kafkaConfig';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    kafkaConfig,
  );
  await app.listen();
}
bootstrap();
