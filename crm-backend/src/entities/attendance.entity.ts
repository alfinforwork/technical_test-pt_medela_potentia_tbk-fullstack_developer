import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { User } from './user.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint' })
  userId!: number;

  @Column({ type: 'bigint' })
  employeeId!: number;

  @Column({ type: 'datetime' })
  checkInTime!: Date;

  @Column({ type: 'datetime', nullable: true })
  checkOutTime?: Date;

  @Column({ type: 'text', nullable: true })
  photoUrl?: string;

  @Column({ type: 'text', nullable: true })
  checkOutPhoto?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 50, default: 'present' })
  status!: string;

  @Column({ type: 'date' })
  attendanceDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Employee, (employee) => employee.attendances)
  @JoinColumn({ name: 'employeeId' })
  employee!: Employee;
}
