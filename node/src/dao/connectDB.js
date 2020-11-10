const mongoose = require("mongoose");
const config = require("../../config");
const {mongo} = config;
const {log} = require("express-power");

const connectDB = () => new Promise(resolve => {
    const uri = mongo.uri || `mongodb${mongo.srv ? "+srv" : ""}://${mongo.username}:${encodeURIComponent(mongo.password)}@${mongo.hostname}:${mongo.port}/blossom?authSource=${mongo.authenticationDatabase}`;

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        ssl: false,
    }).then(() => {
        log("Connected to Mongo".green);
        resolve(true);
    }).catch(e => {
        log("Could not connect to Mongo".red);
        if (config.verbose) console.error(e);
        resolve(false);
    });
});

module.exports = connectDB;
