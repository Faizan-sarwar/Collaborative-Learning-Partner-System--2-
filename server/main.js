import cron from 'node-cron';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
//  IMPORT HTTP & SOCKET.IO
import http from 'http';
import { Server } from 'socket.io';

import auth from '../server/routes/auth.js';
import StudyGroup from '../server/models/StudyGroup.js';
import ActivityLog from '../server/models/ActivityLog.js';
import ChatRoutes from '../server/routes/chat.js';
import User from '../server/models/User.js';
import Settings from '../server/models/Settings.js';
import gamificationRoutes from '../server/routes/gamification.js';
import activityLogsRoutes from '../server/routes/activityLogs.js';
import notificationRoutes from '../server/routes/notification.js';
import referralRoutes from '../server/routes/referrals.js';

dotenv.config();
const app = express();


//  HTTP SERVER + SOCKET.IO (mobile-resilient config)

const server = http.createServer(app);

//  CORS REFLECTION HELPER
// Mirrors the caller's origin so localhost, 192.168.x.x, and any LAN IP all work
// with credentials. Wildcard '*' is forbidden when credentials:true, so we MUST
// echo the actual origin back instead.
const corsOrigin = (origin, callback) => {
  // No origin = same-origin request (or curl/Postman) — allow
  if (!origin) return callback(null, true);
  // Allow ANY origin during development. In production, replace with an
  // allowlist (e.g. only your domain + your LAN range).
  callback(null, origin);
};

const io = new Server(server, {
  cors: {
    origin: corsOrigin,                   //  Mirror origin (fixes LAN/phone)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  pingInterval: 20000,                    // Ping every 20s
  pingTimeout: 25000,                     // Wait 25s for pong
  transports: ['websocket', 'polling'],   // Fallback for restrictive networks
  allowEIO3: true                         // Compat with older mobile clients
});


//  GLOBAL SOCKET REGISTRY
// Tracks which user ID belongs to which active socket connection.

const connectedUsers = new Map();
app.set('io', io);
app.set('connectedUsers', connectedUsers);

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // ─── REGISTER USER (frontend emits this right after connect) ──────────────
  socket.on('registerUser', (userId) => {
    if (!userId) return;
    connectedUsers.set(userId.toString(), socket.id);
    socket.data.userId = userId.toString();
    console.log(`🔗 User registered: ${userId} → ${socket.id}`);
  });

  // ─── TYPING RELAY (Instagram-style 3-dot indicator) ───────────────────────
  socket.on('typing', ({ conversationId, targetUserId }) => {
    const senderId = socket.data.userId;
    if (!senderId || !targetUserId) return;
    const targetSocketId = connectedUsers.get(targetUserId.toString());
    if (targetSocketId) {
      io.to(targetSocketId).emit('userTyping', { conversationId, userId: senderId });
    }
  });

  socket.on('stopTyping', ({ conversationId, targetUserId }) => {
    const senderId = socket.data.userId;
    if (!senderId || !targetUserId) return;
    const targetSocketId = connectedUsers.get(targetUserId.toString());
    if (targetSocketId) {
      io.to(targetSocketId).emit('userStoppedTyping', { conversationId, userId: senderId });
    }
  });

  // ─── READ RECEIPT (lighter than HTTP roundtrip) ───────────────────────────
  socket.on('markRead', ({ conversationId, targetUserId }) => {
    const senderId = socket.data.userId;
    if (!senderId || !targetUserId) return;
    const targetSocketId = connectedUsers.get(targetUserId.toString());
    if (targetSocketId) {
      io.to(targetSocketId).emit('messagesRead', {
        conversationId,
        readerId: senderId,
        readAt: new Date()
      });
    }
  });

  // ─── HEARTBEAT (keeps mobile sockets warm) ────────────────────────────────
  socket.on('heartbeat', () => {
    socket.emit('heartbeat-ack', { t: Date.now() });
  });

  // ─── DISCONNECT (deferred cleanup) ────────────────────────────────────────
  // Wait 1.5s before removing the user. If a fresh socket claims their userId
  // in the meantime (StrictMode remount, mobile resume, reconnect), we keep the
  // registry intact. This stops the "connected but server says offline" ghost.
  socket.on('disconnect', (reason) => {
    const uid = socket.data.userId;
    if (!uid) return;
    console.log(`🔌 Socket ${socket.id} disconnected: ${reason} (uid=${uid}) — cleanup in 1.5s`);
    setTimeout(() => {
      if (connectedUsers.get(uid) === socket.id) {
        connectedUsers.delete(uid);
        console.log(`🧹 User ${uid} removed (no reconnect)`);
      } else {
        console.log(`✨ User ${uid} reconnected — registry kept`);
      }
    }, 1500);
  });
});


