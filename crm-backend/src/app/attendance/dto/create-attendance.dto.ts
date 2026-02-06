import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @Type(() => Number)
  @IsNumber()
  employeeId!: number;

  @Type(() => Date)
  @IsDate()
  checkInTime!: Date;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @Type(() => Date)
  @IsDate()
  attendanceDate!: Date;
}
