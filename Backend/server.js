import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
app.use(express.static('public'));
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Bank Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
