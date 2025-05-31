/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PRODUCTS_PACKAGE_NAME } from '../../../types/proto/products';

async function bootstrap() {
  // Create a hybrid application (HTTP + gRPC)
  const app = await NestFactory.create(AppModule);

  // Connect microservice (gRPC)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PRODUCTS_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/products.proto'),
      url: `0.0.0.0:${process.env.PORT}`,
      credentials: require('@grpc/grpc-js').ServerCredentials.createInsecure(),
    },
  });

  // Start all microservices (gRPC)
  await app.startAllMicroservices();

  // Start HTTP server
  const port = process.env.PORT || 3001;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  Logger.log(`🚀 gRPC server is listening on default port`);
}

bootstrap();
