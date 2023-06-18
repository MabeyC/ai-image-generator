const mongoose = require('mongoose');

const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: 'majority' },
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
};

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, dbConfig);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

mongoose.set('strictQuery', true);

module.exports = connectDB;
