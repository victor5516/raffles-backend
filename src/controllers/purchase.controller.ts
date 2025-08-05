import { Request, Response } from 'express';
import { Prisma, PurchaseStatus } from '@prisma/client';
import { prisma } from '../prisma/client';
import {
  createPurchaseValidator,
  updatePurchaseValidator,
} from '../middleware/validators/purchase.validator';
import { upload } from '../middleware/upload.middleware';
import fs from 'fs';
const baseUrl = process.env.BASE_URL;
export const createPurchase = [
  upload.single('payment_screenshot_url'),
  createPurchaseValidator,
  async (req: Request, res: Response) => {
    const {
      raffleId,
      paymentMethodId,
      ticket_quantity,
      bank_reference,
      customer: customerData,
    } = req.body;

    if (req.file) {
      req.body.payment_screenshot_url = `${baseUrl}/uploads/${req.file.filename}`;
    }

    try {
      const purchase = await prisma.$transaction(async (tx) => {
        let customer = await tx.customer.findUnique({
          where: { national_id: customerData.national_id },
        });

        if (customer) {
          customer = await tx.customer.update({
            where: { uid: customer.uid },
            data: customerData,
          });
        } else {
          customer = await tx.customer.create({
            data: customerData,
          });
        }

        const newPurchase = await tx.purchase.create({
          data: {
            raffleId,
            paymentMethodId,
            ticket_quantity,
            payment_screenshot_url: req.body.payment_screenshot_url,
            bank_reference,
            customerId: customer.uid,
          },
        });

        return newPurchase;
      });

      res.status(201).json(purchase);
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        message: 'Error creating purchase',
        error: (error as Error).message,
      });
    }
  },
];

export const getPurchases = async (_req: Request, res: Response) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        customer: true,
        raffle: true,
        paymentMethod: true,
      },
    });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving purchases',
      error: (error as Error).message,
    });
  }
};

export const getPurchaseByUid = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const purchase = await prisma.purchase.findUnique({
      where: { uid },
      include: {
        customer: true,
        raffle: true,
        paymentMethod: true,
        tickets: true,
      },
    });
    if (purchase) {
      res.status(200).json(purchase);
    } else {
      res.status(404).json({ message: 'Purchase not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving purchase',
      error: (error as Error).message,
    });
  }
};

export const updatePurchaseStatus = [
  updatePurchaseValidator,
  async (req: Request, res: Response) => {
    const { uid } = req.params;
    const { status } = req.body;

    try {
      const updatedPurchase = await prisma.$transaction(async (tx) => {
        const purchase = await tx.purchase.findUnique({
          where: { uid },
          include: { raffle: true },
        });

        if (!purchase) {
          throw new Error('Purchase not found');
        }

        if (purchase.status === 'verified') {
          throw new Error('Purchase has already been verified.');
        }

        const result = await tx.purchase.update({
          where: { uid },
          data: {
            status,
            verified_at: status === 'verified' ? new Date() : null,
          },
        });

        if (status === 'verified') {
          const { ticket_quantity, raffle } = purchase;
          const soldTickets = await tx.ticket.findMany({
            where: { raffleId: raffle.uid },
            select: { ticket_number: true },
          });
          const soldTicketNumbers = new Set(
            soldTickets.map((t) => t.ticket_number),
          );

          const allPossibleNumbers = Array.from(
            { length: raffle.total_tickets },
            (_, i) => i,
          );
          for (let i = allPossibleNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPossibleNumbers[i], allPossibleNumbers[j]] = [
              allPossibleNumbers[j],
              allPossibleNumbers[i],
            ];
          }

          const assignedNumbers: number[] = [];
          for (const num of allPossibleNumbers) {
            if (assignedNumbers.length >= ticket_quantity) break;
            if (!soldTicketNumbers.has(num)) {
              assignedNumbers.push(num);
            }
          }

          if (assignedNumbers.length < ticket_quantity) {
            throw new Error('Not enough tickets available.');
          }

          await tx.ticket.createMany({
            data: assignedNumbers.map((ticket_number) => ({
              raffleId: raffle.uid,
              purchaseId: purchase.uid,
              ticket_number,
            })),
          });
        }

        return result;
      });

      res.status(200).json(updatedPurchase);
    } catch (error) {
      if ((error as Error).message === 'Purchase not found') {
        return res.status(404).json({ message: 'Purchase not found' });
      }
      if ((error as Error).message.includes('tickets available')) {
        return res.status(409).json({ message: (error as Error).message });
      }
      res.status(500).json({
        message: 'Error updating purchase',
        error: (error as Error).message,
      });
    }
  },
];

export const deletePurchase = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    await prisma.purchase.delete({
      where: { uid },
    });
    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(500).json({
      message: 'Error deleting purchase',
      error: (error as Error).message,
    });
  }
};
