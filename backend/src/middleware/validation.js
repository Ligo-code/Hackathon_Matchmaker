import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { INTEREST_OPTIONS } from '../models/User.js';

// Middleware for handling validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Registration validation
export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens and apostrophes'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .toLowerCase(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .isIn(['frontend', 'backend'])
    .withMessage('Role must be either frontend or backend'),
  
  body('experience')
    .isIn(['junior', 'middle', 'senior'])
    .withMessage('Experience must be junior, middle, or senior'),
  
  body('interests')
    .isArray({ min: 1, max: 5 })
    .withMessage('Please select between 1 and 5 interests')
    .custom((interests) => {
      if (!Array.isArray(interests)) return false;
      return interests.every(interest => INTEREST_OPTIONS.includes(interest));
    })
    .withMessage('One or more selected interests are invalid'),
  
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .toLowerCase(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 200 }) // Protection against DoS attacks with very long passwords
    .withMessage('Password is too long'),
  
  handleValidationErrors
];

// ObjectId validation in parameters
export const validateObjectId = (paramName) => [
  param(paramName)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid ID format');
      }
      return true;
    })
    .withMessage(`Invalid ${paramName} ID format`),
  
  handleValidationErrors
];

// Profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens and apostrophes'),
  
  body('interests')
    .optional()
    .isArray({ min: 1, max: 5 })
    .withMessage('Please select between 1 and 5 interests')
    .custom((interests) => {
      if (!interests) return true; // optional
      return interests.every(interest => INTEREST_OPTIONS.includes(interest));
    })
    .withMessage('One or more selected interests are invalid'),
  
  body('experience')
    .optional()
    .isIn(['junior', 'middle', 'senior'])
    .withMessage('Experience must be junior, middle, or senior'),
  
  body('role')
    .optional()
    .isIn(['frontend', 'backend'])
    .withMessage('Role must be either frontend or backend'),
  
  handleValidationErrors
];

// Additional validation for password change
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from current password'),
  
  handleValidationErrors
];

// Validation for search/filtering
export const validateSearchQuery = [
  body('experience')
    .optional()
    .isIn(['junior', 'middle', 'senior'])
    .withMessage('Invalid experience level'),
  
  body('role')
    .optional()
    .isIn(['frontend', 'backend'])
    .withMessage('Invalid role'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  
  handleValidationErrors
];