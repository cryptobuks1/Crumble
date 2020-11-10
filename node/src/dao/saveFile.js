const { createModel } = require('mongoose-gridfs');

const saveFile = async (stream, options) => {
    return new Promise((resolve, reject) => {
        const File = createModel();
        File.write(options, stream, (error, file) => {
            if (error) reject(error);
            else resolve(file);
        });
    });
};

module.exports = saveFile;
