const { User } = require("../models");
const config = require("../../config");
const { randomBytes } = require('crypto');
const argon2i = require('argon2-ffi').argon2i;

const updateRootUser = async () => {
    const rootUser = config.rootUser || {};

    rootUser.username = (rootUser.username || "root").toLowerCase();

    const user = await User.findOne({ username: rootUser.username || "root" });

    const salt = randomBytes(32);
    const hash = await argon2i.hash(rootUser.password || "root", salt);

    if (!user) {
        await User.deleteMany({ roles: { $in: ["root"] } });

        return User({
            username: rootUser.username || "root",
            password: hash,
            firstName: rootUser.firstName || "Admin",
            lastName: rootUser.lastName || "User",
            email: rootUser.email || "admin@example.com",
            roles: ["root", "admin"],
        }).save();
    }
    else {
        return User.findOneAndUpdate({
            username: rootUser.username || "root",
        }, {
            $set: {
                password: hash,
                firstName: rootUser.firstName || "Admin",
                lastName: rootUser.lastName || "User",
                email: rootUser.email || "admin@example.com",
                roles: ["root", "admin"],
            },
        });
    }
};

const findUserByUsername = async (username) => {
    return User.findOne({ username });
};

module.exports = { updateRootUser, findUserByUsername };
