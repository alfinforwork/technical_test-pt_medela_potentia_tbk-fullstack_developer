import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CheckOutDto {
  @Type(() => Date)
  @IsDate()
  checkOutTime!: Date;
}
