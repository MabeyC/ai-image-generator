const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  if(!password) {
    return null;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    return hashPass;
  }
  catch (err) {
    console.log(`Error: ${err.message}`);
    return null;
  }
};

const validatePassword = async (password, userPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, userPassword);
    if(!isMatch) {
      return false;
    } else {
      return true;
    }
  }
  catch (err) {
    console.log(`Error: ${err.message}`);
    return null;
  }
};

module.exports = { hashPassword, validatePassword };