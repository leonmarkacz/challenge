import { OmitType } from '@nestjs/swagger';
import { Stock } from '../entities/stock.entity';

export class CreateStockDto extends OmitType(Stock, []) {}
