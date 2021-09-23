import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StockStatusEnum } from '../model/stock-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Column('enum', { enum: StockStatusEnum })
  @ApiProperty()
  @IsNotEmpty()
  status: StockStatusEnum;

  @Column({ nullable: true })
  @ApiProperty()
  @IsString()
  reservationToken: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: number;
}
