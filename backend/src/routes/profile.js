import express from 'express';
import User from '../models/User.js';
import { validateProfileUpdate, validatePasswordChange } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(requireAuth);

// Get own profile
router.get('/me', async (req, res) => {
  try {
    const user = req.user;

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
        experience: user.experience,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user profile" });
  }
});

// Update own profile
router.put('/me', validateProfileUpdate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, interests, experience, role } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (interests) updateData.interests = interests;
    if (experience) updateData.experience = experience;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
        experience: user.experience,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Change own password
router.put('/me/password', validatePasswordChange, async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// Deactivate own account
router.put('/me/deactivate', async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        error: "Password confirmation is required to deactivate account" 
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password before deactivation
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Deactivate account
    user.isActive = false;
    await user.save();

    res.json({ 
      message: "Account deactivated successfully",
      user: {
        _id: user._id,
        name: user.name,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to deactivate account" });
  }
});

export default router;