import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from '../service/stock.service';
import { StockRepository } from '../entities/stock.repository';
import { Stock } from '../entities/stock.entity';

describe('StockController', () => {
  let controller: StockController;
  let stockrepository: StockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [StockService, StockRepository],
    }).compile();

    controller = module.get<StockController>(StockController);
    stockrepository = module.get<StockRepository>(StockRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
