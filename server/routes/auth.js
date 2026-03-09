import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv'; // 🟢 1. IMPORT DOTENV

dotenv.config(); // 🟢 2. RUN IT IMMEDIATELY so the credentials load

import User from '../models/User.js';
import StudyGroup from '../models/StudyGroup.js';
import ActivityLog from '../models/ActivityLog.js';
import Settings from '../models/Settings.js';
import Notification from '../models/Notifications.js';

const router = express.Router();

const otpStore = new Map();

// 🟢 3. ADD A CHECK to warn you if credentials are still missing
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("⚠️ WARNING: EMAIL_USER or EMAIL_PASS is missing in your .env file!");
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- Helpers ---
const getClientIp = (req) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  if (Array.isArray(ip)) ip = ip[0];
  if (ip.includes(',')) ip = ip.split(',')[0].trim();
  if (ip.includes('::ffff:')) ip = ip.replace('::ffff:', '');
  return (ip === '::1' || ip === '0:0:0:0:0:0:0:1') ? '127.0.0.1' : ip;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: process.env.JWT_EXPIRE || '7d' });
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateSignupData = (data) => {
  const errors = [];
  const addErr = (field, msg) => errors.push({ field, message: msg });

  if (!data.fullName?.trim()) addErr('fullName', 'Full name is required');
  else if (data.fullName.trim().length < 2) addErr('fullName', 'Name must be at least 2 characters');
  else if (data.fullName.trim().length > 100) addErr('fullName', 'Name must be less than 100 characters');

  if (!data.rollNumber?.trim()) addErr('rollNumber', 'Roll number is required');
  else if (!/^[A-Za-z0-9-]+$/.test(data.rollNumber)) addErr('rollNumber', 'Roll number can only contain letters, numbers, and hyphens');

  if (!data.email?.trim()) addErr('email', 'Email is required');
  else if (!validateEmail(data.email)) addErr('email', 'Please enter a valid email address');

  if (!data.password) addErr('password', 'Password is required');
  else {
    const p = data.password, issues = [];
    if (p.length < 8) issues.push('at least 8 characters');
    if (!/[A-Z]/.test(p)) issues.push('one uppercase letter');
    if (!/[a-z]/.test(p)) issues.push('one lowercase letter');
    if (!/[0-9]/.test(p)) issues.push('one number');
    if (!/[^A-Za-z0-9]/.test(p)) issues.push('one special character');
    if (issues.length) addErr('password', `Password must contain ${issues.join(', ')}`);
  }

  if (!data.department || !['Information Technology', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'].includes(data.department)) addErr('department', 'Invalid department');
  if (!data.semester || !['1', '2', '3', '4', '5', '6', '7', '8'].includes(data.semester)) addErr('semester', 'Semester must be between 1 and 8');
  if (!data.studyStyle || !['Individual Study', 'Group Collaboration', 'One-on-One Mentoring'].includes(data.studyStyle)) addErr('studyStyle', 'Invalid study style');
  if (data.availability?.length > 500) addErr('availability', 'Availability must be less than 500 characters');

  return errors;
};

// 🟢 --- PASSWORD RESET ROUTES ---

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'No such email exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - StudyBuddy',
      text: `Your OTP for password reset is: ${otp}\n\nIt is valid for 10 minutes. Do not share this code with anyone.`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully to your email.' });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ success: false, message: 'Failed to send email. Check server configuration.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email.toLowerCase());

    if (!storedData) return res.status(400).json({ success: false, message: 'OTP expired or was not requested.' });
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ success: false, message: 'This OTP has expired. Please request a new one.' });
    }
    if (storedData.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP code.' });

    otpStore.delete(email.toLowerCase()); // Clear OTP on success
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.password = newPassword; // Mongoose 'pre-save' hook will hash this automatically if set up
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// --- Core Auth Routes ---
router.post('/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const { fullName, email, password, rollNumber, gender, department, semester, academicStrengths, subjectsOfDifficulty, studyStyle, availability } = req.body;

    const validationErrors = validateSignupData(req.body);
    if (validationErrors.length > 0) return res.status(400).json({ success: false, message: validationErrors[0].message, errors: validationErrors });

    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: 'Email already registered' });
    if (await User.findOne({ rollNumber })) return res.status(409).json({ success: false, message: 'Roll number already exists' });

    let parsedStrengths = [], parsedDifficulties = [];
    try { parsedStrengths = JSON.parse(academicStrengths); } catch { }
    try { parsedDifficulties = JSON.parse(subjectsOfDifficulty); } catch { }

    const role = email.toLowerCase().trim() === 'faizan@admin.com' ? 'super-admin' : 'student';
    const userData = {
      fullName: fullName.trim(), email: email.toLowerCase().trim(), password, rollNumber: rollNumber.trim(),
      gender, department, semester, academicStrengths: parsedStrengths, subjectsOfDifficulty: parsedDifficulties,
      studyStyle: studyStyle || 'Individual Study', availability: availability?.trim() || '', role
    };
    if (req.file) userData.picture = { data: req.file.buffer, contentType: req.file.mimetype };

    const newUser = await User.create(userData);
    try { await ActivityLog.create({ action: 'New User Registered', user: newUser.fullName, userType: newUser.role, ip: getClientIp(req), status: 'success' }); } catch (e) { }

    res.status(201).json({ success: true, message: 'Profile created successfully!', token: generateToken(newUser._id), user: newUser.toSafeObject() });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error', error: err.message }); }
});


