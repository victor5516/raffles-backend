import { Router } from 'express';
import adminRoutes from './admin.route';
import paymentMethodRoutes from './payment_method.route';
import raffleRoutes from './raffle.route';

const router = Router();

router.use('/admins', adminRoutes);
router.use('/payment-methods', paymentMethodRoutes);
router.use('/raffles', raffleRoutes);

export default router;
