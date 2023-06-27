const { validationResult } = require('express-validator');
const { errorHandler } = require('../utils/errorHandler');
const { findUserByEmail, createUser } = require('../dao/users');
const { hashPassword } = require('../utils/auth.js');

const registerUser = async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return errorHandler({ statusCode: 400, message: 'Bad Request - Incorrect params' }, req, res);
  }

  const { name, email, password } = req.body;
  try {
    let user = await findUserByEmail(email);
    if (user !== null) {
      // User found
      return errorHandler({ statusCode: 400, message: 'Registration Failed' }, req, res)
    }
    // User not found
    const hashPass = await hashPassword(password);
    const savedUser = await createUser({ name, email, password: hashPass });
    req.session.userId = savedUser.id;
    res.status(200).json({ success: true, message: `Registration Successful` });
  } 
  catch (err) {
    return errorHandler({
      statusCode: 500,
      message: 'Internal Server Error'
    }, req, res);
  }
};

// @TODO
const deleteUser = async (req, res) => {
  console.log('Delete User Controller');
  res.send(200).json({ success: true, message: 'User Deleted Route'});
};

// @TODO 
const UpdateUser = async (req, res) => {
  console.log('Update User Controller');
  res.send(200).json({ success: true, message: 'User Updated Route'});
};

module.exports = { registerUser };