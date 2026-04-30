import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: String },
  lastMessageAt: { type: Date, default: Date.now },
  unreadCount: { type: Map, of: Number, default: {} },
  deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  clearedAt: { type: Map, of: Date, default: {} },
  
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);  