import { Controller, Get, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type {
  GetProductRequest,
  GetProductResponse,
  ProductServiceController,
} from '../../../../../types/proto/products';
import { Observable } from 'rxjs';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController implements ProductServiceController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'GetProduct')
  getProduct(
    request: GetProductRequest,
  ):
    | GetProductResponse
    | Promise<GetProductResponse>
    | Observable<GetProductResponse> {
    const v = this.productService.getProductGRPC(request.productId);
    return v;
  }

  @Get(':productId')
  getProductRest(@Param('productId') productId: string) {
    // Convert string to number for the REST endpoint
    return this.productService.getProductRest(parseInt(productId, 10));
  }
}
