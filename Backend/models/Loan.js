import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  termMonths: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    default: 10, // Default interest rate 10%
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  monthlyEMI: {
    type: Number,
  },
}, {
  timestamps: true,
});

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;
