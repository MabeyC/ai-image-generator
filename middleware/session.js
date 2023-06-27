const session = require('express-session');
const { redisStore } = require('../config/redis');

const sessionMiddleware = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false, // don't override session if no changes are made
  name: 'SessionId', // rename to mitigate against Powered-By attacks
  cookie: {
    secure: false, // PRODUCTION set this to true (Force HTTPS)
    httpOnly: true, // prevents client side js from reading cookie
    maxAge: 1000 * 60 * 30 // milliseconds (30 mins)
  }
});

module.exports = { sessionMiddleware };