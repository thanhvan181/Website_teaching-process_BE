require('dotenv').config();
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

module.exports = {
  port: parseInt(argv.port || process.env.PORT || '8080', 10),
  mongo_uri: process.env.MONGO_URI,
  env: process.env.NODE_ENV,
};
