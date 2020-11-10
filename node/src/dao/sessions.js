const { Session } = require("../models");

const deleteSessions = async () => {
    await Session.deleteMany({ expires: { $lte: Date.now() } });
};

const findSession = (signature) => {
    return Session.findOne({ signature, expires: { $gt: Date.now() } })
};

module.exports = { deleteSessions, findSession };
