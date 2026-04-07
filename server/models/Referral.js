import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true, lowercase: true },
  status: { type: String, enum: ['pending', 'joined'], default: 'pending' },
  reward: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Referral', referralSchema);