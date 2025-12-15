import express from 'express';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// 🔹 GET LATEST 5 LOGS (For Notifications)
router.get('/latest', async (req, res) => {
  try {
    const logs = await ActivityLog
      .find()
      .sort({ createdAt: -1 })
      .limit(5); // Only fetch the last 5 for the dropdown

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// GET all activity logs (Existing)
router.get('/', async (req, res) => {
  try {
    const logs = await ActivityLog
      .find()
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

export default router;