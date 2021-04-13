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

  questions: {
    type: Array,
  },

  solved:{
    type:Array
  },

  score : {
    type : Number
  },

  time : {
    type : Number
  }
});
const model = mongoose.model("User", userSchema);
module.exports = model;
