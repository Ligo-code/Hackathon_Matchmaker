import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// TODO: Add authentication middleware when auth module is ready
// TODO: Add authorization check - users should only access their own profile

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, interests, experience, role } = req.body;
    
    const updateData = {};
    // Basic validation
    if (name) {
        if (name.length < 2 || name.length > 100) {
          return res.status(400).json({ 
            error: "Name must be between 2 and 100 characters" 
          });
        }
        updateData.name = name;
      }
      
      if (interests) {
        if (!Array.isArray(interests)) {
          return res.status(400).json({ 
            error: "Interests must be an array" 
          });
        }
        updateData.interests = interests;
      }
      
      if (experience) {
        const validExperience = ['junior', 'middle', 'senior'];
        if (!validExperience.includes(experience)) {
          return res.status(400).json({ 
            error: "Invalid experience level. Must be: junior or middle or senior" 
          });
        }
        updateData.experience = experience;
      }

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

// Deactivate account
router.put('/:userId/deactivate', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: Add authorization check - users should only deactivate their own account
    // TODO: Consider requiring password confirmation for this action
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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

// Reactivate account
router.put('/:userId/activate', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: Define who can reactivate accounts (user themselves via login? support team?)
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      message: "Account activated successfully",
      user: {
        _id: user._id,
        name: user.name,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to activate account" });
  }
});

// TODO: Password change endpoint will be added after auth module implementation

export default router;