//  BODY PARSING + STATIC UPLOADS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  SERVE UPLOADED CHAT MEDIA (images, voice notes, files)
// CRITICAL: forces correct MIME. Without this Express serves .webm as
// "video/webm" and Chrome's <audio> refuses to decode it (Format error code 4).
const MEDIA_MIME = {
  '.webm': 'audio/webm', '.ogg': 'audio/ogg', '.oga': 'audio/ogg', '.opus': 'audio/ogg',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.wav': 'audio/wav',
  '.mp4': 'video/mp4', '.mov': 'video/quicktime',
};
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    const ext = path.extname(filePath).toLowerCase();
    if (MEDIA_MIME[ext]) res.setHeader('Content-Type', MEDIA_MIME[ext]);
    res.setHeader('Accept-Ranges', 'bytes'); // enables <audio> seeking
  }
}));

app.use(cors({
  origin: corsOrigin,                     //  Same mirror function (fixes LAN/phone)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


//  MONGODB CONNECTION

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studybuddy';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));


//  GLOBAL BACKEND FIREWALL (Maintenance Mode - Admin Aware)

app.use(async (req, res, next) => {
  try {
    const settings = await Settings.findOne();

    if (!settings || !settings.maintenanceMode) return next();

    const publicAllowedPaths = [
      '/api/auth/login',
      '/api/auth/admin/settings',
      '/api/auth/me'
    ];

    if (publicAllowedPaths.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test_key');
        const user = await User.findById(decoded.id);

        if (user && (user.role === 'admin' || user.role === 'super-admin')) {
          return next();
        }
      } catch (tokenErr) {
        // Token is invalid or expired
      }
    }

    return res.status(503).json({
      success: false,
      message: 'The system is currently undergoing maintenance. Please try again later.'
    });

  } catch (err) {
    next();
  }
});


//  ROUTES

app.use('/api/auth', auth);
app.use('/api/activity-logs', activityLogsRoutes);
app.use('/api/chat', ChatRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/referrals', referralRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Express server running',
    version: '1.0.0'
  });
});


// STUDY GROUPS


// Create a new study group
app.post('/studygroup', async (req, res) => {
  try {
    const { name, subjects, description, meetingTime, membership, creatorId } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Group name is required' });
    if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) return res.status(400).json({ success: false, message: 'Valid creator ID is required' });

    let parsedSubjects = subjects;
    if (typeof subjects === 'string') {
      try { parsedSubjects = JSON.parse(subjects); }
      catch { parsedSubjects = subjects.split(',').map(s => s.trim()).filter(Boolean); }
    }

    const newGroup = new StudyGroup({
      name: name.trim(),
      subjects: parsedSubjects || [],
      description: description?.trim() || '',
      meetingTime: meetingTime?.trim() || '',
      membership: membership || 'open',
      creator: creatorId,
      members: [creatorId]
    });

    const savedGroup = await newGroup.save();

    try {
      const creator = await User.findById(creatorId);
      await ActivityLog.create({
        action: `Created Group: ${savedGroup.name}`,
        user: creator ? creator.fullName : 'Unknown User',
        userType: 'student',
        ip: req.ip || '127.0.0.1',
        status: 'success'
      });
    } catch (logErr) { }

    res.status(201).json({ success: true, message: 'Study group created successfully', group: savedGroup });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
      return res.status(400).json({ success: false, message: errors[0].message, errors });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Get all study groups
app.get('/studygroup', async (req, res) => {
  try {
    const { active, membership } = req.query;
    const query = {};

    if (active !== undefined) query.active = active === 'true';
    if (membership) query.membership = membership;

    const groups = await StudyGroup.find(query)
      .populate('creator', 'fullName email')
      .populate('members', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: groups.length, groups });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// Join a study group
app.post('/studygroup/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid group ID' });
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ success: false, message: 'Valid user ID is required' });

    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!group.active) return res.status(400).json({ success: false, message: 'Group is not active' });
    if (group.members.includes(userId)) return res.status(400).json({ success: false, message: 'Already a member' });
    if (group.members.length >= group.maxMembers) return res.status(400).json({ success: false, message: 'Group is full' });

    group.members.push(userId);
    await group.save();

    try {
      const joiner = await User.findById(userId);
      await ActivityLog.create({
        action: `Joined Group: ${group.name}`,
        user: joiner ? joiner.fullName : 'Unknown User',
        userType: 'student',
        ip: req.ip || '127.0.0.1',
        status: 'success'
      });
    } catch (logErr) { }

    res.json({ success: true, message: 'Joined group successfully', group });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// Leave a study group
