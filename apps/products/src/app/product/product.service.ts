import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  getProductGRPC(productId: number) {
    // In a real application, you would fetch this from a database
    return {
      communication: 'response from gRPC',
      productId,
    };
  }
  getProductRest(productId: number) {
    // In a real application, you would fetch this from a database
    return {
      communication: 'response from restApi',
      productId,
    };
  }
}
