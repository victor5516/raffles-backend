import { Router } from 'express';
import { searchTicketsByNationalId } from '../controllers/ticket.controller';

const router = Router();

// GET /api/v1/tickets/search?national_id=12345678&raffle_uid=abc123
router.get('/search', searchTicketsByNationalId);

export default router;
