const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the token from the header
  const token = req.header('x-auth-token');
  // Check if no token
  if(!token) {
    return res.status(401).json({ message: 'No token, authorization denied'});
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid'});
  }
}