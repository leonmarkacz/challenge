import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { StockService } from '../service/stock.service';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellStockDto } from '../dto/sell-stock.dto';
import { UnreserveStockDto } from '../dto/unreserve-stock.dto';
import { ReserveStockDto } from '../dto/reserve-stock.dto';
import { AppendStockDto } from '../dto/append-stock.dto';
import { DetailedStockDto } from '../dto/detailed-stock.dto';
import { Stock } from '../entities/stock.entity';
import { DetailedStockInformation } from '../model/detailed-stock-informations.interface';
import { ReservationToken } from '../model/reservation-token.interface';

@ApiTags('product')
@Controller('product')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'returns detailed stock informations for productId',
  })
  @ApiOkResponse({
    description: 'detailed stock informations for product',
    type: DetailedStockDto,
  })
  getDetailedStockInformation(@Param('id') productId: string): Promise<DetailedStockInformation> {
    return this.stockService.getDetailedStockInformation(productId);
  }

  @Post(':id/reserve')
  @ApiOperation({ summary: 'reserves one element from stock' })
  @ApiOkResponse({
    description: 'reserves one element from stock',
    type: ReserveStockDto,
  })
  @ApiBadRequestResponse({
    description: "Couldn't reserve product",
  })
  @HttpCode(200)
  reserveProduct(@Param('id') productId: string): Promise<ReservationToken> {
    return this.stockService.reserveProductFromStock(productId);
  }

  @Post(':id/unreserve')
  @ApiOperation({ summary: 'unreserves one element from stock' })
  @ApiOkResponse({
    description: 'unreserves one element from stock',
  })
  @ApiBadRequestResponse({
    description: "Couldn't unreserve product with reservationToken #token",
  })
  @ApiBody({
    type: UnreserveStockDto,
  })
  @HttpCode(200)
  unreserveProduct(
    @Param('id') productId: string,
    @Body() unreserveStockDto: UnreserveStockDto
  ): Promise<ReservationToken> {
    return this.stockService.unreserveProductFromStock(productId, unreserveStockDto);
  }

  @Post(':id/sold')
  @ApiOperation({ summary: 'sells reserved element from stock' })
  @ApiOkResponse({
    description: 'sells reserved element from stock',
  })
  @ApiBadRequestResponse({
    description: "Couldn't sell reserved product with reservationToken #token",
  })
  @ApiBody({
    type: SellStockDto,
  })
  @HttpCode(200)
  sellProduct(@Param('id') productId: string, @Body() sellStockDto: SellStockDto): Promise<Stock> {
    return this.stockService.sellReservedProduct(productId, sellStockDto);
  }

  @Put(':id/stock')
  @ApiOperation({
    summary: 'sets amount of sellable items',
  })
  @ApiOkResponse({
    description: 'sets amount of sellable items',
  })
  @ApiBadRequestResponse({
    description: "Couldn't add stock for product #productId",
  })
  @ApiBody({
    type: AppendStockDto,
  })
  appendStock(@Param('id') id: string, @Body() appendStockDto: AppendStockDto): Promise<Stock[] | Stock> {
    return this.stockService.appendStock(id, appendStockDto);
  }
}
