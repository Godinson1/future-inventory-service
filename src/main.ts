import { NestFactory } from '@nestjs/core';
import { RmqService } from 'future-connectors';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { INVENTORY } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(INVENTORY));

  app.enableCors();
  app.use(helmet());
  await app.startAllMicroservices();
  await app.listen(5000);
}
bootstrap();
