import cron from 'node-cron';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // ADD THIS AT THE TOP
import dotenv from 'dotenv';
import auth from '../server/routes/auth.js';
import StudyGroup from '../server/models/StudyGroup.js';
import ActivityLog from '../server/models/ActivityLog.js';
import ChatRoutes from '../server/routes/chat.js';
import User from '../server/models/User.js';
import Settings from '../server/models/Settings.js'; // 🟢 ADDED: Need this for the firewall
import gamificationRoutes from '../server/routes/gamification.js';
import activityLogsRoutes from '../server/routes/activitylogs.js';
import notificationRoutes from '../server/routes/notification.js';
import referralRoutes from '../server/routes/referrals.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studybuddy';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// 🟢 GLOBAL BACKEND FIREWALL (Maintenance Mode - Admin Aware)
app.use(async (req, res, next) => {
  try {
    const settings = await Settings.findOne();

    // If maintenance is OFF, let everyone through
    if (!settings || !settings.maintenanceMode) return next();

    // These routes MUST remain public so users can log in and the frontend can check settings
    const publicAllowedPaths = [
      '/api/auth/login',
      '/api/auth/admin/settings',
      '/api/auth/me'
    ];

    if (publicAllowedPaths.includes(req.path)) {
      return next();
    }

    // 🟢 NEW: Check if the person making the request is an Admin!
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        const user = await User.findById(decoded.id);

        // If they are an admin or super-admin, wave them through the firewall!
        if (user && (user.role === 'admin' || user.role === 'super-admin')) {
          return next();
        }
      } catch (tokenErr) {
        // Token is invalid or expired, ignore and let them hit the block below
      }
    }

    // If we reach here, it's a student trying to fetch data during maintenance. Block them.
    return res.status(503).json({
      success: false,
      message: 'The system is currently undergoing maintenance. Please try again later.'
    });

  } catch (err) {
    next();
  }
});

// Routes
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

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
// ==========================================
// 🟢 ENTERPRISE BACKGROUND WORKER (CRON JOBS)
// Runs automatically every night at Midnight (00:00)
// ==========================================
cron.schedule('0 0 * * *', async () => {
  console.log('⏳ [CRON] Running nightly system maintenance...');
  try {
    const settings = await Settings.findOne();
    if (!settings) return;

    // 1. ENFORCE DATA RETENTION (e.g., 30, 60, or 90 days)
    if (settings.dataRetention) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - settings.dataRetention);

      // Example: Delete Activity Logs older than the retention period to save DB space
      const deletedLogs = await ActivityLog.deleteMany({ createdAt: { $lt: cutoffDate } });
      console.log(`🧹 [CRON] Data Retention: Deleted ${deletedLogs.deletedCount} old activity logs.`);
    }

    // 2. AUTO BACKUP SIMULATION
    // In a production environment like AWS/AWS, you would trigger an S3 snapshot here.
    // For this app, we log the cycle based on the frequency setting.
    const dayOfWeek = new Date().getDay();
    const dateOfMonth = new Date().getDate();

    let shouldBackup = false;
    if (settings.autoBackup === 'daily') shouldBackup = true;
    if (settings.autoBackup === 'weekly' && dayOfWeek === 0) shouldBackup = true; // Runs on Sunday
    if (settings.autoBackup === 'monthly' && dateOfMonth === 1) shouldBackup = true; // Runs 1st of month

    if (shouldBackup) {
      console.log(`💾 [CRON] Auto Backup Triggered (${settings.autoBackup} schedule).`);
      // Logic to trigger MongoDB dump would go here
    }

  } catch (err) {
    console.error('❌ [CRON] Maintenance failed:', err);
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});