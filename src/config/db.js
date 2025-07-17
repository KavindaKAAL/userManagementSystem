const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err.message);
  });
}

const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error(`Error closing database connection: ${error.message}`);
  }
};

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("MongoDB database dropped.");
  } catch (error) {
    console.error(`Error dropping database: ${error.message}`);
  }
};

const clearDatabase = async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    };
    console.log("MongoDB database collection cleared.");
  } catch (error) {
    console.error(`Error clearing database collection: ${error.message}`);
  }
};

module.exports = { connectDB, closeDatabase, dropDatabase, clearDatabase };