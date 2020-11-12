const {createModel} = require("mongoose-gridfs");
const { findShield } = require("../../dao/shield");
const { findSession } = require("../../dao/sessions");

module.exports = async (req, res) => {
    const File = createModel();

    let shield;
    try {
        shield = await findShield(req.params.id);
    } catch (e) {
        return res.status(500).json({ error: 'database read error' });
    }

    if (!shield) return res.status(404).json({ error: 'file not found' });

    if (shield.auth) {
        let session
        try {
            session = await findSession(req.query.signature);
        } catch (e) {
            return res.status(500).json({ error: 'database signature error' });
        }
        if (!session) return res.status(401).json({ error: 'invalid or expired signature' });

        let ok = false;

        if (shield.owner.toString() === session.user.toString()) ok = true;

        if (!ok) return res.status(401).json({ error: 'unauthorized user' });
    }

    if (req.query.thumbnail && (!shield.thumbnail || !shield.thumbnail[req.query.thumbnail])) {
        return res.status(404).json({ error: `no ${req.query.thumbnail} thumbnail for this file` });
    }

    File.findById(req.query.thumbnail ? shield.thumbnail[req.query.thumbnail] : shield.file, (error, file) => {
        const range = req.headers.range;
        if ((file.contentType.includes('video') || file.contentType.includes('audio')) && range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
            const chunksize = (end - start) + 1;
            const readStream = file.read({start, end});
            res.set('Content-Range', `bytes ${start}-${end}/${file.length}`);
            res.set('Accept-Ranges', 'bytes');
            res.set('Content-Length', chunksize);
            res.set('Content-Type', file.contentType);
            res.status(206);
            readStream.pipe(res);
        } else {
            const readStream = file.read();
            readStream.pipe(res);
            res.set('Content-Length', file.length);
            res.set('Content-Type', file.contentType);
            res.status(200);
        }
    });
};
