const Q = require("./question");
const mongoose = require('mongoose');

	let connURL = "mongodb+srv://loneCoder:QWERTY1234@cluster0-avdpm.mongodb.net/konstDB?retryWrites=true&w=majority";
    const db =  mongoose.connect(connURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });



