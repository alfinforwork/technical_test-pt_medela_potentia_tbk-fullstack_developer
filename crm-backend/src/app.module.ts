import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { EmployeeModule } from './app/employee/employee.module';
import { AttendanceModule } from './app/attendance/attendance.module';
import { databaseConfig } from './config/database.config';
import { SeedService } from './seed/seed.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    EmployeeModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
