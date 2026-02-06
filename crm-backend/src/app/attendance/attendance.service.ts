import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Attendance } from '../../entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const attendance = this.attendanceRepository.create(createAttendanceDto);
    return await this.attendanceRepository.save(attendance);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.attendanceRepository.findAndCount({
      skip,
      take: limit,
      relations: ['user', 'employee'],
      order: { checkInTime: 'DESC' },
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
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['user', 'employee'],
    });

    if (!attendance) {
      throw new Error(`Attendance with id ${id} not found`);
    }

    return attendance;
  }

  async findByUserId(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.attendanceRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      relations: ['employee'],
      order: { checkInTime: 'DESC' },
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

  async findByEmployeeId(
    employeeId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.attendanceRepository.findAndCount({
      where: { employeeId },
      skip,
      take: limit,
      relations: ['user'],
      order: { checkInTime: 'DESC' },
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

  async findByDateRange(startDate: Date, endDate: Date) {
    return await this.attendanceRepository.find({
      where: {
        attendanceDate: Between(startDate, endDate),
      },
      relations: ['user', 'employee'],
      order: { checkInTime: 'DESC' },
    });
  }

  async checkOut(id: number, checkOutTime: Date, photoUrl?: string) {
    const attendance = await this.findById(id);
    attendance.checkOutTime = checkOutTime;
    attendance.status = 'checked_out';
    if (photoUrl) {
      attendance.checkOutPhoto = photoUrl;
    }
    return await this.attendanceRepository.save(attendance);
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.findById(id);

    const updated = this.attendanceRepository.merge(
      attendance,
      updateAttendanceDto,
    );
    return await this.attendanceRepository.save(updated);
  }

  async getTodayAttendance(employeeId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.attendanceRepository.findOne({
      where: {
        employeeId,
        attendanceDate: Between(today, tomorrow),
      },
      relations: ['employee'],
    });
  }

  async delete(id: number) {
    const attendance = await this.findById(id);
    return await this.attendanceRepository.remove(attendance);
  }
}
