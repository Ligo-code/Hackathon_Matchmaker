import express from 'express';
import User from '../models/User.js';
import Invite from '../models/Invite.js';
import ChatRoom from '../models/ChatRoom.js';
import { requireAuth } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get incoming invites for authenticated user
router.get('/me/incoming', async (req, res) => {
  try {
    const userId = req.user._id;
    
    const invites = await Invite.find({ 
      to: userId, 
      status: 'pending' 
    })
    .populate('from', 'name interests experience role')
    .sort({ createdAt: -1 });

    res.json({
      invites: invites.map(invite => ({
        _id: invite._id,
        from: {
          _id: invite.from._id,
          name: invite.from.name,
          interests: invite.from.interests,
          experience: invite.from.experience,
          role: invite.from.role
        },
        matchScore: invite.matchScore,
        createdAt: invite.createdAt
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get incoming invites" });
  }
});

// Get sent invites for authenticated user
router.get('/me/sent', async (req, res) => {
  try {
    const userId = req.user._id;
    
    const invites = await Invite.find({ from: userId })
      .populate('to', 'name interests experience role')
      .sort({ createdAt: -1 });

    res.json({
      invites: invites.map(invite => ({
        _id: invite._id,
        to: {
          _id: invite.to._id,
          name: invite.to.name,
          interests: invite.to.interests,
          experience: invite.to.experience,
          role: invite.to.role
        },
        status: invite.status,
        matchScore: invite.matchScore,
        createdAt: invite.createdAt,
        respondedAt: invite.respondedAt
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get sent invites" });
  }
});

// Accept invite
router.post('/:inviteId/accept', validateObjectId('inviteId'), async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user._id;

    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    // Check if user is authorized to accept this invite
    if (invite.to.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to accept this invite" });
    }

    if (invite.status !== 'pending') {
      return res.status(400).json({ error: "Invite already responded to" });
    }

    // Update invite status
    invite.status = 'accepted';
    invite.respondedAt = new Date();
    await invite.save();

    // Check if chat room already exists
    let chatRoom = await ChatRoom.findOne({
      participants: { $all: [invite.from, invite.to] }
    });

    // Create chat room if doesn't exist
    if (!chatRoom) {
      chatRoom = new ChatRoom({
        participants: [invite.from, invite.to],
        inviteId: invite._id
      });
      await chatRoom.save();
    }

    res.json({
      message: "Invite accepted successfully",
      chatRoomId: chatRoom._id,
      invite: {
        _id: invite._id,
        status: invite.status,
        respondedAt: invite.respondedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to accept invite" });
  }
});

// Reject invite
router.post('/:inviteId/reject', validateObjectId('inviteId'), async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user._id;

    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    // Check if user is authorized to reject this invite
    if (invite.to.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to reject this invite" });
    }

    if (invite.status !== 'pending') {
      return res.status(400).json({ error: "Invite already responded to" });
    }

    invite.status = 'rejected';
    invite.respondedAt = new Date();
    await invite.save();

    res.json({
      message: "Invite rejected successfully",
      invite: {
        _id: invite._id,
        status: invite.status,
        respondedAt: invite.respondedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject invite" });
  }
});

// Get invite stats for authenticated user
router.get('/me/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [pendingReceived, totalReceived, totalSent, acceptedCount] = await Promise.all([
      Invite.countDocuments({ to: userId, status: 'pending' }),
      Invite.countDocuments({ to: userId }),
      Invite.countDocuments({ from: userId }),
      Invite.countDocuments({ 
        $or: [
          { from: userId, status: 'accepted' },
          { to: userId, status: 'accepted' }
        ]
      })
    ]);

    res.json({
      stats: {
        pendingReceived,
        totalReceived,
        totalSent,
        acceptedCount
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get invite stats" });
  }
});

export default router;