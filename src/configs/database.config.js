const mongoose = require("mongoose");
const environment = require("./environment.config");

module.exports = {
  mongodb: () => {
    mongoose
      .connect(environment.mongo_uri)
      .then(() => {
        console.log("Database connected");
      })
      .catch((error) => {
        console.log("Database disconnect");
      });
    return mongoose;
  },
};
