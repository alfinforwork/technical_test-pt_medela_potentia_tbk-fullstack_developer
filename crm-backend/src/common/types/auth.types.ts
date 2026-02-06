import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  email: string;
  role: 'employee' | 'admin';
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
