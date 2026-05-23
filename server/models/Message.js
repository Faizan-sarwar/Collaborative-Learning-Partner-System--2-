import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // 🟢 Made optional: A message might just be a Voice Note or Image
  text: { type: String, default: '' },

  isRead: { type: Boolean, default: false },
  readAt: { type: Date },

  // 🟢 NEW: Enterprise Chat Features
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null }, // ID of the message being replied to
  isEdited: { type: Boolean, default: false }, // True if the user modified the text
  deletedForEveryone: { type: Boolean, default: false }, // True if unsent within the 15-min window
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // If a user deletes it just for themselves

  // 🟢 NEW: Media & Voice Notes
  fileUrl: { type: String, default: null }, // URL to the uploaded file
  fileType: { type: String, enum: ['image', 'video', 'audio', 'document', null], default: null },
  fileSize: { type: Number, default: null },
  fileName: { type: String, default: null }

}, { timestamps: true });

export default mongoose.model('Message', messageSchema);