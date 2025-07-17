const env = require("./config");

const config = {
  PORT: env.PORT || 8081,
  MONGO_URI: env.MONGO_URI,
};

module.exports = { config };