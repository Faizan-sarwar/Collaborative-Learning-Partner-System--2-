const express = require('express');
const router = express.Router();
const StudyRoom = require('../models/StudyRoom');

// 1. GET ALL ROOMS (Point 4: Show to every user)
router.get('/', async (req, res) => {
  try {
    const rooms = await StudyRoom.find({ isActive: true });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE GROUP (Point 1: Host creates group)
router.post('/', async (req, res) => {
  const { name, hostId, hostName, maxOccupancy } = req.body;
  
  const newRoom = new StudyRoom({
    name,
    host: { id: hostId, name: hostName },
    maxOccupancy,
    participants: [{ id: hostId, name: hostName }] // Host is automatically a participant
  });

  await newRoom.save();
  res.json(newRoom);
});

// 3. SEND JOIN REQUEST (The "Knock")
router.post('/:roomId/join', async (req, res) => {
  const { userId, userName } = req.body;
  const room = await StudyRoom.findById(req.params.roomId);

  // Check if room is full
  if (room.participants.length >= room.maxOccupancy) {
    return res.status(400).json({ message: "Room is full" });
  }

  // Add to pending requests
  room.pendingRequests.push({ id: userId, name: userName });
  await room.save();
  
  res.json({ message: "Request sent", status: "pending" });
});

// 4. CHECK STATUS (For polling in StudyRoomWaiting.jsx)
router.get('/:roomId/status/:userId', async (req, res) => {
  const room = await StudyRoom.findById(req.params.roomId);
  const { userId } = req.params;

  const isParticipant = room.participants.some(p => p.id.toString() === userId);
  const isPending = room.pendingRequests.some(p => p.id.toString() === userId);

  if (isParticipant) return res.json({ status: 'approved' });
  if (isPending) return res.json({ status: 'pending' });
  return res.json({ status: 'rejected' });
});

// 5. HOST APPROVE/REJECT (Point 3)
router.post('/:roomId/respond', async (req, res) => {
  const { userId, action } = req.body; // action = 'approve' or 'reject'
  const room = await StudyRoom.findById(req.params.roomId);

  // Remove from pending
  const requestIndex = room.pendingRequests.findIndex(p => p.id.toString() === userId);
  if (requestIndex === -1) return res.status(404).json({ message: "Request not found" });
  
  const userRequest = room.pendingRequests[requestIndex];
  room.pendingRequests.splice(requestIndex, 1);

  if (action === 'approve') {
    if (room.participants.length < room.maxOccupancy) {
      room.participants.push({ id: userRequest.id, name: userRequest.name });
    } else {
      return res.status(400).json({ message: "Room became full" });
    }
  }

  await room.save();
  res.json({ message: `User ${action}d` });
});

// 6. REMOVE MEMBER (Point 2: Host can remove members)
router.delete('/:roomId/members/:userId', async (req, res) => {
  const room = await StudyRoom.findById(req.params.roomId);
  
  room.participants = room.participants.filter(p => p.id.toString() !== req.params.userId);
  await room.save();
  
  res.json({ message: "Member removed" });
});

module.exports = router;