import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// ────────────────────────────────────────────────────────────────────────────
//  CONSTANTS
// ────────────────────────────────────────────────────────────────────────────
const EDIT_UNSEND_WINDOW_MS = 15 * 60 * 1000; // 15 minutes (Instagram-style)
const MAX_TEXT_LENGTH = 4000;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ALLOWED_MIME = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'],
  audio: ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/aac'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/zip']
};

const detectFileType = (mime) => {
  if (!mime) return null;
  //  STRIP codec parameters — Firefox sends "audio/ogg;codecs=opus",
  // Safari sometimes sends "audio/mp4;codecs=mp4a.40.2", etc.
  // Also normalize case (some Android browsers send "image/JPEG").
  const normalized = mime.split(';')[0].trim().toLowerCase();
  for (const [type, list] of Object.entries(ALLOWED_MIME)) {
    if (list.includes(normalized)) return type;
  }
  //  LAST RESORT: prefix-based fallback so unknown mobile codecs still work.
  // If it's clearly an audio/image/video by MIME prefix, accept it.
  if (normalized.startsWith('image/')) return 'image';
  if (normalized.startsWith('audio/')) return 'audio';
  if (normalized.startsWith('video/')) return 'video';
  return null;
};

// ────────────────────────────────────────────────────────────────────────────
//  MULTER (DISK STORAGE) — uploads under /uploads/chat
// ────────────────────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'chat');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname || '').toLowerCase().slice(0, 8);
    const random = crypto.randomBytes(12).toString('hex');
    cb(null, `${Date.now()}-${random}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (detectFileType(file.mimetype)) return cb(null, true);
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
  }
});

//  MULTER WRAPPER — converts multer errors (file too large, bad MIME) into
// proper 400 responses instead of letting them fall through to a 500.
// Without this, the frontend just sees "Server error" and the user can't
// tell whether their voice note was rejected or the server crashed.
const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('[chat] ❌ Upload rejected:', err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, message: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.` });
      }
      return res.status(400).json({ success: false, message: err.message || 'File upload failed' });
    }
    next();
  });
};

// Serve uploaded files statically — register this in main.js too if not already:
//   app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// ────────────────────────────────────────────────────────────────────────────
//  AUTH MIDDLEWARE
// ────────────────────────────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid Token' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ────────────────────────────────────────────────────────────────────────────

// Push a Socket.io event to a target user if connected. Returns true if delivered.
const emitToUser = (req, userId, event, payload) => {
  if (!userId) return false;
  const io = req.app.get('io');
  const connectedUsers = req.app.get('connectedUsers');
  const targetSocketId = connectedUsers?.get(userId.toString());
  if (io && targetSocketId) {
    io.to(targetSocketId).emit(event, payload);
    return true;
  }
  return false;
};

// Emit to BOTH participants (sender + recipient) — used when sender has multiple tabs
const emitToBoth = (req, userIds, event, payload) => {
  const io = req.app.get('io');
  const connectedUsers = req.app.get('connectedUsers');
  if (!io || !connectedUsers) return;
  for (const uid of userIds) {
    if (!uid) continue;
    const sid = connectedUsers.get(uid.toString());
    if (sid) io.to(sid).emit(event, payload);
  }
};

// Strict 15-minute window check
const isWithinEditWindow = (createdAt) => {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (isNaN(created)) return false;
  return (Date.now() - created) <= EDIT_UNSEND_WINDOW_MS;
};

// Serialize a Mongoose Message → wire format the frontend understands
const serializeMessage = async (msg, currentUserId, opts = {}) => {
  if (!msg) return null;
  const senderIdStr = msg.sender?.toString?.() || String(msg.sender);
  const isOwn = senderIdStr === currentUserId?.toString();

  const wasDeletedForMe = (msg.deletedFor || []).some(id => id.toString() === currentUserId?.toString());
  if (wasDeletedForMe) return null; // hidden from this user entirely

  let replyToPayload = null;
  if (msg.replyTo) {
    // replyTo may already be populated or be a raw ObjectId
    let replyDoc = msg.replyTo;
    if (replyDoc && !replyDoc._id) {
      replyDoc = await Message.findById(msg.replyTo).select('text sender fileType deletedForEveryone').lean();
    }
    if (replyDoc) {
      replyToPayload = {
        id: replyDoc._id?.toString(),
        text: replyDoc.deletedForEveryone ? '' : (replyDoc.text || ''),
        senderId: replyDoc.sender?.toString?.() || String(replyDoc.sender),
        fileType: replyDoc.fileType || null,
        deletedForEveryone: !!replyDoc.deletedForEveryone
      };
    }
  }

  return {
    id: msg._id.toString(),
    conversationId: msg.conversationId?.toString?.(),
    senderId: senderIdStr,
    isOwn,
    text: msg.deletedForEveryone ? '' : (msg.text || ''),
    isRead: !!msg.isRead,
    readAt: msg.readAt || null,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    isEdited: !!msg.isEdited,
    deletedForEveryone: !!msg.deletedForEveryone,
    replyTo: replyToPayload,
    fileUrl: msg.deletedForEveryone ? null : (msg.fileUrl || null),
    fileType: msg.deletedForEveryone ? null : (msg.fileType || null),
    fileSize: msg.fileSize || null,
    fileName: msg.deletedForEveryone ? null : (msg.fileName || null),
    // Convenience flag the client can use to show/hide edit/unsend buttons
    canEditUnsend: isOwn && !msg.deletedForEveryone && isWithinEditWindow(msg.createdAt),
    ...opts
  };
};

