import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
    match: [/^[A-Za-z0-9-]+$/, 'Roll number can only contain letters, numbers, and hyphens']
  },
  picture: {
    data: Buffer,
    contentType: String
  },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: {
      values: ['Information Technology', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'],
      message: 'Invalid department'
    }
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: {
      values: ['1', '2', '3', '4', '5', '6', '7', '8'],
      message: 'Semester must be between 1 and 8'
    }
  },
  studyStyle: {
    type: String,
    required: [true, 'Study style is required'],
    enum: {
      values: ['Individual Study', 'Group Collaboration', 'One-on-One Mentoring'],
      message: 'Invalid study style'
    },
    default: 'Individual Study'
  },
  academicStrengths: {
    type: [String],
    default: []
  },
  subjectsOfDifficulty: {
    type: [String],
    default: []
  },
  phone: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    default: ''
  },
  availability: {
    type: String,
    maxlength: [500, 'Availability cannot exceed 500 characters'],
    trim: true,
    default: ''
  },

  // --- STATUS & ROLES ---
  isOnline: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now },
  approved: { type: Boolean, default: true },
  role: {
    type: String,
    enum: ['student', 'admin', 'moderator', 'super-admin'],
    default: 'student'
  },
  plan: {
    type: String,
    enum: ['free', 'pro-trial', 'pro'],
    default: 'pro-trial'
  },
  planExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
  },

  // --- SOCIAL & CONNECTIONS ---
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // ADDED FOR BLOCK FEATURE
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // --- ANALYTICS & GAMIFICATION ---
  reliability: { type: Number, default: 0 },
  quizCompleted: { type: Boolean, default: false },
  completedModules: { type: Number, default: 0 },
  studyHours: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastStudyDate: { type: String, default: null },
  streakHistory: { type: [Boolean], default: [] },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  achievements: [{ type: Number }],

  // 🟢 --- REFERRAL SYSTEM ---
  referralCode: { 
    type: String, 
    unique: true, 
    sparse: true // sparse allows existing users without a code to not crash the DB
  },
  referredBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },

  // --- SETTINGS ---
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      studyReminders: { type: Boolean, default: true },
      showAvatar: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      showActivity: { type: Boolean, default: true }
    },
    theme: { type: String, default: 'dark' },
    language: { type: String, default: 'en' }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get safe user object (without password and picture buffer)
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.picture;
  obj.pictureUrl = `/student/${this._id}/picture`;
  return obj;
};

// Centralized XP Logic
userSchema.methods.awardXP = async function (amount) {
  this.xp += amount;

  // Level Thresholds (Must match your Frontend 'levels' array)
  const levels = [
    { level: 1, xp: 0 },
    { level: 2, xp: 200 },
    { level: 3, xp: 500 },
    { level: 4, xp: 1000 },
    { level: 5, xp: 2000 },
    { level: 6, xp: 4000 },
    { level: 7, xp: 8000 }
  ];

  let newLevel = this.level;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (this.xp >= levels[i].xp) {
      newLevel = levels[i].level;
      break;
    }
  }

  if (newLevel > this.level) {
    this.level = newLevel;
  }

  await this.save();
  return { xp: this.xp, level: this.level, added: amount };
};
// Centralized XP Logic
userSchema.methods.awardXP = async function (amount) {
  this.xp += amount;

  // Level Thresholds (Must match your Frontend 'levels' array)
  const levels = [
    { level: 1, xp: 0 },
    { level: 2, xp: 200 },
    { level: 3, xp: 500 },
    { level: 4, xp: 1000 },
    { level: 5, xp: 2000 },
    { level: 6, xp: 4000 },
    { level: 7, xp: 8000 }
  ];

  let newLevel = this.level;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (this.xp >= levels[i].xp) {
      newLevel = levels[i].level;
      break;
    }
  }

  if (newLevel > this.level) {
    this.level = newLevel;
  }

  await this.save();
  return { xp: this.xp, level: this.level, added: amount };
};

// 🟢 PROFESSIONAL RELIABILITY ENGINE
// Call this function anywhere in your backend to safely bump a user's score up or down
userSchema.methods.adjustReliability = async function(amount) {
    // 1. Get current score (default to 40 if they somehow have nothing)
    let currentScore = this.reliability || 40;
    
    // 2. Add or subtract the amount
    currentScore += amount;
    
    // 3. Ensure the score never goes above 100% or below 0%
    this.reliability = Math.max(0, Math.min(100, currentScore));
    
    // 4. Save the user
    await this.save();
    
    return this.reliability;
};

export default mongoose.model('User', userSchema);