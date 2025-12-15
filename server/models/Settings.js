import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  platformName: { type: String, default: 'StudyPal' },
  logoUrl: { type: String, default: '' },
  supportEmail: { type: String, default: '' },
  allowRegistrations: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  sessionTimeout: { type: Number, default: 60 }, // minutes
  emailNotifications: { type: Boolean, default: true },
  welcomeEmail: { type: Boolean, default: true },
  adminAlerts: { type: Boolean, default: true },
  autoBackup: { type: String, default: 'weekly' }, // daily, weekly, monthly
  dataRetention: { type: Number, default: 30 } // days
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);