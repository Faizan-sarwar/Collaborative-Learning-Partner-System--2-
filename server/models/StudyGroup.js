import mongoose from 'mongoose';

const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    minlength: [2, 'Group name must be at least 2 characters'],
    maxlength: [100, 'Group name must be less than 100 characters']
  },
  subjects: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'Cannot have more than 10 subjects'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  meetingTime: {
    type: String,
    trim: true,
    maxlength: [200, 'Meeting time cannot exceed 200 characters'],
    default: ''
  },
  membership: {
    type: String,
    enum: {
      values: ['open', 'invite'],
      message: 'Membership must be either open or invite'
    },
    default: 'open'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  maxMembers: {
    type: Number,
    default: 10,
    min: [2, 'Group must allow at least 2 members'],
    max: [50, 'Group cannot exceed 50 members']
  }
}, {
  timestamps: true
});

// Virtual for member count
studyGroupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Ensure virtuals are included in JSON
studyGroupSchema.set('toJSON', { virtuals: true });
studyGroupSchema.set('toObject', { virtuals: true });

export default mongoose.model('StudyGroup', studyGroupSchema);