// Build last-message preview text for the conversation list
const lastMessagePreview = (msg) => {
  if (!msg) return '';
  if (msg.deletedForEveryone) return 'Message unsent';
  if (msg.fileType === 'image') return '📷 Photo';
  if (msg.fileType === 'audio') return '🎤 Voice note';
  if (msg.fileType === 'video') return '🎬 Video';
  if (msg.fileType === 'document') return '📎 ' + (msg.fileName || 'File');
  return msg.text || '';
};

// ────────────────────────────────────────────────────────────────────────────
//  1. GET ALL CONVERSATIONS (with Block Status + gamification fields)
// ────────────────────────────────────────────────────────────────────────────
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).select('blockedUsers');
    const myBlockedList = currentUser?.blockedUsers?.map(id => id.toString()) || [];

    const conversations = await Conversation.find({
      participants: req.userId,
      deletedBy: { $ne: req.userId }
    })
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
    console.error('[chat] /conversations error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  2. GET MESSAGES (with replyTo populated)
// ────────────────────────────────────────────────────────────────────────────
router.get('/messages/:conversationId', verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

    // Authorization: must be a participant
    const isParticipant = conversation.participants.some(p => p.toString() === req.userId);
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Forbidden' });

    const clearTime = conversation.clearedAt?.get(req.userId);
    const query = { conversationId: req.params.conversationId };
    if (clearTime) query.createdAt = { $gt: clearTime };

    const messages = await Message.find(query)
      .populate({ path: 'replyTo', select: 'text sender fileType deletedForEveryone' })
      .sort({ createdAt: 1 });

    const formattedMessages = (
      await Promise.all(messages.map(msg => serializeMessage(msg, req.userId)))
    ).filter(Boolean);

    res.json({ success: true, messages: formattedMessages });
  } catch (err) {
    console.error('[chat] /messages GET error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  3. SEND MESSAGE — accepts JSON OR multipart/form-data (image/voice)
//      The same endpoint handles text-only, text+media, and reply.
// ────────────────────────────────────────────────────────────────────────────
router.post('/messages', verifyToken, handleUpload, async (req, res) => {
  try {
    // Pull fields whether they come from JSON or FormData
    const conversationId = req.body.conversationId || null;
    const targetUserId = req.body.targetUserId;
    const text = (req.body.text || '').toString();
    const replyTo = req.body.replyTo || null;
    const clientTempId = req.body.clientTempId || null;

    //  DIAGNOSTIC LOG — shows in your server terminal so you can debug
    // media uploads. Remove these console.log lines once everything is stable.
    if (req.file) {
      console.log('[chat] 📎 Incoming file:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        savedTo: req.file.path,
        detectedType: detectFileType(req.file.mimetype)
      });
    } else {
      console.log('[chat] 💬 Incoming text:', { from: req.userId, len: text.length, conversationId, targetUserId });
    }

    // ─── Validation ───────────────────────────────────────────────────────
    if (text && text.length > MAX_TEXT_LENGTH) {
      if (req.file) fs.unlink(req.file.path, () => { });
      return res.status(400).json({ success: false, message: `Text exceeds ${MAX_TEXT_LENGTH} characters.` });
    }
    if (!text.trim() && !req.file) {
      return res.status(400).json({ success: false, message: 'Message must contain text or a file.' });
    }
    if (!targetUserId && !conversationId) {
      return res.status(400).json({ success: false, message: 'Recipient required.' });
    }
    if (replyTo && !mongoose.Types.ObjectId.isValid(replyTo)) {
      if (req.file) fs.unlink(req.file.path, () => { });
      return res.status(400).json({ success: false, message: 'Invalid reply reference.' });
    }

    // ─── Block checks (strict, two-way) ───────────────────────────────────
    const senderUser = await User.findById(req.userId).select('blockedUsers');
    let resolvedTargetId = targetUserId;

    // If conversationId only, derive the other participant
    if (!resolvedTargetId && conversationId) {
      const conv = await Conversation.findById(conversationId).select('participants');
      if (!conv) {
        if (req.file) fs.unlink(req.file.path, () => { });
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      const other = conv.participants.find(p => p.toString() !== req.userId);
      resolvedTargetId = other ? other.toString() : null;
    }

    const targetUser = resolvedTargetId ? await User.findById(resolvedTargetId).select('blockedUsers') : null;

    if (senderUser?.blockedUsers?.some(id => id.toString() === resolvedTargetId)) {
      if (req.file) fs.unlink(req.file.path, () => { });
      return res.status(403).json({ success: false, message: 'You must unblock this user to send a message.' });
    }
    if (targetUser?.blockedUsers?.some(id => id.toString() === req.userId)) {
      if (req.file) fs.unlink(req.file.path, () => { });
      return res.status(403).json({ success: false, message: 'Message could not be delivered.' });
    }

    // ─── Validate replyTo belongs to same conversation ────────────────────
    let replyDoc = null;
    if (replyTo) {
      replyDoc = await Message.findById(replyTo).select('conversationId text sender fileType deletedForEveryone');
      if (!replyDoc) {
        if (req.file) fs.unlink(req.file.path, () => { });
        return res.status(404).json({ success: false, message: 'Replied message not found' });
      }
    }

    // ─── Find or create conversation ──────────────────────────────────────
    let convId = conversationId;
    if (!convId && resolvedTargetId) {
      let existingConv = await Conversation.findOne({
        participants: { $all: [req.userId, resolvedTargetId] }
      });
      if (!existingConv) {
        existingConv = await Conversation.create({
          participants: [req.userId, resolvedTargetId],
          lastMessage: text || '',
          unreadCount: { [resolvedTargetId]: 1 }
        });
      }
      convId = existingConv._id;
    }

    // Confirm replyTo is from this conversation (security: no cross-conv quoting)
    if (replyDoc && replyDoc.conversationId.toString() !== convId.toString()) {
      if (req.file) fs.unlink(req.file.path, () => { });
      return res.status(400).json({ success: false, message: 'Cannot reply across conversations.' });
    }

    // ─── Build message payload ────────────────────────────────────────────
    const messagePayload = {
      conversationId: convId,
      sender: req.userId,
      text: text || '',
      isRead: false,
      replyTo: replyDoc ? replyDoc._id : null
    };

    if (req.file) {
      const fileType = detectFileType(req.file.mimetype);
      // Public URL — assumes app.use('/uploads', express.static(...)) is registered in main.js
      const publicUrl = `/uploads/chat/${path.basename(req.file.path)}`;
      messagePayload.fileUrl = publicUrl;
      messagePayload.fileType = fileType;
      messagePayload.fileSize = req.file.size;
      messagePayload.fileName = req.file.originalname || path.basename(req.file.path);
    }

    const newMessage = await Message.create(messagePayload);
    if (replyDoc) await newMessage.populate({ path: 'replyTo', select: 'text sender fileType deletedForEveryone' });

    // ─── Update conversation metadata ─────────────────────────────────────
    const previewText = lastMessagePreview(newMessage);
    await Conversation.findByIdAndUpdate(convId, {
      lastMessage: previewText,
      lastMessageAt: new Date(),
      $inc: { [`unreadCount.${resolvedTargetId}`]: 1 },
      $pull: { deletedBy: { $in: [req.userId, resolvedTargetId] } }
    });

    // ─── Serialize for sender (isOwn=true) and recipient (isOwn=false) ────
    const senderPayload = await serializeMessage(newMessage, req.userId, { clientTempId });
    const recipientPayload = await serializeMessage(newMessage, resolvedTargetId);

    // ─── PUSH LIVE: recipient gets receiveMessage + notification ──────────
    //  DIAGNOSTIC: log whether the recipient was actually online
    const delivered = emitToUser(req, resolvedTargetId, 'receiveMessage', {
      conversationId: convId,
      message: recipientPayload
    });
    console.log(`[chat] 📡 Live delivery to ${resolvedTargetId}: ${delivered ? '✅ ONLINE' : '⚠️  OFFLINE (they will see it on next refresh)'}`);
    emitToUser(req, resolvedTargetId, 'newNotification', {
      type: 'message',
      title: 'New Message',
      message: previewText
    });

    // Mirror to sender's OTHER devices/tabs (skip current socket via clientTempId on FE)
    emitToUser(req, req.userId, 'messageSentEcho', {
      conversationId: convId,
      message: senderPayload
    });

    res.json({
      success: true,
      message: senderPayload,
      conversationId: convId
    });

  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => { });
    console.error('[chat] /messages POST error:', err);
    // Multer file-size error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, message: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.` });
    }
    res.status(500).json({ success: false, message: err.message || 'Failed to send message' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  4. EDIT MESSAGE (within 15-min window; sender only; text only)
// ────────────────────────────────────────────────────────────────────────────
router.put('/messages/:messageId', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Text cannot be empty.' });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ success: false, message: `Text exceeds ${MAX_TEXT_LENGTH} characters.` });
    }

    const msg = await Message.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    // STRICT validation
    if (msg.sender.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'You can only edit your own messages.' });
    }
    if (msg.deletedForEveryone) {
      return res.status(400).json({ success: false, message: 'Cannot edit an unsent message.' });
    }
    if (msg.fileUrl) {
      return res.status(400).json({ success: false, message: 'Media messages cannot be edited.' });
    }
    if (!isWithinEditWindow(msg.createdAt)) {
      return res.status(403).json({ success: false, message: 'Edit window (15 minutes) has expired.' });
    }

    msg.text = text.trim();
    msg.isEdited = true;
    await msg.save();
    if (msg.replyTo) await msg.populate({ path: 'replyTo', select: 'text sender fileType deletedForEveryone' });

    // Update conversation last-message preview if this is the latest
    const conv = await Conversation.findById(msg.conversationId);
    if (conv) {
      const latest = await Message.findOne({ conversationId: msg.conversationId }).sort({ createdAt: -1 });
      if (latest && latest._id.toString() === msg._id.toString()) {
        conv.lastMessage = lastMessagePreview(msg);
        await conv.save();
      }
    }

    // Notify BOTH participants in real time
    const participants = conv ? conv.participants.map(p => p.toString()) : [req.userId];
    for (const uid of participants) {
      const payload = await serializeMessage(msg, uid);
      if (payload) {
        emitToUser(req, uid, 'messageEdited', {
          conversationId: msg.conversationId,
          message: payload
        });
      }
    }

    const responsePayload = await serializeMessage(msg, req.userId);
    res.json({ success: true, message: responsePayload });
  } catch (err) {
    console.error('[chat] /messages PUT error:', err);
    res.status(500).json({ success: false, message: 'Failed to edit message' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  5. UNSEND (Delete for Everyone) — within 15-min window
// ────────────────────────────────────────────────────────────────────────────
router.delete('/messages/:messageId/unsend', verifyToken, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    if (msg.sender.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'You can only unsend your own messages.' });
    }
    if (msg.deletedForEveryone) {
      return res.status(400).json({ success: false, message: 'Message is already unsent.' });
    }
    if (!isWithinEditWindow(msg.createdAt)) {
      return res.status(403).json({ success: false, message: 'Unsend window (15 minutes) has expired.' });
    }

    // Wipe content; keep the placeholder so reply-chains and ordering still resolve
    const oldFileUrl = msg.fileUrl;
    msg.deletedForEveryone = true;
    msg.text = '';
    msg.fileUrl = null;
    msg.fileType = null;
    msg.fileName = null;
    msg.fileSize = null;
    await msg.save();

    // Physically remove the stored media file if any
    if (oldFileUrl && oldFileUrl.startsWith('/uploads/')) {
      const abs = path.resolve(process.cwd(), oldFileUrl.replace(/^\//, ''));
      fs.unlink(abs, () => { });
    }

    // Update conversation preview if this was the last message
    const conv = await Conversation.findById(msg.conversationId);
    if (conv) {
      const latest = await Message.findOne({ conversationId: msg.conversationId }).sort({ createdAt: -1 });
      if (latest && latest._id.toString() === msg._id.toString()) {
        conv.lastMessage = 'Message unsent';
        await conv.save();
      }

      // Notify both participants
      const participants = conv.participants.map(p => p.toString());
      for (const uid of participants) {
        const payload = await serializeMessage(msg, uid);
        if (payload) {
          emitToUser(req, uid, 'messageUnsent', {
            conversationId: msg.conversationId,
            messageId: msg._id.toString(),
            message: payload
          });
        }
      }
    }

    res.json({ success: true, message: 'Message unsent', id: msg._id });
  } catch (err) {
    console.error('[chat] /messages unsend error:', err);
    res.status(500).json({ success: false, message: 'Failed to unsend message' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  6. DELETE FOR ME (anytime; sender or recipient)
// ────────────────────────────────────────────────────────────────────────────
router.delete('/messages/:messageId/me', verifyToken, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    const conv = await Conversation.findById(msg.conversationId).select('participants');
    if (!conv || !conv.participants.some(p => p.toString() === req.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!msg.deletedFor.some(id => id.toString() === req.userId)) {
      msg.deletedFor.push(req.userId);
      await msg.save();
    }
    res.json({ success: true, message: 'Deleted for you', id: msg._id });
  } catch (err) {
    console.error('[chat] delete-for-me error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  7. MARK READ (cascade to messages + emit read receipt)
// ────────────────────────────────────────────────────────────────────────────
router.put('/conversations/:id/read', verifyToken, async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id).select('participants');
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });
    if (!conv.participants.some(p => p.toString() === req.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await Conversation.findByIdAndUpdate(req.params.id, {
      $set: { [`unreadCount.${req.userId}`]: 0 }
    });

    const result = await Message.updateMany(
      { conversationId: req.params.id, sender: { $ne: req.userId }, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    // Notify the OTHER participant their messages are read
    const otherUser = conv.participants.find(p => p.toString() !== req.userId);
    if (otherUser) {
      emitToUser(req, otherUser.toString(), 'messagesRead', {
        conversationId: req.params.id,
        readerId: req.userId,
        readAt: new Date(),
        count: result?.modifiedCount || 0
      });
    }

    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    console.error('[chat] mark-read error:', err);
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  8. CLEAR CHAT
// ────────────────────────────────────────────────────────────────────────────
router.delete('/messages/:conversationId/clear', verifyToken, async (req, res) => {
  try {
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      $set: { [`clearedAt.${req.userId}`]: new Date() },
      $pull: { deletedBy: req.userId }
    });
    res.json({ success: true, message: 'Chat cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear chat' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  9. DELETE CONVERSATION
// ────────────────────────────────────────────────────────────────────────────
router.delete('/conversations/:id', verifyToken, async (req, res) => {
  try {
    const conv = await Conversation.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { deletedBy: req.userId } },
      { new: true }
    );
    if (conv && conv.deletedBy && conv.deletedBy.length === 2) {
      // Both parties deleted — wipe permanently along with media files
      const msgs = await Message.find({ conversationId: req.params.id }).select('fileUrl');
      for (const m of msgs) {
        if (m.fileUrl && m.fileUrl.startsWith('/uploads/')) {
          const abs = path.resolve(process.cwd(), m.fileUrl.replace(/^\//, ''));
          fs.unlink(abs, () => { });
        }
      }
      await Message.deleteMany({ conversationId: req.params.id });
      await Conversation.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete conversation' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  10. BLOCK / UNBLOCK
// ────────────────────────────────────────────────────────────────────────────
router.post('/block/:targetUserId', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { blockedUsers: req.params.targetUserId }
    });
    // Notify the target that they've been blocked so their UI updates live
    emitToUser(req, req.params.targetUserId, 'youWereBlocked', { byUserId: req.userId });
    res.json({ success: true, message: 'User blocked' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to block user' });
  }
});

router.post('/unblock/:targetUserId', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { blockedUsers: req.params.targetUserId }
    });
    emitToUser(req, req.params.targetUserId, 'youWereUnblocked', { byUserId: req.userId });
    res.json({ success: true, message: 'User unblocked' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to unblock user' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
//  11. TYPING INDICATOR — pure socket relay endpoint (HTTP fallback)
//      The frontend will primarily emit 'typing' / 'stopTyping' directly via socket;
//      this is a defensive fallback for clients that lose socket but keep HTTP.
// ────────────────────────────────────────────────────────────────────────────
router.post('/typing/:conversationId', verifyToken, async (req, res) => {
  try {
    const { isTyping } = req.body;
    const conv = await Conversation.findById(req.params.conversationId).select('participants');
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const other = conv.participants.find(p => p.toString() !== req.userId);
    if (other) {
      emitToUser(req, other.toString(), isTyping ? 'userTyping' : 'userStoppedTyping', {
        conversationId: req.params.conversationId,
        userId: req.userId
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed' });
  }
});

export default router;