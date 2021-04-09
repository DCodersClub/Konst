const mongoose = require("mongoose");

let questionSchema = new mongoose.Schema({
  index: String,
  question: String,
  answer: String,
});
const model = mongoose.model("Question", questionSchema);
module.exports = model;
