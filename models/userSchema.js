var mongoose = require("mongoose");

// this is userSchema with name and password
var Schema = mongoose.Schema;
var userdata = new Schema({
    name: { type: String, required: true },
    dob: { type: String, required: true },
    country: { type: String, required: true },
    resume: { type: String, required: true },
    date: { type: String, required: true }

});

module.exports = mongoose.model("formusers", userdata);