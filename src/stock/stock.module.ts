import { Module } from '@nestjs/common';
import { StockService } from './service/stock.service';
import { StockController } from './controller/stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { StockRepository } from './entities/stock.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService, StockRepository],
})
export class StockModule {}
