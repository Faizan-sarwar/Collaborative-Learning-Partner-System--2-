import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StudyGroup from '../models/StudyGroup.js';
import ActivityLog from '../models/ActivityLog.js';
import multer from 'multer';

const router = express.Router();
// --- Helper: Get Client IP Robustly ---
const getClientIp = (req) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // Handle array or comma-separated list (if behind proxy)
  if (Array.isArray(ip)) ip = ip[0];
  if (ip.includes(',')) ip = ip.split(',')[0].trim();

  // Clean up IPv6 prefixes
  if (ip.includes('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  // Strictly convert IPv6 localhost to IPv4
  if (ip === '::1' || ip === '0:0:0:0:0:0:0:1') {
    return '127.0.0.1';
  }

  return ip;
};

// Multer config for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password) => {
  const issues = [];
  if (password.length < 8) issues.push('at least 8 characters');
  if (!/[A-Z]/.test(password)) issues.push('one uppercase letter');
  if (!/[a-z]/.test(password)) issues.push('one lowercase letter');
  if (!/[0-9]/.test(password)) issues.push('one number');
  if (!/[^A-Za-z0-9]/.test(password)) issues.push('one special character');
  return issues;
};

const validateSignupData = (data) => {
  const errors = [];

  // Full Name validation
  if (!data.fullName || !data.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  } else if (data.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Name must be at least 2 characters' });
  } else if (data.fullName.trim().length > 100) {
    errors.push({ field: 'fullName', message: 'Name must be less than 100 characters' });
  }

  // Roll Number validation
  if (!data.rollNumber || !data.rollNumber.trim()) {
    errors.push({ field: 'rollNumber', message: 'Roll number is required' });
  } else if (!/^[A-Za-z0-9-]+$/.test(data.rollNumber)) {
    errors.push({ field: 'rollNumber', message: 'Roll number can only contain letters, numbers, and hyphens' });
  }

  // Email validation
  if (!data.email || !data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    const passwordIssues = validatePassword(data.password);
    if (passwordIssues.length > 0) {
      errors.push({ field: 'password', message: `Password must contain ${passwordIssues.join(', ')}` });
    }
  }

  // Department validation
  const validDepartments = ['Information Technology', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  if (!data.department || !validDepartments.includes(data.department)) {
    errors.push({ field: 'department', message: 'Invalid department' });
  }

  // Semester validation
  const validSemesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  if (!data.semester || !validSemesters.includes(data.semester)) {
    errors.push({ field: 'semester', message: 'Semester must be between 1 and 8' });
  }

  // Study Style validation
  const validStudyStyles = ['Individual Study', 'Group Collaboration', 'One-on-One Mentoring'];
  if (!data.studyStyle || !validStudyStyles.includes(data.studyStyle)) {
    errors.push({ field: 'studyStyle', message: 'Invalid study style' });
  }

  // Availability validation (optional but max length)
  if (data.availability && data.availability.length > 500) {
    errors.push({ field: 'availability', message: 'Availability must be less than 500 characters' });
  }

  return errors;
};

// Signup route with image upload
router.post('/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      rollNumber,
      department,
      semester,
      academicStrengths,
      subjectsOfDifficulty,
      studyStyle,
      availability
    } = req.body;

    // ❌ REMOVED THE INCORRECT BLOCK FROM HERE

    // Validate input
    const validationErrors = validateSignupData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0].message,
        errors: validationErrors
      });
    }

    // Check email duplicate
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        field: 'email'
      });
    }

    // Check roll number duplicate
    const rollExists = await User.findOne({ rollNumber });
    if (rollExists) {
      return res.status(409).json({
        success: false,
        message: 'Roll number already exists',
        field: 'rollNumber'
      });
    }

    // Parse array fields
    let parsedStrengths = academicStrengths;
    let parsedDifficulties = subjectsOfDifficulty;

    if (typeof academicStrengths === 'string') {
      try {
        parsedStrengths = JSON.parse(academicStrengths);
      } catch {
        parsedStrengths = [];
      }
    }

    if (typeof subjectsOfDifficulty === 'string') {
      try {
        parsedDifficulties = JSON.parse(subjectsOfDifficulty);
      } catch {
        parsedDifficulties = [];
      }
    }

    // ✅ 1. Define userData first
    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      rollNumber: rollNumber.trim(),
      department,
      semester,
      academicStrengths: parsedStrengths || [],
      subjectsOfDifficulty: parsedDifficulties || [],
      studyStyle: studyStyle || 'Individual Study',
      availability: availability?.trim() || ''
    };

    // ✅ 2. Now it is safe to add the picture to userData
    if (req.file) {
      userData.picture = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    // Create user
    const newUser = new User(userData);
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Activity Log logic (ensure this matches your previous context)
    try {
      if (typeof ActivityLog !== 'undefined') { // Safety check
          await ActivityLog.create({
            action: 'New User Registered',
            user: newUser.fullName,
            userType: 'student',
            ip: req.ip || '127.0.0.1', 
            status: 'success'
          });
      }
    } catch (logErr) {
      console.error('Logging failed:', logErr);
    }

    res.status(201).json({
      success: true,
      message: 'Profile created successfully!',
      token,
      user: newUser.toSafeObject()
    });
  } catch (err) {
    console.error('Signup error:', err);
    // ... error handling remains the same
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      return res.status(400).json({ success: false, message: errors[0].message, errors });
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ success: false, message: `${field === 'email' ? 'Email' : 'Roll number'} already exists`, field });
    }
    res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        field: 'email'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
        field: 'email'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
        field: 'password'
      });
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // 🔹 LOG ACTIVITY: User Logged In
    try {
      await ActivityLog.create({
        action: 'User Logged In',
        user: user.fullName,
        userType: user.role || 'student', // default to student if role not present
        ip: req.ip || '127.0.0.1',
        status: 'success'
      });
    } catch (logErr) {
      console.error('Logging failed:', logErr);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: user.toSafeObject() });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
});

