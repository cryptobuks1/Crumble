const { Readable } = require('stream');

/**
 * @param binary Buffer
 * returns readableInstanceStream Readable
 */
function bufferToStream(binary) {
    return new Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });
}

module.exports = bufferToStream;