app.post('/studygroup/:id/leave', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid group ID' });

    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!group.members.includes(userId)) return res.status(400).json({ success: false, message: 'Not a member' });

    group.members = group.members.filter(id => id.toString() !== userId);
    await group.save();

    res.json({ success: true, message: 'Left group successfully', group });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// UPDATE COURSE
app.put('/studygroup/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, subjects, meetingTime, active } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const group = await StudyGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Course not found' });

    let parsedSubjects = subjects;
    if (typeof subjects === 'string') {
      try { parsedSubjects = JSON.parse(subjects); }
      catch { parsedSubjects = subjects.split(',').map(s => s.trim()).filter(Boolean); }
    }

    if (name !== undefined) group.name = name;
    if (description !== undefined) group.description = description;
    if (parsedSubjects !== undefined) group.subjects = parsedSubjects;
    if (meetingTime !== undefined) group.meetingTime = meetingTime;
    if (active !== undefined) group.active = active;

    await group.save();

    try {
      await ActivityLog.create({
        action: `Updated Course: ${group.name} (Status: ${group.active ? 'Active' : 'Disabled'})`,
        user: 'Admin',
        userType: 'admin',
        ip: req.ip || '127.0.0.1',
        status: 'success'
      });
    } catch (e) { }

    res.json({ success: true, message: 'Course updated successfully', group });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// DELETE COURSE
app.delete('/studygroup/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const group = await StudyGroup.findByIdAndDelete(id);
    if (!group) return res.status(404).json({ success: false, message: 'Course not found' });

    try {
      await ActivityLog.create({
        action: `Deleted Course: ${group.name}`,
        user: 'Admin',
        userType: 'admin',
        ip: req.ip || '127.0.0.1',
        status: 'success'
      });
    } catch (e) { }

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});


//  GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


//  ENTERPRISE BACKGROUND WORKER (CRON JOBS)

cron.schedule('0 0 * * *', async () => {
  console.log('⏳ [CRON] Running nightly system maintenance...');
  try {
    const settings = await Settings.findOne();
    if (!settings) return;

    if (settings.dataRetention) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - settings.dataRetention);
      const deletedLogs = await ActivityLog.deleteMany({ createdAt: { $lt: cutoffDate } });
      console.log(`🧹 [CRON] Data Retention: Deleted ${deletedLogs.deletedCount} old activity logs.`);
    }

    const dayOfWeek = new Date().getDay();
    const dateOfMonth = new Date().getDate();

    let shouldBackup = false;
    if (settings.autoBackup === 'daily') shouldBackup = true;
    if (settings.autoBackup === 'weekly' && dayOfWeek === 0) shouldBackup = true;
    if (settings.autoBackup === 'monthly' && dateOfMonth === 1) shouldBackup = true;

    if (shouldBackup) {
      console.log(`💾 [CRON] Auto Backup Triggered (${settings.autoBackup} schedule).`);
    }

  } catch (err) {
    console.error('❌ [CRON] Maintenance failed:', err);
  }
});


//  START SERVER (server.listen, NOT app.listen — needed for Socket.IO)

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Real-Time Server running on port ${PORT}`);
});