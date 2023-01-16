const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.MongoURl

const connection = mongoose.connect(URL);

module.exports = {
  connection,
};
