import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import {
  createRaffleValidator,
  updateRaffleValidator,
} from '../middleware/validators/raffle.validator';
import fs from 'fs';
import { upload } from '../middleware/upload.middleware';
const baseUrl = process.env.BASE_URL;

export const createRaffle = [
  upload.single('image'),
  createRaffleValidator,
  async (req: Request, res: Response) => {
    try {
      const { ...raffleData } = req.body;

      if (req.file) {
        raffleData.image_url = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const raffle = await prisma.raffle.create({
        data: {
          ...raffleData,
          deadline: new Date(raffleData.deadline),
          digits_length: parseInt(raffleData.digits_length, 10),
          ticket_price: parseFloat(raffleData.ticket_price),
          total_tickets: parseInt(raffleData.total_tickets, 10),
        },
      });
      res.status(201).json(raffle);
    } catch (error) {
      //delete files if error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        message: 'Error creating raffle',
        error: (error as Error).message,
      });
    }
  },
];

export const getRaffles = async (_req: Request, res: Response) => {
  try {
    // calculate total tickets sold
    const raffles = await prisma.raffle.findMany({
      include: {
        _count: {
          select: {
            tickets: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.status(200).json(raffles.map((raffle) => ({
      ...raffle,
      tickets_sold: raffle._count.tickets,
    })));
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
  upload.single('image'),
  updateRaffleValidator,
  async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      const { ...raffleData } = req.body;
      if (req.file) {
        raffleData.image_url = `${baseUrl}/uploads/${req.file.filename}`;
      }
      const raffle = await prisma.raffle.update({
        where: { uid },
        data: {
          ...raffleData,
          deadline: new Date(raffleData.deadline),
          digits_length: parseInt(raffleData.digits_length, 10),
          ticket_price: parseFloat(raffleData.ticket_price),
          total_tickets: parseInt(raffleData.total_tickets, 10),
        },
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
