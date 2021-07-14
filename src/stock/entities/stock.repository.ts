import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { BadRequestException, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { StockStatusEnum } from '../model/stock-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { DetailedStockDto } from '../dto/detailed-stock.dto';
import { ReserveStockDto } from '../dto/reserve-stock.dto';

@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> implements OnModuleInit {
  private repository: Repository<Stock>;

  constructor() {
    super();
  }

  async onModuleInit() {
    this.repository = await getConnection().getRepository(Stock);
    Logger.log(`Repository found: ${this.repository.manager.connection.isConnected}`, 'StockRepository');
  }

  async saveProducts(prodcuts): Promise<Stock[] | Stock> {
    try {
      const products = await this.repository.save(prodcuts);
      Logger.log(`saveProducts: ${JSON.stringify(products)}`, 'StockRepository');
      return prodcuts;
    } catch (error) {
      Logger.error(error, 'appendStock', 'StockService');
      throw new InternalServerErrorException(error);
    }
  }

  async getDetailedStock(productId: string): Promise<DetailedStockDto> {
    try {
      const detailedStock = {
        IN_STOCK: await this.repository.count({
          productId,
          status: StockStatusEnum.IN_STOCK,
        }),
        RESERVED: await this.repository.count({
          productId,
          status: StockStatusEnum.RESERVED,
        }),
        SOLD: await this.repository.count({
          productId,
          status: StockStatusEnum.SOLD,
        }),
      };
      Logger.log(`getDetailedStock: ${JSON.stringify(detailedStock)}`, 'StockRepository');
      return detailedStock;
    } catch (error) {
      Logger.error(error, 'getDetailedStockInformation', 'StockService');
      throw new BadRequestException();
    }
  }

  async reserveProduct(productId: string): Promise<ReserveStockDto> {
    try {
      const product = await this.repository.findOne({
        productId,
        status: StockStatusEnum.IN_STOCK,
      });
      const reservatedProduct = await this.repository.save({
        id: product.id,
        status: StockStatusEnum.RESERVED,
        reservationToken: uuidv4(),
      });
      Logger.log(
        `Reserved #${product.id} with reservationToken: ${reservatedProduct.reservationToken}`,
        'StockRepository'
      );
      return { reservationToken: reservatedProduct.reservationToken };
    } catch (error) {
      Logger.error(error, 'reserveProductFromStock', 'StockService');
      throw new BadRequestException('Could not reserve item. There are no reservable items left');
    }
  }

  async unreserveProduct(productId: string, reservationToken: string): Promise<Stock> {
    try {
      const product = await this.repository.findOne({
        productId,
        reservationToken,
        status: StockStatusEnum.RESERVED,
      });
      Logger.log(`Unreserved item for reservationToken: ${reservationToken}`, 'StockRepository');
      return await this.repository.save({
        id: product.id,
        status: StockStatusEnum.IN_STOCK,
        reservationToken: null,
      });
    } catch (error) {
      Logger.error(error, 'unreserveProductFromStock', 'StockService');
      throw new BadRequestException('Could not unreserve item');
    }
  }

  async sellProduct(productId: string, reservationToken: string): Promise<Stock> {
    const product = await this.repository.findOne({
      productId,
      reservationToken,
      status: StockStatusEnum.RESERVED,
    });
    if (product) {
      try {
        Logger.log(`Selling item for reservationToken: ${reservationToken}`, 'StockRepository');
        return await this.repository.save({
          id: product.id,
          status: StockStatusEnum.SOLD,
          reservationToken: null,
        });
      } catch (error) {
        Logger.error(error, null, 'sellProduct');
        throw new InternalServerErrorException(
          `Could not update product status for reservationToken #${reservationToken}`
        );
      }
    }
    Logger.error(
      `Could not sell reserved item for reservationToken: ${reservationToken}`,
      'sellReservedProduct',
      'StockService'
    );
    throw new BadRequestException('Could not sell reserved item');
  }
}
