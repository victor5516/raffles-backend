import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { generateAccessToken, comparePasswords } from '../utils/crypto';
import { adminLoginValidator } from '../middleware/validators/admin.validator';

export const adminLogin = [
  adminLoginValidator,
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
