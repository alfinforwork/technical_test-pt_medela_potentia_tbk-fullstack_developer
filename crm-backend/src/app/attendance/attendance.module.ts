import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../../entities/attendance.entity';
import { S3Service } from '../../services/s3.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  providers: [AttendanceService, S3Service],
  controllers: [AttendanceController],
  exports: [AttendanceService],
})
export class AttendanceModule {}
