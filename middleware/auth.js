const { errorHandler } = require('../utils/errorHandler');

// authSession middleware
const authSession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    const err = {}
    err.message = 'Unauthorized';
    err.statusCode = 401;
    // Call Error Middleware
    errorHandler(err, req, res);
  } else {
    next(); // Continue to the next middleware
  }
};

module.exports = { authSession };

