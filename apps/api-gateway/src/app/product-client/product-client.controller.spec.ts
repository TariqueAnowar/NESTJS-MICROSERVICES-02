import { Test, TestingModule } from '@nestjs/testing';
import { ProductClientController } from './product-client.controller';

describe('ProductClientController', () => {
  let controller: ProductClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductClientController],
    }).compile();

    controller = module.get<ProductClientController>(ProductClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
