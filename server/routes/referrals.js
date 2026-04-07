import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Referral from '../models/Referral.js';

const router = express.Router();

// Setup Nodemailer (Reusing your auth.js logic)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id;
    next();
  } catch (err) { res.status(401).json({ message: 'Invalid Token' }); }
};

// 1. GET MY REFERRALS (For the Frontend Table)
router.get('/my-referrals', verifyToken, async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.userId }).sort({ createdAt: -1 });
    // Fetch actual names for joined users
    const enrichedReferrals = await Promise.all(referrals.map(async (ref) => {
      let name = ref.email.split('@')[0];
      if (ref.status === 'joined') {
        const joinedUser = await User.findOne({ email: ref.email });
        if (joinedUser) name = joinedUser.fullName;
      }
      return { ...ref.toObject(), name };
    }));
    res.json({ success: true, referrals: enrichedReferrals });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// 2. SEND INVITE EMAIL
router.post('/invite', verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findById(req.userId);

    // Check if user is trying to invite an existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists on Collaborative Learning Partner System!' });

    // Check if already invited
    const existingInvite = await Referral.findOne({ referrer: req.userId, email: email.toLowerCase() });
    if (existingInvite) return res.status(400).json({ success: false, message: 'You already invited this email.' });

    // Create pending referral in DB
    await Referral.create({ referrer: req.userId, email: email.toLowerCase(), status: 'pending' });

    // Send the Email
    const referralLink = `http://localhost:5173/signup?ref=${user.referralCode}`; // Adjust port to your frontend port
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${user.fullName} invited you to join Collaborative Learning Partner System!`,
      text: `Hi!\n\n${user.fullName} thinks you'd love Collaborative Learning Partner System. Join using this link to get started: \n\n${referralLink}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Invite sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send invite' });
  }
});

export default router;