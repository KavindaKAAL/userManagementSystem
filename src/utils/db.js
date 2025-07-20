const mongoose = require('mongoose');
const logger = require('../../logger');

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    logger.error('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB error:', err.message);
  });
}

const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed.");
  } catch (error) {
    logger.error(`Error closing database connection: ${error.message}`);
  }
};

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    logger.info("MongoDB database dropped.");
  } catch (error) {
    logger.error(`Error dropping database: ${error.message}`);
  }
};

const clearDatabase = async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    };
    logger.info("MongoDB database collection cleared.");
  } catch (error) {
    logger.error(`Error clearing database collection: ${error.message}`);
  }
};

module.exports = { connectDB, closeDatabase, dropDatabase, clearDatabase };