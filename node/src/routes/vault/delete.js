const {createModel} = require('mongoose-gridfs');
const { findShieldGarbageIncluded } = require("../../dao/shield");

module.exports = async (req, res) => {
    const File = createModel();
    const { permanent } = req.fields;

    const shield = await findShieldGarbageIncluded(req.fields.shield);

    if (!shield) return res.status(404).json({ error: 'file not found' });

    if (shield.owner.toString() === req.user.id.toString()) {
        if (permanent) {
            let fileResult, shieldResult;

            try {
                fileResult = await File.deleteOne({_id: shield.file});
            } catch (e) {
                return res.status(500).json({ status: "error", message: "error while deleting file" });
            }

            try {
                shieldResult = await shield.delete();
            } catch (e) {
                return res.status(500).json({ status: "error", message: "error while deleting shield" });
            }

            res.status(200).json({ file: fileResult, shield: shieldResult, status: "deleted" });
        }
        else {
            shield.garbage = true;

            try {
                await shield.save();
            } catch (e) {
                return res.status(500).json({ status: "error", message: "error while trashing file" });
            }

            res.status(200).json({ shield, status: "garbage" });
        }
    }
    else {
        res.status(401).json({ error: 'unauthorized user' });
    }
};
