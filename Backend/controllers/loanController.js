import Loan from '../models/Loan.js';

// Calculate EMI using standard formula
const calculateEMI = (amount, months, rate) => {
  const r = rate / (12 * 100); // monthly interest
  return Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
};

// @desc Apply for a loan
export const applyLoan = async (req, res) => {
  const { amount, termMonths } = req.body;

  if (amount <= 0 || termMonths <= 0) {
    return res.status(400).json({ message: 'Invalid loan details' });
  }

  const interestRate = 10;
  const emi = calculateEMI(amount, termMonths, interestRate);

  const loan = await Loan.create({
    user: req.user._id,
    amount,
    termMonths,
    interestRate,
    monthlyEMI: emi,
  });

  res.status(201).json(loan);
};

// @desc Get user's loans
export const getUserLoans = async (req, res) => {
  const loans = await Loan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(loans);
};

// @desc Admin: approve/reject loan
export const updateLoanStatus = async (req, res) => {
  const { loanId, status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const loan = await Loan.findById(loanId);
  if (!loan) return res.status(404).json({ message: 'Loan not found' });

  loan.status = status;
  await loan.save();

  res.json(loan);
};
