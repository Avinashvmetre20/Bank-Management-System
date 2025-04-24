import express from 'express';
import {
  applyLoan,
  getUserLoans,
  updateLoanStatus,
} from '../controllers/loanController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyLoan);
router.get('/', protect, getUserLoans);
router.put('/status', protect, admin, updateLoanStatus); // Only admin can approve/reject

export default router;
