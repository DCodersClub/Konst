const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    maxLength: 50,
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
    maxLength: 100,
  },

  isVerified:{
    type: Boolean,
    default:false,
  },
  
  questions: {
    type: Array,
  },

  solved: {
    type: Array,
  },

  score: {
    type: Number,
    default: 0,
    index: true,
  },

  time: {
    type: Number,
    default: 0,
    index: true,
  },
});
const model = mongoose.model("User", userSchema);
module.exports = model;
