const mongoose = require("mongoose");

let questionSchema = new mongoose.Schema({
  index: String,
  question: String,
  answer: String,
  solved : {type:Boolean,default:false}
});
const model = mongoose.model("Question", questionSchema);
module.exports = model;
