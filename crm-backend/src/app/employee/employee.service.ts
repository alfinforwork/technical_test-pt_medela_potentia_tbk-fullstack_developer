import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { User } from '../../entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { email, password, name, phone, position, department } =
      createEmployeeDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: 'employee',
    });

    const savedUser = await this.userRepository.save(user);

    // Create employee record
    const employee = this.employeeRepository.create({
      userId: savedUser.id,
      name,
      email,
      phone,
      position,
      department,
    });

    return await this.employeeRepository.save(employee);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.employeeRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['attendances'],
    });

    if (!employee) {
      throw new Error(`Employee with id ${id} not found`);
    }

    return employee;
  }

  async findByEmail(email: string) {
    return await this.employeeRepository.findOne({
      where: { email },
    });
  }

  async findByUserId(userId: number) {
    const employee = await this.employeeRepository.findOne({
      where: { userId },
    });

    if (!employee) {
      throw new Error(`Employee for user ${userId} not found`);
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findById(id);
    const { email, password, ...rest } = updateEmployeeDto;

    // If email is being updated, check if it's already in use
    if (email && email !== employee.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Update employee fields
    const updated = this.employeeRepository.merge(employee, rest);
    if (email) {
      updated.email = email;
    }

    const savedEmployee = await this.employeeRepository.save(updated);

    // Update user record if email or password changed
    if (email || password) {
      const user = await this.userRepository.findOne({
        where: { id: employee.userId },
      });

      if (user) {
        if (email) {
          user.email = email;
        }
        if (password) {
          user.password = await bcrypt.hash(password, 10);
        }
        await this.userRepository.save(user);
      }
    }

    return savedEmployee;
  }

  async delete(id: number) {
    const employee = await this.findById(id);
    return await this.employeeRepository.remove(employee);
  }

  async getActiveEmployees() {
    return await this.employeeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async deactivateEmployee(id: number) {
    const employee = await this.findById(id);
    employee.isActive = false;
    return await this.employeeRepository.save(employee);
  }

  async activateEmployee(id: number) {
    const employee = await this.findById(id);
    employee.isActive = true;
    return await this.employeeRepository.save(employee);
  }
}
