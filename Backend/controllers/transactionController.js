import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { generateTransactionPDF } from '../utils/pdfGenerator.js';  // Import the function
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// @desc Deposit Money
export const depositMoney = async (req, res) => {
  const { accountId, amount } = req.body;

  const account = await Account.findById(accountId);
  if (!account) return res.status(404).json({ message: 'Account not found' });

  if (account.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized access' });

  account.balance += amount;
  await account.save();

  const txn = await Transaction.create({
    toAccount: account._id,
    amount,
    type: 'deposit',
    description: `Deposit of ₹${amount}`,
  });

  res.status(201).json(txn);
};

// @desc Withdraw Money
export const withdrawMoney = async (req, res) => {
  const { accountId, amount } = req.body;

  const account = await Account.findById(accountId);
  if (!account) return res.status(404).json({ message: 'Account not found' });

  if (account.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized access' });

  if (account.balance < amount)
    return res.status(400).json({ message: 'Insufficient balance' });

  account.balance -= amount;
  await account.save();

  const txn = await Transaction.create({
    fromAccount: account._id,
    amount,
    type: 'withdraw',
    description: `Withdrawal of ₹${amount}`,
  });

  res.status(201).json(txn);
};

// @desc Transfer Money
export const transferMoney = async (req, res) => {
  const { fromId, toId, amount } = req.body;

  const from = await Account.findById(fromId);
  const to = await Account.findById(toId);

  if (!from || !to) return res.status(404).json({ message: 'One or both accounts not found' });

  if (from.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized access' });

  if (from.balance < amount)
    return res.status(400).json({ message: 'Insufficient balance' });

  from.balance -= amount;
  to.balance += amount;
  await from.save();
  await to.save();

  const txn = await Transaction.create({
    fromAccount: from._id,
    toAccount: to._id,
    amount,
    type: 'transfer',
    description: `Transfer of ₹${amount} from ${from.accountNumber} to ${to.accountNumber}`,
  });

  res.status(201).json(txn);
};

// @desc Get Transaction History (User)
export const getMyTransactions = async (req, res) => {
  const userAccounts = await Account.find({ user: req.user._id });
  const accountIds = userAccounts.map(acc => acc._id);

  const transactions = await Transaction.find({
    $or: [
      { fromAccount: { $in: accountIds } },
      { toAccount: { $in: accountIds } }
    ]
  }).sort({ createdAt: -1 });

  res.json(transactions);
};

// The generateTransactionPDF function should be in a separate file (utils/pdfGenerator.js)
import { dirname } from 'path';

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const downloadTransactionPDF = async (req, res) => {
  try {
    // Ensure that the reports directory exists
    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const userAccounts = await Account.find({ user: req.user._id });
    const accountIds = userAccounts.map(acc => acc._id);

    // Fetch transactions
    const transactions = await Transaction.find({
      $or: [{ fromAccount: { $in: accountIds } }, { toAccount: { $in: accountIds } }]
    }).sort({ createdAt: -1 });

    if (!transactions.length) {
      console.log('No transactions found for this user.');
      return res.status(404).json({ message: 'No transactions found.' });
    }

    // Create the file path dynamically in the reports folder
    const filePath = path.join(reportsDir, `report_${req.user._id}.pdf`);

    // Generate the PDF and save it
    await generateTransactionPDF(transactions, filePath);

    // Send the file as a download
    res.download(filePath, 'Transaction_Report.pdf', (err) => {
      if (err) {
        console.error('Error while sending the file for download:', err);
        res.status(500).json({ message: 'Error sending the PDF for download' });
      }
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ message: 'Error generating the transaction PDF', error: err.message });
  }
};

  
