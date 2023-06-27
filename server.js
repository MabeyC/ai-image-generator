require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const { connectDB } = require('./config/db');
const { redisClient } = require('./config/redis');
const { sessionMiddleware } = require('./middleware/session');

// Init DB connection
connectDB();

// Init server
const app = express();
// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
// Cors Middleware
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001'], 
  credentials: true 
}));
// Redis Middleware
redisClient.connect().catch(console.error);
// Session Middleware
app.use(sessionMiddleware);

// app.set('trust proxy', 1); // @TODO If production, uncomment this line

// Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the Ai Image Generation App!');
});

// User Route
app.use('/user', require('./routes/userRoutes'));
// Authentication Route
app.use('/auth', require('./routes/authRoutes'));
// AI Image Generation Route
app.use('/openai', require('./routes/openaiRoutes'));
// File Access Route
app.use('/file', require('./routes/fileRoutes'));

// Start server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Exporting app for testing
module.exports = app;