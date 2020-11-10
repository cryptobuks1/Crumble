const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ShieldSchema = new Schema({
    file: {
        type: Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    extension: {
        type: String,
        required: false
    },
    path: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        required: true
    },
    tags: [{
        type: String,
        required: false
    }],
    auth: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        required: false,
    },
    width: {
        type: Number,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    shield: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    garbage: {
        type: Boolean,
        default: false,
    }
    // groups
});

const Shield = mongoose.model('Shield', ShieldSchema);

module.exports = Shield;
