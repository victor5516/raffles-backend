import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import { RaffleStatus } from '@prisma/client';

const raffleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  digits_length: z.number().int().positive(),
  ticket_price: z.number().positive(),
  total_tickets: z.number().int().positive(),
  image_url: z.string().url().optional(),
  deadline: z.string().datetime(),
  status: z.nativeEnum(RaffleStatus).optional(),
});

const updateRaffleSchema = raffleSchema.partial();

export const createRaffle = [
  validate(raffleSchema),
  async (req: Request, res: Response) => {
    try {
      const raffle = await prisma.raffle.create({
        data: req.body,
      });
      res.status(201).json(raffle);
    } catch (error) {
      res.status(500).json({
        message: 'Error creating raffle',
        error: (error as Error).message,
      });
    }
  },
];

export const getRaffles = async (_req: Request, res: Response) => {
  try {
    const raffles = await prisma.raffle.findMany();
    res.status(200).json(raffles);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving raffles',
      error: (error as Error).message,
    });
  }
};

export const getRaffleByUid = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const raffle = await prisma.raffle.findUnique({
      where: { uid },
    });
    if (raffle) {
      res.status(200).json(raffle);
    } else {
      res.status(404).json({ message: 'Raffle not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving raffle',
      error: (error as Error).message,
    });
  }
};

export const updateRaffle = [
  validate(updateRaffleSchema),
  async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      const raffle = await prisma.raffle.update({
        where: { uid },
        data: req.body,
      });
      res.status(200).json(raffle);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return res.status(404).json({ message: 'Raffle not found' });
      }
      res.status(500).json({
        message: 'Error updating raffle',
        error: (error as Error).message,
      });
    }
  },
];

export const deleteRaffle = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    await prisma.raffle.delete({
      where: { uid },
    });
    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Raffle not found' });
    }
    res.status(500).json({
      message: 'Error deleting raffle',
      error: (error as Error).message,
    });
  }
};
