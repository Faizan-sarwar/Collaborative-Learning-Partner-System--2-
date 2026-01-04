import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from '../server/routes/auth.js';
import StudyGroup from '../server/models/StudyGroup.js';
import ActivityLog from '../server/models/ActivityLog.js';
import ChatRoutes from '../server/routes/chat.js';
import User from '../server/models/User.js';
import gamificationRoutes from '../server/routes/gamification.js';
import activityLogsRoutes from '../server/routes/activitylogs.js';
import notificationRoutes from '../server/routes/notification.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studybuddy';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', auth);
app.use('/api/activity-logs', activityLogsRoutes);
app.use('/api/chat', ChatRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Express server running',
    version: '1.0.0',
    endpoints: {
      signup: 'POST /signup',
      login: 'POST /login',
      me: 'GET /me',
      matches: 'GET /matches/:userId',
      studentPicture: 'GET /student/:id/picture',
      studentStats: 'GET /student/:id/stats',
      studyGroups: 'POST/GET /studygroup'
    }
  });
});

// Create a new study group
app.post('/studygroup', async (req, res) => {
  try {
    const { name, subjects, description, meetingTime, membership, creatorId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid creator ID is required'
      });
    }

    // Parse subjects if string
    let parsedSubjects = subjects;
    if (typeof subjects === 'string') {
      try {
        parsedSubjects = JSON.parse(subjects);
      } catch {
        parsedSubjects = subjects.split(',').map(s => s.trim()).filter(Boolean);
      }
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

    // 🔹 LOG ACTIVITY: Group Created
    try {
      const creator = await User.findById(creatorId);
      await ActivityLog.create({
        action: `Created Group: ${savedGroup.name}`,
        user: creator ? creator.fullName : 'Unknown User',
        userType: 'student',
        ip: req.ip || '127.0.0.1',
        status: 'success'
      });
    } catch (logErr) {
      console.error('Logging failed:', logErr);
    }

    res.status(201).json({
      success: true,
      message: 'Study group created successfully',
      group: savedGroup
    });
  } catch (err) {
    console.error('Error creating group:', err);

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      return res.status(400).json({
        success: false,
        message: errors[0].message,
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// Get all study groups
app.get('/studygroup', async (req, res) => {
  try {
    const { active, membership } = req.query;
    const query = {};

    if (active !== undefined) {
      query.active = active === 'true';
    }

    if (membership) {
      query.membership = membership;
    }

    const groups = await StudyGroup.find(query)
      .populate('creator', 'fullName email')
      .populate('members', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: groups.length,
      groups
    });
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Join a study group
app.post('/studygroup/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid group ID' });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Valid user ID is required' });
    }

    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (!group.active) {
      return res.status(400).json({ success: false, message: 'Group is not active' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ success: false, message: 'Group is full' });
    }

    group.members.push(userId);
    await group.save();

    // 🔹 LOG ACTIVITY: Joined Group
    try {
      const joiner = await User.findById(userId);
      await ActivityLog.create({
        action: `Joined Group: ${group.name}`,
        user: joiner ? joiner.fullName : 'Unknown User',
        userType: 'student',
        ip: req.ip || '127.0.0.1',
        status: 'success'
      });
    } catch (logErr) {
      console.error('Logging failed:', logErr);
    }

    res.json({
      success: true,
      message: 'Joined group successfully',
      group
    });
  } catch (err) {
    console.error('Error joining group:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Leave a study group
app.post('/studygroup/:id/leave', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid group ID' });
    }

    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Not a member' });
    }

    group.members = group.members.filter(id => id.toString() !== userId);
    await group.save();

    res.json({
      success: true,
      message: 'Left group successfully',
      group
    });
  } catch (err) {
    console.error('Error leaving group:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ================= UPDATE COURSE (Study Group) =================
app.put('/studygroup/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, subjects, meetingTime, active } = req.body; // 1. Extract 'active'

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    const group = await StudyGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Course not found' });

    // Parse subjects if necessary
    let parsedSubjects = subjects;
    if (typeof subjects === 'string') {
        try { parsedSubjects = JSON.parse(subjects); } 
        catch { parsedSubjects = subjects.split(',').map(s => s.trim()).filter(Boolean); }
    }

    // Update fields
    if (name !== undefined) group.name = name;
    if (description !== undefined) group.description = description;
    if (parsedSubjects !== undefined) group.subjects = parsedSubjects;
    if (meetingTime !== undefined) group.meetingTime = meetingTime;
    
    // 2. Explicitly update 'active' status
    if (active !== undefined) {
        group.active = active; 
    }

    await group.save();

    // Log Activity
    try {
        await ActivityLog.create({
            action: `Updated Course: ${group.name} (Status: ${group.active ? 'Active' : 'Disabled'})`,
            user: 'Admin',
            userType: 'admin',
            ip: req.ip || '127.0.0.1',
            status: 'success'
        });
    } catch(e) {}

    res.json({ success: true, message: 'Course updated successfully', group });
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ================= DELETE COURSE =================
app.delete('/studygroup/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    const group = await StudyGroup.findByIdAndDelete(id);
    if (!group) return res.status(404).json({ success: false, message: 'Course not found' });

    // Log Activity
    try {
        await ActivityLog.create({
            action: `Deleted Course: ${group.name}`,
            user: 'Admin',
            userType: 'admin',
            ip: req.ip || '127.0.0.1',
            status: 'success'
        });
    } catch(e) {}

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});