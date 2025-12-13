import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: String,
    user: String,
    userType: {
      type: String,
      enum: ['admin', 'student', 'system', 'unknown'],
      default: 'unknown',
    },
    ip: String,
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
