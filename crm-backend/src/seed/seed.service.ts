import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    try {
      const existingAdmin = await this.userRepository.findOne({
        where: { email: 'admin@getnada.com' },
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('12345678', 10);
        
        const adminUser = this.userRepository.create({
          email: 'admin@getnada.com',
          password: hashedPassword,
          name: 'System Administrator',
          role: 'admin',
          isActive: true,
        });

        await this.userRepository.save(adminUser);
        console.log('Admin user created successfully!');
        console.log('Email: admin@getnada.com');
        console.log('Password: 12345678');
      }
    } catch (error) {
      console.error('Error seeding admin user:', error);
    }
  }
}
