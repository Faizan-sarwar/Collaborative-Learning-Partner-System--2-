import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify token
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

// 1. Get All Conversations for Current User
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.userId })
      .populate('participants', 'fullName isOnline lastLogin')
      .sort({ lastMessageAt: -1 });

    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.participants.find(p => p._id.toString() !== req.userId);
      return {
        id: conv._id,
        otherUserId: otherUser._id,
        name: otherUser.fullName,
        avatar: null, // Add avatar logic if needed
        lastMessage: conv.lastMessage || 'Start a conversation',
        lastSeen: otherUser.isOnline ? 'Online' : new Date(otherUser.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: conv.unreadCount.get(req.userId) || 0,
        online: otherUser.isOnline
      };
    });

    res.json({ success: true, conversations: formattedConversations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 2. Get Messages for a Conversation
router.get('/messages/:conversationId', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      text: msg.text,
      senderId: msg.sender.toString(),
      isOwn: msg.sender.toString() === req.userId,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    res.json({ success: true, messages: formattedMessages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 3. Send a Message
router.post('/messages', verifyToken, async (req, res) => {
  try {
    const { conversationId, text, targetUserId } = req.body;
    let convId = conversationId;

    // Create conversation if it doesn't exist (First message logic)
    if (!convId && targetUserId) {
      // Check if conversation already exists
      let existingConv = await Conversation.findOne({
        participants: { $all: [req.userId, targetUserId] }
      });

      if (!existingConv) {
        existingConv = await Conversation.create({
          participants: [req.userId, targetUserId],
          lastMessage: text,
          unreadCount: { [targetUserId]: 1 }
        });
      }
      convId = existingConv._id;
    }

    const newMessage = await Message.create({
      conversationId: convId,
      sender: req.userId,
      text
    });

    // Update Conversation (Last Message & Unread Count)
    await Conversation.findByIdAndUpdate(convId, {
      lastMessage: text,
      lastMessageAt: new Date(),
      $inc: { [`unreadCount.${req.body.targetUserId}`]: 1 } // Increment unread for receiver
    });

    res.json({
      success: true,
      message: {
        id: newMessage._id,
        text: newMessage.text,
        senderId: req.userId,
        isOwn: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      conversationId: convId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

export default router;