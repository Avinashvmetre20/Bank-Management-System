import express from 'express';
import {
  requestCard,
  getUserCards,
  updateCardStatus,
} from '../controllers/cardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, requestCard);
router.get('/', protect, getUserCards);
router.put('/status', protect, admin, updateCardStatus); // admin-only

export default router;
