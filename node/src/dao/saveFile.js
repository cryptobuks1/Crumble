const { createModel } = require('mongoose-gridfs');

const saveFile = async (stream, options, md5) => {
    return new Promise(async (resolve, reject) => {
        const File = createModel({ writeConcern: { w: 1 } });
        File.findOne({ md5 }, (err, file) => {
            if (err) reject(err);
            if (file) return resolve(file);
            File.write(options, stream, (err, file) => {
                if (err) reject(err);
                else resolve(file);
            });
        });
    });
};

module.exports = saveFile;
