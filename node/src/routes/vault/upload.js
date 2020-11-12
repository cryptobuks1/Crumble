const saveFile = require("../../dao/saveFile");
const {saveShield} = require("../../dao/shield");
const fs = require("fs");
const randomstring = require("randomstring");
const {getVideoDurationInSeconds} = require('get-video-duration');
const getDimensions = require('get-video-dimensions');
const sharp = require('sharp');
const videoThumb = require('video-thumb');
const config = require('../../../config');
const bufferToStream = require('../../utils/bufferToStream');
const md5File = require('md5-file');
const tmp = require('tmp');

module.exports = async (req, res) => {
    const files = req.files;
    const file = files["file"];

    if (!file) return res.status(400).json({status: "error", message: "file required", file: "file required"});

    const name = req.fields.name || file.name;
    const description = req.fields.description || '';
    const tags = req.fields.tags || [];
    const auth = req.fields.auth || false;
    const users = req.fields.users || [];

    /* Thumbnail */

    const thumbConfigs = config.thumbnail || [];

    let thumbObject = {}, preThumb, thumbReader, thumbnailSize = 0, duration, dimensions, width, height;

    if (file.type.includes('video')) {

        duration = await getVideoDurationInSeconds(file.path);
        dimensions = await getDimensions(file.path);
        width = dimensions.width;
        height = dimensions.height;

        preThumb = `${file.path}-pre-thumb`;

        try {
            await new Promise((resolve, reject) => {
                videoThumb.extract(file.path, preThumb, '00:00:00', dimensions.width + 'x' + dimensions.height, err => {
                    if (err) reject();
                    resolve();
                });
            });
        } catch (e) {
            return res.status(500).json({status: "error", message: "error while generating thumbnail"});
        }
    }

    if (file.type.includes('image') || file.type.includes('video')) {
        if (thumbConfigs) {
            for (let thumbConfig of thumbConfigs) {

                const name = tmp.tmpNameSync().toString();

                try {
                    await bufferToStream(await sharp(preThumb || file.path).resize({
                        width: ['crop', 'width'].includes(thumbConfig.type) ? thumbConfig.size : undefined,
                        height: ['crop', 'height'].includes(thumbConfig.type) ? thumbConfig.size : undefined,
                        withoutEnlargement: true,
                        fit: 'cover',
                    }).jpeg().toFile(name));
                } catch (e) {
                    console.log(e);
                    return res.status(500).json({status: "error", message: "error while generating thumbnail"});
                }

                const md5 = md5File.sync(name);
                thumbReader = fs.createReadStream(name);

                const thumbOptions = ({filename: 'thumbnail', contentType: 'image/jpeg'});

                try {
                    const result = await saveFile(thumbReader, thumbOptions, md5);
                    fs.unlinkSync(name);
                    thumbObject[thumbConfig.key] = result._id;
                    thumbnailSize += result.length;
                } catch (e) {
                    console.log(e);
                    return res.status(500).json({status: "error", message: "error while writing file"});
                }

            }

        }
    }

    /* End Thumbnail */

    // Save actual file

    let result;

    let object;

    const reader = fs.createReadStream(file.path);
    const options = ({ filename: file.name, contentType: file.type });

    const md5 = md5File.sync(file.path);

    try {
        object = await saveFile(reader, options, md5);
    } catch (e) {
        return res.status(500).json({ status: "error", message: "error while writing file" });
    }

    reader.close();
    fs.unlinkSync(file.path);

    const shield = randomstring.generate({ length: 40, charset: 'alphanumeric', capitalization: 'lowercase'});

    try {
        result = await saveShield({
            file: object,
            thumbnail: thumbObject,
            thumbnailSize,
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
            duration,
            width,
            height,
            shield,
            users,
            owner: req.user.id,
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
