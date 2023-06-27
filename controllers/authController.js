const { validationResult } = require('express-validator');
const User = require('../models/UserModel');
const { errorHandler } = require('../utils/errorHandler');
const { findUserByEmail } = require('../dao/users');
const { validatePassword } = require('../utils/auth');

const loginUser = async (req, res) => {
  // Check for errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) return errorHandler({ statusCode: 400, message: 'Bad Request - Incorrect params' }, req, res);
  
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    const isMatch = await validatePassword(password, user.password);
    if(!user || !isMatch) return errorHandler({ statusCode: 400, message: 'Bad Request - Invalid Credentials' }, req, res);
    req.session.userId = user.id;
    res.status(200).json({ success: true, userId: user.id });
  } 
  catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: 'Server Error'});
  }
}

const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    return res.status(200).json({ success: true, data: { id: user.id }});
  } 
  catch (err) {
    const { statusCode, message } = err;
    errorHandler(statusCode, message, err, req, res);
  }
}

module.exports = { loginUser, getUserId };