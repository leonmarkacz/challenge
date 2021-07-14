import { ApiProperty } from '@nestjs/swagger';
import { DetailedStockInformation } from '../model/detailed-stock-informations.interface';

export class DetailedStockDto implements DetailedStockInformation {
  @ApiProperty()
  IN_STOCK: number;
  @ApiProperty()
  RESERVED: number;
  @ApiProperty()
  SOLD: number;
}
