import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { StockRepository } from '../entities/stock.repository';

describe('StockService', () => {
  let service: StockService;
  let stockRepository: StockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockService, StockRepository],
    }).compile();

    service = module.get<StockService>(StockService);
    stockRepository = module.get<StockRepository>(StockRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
