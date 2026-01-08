const mongoose = require('mongoose');

const StudyRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String } 
  },
  maxOccupancy: { type: Number, default: 5 },
  
  // Who is currently inside?
  participants: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    avatar: String
  }],

  // Who is knocking on the door? (Point 3)
  pendingRequests: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    requestedAt: { type: Date, default: Date.now }
  }],

  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('StudyRoom', StudyRoomSchema);