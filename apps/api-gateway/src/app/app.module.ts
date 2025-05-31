import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PRODUCTS_PACKAGE_NAME } from '../../../../types/proto/products';
import { ProductClientController } from './product-client/product-client.controller';

import { Logger } from '@nestjs/common'; // Add this import

const grpcUrl = process.env.PRODUCTS_GRPC_URL;

if (!grpcUrl) {
  // This log will confirm if the ENV var is missing
  Logger.error(
    'PRODUCTS_GRPC_URL environment variable is NOT set for gRPC client in AppModule!',
    'AppModule Init',
  );
  // Consider throwing an error here to prevent misconfiguration if this is critical
  // throw new Error('PRODUCTS_GRPC_URL is not set.');
} else {
  // This log will confirm the exact URL being used by the client
  Logger.log(`[Client Init] Using gRPC URL: ${grpcUrl}`, 'AppModule Init');
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: PRODUCTS_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/products.proto'),
          url: process.env.PRODUCTS_SERVICE_URL,
        },
      },
    ]),
  ],
  controllers: [AppController, ProductClientController],
  providers: [AppService],
})
export class AppModule {}