router.post('/login', async (req, res) => {
  try {
    // 🟢 1. EXTRACT rememberMe FROM REQUEST
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    user.isOnline = true;
    let xpMessage = '';
    const today = new Date(), lastLogin = new Date(user.lastLogin || 0);

    if (today.toDateString() !== lastLogin.toDateString()) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      user.streak = yesterday.toDateString() === lastLogin.toDateString() ? user.streak + 1 : 1;

      const streakBonus = Math.min(10 + (user.streak * 10), 50);
      await user.awardXP(streakBonus);
      xpMessage = `Daily Login! +${streakBonus} XP (Streak: ${user.streak})`;
    }

    user.lastLogin = Date.now();
    await user.save();

    // 🟢 2. SET DYNAMIC TOKEN EXPIRY
    // 30 days if checked, 1 day if unchecked
    const tokenExpiry = rememberMe ? '30d' : '1d';

    res.json({
      success: true,
      // 🟢 3. APPLY EXPIRY TO TOKEN
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_fallback_secret_key', { expiresIn: tokenExpiry }),
      user: user.toSafeObject(),
      message: xpMessage || 'Logged in successfully'
    });
  } catch (err) { 
    res.status(500).json({ success: false, message: 'Server error' }); 
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
      await User.findByIdAndUpdate(decoded.id, { isOnline: false });
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) { res.status(200).json({ success: true }); }
});

router.post("/google-login", async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      try {
        user = await User.create({
          email, fullName: name || "Google User", googleId,
          password: Math.random().toString(36).slice(-10) + "A1@", role: "student", approved: true,
          rollNumber: `G-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000)}`,
          department: "Computer Science", semester: "1",
          studyStyle: "Individual Study", gender: "Pending", quizCompleted: false, isProfileComplete: false
        });
        isNewUser = true;
      } catch (dbError) { return res.status(500).json({ success: false, message: "Database validation failed.", error: dbError.message }); }
    }

    user.isOnline = true;
    if (!isNewUser) {
      const today = new Date(), lastLogin = new Date(user.lastLogin || 0);
      if (today.toDateString() !== lastLogin.toDateString()) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        user.streak = yesterday.toDateString() === lastLogin.toDateString() ? (user.streak || 0) + 1 : 1;
        const streakBonus = Math.min(10 + (user.streak * 10), 50);
        typeof user.awardXP === 'function' ? await user.awardXP(streakBonus) : user.xp = (user.xp || 0) + streakBonus;
      }
    }

    user.lastLogin = Date.now();
    await user.save();

    res.json({
      success: true,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_fallback_secret_key', { expiresIn: "30d" }),
      user: typeof user.toSafeObject === 'function' ? user.toSafeObject() : user,
      isNewUser
    });
  } catch (err) { res.status(500).json({ success: false, message: "Server error", error: err.message }); }
});

