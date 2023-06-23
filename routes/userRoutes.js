const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST /users
// @desc    Register user
// @access  Public
router.post('/', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email address').notEmpty().isEmail(),
  body('password', 'Please enter a password with 8 or more characters').notEmpty().isLength({ min: 8 , max: 16 })
], 
async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  
  try {
  
  let user = await User.findOne({ email: email});
  
  // See if User already exists
  if(user) {
    return res.status(400).json({
      errors: [{
        message: 'User already exists'
      }]
    });
  }

  // Get users gravatar
  const avatar = gravatar.url(email, {
    s: '200', // size of image
    r: 'pg', // rating of image
    d: 'mm' // default image
  });

  user = new User({
    name,
    email,
    avatar,
    password
  });

  // Encrypt the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  // return JSON Web Token

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