import express from 'express';
import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getMyTransactions,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { downloadTransactionPDF } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/deposit', protect, depositMoney);
router.post('/withdraw', protect, withdrawMoney);
router.post('/transfer', protect, transferMoney);
router.get('/', protect, getMyTransactions);
router.get('/download/pdf', protect, downloadTransactionPDF);


export default router;
