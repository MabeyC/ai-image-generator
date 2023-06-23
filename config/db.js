const mongoose = require('mongoose');

// MongoDB configuration
const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: 'majority' },
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, dbConfig);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`MongoDB Error: ${err}`);
  }
};

mongoose.set('strictQuery', true);

module.exports =  { connectDB };
