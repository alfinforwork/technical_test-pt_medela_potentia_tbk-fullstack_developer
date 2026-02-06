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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators/roles.decorator';
import { getErrorMessage } from '../../common/error.handler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import Response from '../../common/response';
import { S3Service } from '../../services/s3.service';
import { AttendanceService } from './attendance.service';
import { CheckOutDto } from './dto/check-out.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService,
    private s3Service: S3Service,
  ) {}

  @Post()
  @Roles('employee', 'admin')
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
      return Response.success('Attendance checked in successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to check in'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @Roles('admin')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.attendanceService.findAll(page, limit);
      return Response.success(
        'Attendances retrieved successfully',
        result.data,
        {
          pagination: result.pagination,
        },
      );
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch attendances'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:userId')
  @Roles('employee', 'admin')
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
      return Response.success(
        'User attendances retrieved successfully',
        result.data,
        {
          pagination: result.pagination,
        },
      );
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch user attendances'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('employee/:employeeId')
  @Roles('admin')
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
      return Response.success(
        'Employee attendances retrieved successfully',
        result.data,
        {
          pagination: result.pagination,
        },
      );
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch employee attendances'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('today/:employeeId')
  @Roles('employee', 'admin')
  async getTodayAttendance(@Param('employeeId') employeeId: number) {
    try {
      const result =
        await this.attendanceService.getTodayAttendance(employeeId);
      return Response.success(
        'Today attendance retrieved successfully',
        result,
      );
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch today attendance'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @Roles('employee', 'admin')
  async findById(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      const result = await this.attendanceService.findById(id);
      return Response.success('Attendance retrieved successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Attendance not found'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id/checkout')
  @Roles('employee', 'admin')
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
      return Response.success('Attendance checked out successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to check out'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @Roles('admin')
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
      return Response.success('Attendance updated successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to update attendance'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles('admin')
  async delete(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      await this.attendanceService.delete(id);
      return Response.success('Attendance deleted successfully', null);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to delete attendance'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
