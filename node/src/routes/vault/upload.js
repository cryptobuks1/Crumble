const saveFile = require("../../dao/saveFile");
const {saveShield} = require("../../dao/shield");
const fs = require("fs");
const randomstring = require("randomstring");

module.exports = async (req, res) => {
    const files = req.files;
    const file = files["file"];

    if (!file) return res.status(400).json({ status: "error", message: "file required", file: "file required" });

    const name = req.fields.name || file.name;
    const description = req.fields.description || '';
    const tags = req.fields.tags || [];
    const auth = req.fields.auth || false;
    const users = req.fields.users || [];

    const reader = fs.createReadStream(file.path);
    const options = ({ filename: file.name, contentType: file.type });

    let object;

    try {
        object = await saveFile(reader, options);
    } catch (e) {
        return res.status(500).json({ status: "error", message: "error while writing file" });
    }

    const shield = randomstring.generate({ length: 40, charset: 'alphanumeric', capitalization: 'lowercase'});

    let result;

    try {
        result = await saveShield({
            file: object,
            name,
            originalName: file.name,
            description,
            extension: (file.name || '').split('.').pop(),
            path: '/',
            type: file.type,
            size: file.size,
            tags,
            auth,
            views: 0,
            duration: null,
            width: null,
            height: null,
            shield,
            users,
            owner: req.user.id
        });
    } catch (e) {
        return res.status(500).json({ status: "error", message: "database write error" });
    }

    result.shield += result.id;

    try {
        await result.save();
    } catch (e) {
        return res.status(500).json({ status: "error", message: "database write error" });
    }

    res.status(200).json({ status: "ok", shield: result });
};
