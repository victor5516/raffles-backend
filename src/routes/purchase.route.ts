import { Router } from 'express';
import {
  createPurchase,
  deletePurchase,
  getPurchaseByUid,
  getPurchases,
  updatePurchaseStatus,
} from '../controllers/purchase.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createPurchase);
router.get('/', [verifyToken], getPurchases);
router.get('/:uid', [verifyToken], getPurchaseByUid);
router.patch('/:uid/status', [verifyToken, ...updatePurchaseStatus]);
router.delete('/:uid', [verifyToken], deletePurchase);

export default router;
