import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: String },
  
  userType: { 
    type: String, 
    enum: ['student', 'admin', 'super-admin', 'system', 'visitor'], 
    default: 'visitor' 
  },
  
  ip: { type: String },
  status: { 
    type: String, 
    enum: ['success', 'failed'], 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);