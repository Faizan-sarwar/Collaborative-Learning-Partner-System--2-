import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional (e.g., system messages don't have a sender)
  type: { type: String, enum: ['connection', 'study', 'achievement', 'message', 'reminder'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String }, // Optional link to redirect to
  unread: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);