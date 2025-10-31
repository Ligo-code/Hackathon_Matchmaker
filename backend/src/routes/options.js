import express from 'express';
import { INTEREST_OPTIONS } from '../models/User.js';

const router = express.Router();

// Get all dropdown options for frontend
router.get('/options', (req, res) => {
  res.json({
    interests: INTEREST_OPTIONS,
    experience: ['junior', 'middle', 'senior'],
    roles: ['frontend', 'backend']
  });
});

export default router;