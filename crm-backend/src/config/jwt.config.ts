import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
  signOptions: { expiresIn: '24h' },
};
