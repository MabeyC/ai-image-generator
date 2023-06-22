require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const { connectDB } = require('./config/db');

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
// Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the Ai Image Generation App!');
});
// AI Image Generation Route
app.use('/openai', require('./routes/openaiRoutes'));

// File Access Route
app.use('/file', require('./routes/fileRoutes'));

// Start server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;