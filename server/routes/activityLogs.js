import express from 'express';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// GET all activity logs
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
