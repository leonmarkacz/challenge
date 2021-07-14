import { ApiProperty } from '@nestjs/swagger';
import { ReservationToken } from '../model/reservation-token.interface';

export class ReserveStockDto implements ReservationToken {
  @ApiProperty()
  reservationToken: string;
}
