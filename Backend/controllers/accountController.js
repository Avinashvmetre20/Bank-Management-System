import Account from '../models/Account.js';

// Generate a random account number
const generateAccountNumber = () => {
  return 'AC' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// @desc Create new bank account
export const createAccount = async (req, res) => {
  const { accountType } = req.body;

  const existing = await Account.findOne({ user: req.user._id, accountType });
  if (existing) return res.status(400).json({ message: 'Account type already exists for user' });

  const account = await Account.create({
    user: req.user._id,
    accountNumber: generateAccountNumber(),
    accountType,
    balance: 0,
  });

  res.status(201).json(account);
};

// @desc Get all user accounts
export const getMyAccounts = async (req, res) => {
  const accounts = await Account.find({ user: req.user._id });
  res.json(accounts);
};

// @desc Get single account by ID
export const getAccountById = async (req, res) => {
  const account = await Account.findById(req.params.id);

  if (!account) return res.status(404).json({ message: 'Account not found' });
  if (account.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized access' });

  res.json(account);
};
