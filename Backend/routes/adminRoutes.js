import express from 'express';
import { getDashboardStats, approveCard, approveLoan } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Dashboard Route
router.get('/dashboard', protect, admin, getDashboardStats);

// Approve Card Route
router.put('/approve/card/:cardId', protect, admin, approveCard);

// Approve Loan Route
router.put('/approve/loan/:loanId', protect, admin, approveLoan);

export default router;
