import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import Response from '../../common/response';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return Response.success('User registered successfully', result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return Response.success('Login successful', result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }
}
