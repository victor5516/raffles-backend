import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const searchTicketsByNationalId = async (req: Request, res: Response) => {
  try {
    const { national_id, raffle_uid } = req.query as {
      national_id?: string;
      raffle_uid?: string
    };

    // Validar que se proporcionen ambos parámetros
    if (!national_id || !raffle_uid) {
      return res.status(400).json({
        message: 'Se requieren los parámetros national_id y raffle_uid'
      });
    }

    // Buscar tickets que pertenezcan al cliente con esa cédula en esa rifa específica
    const tickets = await prisma.ticket.findMany({
      where: {
        raffleId: raffle_uid,
        purchase: {
          customer: {
            national_id: national_id
          }
        }
      },
      include: {
        purchase: {
          include: {
            customer: {
              select: {
                full_name: true,
                national_id: true
              }
            }
          }
        }
      },
      orderBy: {
        ticket_number: 'asc'
      }
    });

    // Transformar los datos para el frontend
    const formattedTickets = tickets.map(ticket => ({
      id: ticket.uid,
      ticket_number: ticket.ticket_number.toString(),
      customer_name: ticket.purchase?.customer.full_name || 'N/A',
      customer_national_id: ticket.purchase?.customer.national_id || 'N/A',
      purchase_date: ticket.assigned_at.toISOString(),
      status: ticket.purchase?.status || 'active'
    }));

    res.status(200).json(formattedTickets);
  } catch (error) {
    console.error('Error searching tickets:', error);
    res.status(500).json({
      message: 'Error al buscar tickets',
      error: (error as Error).message
    });
  }
};
