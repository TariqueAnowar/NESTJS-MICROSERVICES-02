import { Controller } from '@nestjs/common';
import {
  GetProductRequest,
  GetProductResponse,
  ProductServiceController,
  ProductServiceControllerMethods,
} from '../../../../../types/proto/products';
import { Observable } from 'rxjs';

@Controller('product')
@ProductServiceControllerMethods()
export class ProductController implements ProductServiceController {
  getProduct(
    request: GetProductRequest,
  ):
    | Promise<GetProductResponse>
    | Observable<GetProductResponse>
    | GetProductResponse {
    return {
      product: {
        productId: request.productId,
        name: 'test',
        description: 'test',
        price: 100,
      },
    };
  }
}
