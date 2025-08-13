import { Router } from 'express';
import adminRoutes from './admin.route';
import paymentMethodRoutes from './payment_method.route';
import raffleRoutes from './raffle.route';
import purchaseRoutes from './purchase.route';
import ticketRoutes from './ticket.route';

const router = Router();

router.use('/admins', adminRoutes);
router.use('/payment-methods', paymentMethodRoutes);
router.use('/raffles', raffleRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/tickets', ticketRoutes);

export default router;
