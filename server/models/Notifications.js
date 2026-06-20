import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional (e.g., system messages don't have a sender)
  type: { 
    type: String, 
    // UPDATED: Combined your existing types with all the new Admin/System types
    enum: [
        'connection', 
        'study', 
        'achievement', 
        'message', 
        'reminder',
        'system',
        'announcement',
        'welcome',
        'registration',
        'course',
        'moderation',
        'admin'
    ], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  icon: { type: String }, //  Added this so your Admin panel icons save to the database!
  link: { type: String }, // Optional link to redirect to
  unread: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);