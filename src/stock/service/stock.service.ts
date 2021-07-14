import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { UnreserveStockDto } from '../dto/unreserve-stock.dto';
import { SellStockDto } from '../dto/sell-stock.dto';
import { AppendStockDto } from '../dto/append-stock.dto';
import { CreateStockDto } from '../dto/create-stock.dto';
import { Stock } from '../entities/stock.entity';
import { StockStatusEnum } from '../model/stock-status.enum';
import { StockRepository } from '../entities/stock.repository';
import { ReserveStockDto } from '../dto/reserve-stock.dto';

@Injectable()
export class StockService {
  constructor(private stockRepository: StockRepository) {}

  async getDetailedStockInformation(productId: string) {
    return await this.stockRepository.getDetailedStock(productId);
  }

  async appendStock(productId: string, appendStockDto: AppendStockDto): Promise<Stock[] | Stock> {
    if (appendStockDto.stock > 0) {
      const stock: CreateStockDto[] = [];
      const amountToAppend = appendStockDto.stock - (await this.getDetailedStockInformation(productId)).IN_STOCK;

      for (let i = 0; i < amountToAppend; i++) {
        const product = new Stock();
        product.productId = productId;
        product.reservationToken = null;
        product.status = StockStatusEnum.IN_STOCK;
        product.size = 45;

        stock.push(product);
      }
      return await this.stockRepository.saveProducts(stock);
    }
    Logger.error('No stock amount given', 'appendStock', 'StockService');
    throw new BadRequestException('');
  }

  async reserveProductFromStock(productId: string): Promise<ReserveStockDto> {
    const reservedProduct = await this.stockRepository.reserveProduct(productId);
    return { reservationToken: reservedProduct.reservationToken };
  }

  async unreserveProductFromStock(productId: string, unreserveStockDto: UnreserveStockDto): Promise<UnreserveStockDto> {
    if (uuidValidate(unreserveStockDto.reservationToken)) {
      return await this.stockRepository.unreserveProduct(productId, unreserveStockDto.reservationToken);
    }
  }

  async sellReservedProduct(productId: string, sellStockDto: SellStockDto): Promise<Stock> {
    if (uuidValidate(sellStockDto.reservationToken)) {
      return await this.stockRepository.sellProduct(productId, sellStockDto.reservationToken);
    }
  }
}
