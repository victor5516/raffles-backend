import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import {
  createPaymentMethodValidator,
  updatePaymentMethodValidator,
} from '../middleware/validators/payment_method.validator';
import { upload } from '../middleware/upload.middleware';
import fs from 'fs';
import { getBaseUrl } from '../utils/helpers';
export const createPaymentMethod = [
  upload.single('image'),
  createPaymentMethodValidator,
  async (req: Request, res: Response) => {
    try {
      const { name, payment_data, minimum_payment_amount, currency } = req.body;
      if (req.file) {
        const baseUrl = getBaseUrl(req);
        req.body.image_url = `${baseUrl}/uploads/${req.file.filename}`;
      }
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          name,
          image_url: req.body.image_url,
          payment_data: payment_data ? JSON.parse(payment_data) : {},
          minimum_payment_amount,
          currency,
        },
      });
      res.status(201).json(paymentMethod);
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
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
// get all currency values
export const getCurrencyValues = [async (_req: Request, res: Response) => {
  try {
    const currencyValues = await prisma.currency.findMany();
    res.status(200).json(currencyValues);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving currency values',
      error: (error as Error).message,
    });
  }
}];

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
  upload.single('image'),
  updatePaymentMethodValidator,
  async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      const { name, payment_data, minimum_payment_amount, currency } = req.body;

      const updateData: any = {
        name,
        payment_data,
        minimum_payment_amount,
        currency,
      };

      if (req.file) {
        const baseUrl = getBaseUrl(req);
        updateData.image_url = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const paymentMethod = await prisma.paymentMethod.update({
        where: { uid },
        data: updateData,
      });
      res.status(200).json(paymentMethod);
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
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
