import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import {
  getBioSuggestions,
  getBioTips,
} from "../utils/bioTemplates.js";

const router = express.Router();

/**
 * @route   PATCH /api/profile/bio
 * @desc    Update user bio
 * @access  Private
 */
router.patch("/", requireAuth, async (req, res) => {
  try {
    const { bio, generatedByAI } = req.body;

    // Validate bio length
    if (bio && bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Bio must be 500 characters or less",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update bio
    user.bio = bio || "";
    user.bioGeneratedByAI = generatedByAI || false;
    user.bioLastUpdated = new Date();

    // bioScore will be calculated automatically via pre-save hook
    await user.save();

    res.json({
      success: true,
      data: {
        bio: user.bio,
        bioScore: user.bioScore,
        bioGeneratedByAI: user.bioGeneratedByAI,
        bioLastUpdated: user.bioLastUpdated,
        profileCompleteness: user.profileCompleteness,
      },
    });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/profile/bio/suggestions
 * @desc    Get AI-generated bio suggestions
 * @access  Private
 */
router.post("/suggestions", requireAuth, async (req, res) => {
  try {
    const { count = 3 } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has required profile data
    if (!user.role || !user.interests || user.interests.length === 0 || !user.experience) {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile (role, interests, experience) before generating bio suggestions",
      });
    }

    // Generate suggestions
    const suggestions = getBioSuggestions(
      {
        role: user.role,
        interests: user.interests,
        experience: user.experience,
      },
      count
    );

    res.json({
      success: true,
      data: {
        suggestions,
        count: suggestions.length,
      },
    });
  } catch (error) {
    console.error("Error generating bio suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate bio suggestions",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/profile/bio/tips
 * @desc    Get bio improvement tips
 * @access  Private
 */
router.post("/tips", requireAuth, async (req, res) => {
  try {
    const { bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get tips for provided bio or current user bio
    const bioToAnalyze = bio !== undefined ? bio : user.bio;

    const tips = getBioTips(bioToAnalyze, {
      interests: user.interests,
    });

    res.json({
      success: true,
      data: {
        tips,
        currentBioScore: user.calculateBioScore(),
      },
    });
  } catch (error) {
    console.error("Error generating bio tips:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate bio tips",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/profile/bio
 * @desc    Get current user bio data
 * @access  Private
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        bio: user.bio,
        bioScore: user.bioScore,
        bioGeneratedByAI: user.bioGeneratedByAI,
        bioLastUpdated: user.bioLastUpdated,
        profileCompleteness: user.profileCompleteness,
      },
    });
  } catch (error) {
    console.error("Error fetching bio:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
