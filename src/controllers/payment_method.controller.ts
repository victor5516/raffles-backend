import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import { CurrencyType } from '@prisma/client';

const paymentMethodSchema = z.object({
  name: z.string().min(1),
  image_url: z.string().url().optional(),
  payment_data: z.any(),
  minimum_payment_amount: z.string().min(1),
  currency: z.nativeEnum(CurrencyType),
});

const updatePaymentMethodSchema = paymentMethodSchema.partial();

export const createPaymentMethod = [
  validate(paymentMethodSchema),
  async (req: Request, res: Response) => {
    try {
      const { name, image_url, payment_data, minimum_payment_amount, currency } = req.body;
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          name,
          image_url,
          payment_data,
          minimum_payment_amount,
          currency,
        },
      });
      res.status(201).json(paymentMethod);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res.status(409).json({
            message: 'A payment method with this name already exists.',
            error: error.message,
          });
        }
      }
      res.status(500).json({
        message: 'Error creating payment method',
        error: (error as Error).message,
      });
    }
  },
];

export const getPaymentMethods = [ async (_req: Request, res: Response) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany();
    res.status(200).json(paymentMethods);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving payment methods',
      error: (error as Error).message,
    });
  }
}];

export const getPaymentMethodByUid = [async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { uid },
    });
    if (paymentMethod) {
      res.status(200).json(paymentMethod);
    } else {
      res.status(404).json({ message: 'Payment method not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving payment method',
      error: (error as Error).message,
    });
  }
}];

export const updatePaymentMethod = [
  validate(updatePaymentMethodSchema),
  async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      const paymentMethod = await prisma.paymentMethod.update({
        where: { uid },
        data: req.body,
      });
      res.status(200).json(paymentMethod);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return res.status(404).json({ message: 'Payment method not found' });
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({
          message: 'A payment method with this name already exists.',
          error: error.message,
        });
      }
      res.status(500).json({
        message: 'Error updating payment method',
        error: (error as Error).message,
      });
    }
  },
];

export const deletePaymentMethod = [async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    await prisma.paymentMethod.delete({
      where: { uid },
    });
    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    res.status(500).json({
      message: 'Error deleting payment method',
      error: (error as Error).message,
    });
  }
}];
