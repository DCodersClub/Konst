const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

module.exports = async () => {
  let connURL =
    "mongodb+srv://loneCoder:QWERTY1234@cluster0-avdpm.mongodb.net/konstDB?retryWrites=true&w=majority";
  await mongoose.connect(connURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  mongoose.plugin(passportLocalMongoose);
};
