const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },

  mobileNumber: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  collegeName: {
    type: String,
  },
});
const model = mongoose.model("User", userSchema);
module.exports = model;