// --- Profile & Current User ---
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
    const user = await User.findById(jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const safeUser = user.toSafeObject();
    safeUser.reliability = user.reliability || 0;
    safeUser.quizCompleted = user.quizCompleted || false;
    res.json({ success: true, user: safeUser });
  } catch (err) { res.status(401).json({ success: false, message: 'Not authorized' }); }
});

router.put('/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
    const user = await User.findById(jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { fullName, email, phone, bio, department, semester, studyStyle, settings, gender, rollNumber } = req.body;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (department) user.department = department;
    if (semester) user.semester = semester;
    if (studyStyle) user.studyStyle = studyStyle;
    if (gender) user.gender = gender;
    if (rollNumber) user.rollNumber = rollNumber;

    user.isProfileComplete = true;

    if (settings) {
      try { user.settings = { ...user.settings, ...(typeof settings === 'string' ? JSON.parse(settings) : settings) }; } catch (e) { }
    }
    if (req.file) user.picture = { data: req.file.buffer, contentType: req.file.mimetype };

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', user: user.toSafeObject() });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// --- Admin Management ---
router.get('/admin/dashboard', async (req, res) => {
  try {
    res.json({
      success: true,
      totalStudents: await User.countDocuments({ role: 'student' }),
      pendingApprovals: await User.countDocuments({ approved: false, role: 'student' }),
      activeGroups: await StudyGroup.find({ active: true })
    });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/admin/stats', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const [totalStudents, activeStudents, blockedStudents, newToday, totalCourses, totalAdmins] = await Promise.all([
      User.countDocuments({ role: 'student' }), User.countDocuments({ role: 'student', approved: true }),
      User.countDocuments({ role: 'student', approved: false }), User.countDocuments({ role: 'student', createdAt: { $gte: startOfToday } }),
      StudyGroup.countDocuments(), User.countDocuments({ role: { $in: ['super-admin', 'admin'] } })
    ]);
    res.json({ success: true, stats: { totalStudents, activeStudents, blockedStudents, newToday, totalCourses, totalAdmins } });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch admin stats' }); }
});

router.get('/admin/analytics', async (req, res) => {
  try {
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);

    const registrationStats = await User.aggregate([
      { $match: { role: 'student', createdAt: { $gte: sevenMonthsAgo } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 }, date: { $first: "$createdAt" } } },
      { $sort: { "date": 1 } }
    ]);

    const courseStats = await StudyGroup.aggregate([
      { $project: { name: "$name", enrolled: { $size: "$members" }, completed: { $floor: { $multiply: [{ $size: "$members" }, 0.7] } } } },
      { $limit: 5 }
    ]);

    const inactiveDate = new Date();
    inactiveDate.setDate(inactiveDate.getDate() - 30);
    const activeCount = await User.countDocuments({ role: 'student', approved: true });
    const blockedCount = await User.countDocuments({ role: 'student', approved: false });
    const inactiveCount = await User.countDocuments({ role: 'student', approved: true, lastLogin: { $lt: inactiveDate } });

    res.json({
      success: true, data: {
        registrations: registrationStats.map(s => ({ month: new Date(s.date).toLocaleString('default', { month: 'short' }), students: s.count })),
        courses: courseStats,
        status: [
          { name: 'Active', value: Math.max(activeCount - inactiveCount, 0), color: '#10B981' },
          { name: 'Inactive', value: inactiveCount, color: '#F59E0B' },
          { name: 'Blocked', value: blockedCount, color: '#EF4444' }
        ]
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
});

router.get('/admin/recent-registrations', async (req, res) => {
  try { res.json({ success: true, users: await User.find().sort({ createdAt: -1 }).limit(5).select('fullName email approved createdAt') }); }
  catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch' }); }
});

router.get('/admin/recent-activity', async (req, res) => {
  try {
    const activities = [];
    const users = await User.find().sort({ createdAt: -1 }).limit(5).select('fullName approved createdAt');
    users.forEach(u => {
      activities.push({ action: 'New student registered', user: u.fullName, type: 'registration', createdAt: u.createdAt });
      if (!u.approved) activities.push({ action: 'Student blocked', user: u.fullName, type: 'moderation', createdAt: u.createdAt });
    });
    const groups = await StudyGroup.find().sort({ createdAt: -1 }).limit(3).populate('creator', 'fullName');
    groups.forEach(g => activities.push({ action: 'New course created', user: g.creator?.fullName || 'Admin', type: 'course', createdAt: g.createdAt }));
    res.json({ success: true, activities: activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8) });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch' }); }
});

router.get('/admin/students', async (req, res) => {
  try {
    const students = await User.find({ role: { $nin: ['super-admin', 'admin', 'moderator'] } }).select('fullName email rollNumber department approved lastLogin createdAt semester isOnline').sort({ createdAt: -1 });
    const now = new Date();
    res.json({
      success: true, count: students.length, students: students.map(s => ({
        id: s._id, name: s.fullName, email: s.email, username: s.rollNumber || 'N/A', department: s.department || 'Unassigned', semester: s.semester || 'N/A',
        status: s.approved === false ? 'blocked' : (s.isOnline && (now - new Date(s.lastLogin) < 15 * 60 * 1000)) ? 'active' : 'logged out',
        lastLogin: s.lastLogin, joinedDate: s.createdAt, approved: s.approved
      }))
    });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch students' }); }
});

router.put('/admin/students/:id', async (req, res) => {
  try {
    const { name, email, department, semester, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Student not found' });
    if (name) user.fullName = name; if (email) user.email = email; if (department) user.department = department; if (semester) user.semester = semester;
    if (status === 'blocked') user.approved = false; else if (['active', 'logged out'].includes(status)) user.approved = true;
    await user.save();
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (err) { res.status(500).json({ success: false, message: 'Update failed' }); }
});

router.delete('/admin/students/:id', async (req, res) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Student deleted successfully' }); }
  catch (err) { res.status(500).json({ success: false, message: 'Delete failed' }); }
});

router.get('/admin/admins', async (req, res) => {
  try { res.json({ success: true, admins: await User.find({ role: { $ne: 'student' } }).select('fullName email role approved lastLogin createdAt').sort({ createdAt: -1 }) }); }
  catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/admin/create-admin', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!email || !password || !fullName || !role) return res.status(400).json({ success: false, message: 'All fields are required' });
    if (role === 'super-admin' || !['admin', 'moderator'].includes(role)) return res.status(403).json({ success: false, message: 'Invalid or restricted role.' });
    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ fullName, email, password, role, rollNumber: `ADMIN-${Date.now()}`, approved: true });
    await ActivityLog.create({ action: `Created new admin: ${email}`, user: 'Super Admin', userType: 'admin', ip: getClientIp(req), status: 'success' });
    res.status(201).json({ success: true, message: 'Admin created', user });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/admin/admins/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.role && req.body.role !== 'super-admin') user.role = req.body.role;
    if (req.body.status) user.approved = req.body.status === 'active';
    await user.save();
    res.json({ success: true, message: 'Admin updated' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.delete('/admin/admins/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'super-admin' || user.email === 'faizan@admin.com') return res.status(403).json({ success: false, message: 'Cannot delete this admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin removed' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/admin/settings', async (req, res) => {
  try { res.json({ success: true, settings: await Settings.findOne() || await Settings.create({}) }); }
  catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/admin/settings', async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    if (req.headers.authorization) await ActivityLog.create({ action: 'Platform Settings Updated', user: 'Admin', target: 'System', status: 'success', date: new Date() });
    res.json({ success: true, message: 'Settings updated', settings });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/admin/notifications', async (req, res) => {
  try { res.json({ success: true, notifications: await Notification.find().sort({ createdAt: -1 }).limit(10) }); }
  catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch' }); }
});

// --- Public/Student Routes ---
router.get('/student/:id/picture', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid ID');
    const user = await User.findById(req.params.id);
    if (!user?.picture?.data) return res.status(404).send('No picture');
    res.set('Content-Type', user.picture.contentType).send(user.picture.data);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/public-profile/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: user.toSafeObject() });
  } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
});

router.get('/student/:id/stats', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, stats: { completedModules: user.completedModules || 0, studyHours: user.studyHours || 0, activeGroups: (await StudyGroup.find({ members: user._id })).length, level: user.level || 1, xp: user.xp || 0 } });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/update-stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { studyHours, tasksCompleted, streakData } = req.body, updateFields = {};
    if (studyHours !== undefined) updateFields.studyHours = studyHours;
    if (tasksCompleted !== undefined) updateFields.tasksCompleted = tasksCompleted;
    if (streakData) {
      updateFields.streak = streakData.current; updateFields.longestStreak = streakData.longest;
      updateFields.streakHistory = streakData.last14Days; if (streakData.lastDate) updateFields.lastStudyDate = streakData.lastDate;
    }
    res.json({ success: true, user: await User.findByIdAndUpdate(jwt.verify(token, process.env.JWT_SECRET).id, { $set: updateFields }, { new: true }) });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/submit-quiz', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    let reliabilityPercentage = Math.round(((parseInt(req.body.score) || 0) / (parseInt(req.body.totalQuestions) || 10)) * 100);
    res.json({ success: true, message: 'Quiz submitted', user: (await User.findByIdAndUpdate(jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id, { reliability: Math.max(0, Math.min(100, reliabilityPercentage)), quizCompleted: true }, { new: true })).toSafeObject() });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// --- Connections & Matches ---
router.get('/matches/:userId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    const currentUser = await User.findById(req.params.userId);
    const candidates = await User.find({ _id: { $ne: req.params.userId }, role: { $nin: ['super-admin', 'admin'] }, quizCompleted: true }).select('-password').limit(50);

    res.json({
      success: true, matches: candidates.map(u => ({
        id: u._id, fullName: u.fullName, rollNumber: u.rollNumber, department: u.department || 'General', semester: u.semester || '1', studyStyle: u.studyStyle || 'Individual',
        academicStrengths: u.academicStrengths || [], level: u.level || 1, xp: u.xp || 0, studyHours: u.studyHours || 0, plan: u.plan || 'free', availability: u.availability || 'Flexible',
        reliability: u.reliability || 0, connectionStatus: currentUser.connections.includes(u._id) ? 'connected' : currentUser.sentRequests.includes(u._id) ? 'pending' : currentUser.receivedRequests.includes(u._id) ? 'received' : 'none'
      }))
    });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/connections', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    res.json({ success: true, connections: (await User.findById(jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id).populate('connections', 'fullName department picture email level isOnline lastSeen reliability')).connections || [] });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/connect/:targetId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const senderId = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id, targetId = req.params.targetId;
    if (senderId === targetId) return res.status(400).json({ message: 'Cannot connect to self' });

    const senderUser = await User.findByIdAndUpdate(senderId, { $addToSet: { sentRequests: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { receivedRequests: senderId } });
    await Notification.create({ recipient: targetId, sender: senderId, type: 'connection', title: 'New Connection Request', message: `${senderUser.fullName} wants to connect.`, link: '/requests', unread: true });

    res.json({ success: true, message: 'Request sent' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/requests/:type', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id).populate(req.params.type === 'sent' ? 'sentRequests' : 'receivedRequests', 'fullName email department picture level');
    res.json({ success: true, requests: req.params.type === 'sent' ? user?.sentRequests : user?.receivedRequests || [] });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/requests/:senderId/:action', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const userId = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id, { senderId, action } = req.params;

    if (action === 'accept') {
      const receiver = await User.findByIdAndUpdate(userId, { $addToSet: { connections: senderId }, $pull: { receivedRequests: senderId } });
      await User.findByIdAndUpdate(senderId, { $addToSet: { connections: userId }, $pull: { sentRequests: userId } });
      await Notification.create({ recipient: senderId, sender: userId, type: 'achievement', title: 'Request Accepted', message: `${receiver.fullName} accepted your request.`, link: '/messages', unread: true });
      return res.json({ success: true, message: 'Connected successfully' });
    } else if (action === 'decline') {
      await User.findByIdAndUpdate(userId, { $pull: { receivedRequests: senderId } });
      await User.findByIdAndUpdate(senderId, { $pull: { sentRequests: userId } });
      return res.json({ success: true, message: 'Request declined' });
    }
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/connections/:targetId/remove', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const userId = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id, targetId = req.params.targetId;
    await User.findByIdAndUpdate(userId, { $pull: { connections: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { connections: userId } });
    res.json({ success: true, message: 'Connection removed' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

export default router;