// Admin dashboard stats
router.get('/admin/dashboard', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments();
    const pendingApprovals = await User.countDocuments({ approved: false });
    const activeGroups = await StudyGroup.find({ active: true });
    const registrations = await User.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      totalStudents,
      pendingApprovals,
      activeGroups,
      registrations
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ================= GET ALL STUDENTS =================
router.get('/admin/students', async (req, res) => {
  try {
    // Fetch all users sorted by newest first
    const students = await User.find()
      .select('fullName email rollNumber department approved createdAt studyStyle')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      students: students.map(student => ({
        id: student._id,
        name: student.fullName,
        email: student.email,
        username: student.rollNumber || 'N/A', // Using Roll Number as username
        department: student.department || 'Unassigned',
        status: student.approved ? 'active' : 'inactive', // Simple status logic
        joinedDate: new Date(student.createdAt).toLocaleDateString()
      }))
    });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
});
// ================= ADMIN STATS (REAL DATA) =================
router.get('/admin/stats', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      activeStudents,
      blockedStudents,
      newToday,
      totalAdmins,
      totalCourses
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ approved: true }),
      User.countDocuments({ approved: false }),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ plan: { $in: ['pro', 'pro-trial'] } }), // or role === 'admin' if you add roles
      StudyGroup.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        blockedStudents,
        newToday,
        totalCourses,
        totalAdmins
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats'
    });
  }
});
// ================= RECENT REGISTRATIONS =================
router.get('/admin/recent-registrations', async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName email approved createdAt');

    res.json({
      success: true,
      users: recentUsers
    });
  } catch (err) {
    console.error('Recent registrations error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent registrations'
    });
  }
});
// ================= RECENT ACTIVITY =================
router.get('/admin/recent-activity', async (req, res) => {
  try {
    const activities = [];

    // Recent registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName approved createdAt');

    recentUsers.forEach(user => {
      activities.push({
        action: 'New student registered',
        user: user.fullName,
        type: 'registration',
        createdAt: user.createdAt
      });

      if (!user.approved) {
        activities.push({
          action: 'Student blocked',
          user: user.fullName,
          type: 'moderation',
          createdAt: user.createdAt
        });
      }
    });

    // Recent study groups (courses)
    const recentGroups = await StudyGroup.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('creator', 'fullName');

    recentGroups.forEach(group => {
      activities.push({
        action: 'New course created',
        user: group.creator?.fullName || 'Admin',
        type: 'course',
        createdAt: group.createdAt
      });
    });

    // Sort everything by time
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      activities: activities.slice(0, 8)
    });
  } catch (err) {
    console.error('Recent activity error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity'
    });
  }
});


// Get profile picture by user id
router.get('/student/:id/picture', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Invalid user ID');
    }

    const student = await User.findById(req.params.id);
    if (!student || !student.picture || !student.picture.data) {
      return res.status(404).send('No picture found');
    }

    res.contentType(student.picture.contentType);
    res.send(student.picture.data);
  } catch (err) {
    console.error('Error fetching picture:', err);
    res.status(500).send('Server error');
  }
});

// Get user stats
router.get('/student/:id/stats', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const groups = await StudyGroup.find({ members: student._id });

    const stats = {
      completedModules: student.completedModules || 0,
      studyHours: student.studyHours || 0,
      activeGroups: groups.length,
      level: student.level || 1,
      xp: student.xp || 0
    };

    res.json({ success: true, stats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get study partner matches
router.get('/matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Build match query
    const query = {
      _id: { $ne: userId },
      $or: [
        { academicStrengths: { $in: currentUser.subjectsOfDifficulty } },
        { subjectsOfDifficulty: { $in: currentUser.academicStrengths } }
      ]
    };

    // Add optional filters
    if (currentUser.studyStyle) {
      query.studyStyle = currentUser.studyStyle;
    }

    const candidates = await User.find(query).limit(20);

    res.json({
      success: true,
      matches: candidates.map(user => user.toSafeObject())
    });
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
