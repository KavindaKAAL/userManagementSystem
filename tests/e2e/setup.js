const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/test_school';

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);

  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }

  await mongoose.disconnect();
});
