const Session = require('../../models/Session');
const moment = require('moment');
const {deleteSessions} = require("../../dao/sessions");
const config = require('../../../config');
const randomstring = require("randomstring");

module.exports = async (req, res) => {
    const { maxAge, shield } = req.fields;

    try {
        await deleteSessions();
    } catch (e) {
        return res.status(500).json({ status: "error", message: "database write error" });
    }

    let session;

    try {
        session = await Session({
            expires: moment().add(parseInt(maxAge || 3600), 'seconds').toDate(),
            shield,
            user: req.user.id
        }).save();
    } catch (e) {
        return res.status(500).json({ status: "error", message: "database write error" });
    }

    const random = randomstring.generate({ length: 64, charset: 'alphanumeric', capitalization: 'lowercase'});
    const signature = session.id + random;
    session.signature = signature;

    try {
        await session.save();
    } catch (e) {
        return res.status(500).json({ status: "error", message: "database write error" });
    }

    res.status(200).json({ status: "ok", signature, url: `${config.baseUrl}/api/vault/${shield}?signature=${signature}` });
};
