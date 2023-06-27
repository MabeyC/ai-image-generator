const User = require('../models/UserModel');
const gravatar = require('gravatar');
const mongoose = require('mongoose');

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const findUserById = async (userId) => {
  if(!isValidObjectId(userId)) {
    console.error(`Error - Invalid Input: ${userId} is not a valid`);
    return null;
  }
  try {
    const user = await User.findById(userId);
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error finding user: ${error.message}`);
    return null;
  }
} 

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error finding user: ${error.message}`);
    return null;
  }
};

const createUser = async ({ name, email, password}) => {

    if(!name || !email || !password) {
      return null;
    }
    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200', // size of image
      r: 'pg', // rating of image
      d: 'mm' // default image
    });

    try {
      const user = new User({
        name,
        email,
        avatar,
        password
      });
      let savedUser = await user.save();
      return savedUser;
    }
    catch (err) {
      console.error(`Error: ${err.message}`);
      return null;
    }
}

module.exports = { findUserById, findUserByEmail, createUser };