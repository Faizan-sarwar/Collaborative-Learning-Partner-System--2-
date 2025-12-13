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
  academicStrengths: {
    type: [String],
    default: []
  },
  subjectsOfDifficulty: {
    type: [String],
    default: []
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
  availability: {
    type: String,
    maxlength: [500, 'Availability cannot exceed 500 characters'],
    trim: true,
    default: ''
  },
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  completedModules: {
    type: Number,
    default: 0
  },
  studyHours: {
    type: Number,
    default: 0
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
  approved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get safe user object (without password and picture buffer)
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.picture;
  obj.pictureUrl = `/student/${this._id}/picture`;
  return obj;
};

export default mongoose.model('User', userSchema);
