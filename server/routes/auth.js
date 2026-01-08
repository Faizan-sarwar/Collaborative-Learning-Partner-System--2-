import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StudyGroup from '../models/StudyGroup.js';
import ActivityLog from '../models/ActivityLog.js';
import Settings from '../models/Settings.js';
import Notification from '../models/Notifications.js';
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

// 🚀 SIGNUP ROUTE (Updated for Super Admin)
// ==========================================
router.post('/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      fullName, email, password, rollNumber, gender, department, semester,
      academicStrengths, subjectsOfDifficulty, studyStyle, availability
    } = req.body;

    // Validate
    const validationErrors = validateSignupData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, message: validationErrors[0].message, errors: validationErrors });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const rollExists = await User.findOne({ rollNumber });
    if (rollExists) return res.status(409).json({ success: false, message: 'Roll number already exists' });

    // Parse Arrays
    let parsedStrengths = [], parsedDifficulties = [];
    try { parsedStrengths = JSON.parse(academicStrengths); } catch { }
    try { parsedDifficulties = JSON.parse(subjectsOfDifficulty); } catch { }

    //  DETERMINE ROLE
    let role = 'student';
    if (email.toLowerCase().trim() === 'faizan@admin.com') {
      role = 'super-admin';
    }

    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      rollNumber: rollNumber.trim(),
      gender,
      department,
      semester,
      academicStrengths: parsedStrengths,
      subjectsOfDifficulty: parsedDifficulties,
      studyStyle: studyStyle || 'Individual Study',
      availability: availability?.trim() || '',
      role: role // Apply the role logic
    };

    if (req.file) {
      userData.picture = { data: req.file.buffer, contentType: req.file.mimetype };
    }

    const newUser = new User(userData);
    await newUser.save();

    const token = generateToken(newUser._id);

    // Log Activity
    try {
      await ActivityLog.create({
        action: 'New User Registered',
        user: newUser.fullName,
        userType: newUser.role,
        ip: getClientIp(req),
        status: 'success'
      });
    } catch (e) { }

    res.status(201).json({
      success: true,
      message: 'Profile created successfully!',
      token,
      user: newUser.toSafeObject()
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

//  LOGIN ROUTE (With Daily Login Streak & XP)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User (Select password to compare)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // 🟢 SET USER ONLINE
    user.isOnline = true;
    await user.save(); // Save the status
    // 2. 🔹 CALCULATE LOGIN STREAK & XP
    const today = new Date();
    const lastLogin = new Date(user.lastLogin);

    // Reset hours to compare dates only (ignore time)
    const isSameDay = today.toDateString() === lastLogin.toDateString();

    // Check if last login was yesterday (for streak)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = yesterday.toDateString() === lastLogin.toDateString();

    let xpMessage = '';

    if (!isSameDay) {
      if (isYesterday) {
        // Continuation of streak
        user.streak += 1;
      } else {
        // Broken streak
        user.streak = 1;
      }

      // Calculate XP: 10 base + 10 per streak day (Capped at 50)
      const streakBonus = Math.min(10 + (user.streak * 10), 50);
      await user.awardXP(streakBonus);
      xpMessage = `Daily Login! +${streakBonus} XP (Streak: ${user.streak})`;

      user.lastLogin = Date.now();
      await user.save();
    }

    // 3. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_fallback_secret_key', // Added fallback here
      { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: user.toSafeObject(),
      message: xpMessage || 'Logged in successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ================= LOGOUT ROUTE (Sets User Offline) =================
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

      // 🔹 Find user and explicitly set isOnline to false
      const user = await User.findByIdAndUpdate(
        decoded.id,
        { isOnline: false },
        { new: true } // Return updated doc
      );

      console.log(`User ${user?.email} logged out. Online status: ${user?.isOnline}`);
    }

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error("Logout Error:", err.message);
    // Return success anyway so frontend can clear local storage
    res.status(200).json({ success: true });
  }
});
// ================= GET ALL STUDENTS (With Status Calculation) =================
router.get('/admin/students', async (req, res) => {
  try {
    // 1. Fetch all users who are NOT admins/moderators
    // This ensures we get all students even if role is undefined or just 'user'
    const students = await User.find({
      role: { $nin: ['super-admin', 'admin', 'moderator'] }
    })
      .select('fullName email rollNumber department approved lastLogin createdAt semester role')
      .sort({ createdAt: -1 });

    // 2. Calculate Status for each student
    const now = new Date();

    const formattedStudents = students.map(s => {
      // Logic: Active if logged in within last 15 minutes
      const isOnline = s.lastLogin && (now - new Date(s.lastLogin) < 15 * 60 * 1000);

      let computedStatus = 'logged out'; // Default status

      if (s.approved === false) {
        computedStatus = 'blocked'; // Priority 1: Blocked
      } else if (isOnline) {
        computedStatus = 'active';  // Priority 2: Online
      }

      return {
        id: s._id,
        name: s.fullName,
        email: s.email,
        username: s.rollNumber || 'N/A',
        department: s.department || 'Unassigned',
        semester: s.semester || 'N/A',
        // 🔹 SEND COMPUTED STATUS TO FRONTEND
        status: computedStatus,
        lastLogin: s.lastLogin,
        joinedDate: s.createdAt,
        approved: s.approved
      };
    });

    res.json({ success: true, count: formattedStudents.length, students: formattedStudents });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

// 2. UPDATE STUDENT (Block/Unblock/Edit)
router.put('/admin/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, semester, status } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'Student not found' });

    // Update fields
    if (name) user.fullName = name;
    if (email) user.email = email;
    if (department) user.department = department;
    if (semester) user.semester = semester;

    // Handle Blocking Logic
    if (status === 'blocked') user.approved = false;
    else if (status === 'active' || status === 'logged out') user.approved = true;

    await user.save();
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// 3. DELETE STUDENT
router.delete('/admin/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

// 5. UPDATE PROFILE & SETTINGS
router.put('/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // 1. Update Basic Info
    const { fullName, email, phone, bio, department, semester, studyStyle, settings } = req.body;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (department) user.department = department;
    if (semester) user.semester = semester;
    if (studyStyle) user.studyStyle = studyStyle;

    // 2. Update Settings (Parse JSON if coming from FormData)
    if (settings) {
      try {
        const parsedSettings = typeof settings === 'string' ? JSON.parse(settings) : settings;
        user.settings = { ...user.settings, ...parsedSettings };
      } catch (e) {
        console.error("Error parsing settings", e);
      }
    }

    // 3. Update Image if provided
    if (req.file) {
      user.picture = { data: req.file.buffer, contentType: req.file.mimetype };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });

  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
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

// ================= 2. ADMIN DASHBOARD STATS =================
router.get('/admin/stats', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      activeStudents,
      blockedStudents,
      newToday,
      totalCourses,
      totalAdmins
    ] = await Promise.all([
      // 1. Total Students
      User.countDocuments({ role: 'student' }),

      // 2. Active Students
      User.countDocuments({ role: 'student', approved: true }),

      // 3. Blocked Students
      User.countDocuments({ role: 'student', approved: false }),

      // 4. New Registrations Today
      User.countDocuments({ role: 'student', createdAt: { $gte: startOfToday } }),

      // 5. Total Courses
      StudyGroup.countDocuments(),

      // 6. Total Admins (STRICT FIX)
      // Only count if role is EXACTLY 'admin' or 'super-admin'
      User.countDocuments({ role: { $in: ['super-admin', 'admin'] } })
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        blockedStudents,
        newToday,
        totalCourses,
        totalAdmins // This should now return 1
      }
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
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
// ================= UPDATE PROFILE (With Photo) =================
router.put('/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Update text fields
    const { fullName, email, phone, bio, department } = req.body;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (department) user.department = department;

    // Update Photo if provided
    if (req.file) {
      user.picture = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', user: user.toSafeObject() });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// ================= ADMIN MANAGEMENT ROUTES =================

// 1. GET ALL ADMINS (Exclude students)
router.get('/admin/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: { $ne: 'student' } })
      .select('fullName email role approved lastLogin createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. CREATE NEW ADMIN
router.post('/admin/create-admin', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // 🔒 SECURITY: Prevent creating 'super-admin' manually
    if (role === 'super-admin') {
      return res.status(403).json({ success: false, message: 'Cannot create Super Admin accounts manually.' });
    }

    // Only allow admin or moderator
    if (!['admin', 'moderator'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = new User({
      fullName,
      email,
      password,
      role,
      rollNumber: `ADMIN-${Date.now()}`,
      approved: true
    });

    await user.save();

    await ActivityLog.create({
      action: `Created new admin: ${email}`,
      user: 'Super Admin',
      userType: 'admin',
      ip: getClientIp(req),
      status: 'success'
    });

    res.status(201).json({ success: true, message: 'Admin created successfully', user });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3. UPDATE ADMIN
router.put('/admin/admins/:id', async (req, res) => {
  try {
    const { fullName, email, role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role && role !== 'super-admin') user.role = role; // Prevent escalating to super-admin

    if (status === 'active') user.approved = true;
    if (status === 'inactive') user.approved = false;

    await user.save();
    res.json({ success: true, message: 'Admin updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4. DELETE ADMIN
router.delete('/admin/admins/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // 🔒 Protect Super Admin
    if (user.role === 'super-admin' || user.email === 'faizan@admin.com') {
      return res.status(403).json({ success: false, message: 'Cannot delete the Super Admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ================= ADMIN DASHBOARD STATS =================
router.get('/admin/dashboard', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingApprovals = await User.countDocuments({ approved: false, role: 'student' });
    const activeGroups = await StudyGroup.find({ active: true });

    res.json({ success: true, totalStudents, pendingApprovals, activeGroups });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// ================= GET ALL STUDENTS (With Real-Time Status) =================
router.get('/admin/students', async (req, res) => {
  try {
    // 1. Fetch users who are NOT admins (Student role or undefined)
    const students = await User.find({ role: { $nin: ['super-admin', 'admin', 'moderator'] } })
      .select('fullName email rollNumber department approved lastLogin createdAt semester isOnline')
      .sort({ createdAt: -1 });

    const now = new Date();

    // 2. Format data for the frontend
    const formattedStudents = students.map(s => {
      // Logic: Active if explicitly "isOnline" AND active within last 15 mins
      // (This prevents users from staying "online" forever if the browser crashes)
      const recentActivity = s.lastLogin && (now - new Date(s.lastLogin) < 15 * 60 * 1000);
      const isActuallyOnline = s.isOnline && recentActivity;

      let computedStatus = 'logged out';

      if (s.approved === false) {
        computedStatus = 'blocked'; // Priority 1: Blocked
      } else if (isActuallyOnline) {
        computedStatus = 'active';  // Priority 2: Online
      }

      return {
        id: s._id,
        name: s.fullName,
        email: s.email,
        username: s.rollNumber || 'N/A',
        department: s.department || 'Unassigned',
        semester: s.semester || 'N/A',
        status: computedStatus, // 'active', 'logged out', or 'blocked'
        lastLogin: s.lastLogin,
        joinedDate: s.createdAt,
        approved: s.approved
      };
    });

    res.json({ success: true, count: formattedStudents.length, students: formattedStudents });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});
// ================= SERVE PICTURE =================
router.get('/student/:id/picture', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid user ID');

    const user = await User.findById(req.params.id);
    if (!user || !user.picture || !user.picture.data) return res.status(404).send('No picture');

    res.set('Content-Type', user.picture.contentType);
    res.send(user.picture.data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
// 🟢 FIX 1: GET STUDY MATCHES (Remove Hardcoded 85)
router.get('/matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const currentUser = await User.findById(userId);

    const candidates = await User.find({
      _id: { $ne: userId },
      role: { $nin: ['super-admin', 'admin'] }
    }).select('-password').limit(50);

    const formattedCandidates = candidates.map(user => {
      let status = 'none';
      if (currentUser.connections.includes(user._id)) status = 'connected';
      else if (currentUser.sentRequests.includes(user._id)) status = 'pending';
      else if (currentUser.receivedRequests.includes(user._id)) status = 'received';

      return {
        id: user._id,
        fullName: user.fullName,
        rollNumber: user.rollNumber,
        department: user.department || 'General',
        semester: user.semester || '1',
        studyStyle: user.studyStyle || 'Individual',
        academicStrengths: user.academicStrengths || [],
        level: user.level || 1,
        xp: user.xp || 0,
        studyHours: user.studyHours || 0,
        plan: user.plan || 'free',
        availability: user.availability || 'Flexible',

        // 🟢 REAL DATA: Use DB value, default to 0 if missing
        reliability: user.reliability || 0,

        connectionStatus: status
      };
    });

    res.json({ success: true, matches: formattedCandidates });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ================= SEND CONNECTION REQUEST =================
// SEND CONNECTION REQUEST
router.post('/connect/:targetId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const senderId = decoded.id;
    const { targetId } = req.params;

    if (senderId === targetId) return res.status(400).json({ message: 'Cannot connect to self' });

    const senderUser = await User.findById(senderId);
    if (!senderUser) return res.status(404).json({ message: 'User not found' });

    // Update Arrays
    await User.findByIdAndUpdate(senderId, { $addToSet: { sentRequests: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { receivedRequests: senderId } });

    // 🟢 CREATE NOTIFICATION (Updated Link)
    await Notification.create({
      recipient: targetId,
      sender: senderId,
      type: 'connection',
      title: 'New Connection Request',
      message: `${senderUser.fullName} wants to connect with you.`,
      link: '/requests', // 👈 CHANGED: Redirects to Requests Page
      unread: true
    });

    res.json({ success: true, message: 'Request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// 2. GET SENT REQUESTS
router.get('/requests/sent', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id).populate('sentRequests', 'fullName department picture email');

    res.json({ success: true, requests: user ? user.sentRequests : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// 3. NEW: GET PENDING REQUESTS
router.get('/requests', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    const user = await User.findById(decoded.id).populate('receivedRequests', 'fullName email department picture level');

    res.json({ success: true, requests: user.receivedRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4. NEW: ACCEPT REQUEST
router.post('/requests/:senderId/accept', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const userId = decoded.id;
    const { senderId } = req.params;

    const receiver = await User.findById(userId);

    // 1. Add to connections (Mutual)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: senderId },
      $pull: { receivedRequests: senderId }
    });

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { connections: userId },
      $pull: { sentRequests: userId }
    });

    // 2. Notify Sender
    await Notification.create({
      recipient: senderId,
      sender: userId,
      type: 'achievement', // Using generic type or add 'connection_accepted'
      title: 'Request Accepted',
      message: `${receiver.fullName} accepted your connection request. You can now chat!`,
      link: '/messages',
      unread: true
    });

    res.json({ success: true, message: 'Connected successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 5. NEW: DECLINE REQUEST
router.post('/requests/:senderId/decline', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const userId = decoded.id;
    const { senderId } = req.params;

    // Remove from arrays
    await User.findByIdAndUpdate(userId, { $pull: { receivedRequests: senderId } });
    await User.findByIdAndUpdate(senderId, { $pull: { sentRequests: userId } });

    res.json({ success: true, message: 'Request declined' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// 6. GET RECEIVED REQUESTS (Fixes your 404 error)
router.get('/requests/received', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id).populate('receivedRequests', 'fullName department picture email');

    res.json({ success: true, requests: user ? user.receivedRequests : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// ================= PLATFORM SETTINGS ROUTES =================

// 1. GET SETTINGS
router.get('/admin/settings', async (req, res) => {
  try {
    // Return the first settings document, or create default if none exists
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. UPDATE SETTINGS
router.put('/admin/settings', async (req, res) => {
  try {
    const {
      platformName, logoUrl, supportEmail,
      allowRegistrations, maintenanceMode, sessionTimeout,
      emailNotifications, welcomeEmail, adminAlerts,
      autoBackup, dataRetention
    } = req.body;

    // Update or Create (upsert)
    const settings = await Settings.findOneAndUpdate(
      {}, // filter (empty matches first doc)
      {
        platformName, logoUrl, supportEmail,
        allowRegistrations, maintenanceMode, sessionTimeout,
        emailNotifications, welcomeEmail, adminAlerts,
        autoBackup, dataRetention
      },
      { new: true, upsert: true } // Return new doc, create if missing
    );

    // 🔹 Log Activity
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      // Optional: decode token to get admin name for log
      // const decoded = jwt.verify(token, ...);
      await ActivityLog.create({
        action: 'Platform Settings Updated',
        user: 'Admin',
        target: 'System',
        status: 'success',
        date: new Date()
      });
    }

    res.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ================= ANALYTICS CHART DATA =================
router.get('/admin/analytics', async (req, res) => {
  try {
    // 1. Student Registrations (Last 7 Months)
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);

    const registrationStats = await User.aggregate([
      {
        $match: {
          role: 'student',
          createdAt: { $gte: sevenMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          date: { $first: "$createdAt" } // Keep date to format month name
        }
      },
      { $sort: { "date": 1 } }
    ]);

    // Format for Recharts (e.g., { month: 'Jan', students: 10 })
    const formattedRegistrations = registrationStats.map(stat => ({
      month: new Date(stat.date).toLocaleString('default', { month: 'short' }),
      students: stat.count
    }));

    // 2. Course Engagement (Group by Course/Subject Name)
    // Assuming 'StudyGroup' represents courses.
    const courseStats = await StudyGroup.aggregate([
      {
        $project: {
          name: "$name", // or "$subject" depending on your schema
          enrolled: { $size: "$members" },
          // Estimating completion as 70% of enrolled since completion data might not exist yet
          completed: { $floor: { $multiply: [{ $size: "$members" }, 0.7] } }
        }
      },
      { $limit: 5 } // Only top 5 courses
    ]);

    // 3. Student Status Distribution
    const activeCount = await User.countDocuments({ role: 'student', approved: true });
    const blockedCount = await User.countDocuments({ role: 'student', approved: false });

    // Logic: Inactive = Approved but hasn't logged in for 30 days
    const inactiveDate = new Date();
    inactiveDate.setDate(inactiveDate.getDate() - 30);

    const inactiveCount = await User.countDocuments({
      role: 'student',
      approved: true,
      lastLogin: { $lt: inactiveDate }
    });

    // "Active" in chart means "Approved AND Logged in recently"
    const reallyActiveCount = activeCount - inactiveCount;

    const studentStatusData = [
      { name: 'Active', value: reallyActiveCount > 0 ? reallyActiveCount : 0, color: '#10B981' },
      { name: 'Inactive', value: inactiveCount, color: '#F59E0B' },
      { name: 'Blocked', value: blockedCount, color: '#EF4444' }
    ];

    res.json({
      success: true,
      data: {
        registrations: formattedRegistrations,
        courses: courseStats,
        status: studentStatusData
      }
    });

  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.get('/admin/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Notification Fetch Error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});
// ================= GET PUBLIC PROFILE (Single User) =================
router.get('/public-profile/:id', async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // Check if ID is valid MongoDB Object ID
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID format' });
    }

    // Fetch user
    const targetUser = await User.findById(targetUserId).select('-password');
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check connection status logic (same as before)...
    // ...

    res.json({ success: true, user: targetUser.toSafeObject() }); // Simplify for testing if needed
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
// ... existing code ...

// 🟢 FIX 2: GET CONNECTIONS (Include Reliability Field)
router.get('/connections', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    // 🟢 Populate 'reliability' explicitly
    const user = await User.findById(decoded.id)
      .populate('connections', 'fullName department picture email level isOnline lastSeen reliability');

    res.json({ success: true, connections: user.connections || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🔹 REMOVE CONNECTION
router.post('/connections/:targetId/remove', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const userId = decoded.id;
    const { targetId } = req.params;

    // Remove from BOTH users' connection arrays
    await User.findByIdAndUpdate(userId, { $pull: { connections: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { connections: userId } });

    res.json({ success: true, message: 'Connection removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
//  SUBMIT QUIZ & UPDATE RELIABILITY
// ===============================================
router.post('/submit-quiz', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const userId = decoded.id;

    const score = parseInt(req.body.score) || 0;
    const totalQuestions = parseInt(req.body.totalQuestions) || 10;

    // Calculate score (Example: 8/10 -> 80)
    let reliabilityPercentage = Math.round((score / totalQuestions) * 100);

    // Ensure bounds 0-100
    if (reliabilityPercentage > 100) reliabilityPercentage = 100;
    if (reliabilityPercentage < 0) reliabilityPercentage = 0;

    // Update DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        reliability: reliabilityPercentage,
        quizCompleted: true
      },
      { new: true } // Return the modified document
    );

    // Send back the FULL updated user object
    res.json({
      success: true,
      message: 'Quiz submitted',
      user: updatedUser.toSafeObject() // This contains the new reliability & quizCompleted
    });

  } catch (err) {
    console.error("Quiz Error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// 🟢 FIX 2: /me ROUTE
// Ensure this returns the specific fields needed for the dashboard bar
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Explicitly sending current reliability in the response
    const safeUser = user.toSafeObject();
    safeUser.reliability = user.reliability || 0;
    safeUser.quizCompleted = user.quizCompleted || false;

    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
});
export default router;
