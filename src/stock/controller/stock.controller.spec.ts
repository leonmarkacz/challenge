import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from '../service/stock.service';
import { StockRepository } from '../entities/stock.repository';

describe('StockController', () => {
  let controller: StockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [StockService, StockRepository],
    }).compile();

    controller = module.get<StockController>(StockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
