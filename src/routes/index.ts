import { Router } from 'express';
import adminRoutes from './admin.route';
import paymentMethodRoutes from './payment_method.route';
import raffleRoutes from './raffle.route';
import purchaseRoutes from './purchase.route';

const router = Router();

router.use('/admins', adminRoutes);
router.use('/payment-methods', paymentMethodRoutes);
router.use('/raffles', raffleRoutes);
router.use('/purchases', purchaseRoutes);

export default router;
