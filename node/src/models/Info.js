const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const InfoSchema = new Schema({
    version: String,
    build: Number,
});

const Info = mongoose.model('Info', InfoSchema);

module.exports = Info;
