import { ApiProperty } from '@nestjs/swagger';
import { AppendStock } from '../model/append-stock.interface';

export class AppendStockDto implements AppendStock {
  @ApiProperty()
  stock: number;
}
