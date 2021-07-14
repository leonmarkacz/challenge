import { ApiProperty } from '@nestjs/swagger';
import { ReservationToken } from '../model/reservation-token.interface';

export class SellStockDto implements ReservationToken {
  @ApiProperty()
  reservationToken: string;
}
