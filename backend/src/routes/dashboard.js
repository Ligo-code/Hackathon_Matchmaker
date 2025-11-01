import express from 'express';
import User from '../models/User.js';
import Invite from '../models/Invite.js';
import { getNextCandidate, calculateMatchScore } from '../utils/matching.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(requireAuth);

// Get next candidate card for authenticated user
router.get('/me/next-card', async (req, res) => {
  try {
    const currentUser = req.user;
    const candidate = await getNextCandidate(currentUser, User, Invite);
    
    if (!candidate) {
      return res.json({ 
        hasMore: false,
        message: "No more candidates available",
        suggestion: "Reset your matching lists to see more candidates"
      });
    }
    
    res.json({
      hasMore: true,
      candidate: {
        _id: candidate._id,
        name: candidate.name,
        interests: candidate.interests,
        experience: candidate.experience,
        role: candidate.role,
        matchScore: candidate.matchScore
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get next candidate" });
  }
});

// Send invite to candidate
router.post('/invite', async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user._id;
    
    if (!toUserId) {
      return res.status(400).json({ error: "Missing required field: toUserId" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    // Check if invite already exists
    const existingInvite = await Invite.findOne({ from: fromUserId, to: toUserId });
    if (existingInvite) {
      return res.status(400).json({ error: "Invite already sent to this user" });
    }

    // Calculate match score
    const matchScore = calculateMatchScore(req.user, toUser);

    // Create invite
    const invite = new Invite({
      from: fromUserId,
      to: toUserId,
      matchScore
    });

    await invite.save();

    // Mark user as seen
    await User.findByIdAndUpdate(
      fromUserId,
      { $addToSet: { seenUsers: toUserId } }
    );

    res.status(201).json({
      message: "Invite sent successfully",
      inviteId: invite._id,
      matchScore
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send invite" });
  }
});

// Skip candidate
router.post('/skip', async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user._id;
    
    if (!candidateId) {
      return res.status(400).json({ error: "Missing required field: candidateId" });
    }

    await User.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { 
          skippedUsers: candidateId,
          seenUsers: candidateId 
        } 
      }
    );

    res.json({ message: "Candidate skipped successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to skip candidate" });
  }
});

// Reset matching lists (restart cycle)
router.post('/me/reset', async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          seenUsers: [], 
          skippedUsers: [] 
        } 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      message: "Matching lists reset successfully",
      user: {
        name: user.name,
        seenCount: user.seenUsers.length,
        skippedCount: user.skippedUsers.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset lists" });
  }
});

// Get user's dashboard stats
router.get('/me/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;

    const sentInvites = await Invite.countDocuments({ from: userId });
    const receivedInvites = await Invite.countDocuments({ to: userId });
    const pendingInvites = await Invite.countDocuments({ to: userId, status: 'pending' });
    const acceptedInvites = await Invite.countDocuments({ 
      $or: [
        { from: userId, status: 'accepted' },
        { to: userId, status: 'accepted' }
      ]
    });

    res.json({
      user: {
        name: user.name,
        role: user.role,
        experience: user.experience,
        interests: user.interests
      },
      stats: {
        seenCount: user.seenUsers.length,
        skippedCount: user.skippedUsers.length,
        sentInvites,
        receivedInvites,
        pendingInvites,
        acceptedInvites
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get dashboard stats" });
  }
});

export default router;