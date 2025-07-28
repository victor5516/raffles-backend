import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
export function generateAccessToken(uid: string): string {
  return jwt.sign({ sub: uid }, config.jwtSecret);
}