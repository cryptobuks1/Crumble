const { Info } = require("../models");

const getCurrentVersion = async () => {
    return Info.findOne({}).sort("-version");
};

const updateCurrentVersion = ({version, build}) => {
    console.log(`Installing update: build ${build} version ${version}`.cyan);
    return Info({ version, build }).save();
};

module.exports = { getCurrentVersion, updateCurrentVersion };
