import jwt, { type SignOptions } from 'jsonwebtoken';

export default function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  });
}