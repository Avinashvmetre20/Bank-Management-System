import User from '../models/User.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import Loan from '../models/Loan.js';
import Card from '../models/Card.js';

// @desc Admin dashboard summary
export const getDashboardStats = async (req, res) => {
  const users = await User.countDocuments();
  const accounts = await Account.countDocuments();
  const loans = await Loan.countDocuments();
  const cards = await Card.countDocuments();
  const totalBalance = await Account.aggregate([
    { $group: { _id: null, total: { $sum: '$balance' } } }
  ]);
  const totalDeposits = await Transaction.aggregate([
    { $match: { type: 'deposit' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.json({
    totalUsers: users,
    totalAccounts: accounts,
    totalLoans: loans,
    totalCards: cards,
    bankBalance: totalBalance[0]?.total || 0,
    totalDeposits: totalDeposits[0]?.total || 0,
  });
};


// @desc Approve Card
export const approveCard = async (req, res) => {
  const cardId = req.params.cardId;
  const card = await Card.findById(cardId);

  if (!card) {
    return res.status(404).json({ message: 'Card not found' });
  }

  card.status = 'approved';  // Assuming card has a 'status' field
  await card.save();

  res.json({ message: 'Card approved successfully', card });
};

// @desc Approve Loan
export const approveLoan = async (req, res) => {
  const loanId = req.params.loanId;
  const loan = await Loan.findById(loanId);

  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  loan.status = 'approved';  // Assuming loan has a 'status' field
  await loan.save();

  res.json({ message: 'Loan approved successfully', loan });
};