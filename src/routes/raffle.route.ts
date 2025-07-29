import { Router } from 'express';
import {
  createRaffle,
  deleteRaffle,
  getRaffleByUid,
  getRaffles,
  updateRaffle,
} from '../controllers/raffle.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/', [verifyToken, ...createRaffle]);
router.get('/', getRaffles);
router.get('/:uid', getRaffleByUid);
router.put('/:uid', [verifyToken], updateRaffle);
router.delete('/:uid', [verifyToken], deleteRaffle);

export default router;
