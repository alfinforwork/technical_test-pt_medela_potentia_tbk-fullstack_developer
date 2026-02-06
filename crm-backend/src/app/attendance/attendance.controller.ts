import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { getErrorMessage } from '../../common/error.handler';
import { S3Service } from '../../services/s3.service';
import { AttendanceService } from './attendance.service';
import { CheckOutDto } from './dto/check-out.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendances')
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService,
    private s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      let photoUrl = '';
      if (file) {
        photoUrl = await this.s3Service.uploadFile(file, 'attendance');
      }

      const result = await this.attendanceService.create({
        ...createAttendanceDto,
        photoUrl,
      });
      return {
        success: true,
        message: 'Attendance checked in successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to check in'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.attendanceService.findAll(page, limit);
      return {
        success: true,
        message: 'Attendances retrieved successfully',
        ...result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch attendances'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.attendanceService.findByUserId(
        userId,
        page,
        limit,
      );
      return {
        success: true,
        message: 'User attendances retrieved successfully',
        ...result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch user attendances'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId') employeeId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.attendanceService.findByEmployeeId(
        employeeId,
        page,
        limit,
      );
      return {
        success: true,
        message: 'Employee attendances retrieved successfully',
        ...result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch employee attendances'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('today/:employeeId')
  async getTodayAttendance(@Param('employeeId') employeeId: number) {
    try {
      const result =
        await this.attendanceService.getTodayAttendance(employeeId);
      return {
        success: true,
        message: 'Today attendance retrieved successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch today attendance'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findById(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      const result = await this.attendanceService.findById(id);
      return {
        success: true,
        message: 'Attendance retrieved successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Attendance not found'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id/checkout')
  @UseInterceptors(FileInterceptor('photo'))
  async checkOut(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
    @Body() checkOutDto: CheckOutDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      let photoUrl = '';
      if (file) {
        photoUrl = await this.s3Service.uploadFile(file, 'checkout');
      }

      const result = await this.attendanceService.checkOut(
        id,
        checkOutDto.checkOutTime,
        photoUrl,
      );
      return {
        success: true,
        message: 'Attendance checked out successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to check out'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    try {
      const result = await this.attendanceService.update(
        id,
        updateAttendanceDto,
      );
      return {
        success: true,
        message: 'Attendance updated successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to update attendance'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async delete(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      await this.attendanceService.delete(id);
      return {
        success: true,
        message: 'Attendance deleted successfully',
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to delete attendance'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
