import express from 'express';
import Notification from '../models/Notifications.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

// Get Notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .populate('sender', 'fullName picture') // Populate sender info for avatars
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Mark as Read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { unread: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Mark All as Read
router.put('/read-all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.userId, unread: true }, { unread: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;