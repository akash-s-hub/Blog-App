const mongoose = require("mongoose");

function connectDB() {
  try {
    const connection = mongoose.connect(process.env.MONGO_URI);
    console.log("db connected successfully");
  } catch (error) {
    console.error("error in db connection: ", error);
  }
}

module.exports = connectDB;