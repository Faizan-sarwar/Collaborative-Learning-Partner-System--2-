import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware
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

// 1. COMPLETE QUIZ (+50-100 XP)
router.post('/complete-quiz', verifyToken, async (req, res) => {
  try {
    const { score } = req.body; // Score out of 100
    const user = await User.findById(req.userId);
    
    // Logic: Base 50 XP, plus up to 50 more based on score
    // Score 100% = 100 XP, Score 0% = 50 XP
    const xpAwarded = Math.floor(50 + (score / 100 * 50));
    
    const result = await user.awardXP(xpAwarded);
    res.json({ success: true, message: `Quiz Complete! +${xpAwarded} XP`, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating XP' });
  }
});

// 2. JOIN STUDY ROOM (+20 XP)
router.post('/join-room', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const result = await user.awardXP(20);
    res.json({ success: true, message: 'Joined Room! +20 XP', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating XP' });
  }
});

// 3. COMPLETE STUDY SESSION (+30 XP)
router.post('/complete-session', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    // You might want to update studyHours here too
    user.studyHours = (user.studyHours || 0) + (req.body.hours || 1); 
    const result = await user.awardXP(30);
    res.json({ success: true, message: 'Session Complete! +30 XP', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating XP' });
  }
});

// 4. REFER A FRIEND (+100 XP)
router.post('/refer-friend', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    // In a real app, validate the referral code here
    const result = await user.awardXP(100);
    res.json({ success: true, message: 'Referral Successful! +100 XP', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating XP' });
  }
});

// 5. PEER HELP / ANSWER QUESTION (+25 XP)
router.post('/peer-help', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const result = await user.awardXP(25);
    res.json({ success: true, message: 'Thanks for helping! +25 XP', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating XP' });
  }
});

export default router;