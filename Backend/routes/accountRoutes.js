import express from 'express';
import {
  createAccount,
  getMyAccounts,
  getAccountById,
} from '../controllers/accountController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAccount);
router.get('/', protect, getMyAccounts);
router.get('/:id', protect, getAccountById);

export default router;
