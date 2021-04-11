const mongoose = require("mongoose");

let announceSchema = new mongoose.Schema({
    createdOn:{
        type:Date,
        required:true,
        default:Date.now,
    },
    subject:{
        type:String,
        required: true,
    },
	content: {
		type: String,
		required: true,
	},
});
const model = mongoose.model("Announcement", announceSchema);
module.exports = model;
