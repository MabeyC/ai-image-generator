const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser } = require('../controllers/userController');

// @route   POST /user
// @desc    Register user
// @access  Public
router.post(
  '/', 
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email address').notEmpty().isEmail(),
    body('password', 'Please enter a password with 8 or more characters').notEmpty().isLength({ min: 8 , max: 16 })
  ], 
  registerUser
);

module.exports = router;