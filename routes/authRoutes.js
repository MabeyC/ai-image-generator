const express = require('express');
const router = express.Router();
const { authSession } = require('../middleware/auth');
const { body } = require('express-validator');
const { loginUser, getUserId } = require('../controllers/authController');

// @route   GET /auth
// @desc    Authentication route - Returns userId
// @access  Protected
router.get(
  '/', 
  authSession, 
  getUserId
);

// @route   POST /auth
// @desc    LOGIN - Authenticate user & set session cookie
// @access  Public
router.post(
  '/', 
  [
    body('email', 'Email address is required').notEmpty().isEmail(),
    body('password', 'Password is required').notEmpty()
  ], 
  loginUser
);

module.exports = router;