const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB, closeDatabase, dropDatabase } = require("../../src/utils/db");

let mongod;
let uri;

const setupTestEnvironment = async () => {
  mongod = await MongoMemoryServer.create();
  uri = mongod.getUri();
  await connectDB(uri);
};

const teardownTestEnvironment = async () => {
  await dropDatabase();
  await closeDatabase();
  await mongod.stop();
};

module.exports = { setupTestEnvironment, teardownTestEnvironment };