import { Router } from 'express';
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethodByUid,
  getPaymentMethods,
  getCurrencyValues,
  updatePaymentMethod,
} from '../controllers/payment_method.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', [verifyToken, ...createPaymentMethod]);
router.get('/', getPaymentMethods);
router.get('/currency', getCurrencyValues);
router.get('/:uid', [verifyToken, ...getPaymentMethodByUid]);
router.put('/:uid', [verifyToken, ...updatePaymentMethod]);
router.delete('/:uid', [verifyToken, ...deletePaymentMethod]);

export default router;