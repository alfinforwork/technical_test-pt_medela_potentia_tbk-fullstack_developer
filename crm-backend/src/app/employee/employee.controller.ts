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
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { getErrorMessage } from '../../common/error.handler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import Response from '../../common/response';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post()
  @Roles('admin')
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      const result = await this.employeeService.create(createEmployeeDto);
      return Response.success('Employee created successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to create employee'),
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
      const result = await this.employeeService.findAll(page, limit);
      return Response.success('Employees retrieved successfully', result.data, {
        pagination: result.pagination,
      });
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch employees'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('active')
  @Roles('admin', 'employee')
  async getActiveEmployees() {
    try {
      const result = await this.employeeService.getActiveEmployees();
      return Response.success(
        'Active employees retrieved successfully',
        result,
      );
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch active employees'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:userId')
  @Roles('admin', 'employee')
  async getByUserId(@Param('userId') userId: number) {
    try {
      const result = await this.employeeService.findByUserId(userId);
      return Response.success('Employee retrieved successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Employee not found'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':id')
  @Roles('admin', 'employee')
  async findById(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      const result = await this.employeeService.findById(id);
      return Response.success('Employee retrieved successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Employee not found'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    try {
      const result = await this.employeeService.update(id, updateEmployeeDto);
      return Response.success('Employee updated successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to update employee'),
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
      await this.employeeService.delete(id);
      return Response.success('Employee deleted successfully', null);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to delete employee'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/deactivate')
  @Roles('admin')
  async deactivateEmployee(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      const result = await this.employeeService.deactivateEmployee(id);
      return Response.success('Employee deactivated successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to deactivate employee'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/activate')
  @Roles('admin')
  async activateEmployee(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      const result = await this.employeeService.activateEmployee(id);
      return Response.success('Employee activated successfully', result);
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to activate employee'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
