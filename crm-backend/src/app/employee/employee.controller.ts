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
} from '@nestjs/common';
import { getErrorMessage } from '../../common/error.handler';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      const result = await this.employeeService.create(createEmployeeDto);
      return {
        success: true,
        message: 'Employee created successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to create employee'),
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
      const result = await this.employeeService.findAll(page, limit);
      return {
        success: true,
        message: 'Employees retrieved successfully',
        ...result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch employees'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('active')
  async getActiveEmployees() {
    try {
      const result = await this.employeeService.getActiveEmployees();
      return {
        success: true,
        message: 'Active employees retrieved successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch active employees'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: number) {
    try {
      const result = await this.employeeService.findByUserId(userId);
      return {
        success: true,
        message: 'Employee retrieved successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Employee not found'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':id')
  async findById(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      const result = await this.employeeService.findById(id);
      return {
        success: true,
        message: 'Employee retrieved successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Employee not found'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    try {
      const result = await this.employeeService.update(id, updateEmployeeDto);
      return {
        success: true,
        message: 'Employee updated successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to update employee'),
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
      await this.employeeService.delete(id);
      return {
        success: true,
        message: 'Employee deleted successfully',
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to delete employee'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/deactivate')
  async deactivateEmployee(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      const result = await this.employeeService.deactivateEmployee(id);
      return {
        success: true,
        message: 'Employee deactivated successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to deactivate employee'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/activate')
  async activateEmployee(
    @Param('id', { transform: (val) => parseInt(val as string, 10) })
    id: number,
  ) {
    try {
      const result = await this.employeeService.activateEmployee(id);
      return {
        success: true,
        message: 'Employee activated successfully',
        data: result,
      };
    } catch (error: unknown) {
      throw new HttpException(
        getErrorMessage(error, 'Failed to activate employee'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
