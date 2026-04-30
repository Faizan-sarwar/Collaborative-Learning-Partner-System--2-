import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; //  1. IMPORT DOTENV


dotenv.config(); //  2. RUN IT IMMEDIATELY so the credentials load

import User from '../models/User.js';
import StudyGroup from '../models/StudyGroup.js';
import ActivityLog from '../models/ActivityLog.js';
import Settings from '../models/Settings.js';
import Notification from '../models/Notifications.js';

const router = express.Router();

const otpStore = new Map();

//  3. ADD A CHECK to warn you if credentials are still missing
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
  limits: { fileSize: 50 * 1024 * 1024 }, // 🟢 BUMPED TO 10MB FOR MOBILE PHOTOS
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

//  --- PASSWORD RESET ROUTES ---

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
    // 🟢 SECURITY CHECK: Are registrations allowed?
    const settings = await Settings.findOne();
    if (settings && settings.allowRegistrations === false) {
      // If an admin turned off registrations, block the request at the database level!
      try {
        await ActivityLog.create({
          action: 'Blocked Registration Attempt',
          user: req.body.email || 'Unknown',
          userType: 'system',
          ip: getClientIp(req),
          status: 'failed'
        });
      } catch (e) { }

      return res.status(403).json({
        success: false,
        message: 'New user registrations are currently disabled by the administrator.'
      });
    }

    // 🟢 Notice we grab `referredByCode` from the frontend request body here
    const { fullName, email, password, rollNumber, gender, department, semester, academicStrengths, subjectsOfDifficulty, studyStyle, availability, referredByCode } = req.body;

    const validationErrors = validateSignupData(req.body);
    if (validationErrors.length > 0) return res.status(400).json({ success: false, message: validationErrors[0].message, errors: validationErrors });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: 'Email already registered' });
    if (await User.findOne({ rollNumber })) return res.status(409).json({ success: false, message: 'Roll number already exists' });

    let parsedStrengths = [], parsedDifficulties = [];
    try { parsedStrengths = JSON.parse(academicStrengths); } catch { }
    try { parsedDifficulties = JSON.parse(subjectsOfDifficulty); } catch { }

    // 🟢 Generate a unique referral code for this new user
    const generatedReferralCode = 'STUDY' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const role = email.toLowerCase().trim() === 'faizan@admin.com' ? 'super-admin' : 'student';
    const userData = {
      fullName: fullName.trim(), email: email.toLowerCase().trim(), password, rollNumber: rollNumber.trim(),
      gender, department, semester, academicStrengths: parsedStrengths, subjectsOfDifficulty: parsedDifficulties,
      studyStyle: studyStyle || 'Individual Study', availability: availability?.trim() || '', role,
      xp: 10,
      referralCode: generatedReferralCode // 🟢 Assign their new code
    };
    if (req.file) userData.picture = { data: req.file.buffer, contentType: req.file.mimetype };

    const newUser = await User.create(userData);

    // 🟢 --- START REFERRAL MAGIC ---
    if (referredByCode) {
      const referrer = await User.findOne({ referralCode: referredByCode });

      if (referrer) {
        newUser.referredBy = referrer._id;
        await newUser.save();
        await referrer.awardXP(100);

        if (mongoose.models.Referral) {
          await mongoose.model('Referral').findOneAndUpdate(
            { referrer: referrer._id, email: newUser.email },
            { status: 'joined', reward: 100 },
            { upsert: true }
          );
        }

        await Notification.create({
          recipient: referrer._id,
          type: 'achievement',
          title: 'Successful Referral! 🎉',
          message: `${newUser.fullName} joined using your link! You earned 100 XP.`,
          unread: true
        });
      }
    }
    // 🟢 --- END REFERRAL MAGIC ---

    try {
      await ActivityLog.create({ action: 'New User Registered', user: newUser.fullName, userType: newUser.role, ip: getClientIp(req), status: 'success' });

      await Notification.create({
        type: 'registration',
        title: 'New Student Registration',
        message: `${newUser.fullName} has joined the platform.`,
        link: '/admin/students',
        unread: true
      });
    } catch (e) { console.error("Logging failed", e); }

    res.status(201).json({ success: true, message: 'Profile created successfully!', token: generateToken(newUser._id), user: newUser.toSafeObject() });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error', error: err.message }); }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email }).select('+password');

    // 🟢 1. Password Check (Failed Login)
    if (!user || !(await user.matchPassword(password))) {
      try {
        await ActivityLog.create({
          action: 'Failed Login Attempt',
          user: user ? user.fullName : email,
          userType: user ? user.role : 'visitor',
          ip: getClientIp(req),
          status: 'failed'
        });
      } catch (logErr) { console.error('Logging failed:', logErr); }

      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 🟢 2. MAINTENANCE MODE FIX
    const settings = await Settings.findOne();
    if (settings && settings.maintenanceMode) {
      if (user.role !== 'admin' && user.role !== 'super-admin') {
        return res.status(503).json({
          success: false,
          message: 'The platform is currently under maintenance. Only administrators can log in right now.'
        });
      }
    }

    // 🟢 3. Successful login log
    try {
      await ActivityLog.create({
        action: 'Successful Login',
        user: user.fullName,
        userType: user.role,
        ip: getClientIp(req),
        status: 'success'
      });
    } catch (logErr) { console.error('Logging failed:', logErr); }

    user.isOnline = true;
    let xpMessage = '';
    const today = new Date(), lastLogin = new Date(user.lastLogin || 0);

    if (today.toDateString() !== lastLogin.toDateString()) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      user.streak = yesterday.toDateString() === lastLogin.toDateString() ? (user.streak || 0) + 1 : 1;

      const streakBonus = Math.min(10 + (user.streak * 10), 50);
      if (typeof user.awardXP === 'function') {
        await user.awardXP(streakBonus);
      } else {
        user.xp = (user.xp || 0) + streakBonus;
      }
      xpMessage = `Daily Login! +${streakBonus} XP (Streak: ${user.streak})`;

      // 🟢 BUMP RELIABILITY FOR 7-DAY STREAKS
      if (user.streak > 0 && user.streak % 7 === 0) {
        if (typeof user.adjustReliability === 'function') {
          await user.adjustReliability(2); // +2% every 7 days!
          xpMessage += ` 🎉 7-Day Streak Bonus: +2% Trust Score!`;
        }
      }
    }

    user.lastLogin = Date.now();
    await user.save();

    const tokenExpiry = rememberMe ? '30d' : '1d';
    res.json({
      success: true,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_fallback_secret_key', { expiresIn: tokenExpiry }),
      user: typeof user.toSafeObject === 'function' ? user.toSafeObject() : user,
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
// --- Profile & Current User ---
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const user = await User.findById(jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // 🟢 THE FIX: Auto-generate a referral code for older users who don't have one yet
    if (!user.referralCode) {
      user.referralCode = 'STUDY' + Math.random().toString(36).substring(2, 8).toUpperCase();
      await user.save(); // Save it to the database permanently
    }

    const safeUser = user.toSafeObject();
    safeUser.reliability = user.reliability || 0;
    safeUser.quizCompleted = user.quizCompleted || false;
    // Always include settings so the frontend can read showAvatar preference
    safeUser.settings = user.settings
      ? (typeof user.settings.toObject === 'function' ? user.settings.toObject() : user.settings)
      : {};

    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
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

    // 🟢 MONGOOSE CRASH FIX: Extract the RAW object first so we don't destroy nested data!
    let currentSettings = {};
    if (user.settings) {
      currentSettings = typeof user.settings.toObject === 'function' ? user.settings.toObject() : user.settings;
    }

    // Safely merge incoming settings
    if (settings) {
      try {
        const parsedSettings = typeof settings === 'string' ? JSON.parse(settings) : settings;
        currentSettings = { ...currentSettings, ...parsedSettings };
      } catch (e) {
        console.error("Error parsing settings:", e);
      }
    }

    // Process profile picture
    if (req.file) {
      user.picture = { data: req.file.buffer, contentType: req.file.mimetype };
      // Only auto-switch to Photo Mode if user hasn't explicitly set a preference yet
      if (typeof currentSettings.showAvatar === 'undefined') {
        currentSettings.showAvatar = false;
      }
    }

    // Apply the safely merged object back to Mongoose
    user.settings = currentSettings;
    user.markModified('settings');

    await user.save();

    const safeUser = typeof user.toSafeObject === 'function' ? user.toSafeObject() : user;

    res.json({ success: true, message: 'Profile updated successfully', user: safeUser });

  } catch (err) {
    console.error("🔥 PROFILE UPDATE CRASH:", err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error - check backend terminal'
    });
  }
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

    // NEW: Count occurrences of each subject inside students' academicStrengths arrays
    const courseStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $unwind: { path: "$academicStrengths", preserveNullAndEmptyArrays: false } },
      { $group: { _id: "$academicStrengths", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } }, // Sort by most popular first
      { $limit: 6 } // Top 6 subjects
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
  try { res.json({ success: true, users: await User.find().sort({ createdAt: -1 }).limit(5).select('fullName email approved createdAt isOnline lastLogin') }); }
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

    if (req.headers.authorization) {
      // 🟢 NEW: Added userType and IP address to the log
      await ActivityLog.create({
        action: 'Platform Settings Updated',
        user: 'Admin',
        userType: 'admin', // <-- This fixes the "Visitor" bug
        ip: getClientIp(req),
        status: 'success'
      });
    }

    res.json({ success: true, message: 'Settings updated', settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/admin/notifications', async (req, res) => {
  try {
    res.json({
      success: true,
      // 🟢 Ensure Admin strictly ONLY pulls System, Admin, and Registration notifications
      notifications: await Notification.find({ type: { $in: ['system', 'registration', 'admin'] } })
        .sort({ createdAt: -1 })
        .limit(20)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
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

    const userId = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id;

    const score = parseInt(req.body.score) || 0;

    // 🟢 NEW PROFESSIONAL ALGORITHM
    const baseScore = 40;
    const earnedScore = Math.round(score * 5.8);
    const finalReliability = Math.min(baseScore + earnedScore, 98); // Max 98% initially

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        reliability: finalReliability,
        quizCompleted: true
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Quiz submitted',
      user: updatedUser.toSafeObject()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🟢 ENTERPRISE MATCHMAKING ROUTE (Add this to server/routes/auth.js)
router.get('/matches/:userId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    if (!currentUser) return res.status(404).json({ success: false, message: 'User not found' });

    // 1. Normalize subjects to ignore case/spacing typos (e.g., "Web Develpoment" vs "web development")
    const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const myDifficulties = (currentUser.subjectsOfDifficulty || []).map(normalize);

    // 2. Fetch all other students
    const candidates = await User.find({
      _id: { $ne: currentUser._id },
      role: 'student'
    });

    const connections = (currentUser.connections || []).map(id => id.toString());
    const sentReqs = (currentUser.sentRequests || []).map(id => id.toString());
    const receivedReqs = (currentUser.receivedRequests || []).map(id => id.toString());

    // 3. Score every candidate
    const matches = candidates.map(u => {
      const theirStrengthsRaw = u.academicStrengths || [];
      const theirStrengthsNorm = theirStrengthsRaw.map(normalize);

      let matchCount = 0;
      let matchedSubjects = [];

      // Check for exact intersections
      theirStrengthsRaw.forEach((strength, index) => {
        if (myDifficulties.includes(theirStrengthsNorm[index])) {
          matchCount++;
          matchedSubjects.push(strength); // Keep original casing for the UI
        }
      });

      const isExpertMatch = matchCount > 0;

      // 🟢 THE MATH:
      // If they possess a skill you need: Base 75% + 10% per match + Reliability bonus
      // If they DO NOT possess a skill you need: Max 50% match
      let matchAccuracy = 0;
      if (isExpertMatch) {
        matchAccuracy = 75 + (matchCount * 10) + ((u.reliability || 0) * 0.1);
        matchAccuracy = Math.min(99, Math.round(matchAccuracy)); // Cap at 99%
      } else {
        matchAccuracy = Math.round((u.reliability || 0) * 0.5); // Cap at 50%
      }

      // matchScore is used purely for sorting so experts ALWAYS float to the top
      const matchScore = isExpertMatch ? 1000 + matchAccuracy : matchAccuracy;

      let connectionStatus = 'none';
      const targetId = u._id.toString();
      if (connections.includes(targetId)) connectionStatus = 'connected';
      else if (sentReqs.includes(targetId)) connectionStatus = 'pending';
      else if (receivedReqs.includes(targetId)) connectionStatus = 'received';

      return {
        id: u._id,
        fullName: u.fullName,
        rollNumber: u.rollNumber,
        department: u.department,
        semester: u.semester,
        academicStrengths: u.academicStrengths,
        reliability: u.reliability || 0,
        level: u.level || 1,
        studyHours: u.studyHours || 0,
        xp: u.xp || 0,
        plan: u.plan || 'free',
        gender: u.gender,
        settings: u.settings, // Required for Avatar toggling!
        isExpertMatch,       // Tells UI whether to show the Gold Ribbon
        matchedSubjects,     // Tells UI which specific tags to highlight green
        matchAccuracy,       // The actual percentage (e.g., 94%)
        matchScore,          // Hidden score for strict sorting
        connectionStatus
      };
    });

    // 4. Sort strictly by highest score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, matches });
  } catch (error) {
    console.error("Matchmaking Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
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
      // 🟢 Add $inc: { xp: 75 } to instantly award the points to both users
      const receiver = await User.findByIdAndUpdate(userId, { $addToSet: { connections: senderId }, $pull: { receivedRequests: senderId }, $inc: { xp: 75 } });
      const sender = await User.findByIdAndUpdate(senderId, { $addToSet: { connections: userId }, $pull: { sentRequests: userId }, $inc: { xp: 75 } });

      await Notification.create({ recipient: senderId, sender: userId, type: 'achievement', title: 'Request Accepted', message: `${receiver.fullName} accepted your request! +75 XP`, link: '/messages', unread: true });
      await Notification.create({ recipient: userId, sender: senderId, type: 'achievement', title: 'New Connection', message: `You are now connected with ${sender.fullName}. +75 XP`, link: '/messages', unread: true });

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
// 🟢 1. Define Milestones Securely on the Server
const MILESTONES = [
  { level: 1, xp: 0, hours: 0, name: 'Newcomer' },
  { level: 2, xp: 200, hours: 5, name: 'Novice Learner' },
  { level: 3, xp: 500, hours: 15, name: 'Dedicated Student' },
  { level: 4, xp: 1000, hours: 30, name: 'Rising Scholar' },
  { level: 5, xp: 2000, hours: 60, name: 'Expert Learner' },
  { level: 6, xp: 4000, hours: 100, name: 'Knowledge Master' },
  { level: 7, xp: 8000, hours: 200, name: 'Legendary Scholar' },
];

// 🟢 2. The Universal XP Route
router.post('/award-xp', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const userId = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key').id;

    const { amount, activityTitle } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Add the XP
    user.xp = (user.xp || 0) + Number(amount);

    // 2. Check Milestones for Level Up
    // It finds the highest level where the user meets BOTH the XP and Study Hours requirements
    const qualifiedLevelObj = [...MILESTONES].reverse().find(m => user.xp >= m.xp && (user.studyHours || 0) >= m.hours);
    const newLevel = qualifiedLevelObj ? qualifiedLevelObj.level : 1;

    let leveledUp = false;

    // 3. Handle Level Up!
    if (newLevel > (user.level || 1)) {
      user.level = newLevel;
      leveledUp = true;

      // Send a massive Level Up Notification
      await Notification.create({
        recipient: user._id,
        type: 'achievement',
        title: 'Level Up! 🚀',
        message: `You reached Level ${newLevel}: ${qualifiedLevelObj.name}`,
        unread: true
      });
    }

    // 4. Send the standard XP Notification
    await Notification.create({
      recipient: user._id,
      type: 'achievement',
      title: 'XP Earned! ⚡',
      message: `+${amount} XP for: ${activityTitle}`,
      unread: true
    });

    await user.save();

    res.json({
      success: true,
      xp: user.xp,
      level: user.level,
      leveledUp,
      user: user.toSafeObject()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🟢 RAPIDAPI CHAT TOPICS GENERATOR
// 🟢 RAPIDAPI CHAT TOPICS GENERATOR
router.post('/ai/chat-topics', async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject) return res.status(400).json({ success: false, message: 'Subject is required' });

    if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
      console.error("❌ CRITICAL ERROR: RAPIDAPI credentials missing in .env file!");
      return res.status(500).json({ success: false, message: "API Credentials missing" });
    }

    const prompt = `You are a study assistant for a university student. They are struggling with the subject "${subject}". 
    Generate 4 highly specific, engaging conversation starters or questions they can use to discuss this subject with a study partner.
    Provide 1 short, actionable tip on how they should approach studying this subject together.
    Also provide a single fitting emoji icon, and a hex color code that fits the vibe of the subject.
    Return ONLY a raw JSON object in this exact format, with no markdown formatting or backticks: 
    { "icon": "emoji", "color": "#hexcode", "topics": ["topic 1", "topic 2", "topic 3", "topic 4"], "tip": "The study tip" }`;

    // 🟢 RAPIDAPI FETCH CALL (Tailored for gemini-pro-ai.p.rapidapi.com)
    const response = await fetch(`https://${process.env.RAPIDAPI_HOST}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      },
      // Formatted exactly like your code snippet!
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "RapidAPI request failed");
    }

    // 🟢 Extract the text from the Gemini-style response
    let responseText = "";
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      responseText = data.candidates[0].content.parts[0].text;
    } else if (data.text) {
      responseText = data.text; // Fallback if the API simplifies the response
    } else {
      responseText = JSON.stringify(data);
    }

    // Clean the text to ensure perfect JSON parsing
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      responseText = responseText.substring(jsonStart, jsonEnd);
    }

    const aiData = JSON.parse(responseText);

    res.json({
      success: true,
      icon: aiData.icon,
      color: aiData.color,
      topics: aiData.topics,
      tip: aiData.tip
    });
  } catch (err) {
    console.error("❌ RapidAPI Generation Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});
// 🟢 ADMIN: BROADCAST NOTIFICATION TO STUDENTS
router.post('/admin/send-notification', async (req, res) => {
  try {
    const { title, message, category, icon, targetType, departments, semesters } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    // 1. Build the database query to find the right students
    let query = { role: 'student' };
    if (targetType === 'selected') {
      if (departments && departments.length > 0) query.department = { $in: departments };
      if (semesters && semesters.length > 0) query.semester = { $in: semesters };
    }

    // 2. Find all matching students
    const students = await User.find(query).select('_id');

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'No students matched your selected filters.' });
    }

    // 3. Create a notification for EVERY matched student!
    const notificationsToInsert = students.map(student => ({
      recipient: student._id,
      type: category || 'system',
      title: title,
      message: message,
      icon: icon || 'bell',
      link: '/dashboard',
      unread: true
    }));

    await Notification.insertMany(notificationsToInsert);

    // 4. Log the action so it appears in your Recent Activity chart
    const targetLabel = targetType === 'all' ? 'All Students' : 'Selected Students';
    await ActivityLog.create({
      action: `Broadcasted "${title}"`,
      user: 'Admin',
      userType: 'admin',
      status: 'success'
    });

    // 5. Send success response back to the frontend
    res.json({
      success: true,
      message: `Successfully sent to ${students.length} student(s)!`,
      newHistoryItem: {
        id: Date.now(),
        title,
        message,
        recipients: targetLabel,
        sentAt: 'Just now',
        type: category,
        icon
      }
    });

  } catch (err) {
    console.error("Broadcast Error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// ==========================================
// 🟢 ENTERPRISE DATA MANAGEMENT ROUTES
// ==========================================

// 1. Export All Data
router.get('/admin/export-data', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Verify admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id);
    if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Gather the entire platform's state
    const exportData = {
      timestamp: new Date().toISOString(),
      platform: "Collaborative Learning Partner System",
      data: {
        users: await User.find().select('-password'), // EXCLUDE PASSWORDS FOR SECURITY!
        groups: await StudyGroup.find(),
        logs: await ActivityLog.find().sort({ createdAt: -1 }).limit(1000), // Cap at 1000 to prevent massive files
        settings: await Settings.findOne()
      }
    };

    // Log the export
    await ActivityLog.create({ action: 'Exported Platform Data', user: user.fullName, userType: 'admin', ip: getClientIp(req), status: 'success' });

    // Send as a downloadable JSON file
    res.setHeader('Content-disposition', `attachment; filename=platform_backup_${Date.now()}.json`);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(JSON.stringify(exportData, null, 2));

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during export' });
  }
});

// 2. Clear Cache
router.post('/admin/clear-cache', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id);
    if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Clear server RAM stores (like OTPs from password resets that might be stuck)
    otpStore.clear();

    await ActivityLog.create({ action: 'Cleared Server Cache', user: user.fullName, userType: 'admin', ip: getClientIp(req), status: 'success' });

    res.json({ success: true, message: 'Server memory and caches cleared successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// 🟢 CONTACT FORM SUBMISSION ROUTE
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    // 1. Get the support email from Admin Settings
    const settings = await Settings.findOne();
    const supportEmail = settings?.supportEmail || process.env.EMAIL_USER;

    // 2. Prepare the Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: supportEmail, // The message goes TO the admin/support team
      replyTo: email,    // So the admin can just click "Reply" to answer the user
      subject: `[Contact Form] ${subject || 'New Inquiry'} from ${name}`,
      text: `You received a new message from your platform contact form:\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #6366f1;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    // 4. Log the activity for the admin to see
    try {
      await ActivityLog.create({
        action: 'Contact Form Submitted',
        user: name,
        userType: 'visitor',
        ip: getClientIp(req),
        status: 'success'
      });
    } catch (e) { }

    res.json({ success: true, message: 'Your message has been sent successfully!' });

  } catch (err) {
    console.error("Contact Form Error:", err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});
// 🟢 DATABASE MIGRATION: Retroactively update Reliability Scores
router.post('/admin/migrate-reliability', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.startsWith('Bearer null')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify Admin safely
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    } catch (jwtErr) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const adminUser = await User.findById(decoded.id);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'super-admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Get all students who have completed the quiz
    const students = await User.find({ role: 'student', quizCompleted: true });
    let updatedCount = 0;

    for (const student of students) {
      const oldReliability = student.reliability || 0;
      const rawScore = Math.round((oldReliability / 100) * 10);

      const baseScore = 40;
      const earnedScore = Math.round(rawScore * 5.8);
      const newReliability = Math.min(baseScore + earnedScore, 98);

      // 🟢 SAFEST METHOD: Using updateOne bypasses Mongoose validation 
      // so old test users don't crash the migration!
      await User.updateOne(
        { _id: student._id },
        { $set: { reliability: newReliability } }
      );
      updatedCount++;
    }

    // Log the system action
    await ActivityLog.create({
      action: `Migrated Reliability Scores for ${updatedCount} users`,
      user: adminUser.fullName,
      userType: adminUser.role, // Dynamically use admin or super-admin
      ip: getClientIp(req),
      status: 'success'
    });

    res.json({ success: true, message: `Successfully updated ${updatedCount} users to the new Reliability Algorithm.` });
  } catch (err) {
    console.error("Migration Error:", err);
    res.status(500).json({ success: false, message: 'Migration failed. Check server console for details.' });
  }
});
// 🟢 POST: Accept a Connection Request
router.post('/requests/:id/accept', async (req, res) => {
  try {
    // 1. Verify who is accepting the request
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret_key');
    const receiverId = decoded.id; // The logged-in user
    const senderId = req.params.id; // The user who sent the request

    // 2. Fetch both users from the database
    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 3. Connect them! Add to connections, remove from pending requests
    if (!receiver.connections.includes(senderId)) receiver.connections.push(senderId);
    if (!sender.connections.includes(receiverId)) sender.connections.push(receiverId);

    receiver.receivedRequests.pull(senderId);
    sender.sentRequests.pull(receiverId);

    // 4. Award XP for networking
    if (typeof receiver.awardXP === 'function') await receiver.awardXP(75);
    else receiver.xp = (receiver.xp || 0) + 75;

    if (typeof sender.awardXP === 'function') await sender.awardXP(75);
    else sender.xp = (sender.xp || 0) + 75;

    // 🟢 5. THE PROFESSIONAL RELIABILITY BUMP! (+0.5% for both)
    if (typeof receiver.adjustReliability === 'function') await receiver.adjustReliability(0.5);
    if (typeof sender.adjustReliability === 'function') await sender.adjustReliability(0.5);

    // 6. Save changes to the database
    await receiver.save();
    await sender.save();

    res.json({ success: true, message: 'Connection accepted successfully!' });
  } catch (err) {
    console.error('Accept Request Error:', err);
    res.status(500).json({ success: false, message: 'Server error while accepting request' });
  }
});

// Add this to server/routes/auth.js
router.put('/track-time', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret_key');

    // The frontend will send minutes. We convert to hours for the DB.
    const minutesToAdd = parseFloat(req.body.minutes) || 0;
    const hoursToAdd = minutesToAdd / 60;

    // 🟢 $inc safely ADDS to the total, preventing multi-tab overwrites!
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $inc: { studyHours: hoursToAdd } },
      { new: true }
    );

    res.json({ success: true, totalHours: updatedUser.studyHours });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
export default router;