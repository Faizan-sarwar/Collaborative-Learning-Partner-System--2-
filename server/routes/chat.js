import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

// 🟢 1. Get All Conversations (with Block Status)
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).select('blockedUsers');
    const myBlockedList = currentUser.blockedUsers?.map(id => id.toString()) || [];

    const conversations = await Conversation.find({
      participants: req.userId,
      deletedBy: { $ne: req.userId }
    })
      // ⚡ Exclude massive binary data, but keep the fields needed for avatars!
      .populate({ path: 'participants', select: '-picture.data' })
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.participants.find(p => p._id.toString() !== req.userId);
      if (!otherUser) return null;

      const lastLoginTime = otherUser.lastLogin || Date.now();
      const timeDiffMs = Date.now() - new Date(lastLoginTime).getTime();
      const isActuallyOnline = otherUser.isOnline === true && timeDiffMs <= (15 * 60 * 1000);

      const theirBlockedList = otherUser.blockedUsers?.map(id => id.toString()) || [];
      const didIBlock = myBlockedList.includes(otherUser._id.toString());
      const amIBlocked = theirBlockedList.includes(req.userId);

      const clearTime = conv.clearedAt?.get(req.userId);
      let displayLastMessage = conv.lastMessage?.text || conv.lastMessage || '';

      if (clearTime && conv.lastMessageAt && new Date(clearTime) > new Date(conv.lastMessageAt)) {
        displayLastMessage = '';
      }

      return {
        id: conv._id,
        otherUserId: otherUser._id,
        name: otherUser.fullName,
        // ⚡ FIX: Pass the gamification fields to the frontend!
        gender: otherUser.gender,
        level: otherUser.level,
        settings: otherUser.settings,
        hasPicture: !!otherUser.picture,
        lastMessage: displayLastMessage,
        lastMessageAt: conv.updatedAt,
        online: isActuallyOnline,
        lastSeen: otherUser.lastLogin,
        unread: (conv.unreadCount && conv.unreadCount.get(req.userId)) || 0,
        didIBlock,
        amIBlocked
      };
    }).filter(Boolean);

    res.json({ success: true, conversations: formattedConversations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🟢 2. Get Messages
router.get('/messages/:conversationId', verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const clearTime = conversation.clearedAt?.get(req.userId);
    let query = { conversationId: req.params.conversationId };
    if (clearTime) query.createdAt = { $gt: clearTime };

    const messages = await Message.find(query).sort({ createdAt: 1 });

    // Send raw ISO dates, let frontend format
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      text: msg.text,
      senderId: msg.sender.toString(),
      isOwn: msg.sender.toString() === req.userId,
      isRead: msg.isRead,
      createdAt: msg.createdAt
    }));

    res.json({ success: true, messages: formattedMessages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🟢 3. Send Message (Strict Block Checks)
router.post('/messages', verifyToken, async (req, res) => {
  try {
    const { conversationId, text, targetUserId } = req.body;

    const senderUser = await User.findById(req.userId).select('blockedUsers');
    const targetUser = await User.findById(targetUserId).select('blockedUsers');

    if (senderUser.blockedUsers?.includes(targetUserId)) {
      return res.status(403).json({ success: false, message: 'You must unblock this user to send a message.' });
    }
    if (targetUser && targetUser.blockedUsers?.includes(req.userId)) {
      return res.status(403).json({ success: false, message: 'Message could not be delivered.' });
    }

    let convId = conversationId;
    if (!convId && targetUserId) {
      let existingConv = await Conversation.findOne({ participants: { $all: [req.userId, targetUserId] } });
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
      text,
      isRead: false
    });

    await Conversation.findByIdAndUpdate(convId, {
      lastMessage: text,
      lastMessageAt: new Date(),
      $inc: { [`unreadCount.${targetUserId}`]: 1 },
      $pull: { deletedBy: { $in: [req.userId, targetUserId] } }
    });

    // 🟢 PUSH LIVE MESSAGE & NOTIFICATION
    const io = req.app.get('io');
    const connectedUsers = req.app.get('connectedUsers');
    const targetSocketId = connectedUsers?.get(targetUserId.toString());

    if (io && targetSocketId) {
      // 1. Inject into their active chat window
      io.to(targetSocketId).emit('receiveMessage', {
        conversationId: convId,
        message: { id: newMessage._id, text: newMessage.text, senderId: req.userId, isOwn: false, isRead: false, createdAt: newMessage.createdAt }
      });
      // 2. Ring the notification bell
      io.to(targetSocketId).emit('newNotification', { type: 'message', title: 'New Message', message: text });
    }

    res.json({
      success: true,
      message: {
        id: newMessage._id,
        text: newMessage.text,
        senderId: req.userId,
        isOwn: true,
        isRead: false,
        createdAt: newMessage.createdAt
      },
      conversationId: convId
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// 🟢 4. Mark Read (Updates Actual Messages)
router.put('/conversations/:id/read', verifyToken, async (req, res) => {
  try {
    // 1. Reset Conversation Unread Counter
    await Conversation.findByIdAndUpdate(req.params.id, {
      $set: { [`unreadCount.${req.userId}`]: 0 }
    });

    // 2. Cascade Read Status to Messages
    await Message.updateMany(
      { conversationId: req.params.id, sender: { $ne: req.userId }, isRead: false },
      { $set: { isRead: true, readAt: Date.now() } }
    );

    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
});

// Clear, Delete, and Block routes remain the same...
router.delete('/messages/:conversationId/clear', verifyToken, async (req, res) => {
  try {
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      $set: { [`clearedAt.${req.userId}`]: new Date() },
      $pull: { deletedBy: req.userId }
    });
    res.json({ success: true, message: 'Chat cleared' });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to clear chat' }); }
});

router.delete('/conversations/:id', verifyToken, async (req, res) => {
  try {
    const conv = await Conversation.findByIdAndUpdate(req.params.id, { $addToSet: { deletedBy: req.userId } }, { new: true });
    if (conv && conv.deletedBy && conv.deletedBy.length === 2) {
      await Message.deleteMany({ conversationId: req.params.id });
      await Conversation.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to delete conversation' }); }
});

router.post('/block/:targetUserId', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $addToSet: { blockedUsers: req.params.targetUserId } });
    res.json({ success: true, message: 'User blocked' });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to block user' }); }
});

router.delete('/message/:messageId', verifyToken, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to delete message' }); }
});
// 🟢 6. Block User
router.post('/block/:targetUserId', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $addToSet: { blockedUsers: req.params.targetUserId } });
    res.json({ success: true, message: 'User blocked' });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to block user' }); }
});

// 🟢 6b. Unblock User (ADD THIS)
router.post('/unblock/:targetUserId', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $pull: { blockedUsers: req.params.targetUserId } });
    res.json({ success: true, message: 'User unblocked' });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to unblock user' }); }
});
export default router;