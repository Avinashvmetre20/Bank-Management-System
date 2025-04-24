import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Middleware for admin-only routes
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {  // Check role instead of isAdmin
    next();
  } else {
    res.status(403).json({ message: 'Admin access denied' });
  }
};
