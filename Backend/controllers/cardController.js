import Card from '../models/Card.js';
import Account from '../models/Account.js';

// Generate random card number
const generateCardNumber = () => {
  return '4' + Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
};

// Generate expiry in MM/YY format
const generateExpiry = () => {
  const now = new Date();
  const expiryYear = now.getFullYear() + 5;
  const expiryMonth = ('0' + (now.getMonth() + 1)).slice(-2);
  return `${expiryMonth}/${expiryYear.toString().slice(-2)}`;
};

// @desc Request new card
export const requestCard = async (req, res) => {
  const { accountId, cardType } = req.body;

  const account = await Account.findById(accountId);
  if (!account || account.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized or invalid account' });
  }

  const card = await Card.create({
    user: req.user._id,
    account: account._id,
    cardType,
    cardNumber: generateCardNumber(),
    expiry: generateExpiry(),
  });

  res.status(201).json(card);
};

// @desc Get all cards for user
export const getUserCards = async (req, res) => {
  const cards = await Card.find({ user: req.user._id }).populate('account');
  res.json(cards);
};

// @desc Admin approve/reject card
export const updateCardStatus = async (req, res) => {
  const { cardId, status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const card = await Card.findById(cardId);
  if (!card) return res.status(404).json({ message: 'Card not found' });

  card.status = status;
  await card.save();

  res.json(card);
};
