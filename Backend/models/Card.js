import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  cardType: {
    type: String,
    enum: ['debit', 'credit'],
    required: true,
  },
  cardNumber: {
    type: String,
    unique: true,
    required: true,
  },
  expiry: {
    type: String, // MM/YY format
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Card = mongoose.model('Card', cardSchema);
export default Card;
