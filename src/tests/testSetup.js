const { MongoMemoryServer } = require('mongodb-memory-server');
const {connectDB, closeDatabase, dropDatabase} = require("../config/db");

let mongod = undefined;
let uri = "";

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

module.exports = {setupTestEnvironment , teardownTestEnvironment};