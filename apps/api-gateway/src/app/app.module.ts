import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PRODUCTS_PACKAGE_NAME } from '../../../../types/proto/products';
import { ProductClientController } from './product-client/product-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: PRODUCTS_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/products.proto'),
          url: process.env.PRODUCTS_GRPC_URL,
          credentials: process.env.PRODUCTS_GRPC_URL?.includes('onrender.com')
            ? require('@grpc/grpc-js').credentials.createSsl() // For external URLs
            : require('@grpc/grpc-js').credentials.createInsecure(), // For internal URLs
        },
      },
    ]),
  ],
  controllers: [AppController, ProductClientController],
  providers: [AppService],
})
export class AppModule {}
