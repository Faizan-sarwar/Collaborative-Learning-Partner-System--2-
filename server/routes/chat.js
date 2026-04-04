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

// 1. Get All Conversations for Current User (Hides deleted ones)
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId,
      deletedBy: { $ne: req.userId } // Don't fetch if this user deleted it
    })
      .populate('participants', 'fullName picture isOnline lastSeen')
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.participants.find(p => p._id.toString() !== req.userId);
      if (!otherUser) return null;

      return {
        id: conv._id,
        otherUserId: otherUser._id,
        name: otherUser.fullName,
        avatar: (otherUser.picture && otherUser.picture.data)
          ? `http://localhost:5000/api/auth/student/${otherUser._id}/picture`
          : null,
        lastMessage: conv.lastMessage?.text || conv.lastMessage || 'Start a conversation',
        online: otherUser.isOnline,
        lastSeen: otherUser.isOnline
          ? 'Online'
          : otherUser.lastSeen
            ? new Date(otherUser.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Offline',
        unread: (conv.unreadCount && conv.unreadCount.get(req.userId)) || 0,
      };
    }).filter(Boolean);

    res.json({ success: true, conversations: formattedConversations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 2. Get Messages for a Conversation (Hides cleared messages)
router.get('/messages/:conversationId', verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const clearTime = conversation.clearedAt?.get(req.userId);
    let query = { conversationId: req.params.conversationId };

    // Only fetch messages sent AFTER the user cleared the chat
    if (clearTime) {
      query.createdAt = { $gt: clearTime };
    }

    const messages = await Message.find(query).sort({ createdAt: 1 });

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

    // Check if target user has blocked the sender
    const targetUser = await User.findById(targetUserId);
    if (targetUser && targetUser.blockedUsers && targetUser.blockedUsers.includes(req.userId)) {
      return res.status(403).json({ success: false, message: 'You have been blocked by this user and cannot send messages.' });
    }

    let convId = conversationId;

    if (!convId && targetUserId) {
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

    // Update Conversation and pull from deletedBy so it reappears if previously deleted
    await Conversation.findByIdAndUpdate(convId, {
      lastMessage: text,
      lastMessageAt: new Date(),
      $inc: { [`unreadCount.${targetUserId}`]: 1 },
      $pull: { deletedBy: { $in: [req.userId, targetUserId] } }
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

// 4. Clear Chat (Soft Delete - keeps it in sidebar but empties messages)
router.delete('/messages/:conversationId/clear', verifyToken, async (req, res) => {
  try {
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      $set: { [`clearedAt.${req.userId}`]: new Date() },
      $pull: { deletedBy: req.userId }
    });
    res.json({ success: true, message: 'Chat cleared for you' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear chat' });
  }
});

// 5. Delete Chat (Hide from sidebar entirely)
router.delete('/conversations/:id', verifyToken, async (req, res) => {
  try {
    const conv = await Conversation.findByIdAndUpdate(req.params.id, {
      $addToSet: { deletedBy: req.userId }
    }, { new: true });

    // Physically wipe if BOTH users deleted it
    if (conv && conv.deletedBy && conv.deletedBy.length === 2) {
      await Message.deleteMany({ conversationId: req.params.id });
      await Conversation.findByIdAndDelete(req.params.id);
    }

    res.json({ success: true, message: 'Conversation deleted for you' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete conversation' });
  }
});

// 6. Block User Route
router.post('/block/:targetUserId', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { blockedUsers: req.params.targetUserId }
    });
    res.json({ success: true, message: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to block user' });
  }
});

// 7. Delete Single Message
router.delete('/message/:messageId', verifyToken, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

export default router;