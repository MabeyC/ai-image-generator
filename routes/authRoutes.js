const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/UserModel');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// @route   GET /auth
// @desc    Authentication route
// @access  Protected
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error'});
  }
});

// @route   POST /auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', [
  body('email', 'Email address is required').notEmpty().isEmail(),
  body('password', 'Password is required').notEmpty()
], 
async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  
  try {
  
  let user = await User.findOne({ email: email});
  
  // See if User exists
  if(!user) {
    return res.status(400).json({
      errors: [{
        message: 'Invalid Credentials'
      }]
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    return res.status(400).json({
      errors: [{
        message: 'Invalid Credentials'
      }]
    });
  }

  const payload = {
    user: {
      id: user.id
    }
  }

  jwt.sign(
    payload, 
    process.env.JWT_SECRET,
    { expiresIn : 360000 }, // 3600 for production use 
    (err, token) => {
      if(err){
        throw err;
      }
      res.json({ token });
    }
  );

  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;