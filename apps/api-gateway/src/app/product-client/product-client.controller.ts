import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import {
  PRODUCT_SERVICE_NAME,
  PRODUCTS_PACKAGE_NAME,
  ProductServiceClient,
} from '../../../../../types/proto/products';
import type { ClientGrpc } from '@nestjs/microservices';

@Controller('product-client')
export class ProductClientController implements OnModuleInit {
  private productService: ProductServiceClient;

  constructor(@Inject(PRODUCTS_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Get()
  async getProducts() {
    return this.productService.getProduct({ productId: 133 });
  }
}
