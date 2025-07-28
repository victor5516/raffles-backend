import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import { generateAccessToken, hashPassword, comparePasswords } from '../utils/crypto';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const adminLogin = [
  validate(loginSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await comparePasswords(password, admin.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateAccessToken(admin.uid);
    res.status(200).json({ admin: { email: admin.email, full_name: admin.full_name }, token });
  },
];
